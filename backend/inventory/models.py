from django.db import models

class Inventory(models.Model):
    name = models.CharField("name", max_length=240)
    description = models.TextField()
    quantity = models.PositiveIntegerField()

    def __str__(self):
        return f'name:{self.name}; description:{self.description}; quantity:{self.quantity}' 