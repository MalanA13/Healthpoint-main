import tensorflow as tf


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
