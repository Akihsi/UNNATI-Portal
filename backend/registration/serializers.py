from rest_framework import serializers
from .models import SMERegistration

class SMERegistrationSerializer(serializers.ModelSerializer):
    cv_filename = serializers.SerializerMethodField()
    
    class Meta:
        model = SMERegistration
        fields = [
            'registration_id', 'first_name', 'last_name', 'email_id',
            'personal_linkedin_url', 'contact_number', 'area_of_expertise',
            'expertise_description', 'cv_file', 'cv_filename',
            'address_of_institute', 'state_id', 'district_id', 'city_name',
            'pin_code', 'import_source', 'created_at', 'updated_at'
        ]
        read_only_fields = ['registration_id', 'created_at', 'updated_at', 'cv_filename']
    
    def get_cv_filename(self, obj):
        """Return CV filename if present"""
        return obj.get_cv_filename()

class RegistrationCreateSerializer(serializers.Serializer):
    """Serializer for form submission"""
    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)
    email_id = serializers.EmailField()
    personal_linkedin_url = serializers.CharField(max_length=500, required=False, allow_blank=True)
    contact_number = serializers.CharField(max_length=10)
    area_of_expertise = serializers.CharField(max_length=100, required=False, allow_blank=True)
    expertise_description = serializers.CharField(max_length=1000, required=False, allow_blank=True)
    cv_file = serializers.FileField(required=False, allow_null=True)
    address_of_institute = serializers.CharField(max_length=500)
    state_id = serializers.CharField(max_length=50)
    district_id = serializers.CharField(max_length=50)
    city_name = serializers.CharField(max_length=100)
    pin_code = serializers.CharField(max_length=6)
    import_source = serializers.ChoiceField(choices=['linkedin', 'cv'], default='linkedin')
    
    def validate_contact_number(self, value):
        """Validate mobile number format"""
        if not value.isdigit() or len(value) != 10:
            raise serializers.ValidationError("Contact number must be 10 digits")
        if value[0] not in '6789':
            raise serializers.ValidationError("Contact number must start with 6-9")
        return value
    
    def validate_email_id(self, value):
        """Validate email is not already registered"""
        existing = SMERegistration.objects.filter(email_id=value).first()
        if existing:
            raise serializers.ValidationError("This email is already registered")
        return value
    
    def validate_pin_code(self, value):
        """Validate PIN code format"""
        if not value.isdigit() or len(value) != 6:
            raise serializers.ValidationError("PIN code must be 6 digits")
        return value
    def validate_personal_linkedin_url(self, value):
        if value and not value.startswith(('http://', 'https://')):
            raise serializers.ValidationError("Please enter a valid URL starting with http:// or https://")
        return value

class CVParseSerializer(serializers.Serializer):
    """Serializer for CV parsing response"""
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    contact_number = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)