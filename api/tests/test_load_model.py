import tensorflow as tf

path = "api/models/model.keras"
def dice_loss(y_true, y_pred):
    numerator = tf.reduce_sum(y_true * y_pred)
    denominator = tf.reduce_sum(y_true * y_true) + tf.reduce_sum(y_pred * y_pred) - tf.reduce_sum(y_true * y_pred)
    return 1 - numerator / denominator

class MyMeanIOU(tf.keras.metrics.MeanIoU):
    def update_state(self, y_true, y_pred, sample_weight=None):
        return super().update_state(tf.argmax(y_true, axis=-1), tf.argmax(y_pred, axis=-1), sample_weight)

def load_model(path=None):
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

test = load_model(path)