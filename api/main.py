import os
import io
import base64
from contextlib import asynccontextmanager
from typing import List, Dict, Any, Tuple
from pathlib import Path

import numpy as np
from PIL import Image
import tensorflow as tf
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, Response


HERE = Path(__file__).resolve().parent
DEFAULT_MODEL_PATH = HERE / "models" / "model.keras"
MODEL_PATH = os.getenv("MODEL_PATH", str(DEFAULT_MODEL_PATH))
INPUT_SIZE = (704, 1056, 3)
N_CLASSES = 24
ALLOW_ALL_ORIGINS = os.getenv("ALLOW_ALL_ORIGINS", "true").lower() == "true"
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else []



def dice_loss(y_true, y_pred):
    numerator = tf.reduce_sum(y_true * y_pred)
    denominator = tf.reduce_sum(y_true * y_true) + tf.reduce_sum(y_pred * y_pred) - tf.reduce_sum(y_true * y_pred)
    return 1 - numerator / denominator

class MyMeanIOU(tf.keras.metrics.MeanIoU):
    def update_state(self, y_true, y_pred, sample_weight=None):
        return super().update_state(tf.argmax(y_true, axis=-1), tf.argmax(y_pred, axis=-1), sample_weight)

def load_model(path=MODEL_PATH):
    try:
        loaded_model = tf.keras.models.load_model(
            path,
            custom_objects={"dice_loss": dice_loss, "MyMeanIOU": MyMeanIOU}
        )
        print(f"Model loaded: {path}")
        return loaded_model
    except Exception as e:
        print(f"Error loading model: {e}")
        return None



CLASS_NAMES = [
    'unlabeled', 'paved-area', 'dirt', 'grass', 'gravel', 'water',
    'rocks', 'pool', 'vegetation', 'roof', 'wall', 'window',
    'door', 'fence', 'fence-pole', 'person', 'dog', 'car',
    'bicycle', 'tree', 'bald-tree', 'ar-marker', 'obstacle', 'conflicting'
]

PALETTE = np.array([
    [0,   0,   0],    # 0 unlabeled (will be alpha=0 in RGBA)
    [0, 114, 178],    # 1 paved-area  – vivid blue
    [213, 94,   0],   # 2 dirt        – deep orange
    [0, 158, 115],    # 3 grass       – emerald green
    [240, 228, 66],   # 4 gravel      – bright yellow
    [0, 191, 255],    # 5 water       – deepsky blue
    [204,121,167],    # 6 rocks       – rose
    [0, 255, 255],    # 7 pool        – cyan
    [50, 205,  50],   # 8 vegetation  – lime green
    [220, 20,  60],   # 9 roof        – crimson
    [255,140,   0],   # 10 wall       – dark orange
    [65, 105, 225],   # 11 window     – royal blue
    [255, 69,   0],   # 12 door       – orange red
    [255, 215,  0],   # 13 fence      – gold
    [138, 43, 226],   # 14 fence-pole – blue violet
    [255, 0,  255],   # 15 person     – magenta
    [0, 255, 127],    # 16 dog        – spring green
    [0,   0, 255],    # 17 car        – pure blue
    [64, 224, 208],   # 18 bicycle    – turquoise
    [34, 139,  34],   # 19 tree       – forest green
    [255, 99,  71],   # 20 bald-tree  – tomato
    [255,105, 180],   # 21 ar-marker  – hot pink
    [154,205,  50],   # 22 obstacle   – yellow green
    [127,255,   0],   # 23 conflicting– chartreuse
], dtype=np.uint8)

def palette_legend() -> List[Dict[str, Any]]:
    legend = []
    for i in range(N_CLASSES):
        legend.append({
            "id": i,
            "name": CLASS_NAMES[i],
            "rgb": PALETTE[i].tolist()
        })
    return legend




app_state: Dict[str, Any] = {}

@asynccontextmanager
async def lifespan(app: FastAPI):

    model = load_model(MODEL_PATH)
    if model is None:
        raise RuntimeError("Failed to load model at startup")

    app_state["model"] = model
    app_state["input_size"] = INPUT_SIZE
    app_state["legend"] = palette_legend()
    yield
    app_state.clear()



app = FastAPI(title="SkySight API", lifespan=lifespan)

if ALLOW_ALL_ORIGINS:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=False,
        allow_methods=["*"],
        allow_headers=["*"],
    )
else:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[o for o in ALLOWED_ORIGINS if o],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )



def read_image_to_rgb(image_bytes: bytes) -> Image.Image:
    try:
        img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
        print("Read image.")
        return img
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid image file")
    
def preprocess_for_model(img: Image.Image) -> Tuple[np.ndarray, np.ndarray]:
    target_w, target_h = INPUT_SIZE[1], INPUT_SIZE[0]
    resized = img.resize((target_w, target_h), resample=Image.BILINEAR)
    arr = np.asarray(resized).astype(np.float32) / 255.0
    batched = np.expand_dims(arr, axis=0)
    print("Preprocessed image.")
    return batched, arr

def infer_mask(model: tf.keras.Model, model_input: np.ndarray) -> np.ndarray:
    print("Infering...")
    logits = model.predict(model_input, verbose=0)[0]
    pred_ids = np.argmax(logits, axis=-1).astype(np.uint8)
    print("Inference complete.")
    return pred_ids

def ids_to_rgba_png(pred_ids: np.ndarray) -> bytes:
    h, w = pred_ids.shape
    rgb = PALETTE[pred_ids] 
    alpha = np.where(pred_ids == 0, 0, 200).astype(np.uint8) 
    rgba = np.dstack([rgb, alpha])
    buf = io.BytesIO()
    Image.fromarray(rgba, mode="RGBA").save(buf, format="PNG", optimize=True)
    return buf.getvalue()



@app.get("/health")
async def health():
    model_loaded = "model" in app_state and app_state["model"] is not None
    return {"status": "ok", "model_loaded": model_loaded, "classes": N_CLASSES, "input_size": INPUT_SIZE}

@app.get("/legend")
async def legend():
    return {"classes": app_state.get("legend", [])}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if not file.content_type or not file.content_type.startswith(("image/",)):
        raise HTTPException(status_code=400, detail="Uploaded file must be an image")
    
    raw = await file.read()
    img = read_image_to_rgb(raw)
    model_input, vis_img = preprocess_for_model(img)

    model = app_state["model"]
    pred_ids = infer_mask(model, model_input)

    png_bytes = ids_to_rgba_png(pred_ids)

    b64_png = base64.b64encode(png_bytes).decode("utf-8")
    return JSONResponse({
        "mask_png_base64": b64_png,
        "width": pred_ids.shape[1],
        "height": pred_ids.shape[0],
        "classes": app_state["legend"]
    })  