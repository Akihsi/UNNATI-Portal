from django.shortcuts import render
from django.shortcuts import redirect
from django.conf import settings
import requests
from django.http import JsonResponse
# Create your views here.
import re
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
import pdfplumber
from docx import Document
from .models import SMERegistration
from .serializers import (
    RegistrationCreateSerializer,
    CVParseSerializer,
    SMERegistrationSerializer
)
import logging

logger = logging.getLogger(__name__)

def extract_text_from_pdf(file_obj):
    """Extract text from PDF file"""
    try:
        with pdfplumber.open(file_obj) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() + "\n"
        return text
    except Exception as e:
        logger.error(f"PDF extraction error: {e}")
        return None

def extract_text_from_docx(file_obj):
    """Extract text from DOCX file"""
    try:
        doc = Document(file_obj)
        text = "\n".join([para.text for para in doc.paragraphs])
        return text
    except Exception as e:
        logger.error(f"DOCX extraction error: {e}")
        return None

def extract_text_from_doc(file_obj):
    """Placeholder for DOC extraction (requires additional library)"""
    logger.warning("DOC format parsing not fully implemented")
    return None

def extract_email(text):
    """Extract email from text"""
    pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(pattern, text)
    return match.group(0) if match else None

def extract_phone(text):
    """Extract Indian phone number from text"""
    pattern = r'(?:\+91[-.\s]?)?[6-9]\d[-.\s]?\d{4}[-.\s]?\d{4}'
    match = re.search(pattern, text)
    if match:
        # Clean the number
        phone = re.sub(r'[^\d]', '', match.group(0))
        return phone[-10:] if len(phone) >= 10 else phone
    return None

def extract_name(text):
    """Extract name from CV (usually in first few lines)"""
    lines = text.split('\n')
    for line in lines[:5]:
        line = line.strip()
        if len(line) > 0 and len(line) < 100:
            # Simple heuristic: lines with 1-4 words and mostly letters
            words = line.split()
            if 1 <= len(words) <= 4 and sum(1 for w in words if w[0].isupper()) >= len(words) - 1:
                return line
    return None

def extract_location(text):
    """Extract city and state from CV"""
    indian_states = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Chandigarh', 'Puducherry'
    ]
    
    indian_cities = [
        'Delhi', 'Mumbai', 'Bangalore', 'Bengaluru', 'Chennai', 'Hyderabad',
        'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Lucknow', 'Chandigarh',
        'Surat', 'Indore', 'Kota', 'Nagpur', 'Visakhapatnam', 'Bhopal'
    ]
    
    city = None
    state = None
    
    text_upper = text.upper()
    
    for s in indian_states:
        if s.upper() in text_upper:
            state = s
            break
    
    for c in indian_cities:
        if c.upper() in text_upper:
            city = c
            break
    
    return city, state

@api_view(['POST'])
@permission_classes([AllowAny])
def parse_cv(request):
    """
    Parse CV file and extract information
    Expected: POST with file field named 'cv'
    Returns: JSON with extracted first_name, last_name, email, contact_number, city, state
    """
    try:
        if 'cv' not in request.FILES:
            return Response(
                {'success': False, 'message': 'No CV file provided'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        file = request.FILES['cv']
        
        # Validate file type
        allowed_types = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
        ]
        
        if file.content_type not in allowed_types:
            return Response(
                {'success': False, 'message': 'Invalid file type. Please upload PDF, DOC, or DOCX'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Validate file size (max 5MB)
        if file.size > 5 * 1024 * 1024:
            return Response(
                {'success': False, 'message': 'File size exceeds 5MB limit'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract text based on file type
        text = None
        if file.content_type == 'application/pdf':
            text = extract_text_from_pdf(file)
        elif file.content_type == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
            text = extract_text_from_docx(file)
        elif file.content_type == 'application/msword':
            text = extract_text_from_doc(file)
        
        if not text:
            return Response(
                {'success': False, 'message': 'Could not extract text from CV'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Extract information
        extracted_data = {}
        
        # Extract email
        email = extract_email(text)
        if email:
            extracted_data['email'] = email
        
        # Extract phone
        phone = extract_phone(text)
        if phone:
            extracted_data['contact_number'] = phone
        
        # Extract name
        name = extract_name(text)
        if name:
            name_parts = name.split()
            if len(name_parts) >= 1:
                extracted_data['first_name'] = name_parts[0]
            if len(name_parts) >= 2:
                extracted_data['last_name'] = ' '.join(name_parts[1:])
        
        # Extract location
        city, state = extract_location(text)
        if city:
            extracted_data['city'] = city
        if state:
            extracted_data['state'] = state
        
        # Validate extraction
        serializer = CVParseSerializer(data=extracted_data)
        serializer.is_valid(raise_exception=False)
        
        logger.info(f"CV parsed successfully. Extracted: {extracted_data}")
        
        return Response({
            'success': True,
            'message': 'CV parsed successfully',
            'extracted_data': extracted_data
        }, status=status.HTTP_200_OK)
    
    except Exception as e:
        logger.error(f"CV parsing error: {str(e)}")
        return Response(
            {'success': False, 'message': f'Error parsing CV: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    """
    Register SME with form data
    Expected: POST with all form fields + optional cv_file
    Returns: JSON with registration_id and success status
    """
    try:
        # Validate input
        serializer = RegistrationCreateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(
                {'success': False, 'errors': serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Create registration
        data = serializer.validated_data
        
        sme = SMERegistration.objects.create(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email_id=data['email_id'],
            personal_linkedin_url=data.get('personal_linkedin_url', ''),
            contact_number=data['contact_number'],
            area_of_expertise=data.get('area_of_expertise', ''),
            expertise_description=data.get('expertise_description', ''),
            address_of_institute=data['address_of_institute'],
            state_id=data['state_id'],
            district_id=data['district_id'],
            city_name=data['city_name'],
            pin_code=data['pin_code'],
            import_source=data.get('import_source', 'linkedin')
        )
        
        # Handle CV file upload
        if 'cv_file' in request.FILES and request.FILES['cv_file']:
            sme.cv_file = request.FILES['cv_file']
            sme.save()
        
        # Log registration
        logger.info(f"New registration: {sme.registration_id} - {sme.first_name} {sme.last_name}")
        
        # Prepare response
        response_data = {
            'success': True,
            'message': 'Registration successful',
            'registration_id': sme.registration_id,
            'registration': SMERegistrationSerializer(sme).data
        }
        
        return Response(response_data, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        logger.error(f"Registration error: {str(e)}")
        return Response(
            {'success': False, 'message': f'Registration failed: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['GET'])
@permission_classes([AllowAny])
def get_registration(request, registration_id):
    """Get registration details by ID"""
    try:
        sme = SMERegistration.objects.get(registration_id=registration_id)
        serializer = SMERegistrationSerializer(sme)
        return Response({'success': True, 'data': serializer.data})
    except SMERegistration.DoesNotExist:
        return Response(
            {'success': False, 'message': 'Registration not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    
def linkedin_login(request):

    auth_url = (
        "https://www.linkedin.com/oauth/v2/authorization"
        f"?response_type=code"
        f"&client_id={settings.LINKEDIN_CLIENT_ID}"
        f"&redirect_uri={settings.LINKEDIN_REDIRECT_URI}"
        f"&scope=openid profile email"
    )

    return redirect(auth_url)

def linkedin_callback(request):

    code = request.GET.get("code")

    token_response = requests.post(
        "https://www.linkedin.com/oauth/v2/accessToken",
        data={
            "grant_type": "authorization_code",
            "code": code,
            "client_id": settings.LINKEDIN_CLIENT_ID,
            "client_secret": settings.LINKEDIN_CLIENT_SECRET,
            "redirect_uri": settings.LINKEDIN_REDIRECT_URI
        }
    )

    token_data = token_response.json()

    access_token = token_data.get("access_token")

    if not access_token:
        return JsonResponse({
            "success": False,
            "message": "Could not obtain access token"
        })

    profile_response = requests.get(
        "https://api.linkedin.com/v2/userinfo",
        headers={
            "Authorization": f"Bearer {access_token}"
        }
    )

    profile = profile_response.json()

    return JsonResponse({
        "success": True,
        "profile": profile
    })