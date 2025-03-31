from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
# Create your models here.
class message_status(models.Model):
    # Choices for the stage
    DELIVERED = "1"
    SEEN = "2"
    
    STAGE_CHOICES = [
        (DELIVERED, "Delivered"),
        (SEEN, "Seen"),
    ]
    user=models.ForeignKey(User,on_delete=models.DO_NOTHING,default=1)
    stage=models.CharField(max_length=1,choices=STAGE_CHOICES)
    delivered_time = models.DateTimeField(null=True, blank=True)
    seen_time = models.DateTimeField(null=True, blank=True)
    def save(self, *args, **kwargs):
        """Override the save method to update the time automatically when the stage is set."""
        if self.stage == self.DELIVERED and not self.delivered_time:
            self.delivered_time = timezone.now()
        elif self.stage == self.SEEN and not self.seen_time:
            self.seen_time = timezone.now()
        
        super(message_status, self).save(*args, **kwargs)