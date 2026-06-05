import tensorflow as tf


@tf.keras.utils.register_keras_serializable(package="HealPoint")
class FocalBinaryCrossentropy(tf.keras.losses.Loss):
    def __init__(self, gamma=2.0, alpha=0.25, **kwargs):
        super().__init__(**kwargs)
        self.gamma = gamma
        self.alpha = alpha

    def call(self, y_true, y_pred):
        y_true = tf.cast(y_true, tf.float32)
        y_pred = tf.clip_by_value(y_pred, tf.keras.backend.epsilon(), 1.0 - tf.keras.backend.epsilon())
        pt = tf.where(tf.equal(y_true, 1.0), y_pred, 1.0 - y_pred)
        alpha_factor = tf.where(tf.equal(y_true, 1.0), self.alpha, 1.0 - self.alpha)
        focal_weight = alpha_factor * tf.pow(1.0 - pt, self.gamma)
        loss = -focal_weight * tf.math.log(pt)
        return tf.reduce_mean(loss)

    def get_config(self):
        config = super().get_config()
        config.update({"gamma": self.gamma, "alpha": self.alpha})
        return config
