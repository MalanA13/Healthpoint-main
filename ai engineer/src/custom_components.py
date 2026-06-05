import tensorflow as tf


@tf.keras.utils.register_keras_serializable(package="HealPoint")
class StopAtAuc(tf.keras.callbacks.Callback):
    def __init__(self, target_auc=0.78):
        super().__init__()
        self.target_auc = target_auc

    def on_epoch_end(self, epoch, logs=None):
        logs = logs or {}
        val_auc = logs.get("val_auc")
        if val_auc is not None and val_auc >= self.target_auc:
            self.model.stop_training = True

    def get_config(self):
        return {"target_auc": self.target_auc}


@tf.keras.utils.register_keras_serializable(package="HealPoint")
class RiskCalibrationLayer(tf.keras.layers.Layer):
    def __init__(self, scale=1.0, **kwargs):
        super().__init__(**kwargs)
        self.scale = scale

    def call(self, inputs):
        return tf.clip_by_value(inputs * self.scale, 0.0, 1.0)

    def get_config(self):
        config = super().get_config()
        config.update({"scale": self.scale})
        return config
