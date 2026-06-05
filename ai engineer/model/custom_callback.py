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
