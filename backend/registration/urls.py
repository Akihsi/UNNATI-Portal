from django.urls import path
from . import views

app_name = 'registration'

urlpatterns = [
    path('parse-cv/', views.parse_cv, name='parse_cv'),
    path('register/', views.register, name='register'),
    path('get/<str:registration_id>/', views.get_registration, name='get_registration'),
    path('auth/linkedin/', views.linkedin_login),
    path('auth/linkedin/callback/', views.linkedin_callback),
]
