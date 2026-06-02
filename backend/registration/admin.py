from django.contrib import admin
from .models import SMERegistration

@admin.register(SMERegistration)
class SMERegistrationAdmin(admin.ModelAdmin):
    list_display = ('registration_id', 'first_name', 'last_name', 'email_id', 'contact_number', 'created_at')
    list_filter = ('import_source', 'state_id', 'created_at')
    search_fields = ('registration_id', 'email_id', 'first_name', 'last_name')
    readonly_fields = ('registration_id', 'created_at', 'updated_at')
    
    fieldsets = (
        ('Registration Info', {
            'fields': ('registration_id', 'created_at', 'updated_at', 'import_source')
        }),
        ('Personal Details', {
            'fields': ('first_name', 'last_name', 'email_id', 'personal_linkedin_url', 'contact_number')
        }),
        ('Professional Details', {
            'fields': ('area_of_expertise', 'expertise_description', 'cv_file')
        }),
        ('Address Details', {
            'fields': ('address_of_institute', 'state_id', 'district_id', 'city_name', 'pin_code')
        }),
    )