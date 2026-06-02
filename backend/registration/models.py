from django.db import models, transaction
from django.utils import timezone
import os

class SMERegistration(models.Model):
    # Primary identifier
    registration_id = models.CharField(max_length=30, unique=True, db_index=True)
    
    # Personal Details
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email_id = models.EmailField()
    personal_linkedin_url = models.URLField(max_length=500, blank=True, null=True)
    contact_number = models.CharField(max_length=10)
    
    # Professional Details
    area_of_expertise = models.CharField(max_length=100, blank=True)
    expertise_description = models.TextField(max_length=1000, blank=True)
    cv_file = models.FileField(
        upload_to='cv_uploads/',
        blank=True,
        null=True,
        help_text='Uploaded CV file'
    )
    
    # Address Details
    address_of_institute = models.TextField(max_length=500)
    state_id = models.CharField(max_length=50)
    district_id = models.CharField(max_length=50)
    city_name = models.CharField(max_length=100)
    pin_code = models.CharField(max_length=6)
    
    # Metadata
    import_source = models.CharField(
        max_length=20,
        choices=[('linkedin', 'LinkedIn'), ('cv', 'CV Upload')],
        default='linkedin'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
        verbose_name_plural = 'SME Registrations'
        indexes = [
            models.Index(fields=['registration_id']),
            models.Index(fields=['email_id']),
            models.Index(fields=['-created_at']),
        ]
    
    def __str__(self):
        return f"{self.first_name} {self.last_name} ({self.registration_id})"
    
    def save(self, *args, **kwargs):
        # Auto-generate registration_id if not present
        if not self.registration_id:
            self.registration_id = self._generate_registration_id()
        super().save(*args, **kwargs)
    
    @staticmethod
    def _generate_registration_id():
        """
        Generate unique registration ID in format: UNNS/YYYYMMDD/N<serial>
        Example: UNNS/20260602/N001
        """
        today = timezone.now().strftime('%Y%m%d')
        
        with transaction.atomic():
            # Count registrations created today
            count = SMERegistration.objects.filter(
                created_at__date=timezone.now().date()
            ).count()
            
            serial = str(count + 1).zfill(3)  # Zero-padded to 3 digits
            registration_id = f"UNNS/{today}/N{serial}"
            
            return registration_id
    
    def get_cv_filename(self):
        """Get safe CV filename if uploaded"""
        if self.cv_file:
            return os.path.basename(self.cv_file.name)
        return None