# Detailed Implementation Guide: Enhanced SME Registration

**Date:** June 2, 2026  
**Project:** UNNATI Subject Matter Expert Registration  
**Framework:** Django Backend + Vanilla JS Frontend  

---

## Table of Contents
1. [Overview](#overview)
2. [File Structure](#file-structure)
3. [Frontend Implementation](#frontend-implementation)
4. [Backend Implementation](#backend-implementation)
5. [Integration & Deployment](#integration--deployment)
6. [Testing Guide](#testing-guide)

---

## Overview

### What We're Building
A complete SME registration system with:
- **LinkedIn OAuth import** → Auto-fill first name, last name, LinkedIn URL, email
- **CV parser** → Upload CV → Backend extracts details → Auto-fill form
- **CV storage** → Optional CV upload in Professional Details section
- **Django registration** → Save all data with unique ID: `UNNS/YYYYMMDD/N<serial>`

### Key Points
- **Mutually exclusive import:** Users choose LinkedIn OR CV (not both)
- **Two CV upload locations:**
  - **Top (Import Details):** Temporary, for data extraction only
  - **Professional Details:** Permanent, stored with submission
- **Minimal frontend changes:** Reuse existing structure and CSS
- **Clean backend:** New Django project, no conflicts with existing code

---

## File Structure

```
/Users/nitingupta/Desktop/intern/smeregpage/
├── frontend/
│   ├── index.html (MODIFY - 3 changes)
│   ├── js/
│   │   └── script.js (MODIFY - enhance CV parser, form submission)
│   ├── css/
│   │   └── style.css (NO CHANGES)
│   ├── logo-unnati.png
│   └── logo.png
│
├── backend/
│   ├── requirements.txt (REPLACE)
│   ├── manage.py (NEW - auto-generated)
│   ├── db.sqlite3 (NEW - auto-created)
│   ├── media/
│   │   └── cv_uploads/ (NEW - for CV storage)
│   ├── sme_registration/
│   │   ├── __init__.py (NEW)
│   │   ├── settings.py (NEW)
│   │   ├── urls.py (NEW)
│   │   ├── asgi.py (NEW)
│   │   └── wsgi.py (NEW)
│   ├── registration/
│   │   ├── migrations/
│   │   │   ├── __init__.py (NEW)
│   │   │   └── 0001_initial.py (NEW - auto-generated)
│   │   ├── __init__.py (NEW)
│   │   ├── models.py (NEW)
│   │   ├── views.py (NEW)
│   │   ├── serializers.py (NEW)
│   │   ├── urls.py (NEW)
│   │   ├── apps.py (NEW)
│   │   ├── admin.py (NEW)
│   │   └── tests.py (NEW)
│   └── venv/ (existing)
```

---

# FRONTEND IMPLEMENTATION

## Part 1: HTML Changes (index.html)

### Change 1: Enhance CV Upload in Import Details Section

**Location:** Lines 127-145 (Import CV field)

**Current code to find:**
```html
<div class="import-cv-field" style="display:none;">
    <div class="form-group mb-3">
        <label class="form-label">Upload CV / Resume</label>
        <div class="upload-zone" id="uploadZone">
            <div class="upload-zone-content">
                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                <p class="mb-1 fw-medium">Drag & drop your file here</p>
                <p class="small text-muted mb-2">or</p>
                <button type="button" class="btn btn-outline-primary btn-sm" id="browseBtn">Browse Files</button>
                <input type="file" id="cvFile" accept=".pdf,.doc,.docx" style="display:none;">
                <p class="small text-muted mt-2 mb-0">Supported formats: PDF, DOC, DOCX (max 5MB)</p>
            </div>
            <div class="upload-zone-file" style="display:none;">
                <i class="fas fa-file-pdf file-icon"></i>
                <span class="file-name" id="fileName"></span>
                <button type="button" class="btn btn-sm btn-link text-danger remove-file" id="removeFile"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <div class="error-msg" id="cvFile_error"></div>
    </div>
</div>
```

**Replace with:**
```html
<div class="import-cv-field" style="display:none;">
    <div class="form-group mb-3">
        <label class="form-label">Upload CV / Resume</label>
        <div class="upload-zone" id="uploadZone">
            <div class="upload-zone-content">
                <i class="fas fa-cloud-upload-alt upload-icon"></i>
                <p class="mb-1 fw-medium">Drag & drop your file here</p>
                <p class="small text-muted mb-2">or</p>
                <button type="button" class="btn btn-outline-primary btn-sm" id="browseBtn">Browse Files</button>
                <input type="file" id="cvFile" accept=".pdf,.doc,.docx" style="display:none;">
                <p class="small text-muted mt-2 mb-0">Supported formats: PDF, DOC, DOCX (max 5MB)</p>
            </div>
            <div class="upload-zone-file" style="display:none;">
                <i class="fas fa-file-pdf file-icon"></i>
                <span class="file-name" id="fileName"></span>
                <button type="button" class="btn btn-sm btn-link text-danger remove-file" id="removeFile"><i class="fas fa-times"></i></button>
            </div>
        </div>
        <!-- Status message for CV parsing -->
        <div class="import-status" id="cvImportStatus"></div>
        <div class="error-msg" id="cvFile_error"></div>
    </div>
</div>
```

**What changed:** Added `<div class="import-status" id="cvImportStatus"></div>` to show parsing feedback.

---

### Change 2: Add CV Upload Field to Professional Details Section

**Location:** After line 210 (after expertise_description field)

**Find this code:**
```html
<!-- ========== Section 3: Professional Details ========== -->
<div class="section-box">
    <div class="section-header">
        <h5><i class="fas fa-briefcase me-2"></i>Professional Details</h5>
    </div>
    <div class="form-group mb-4">
        <label for="area_of_expertise" class="form-label">Area of Expertise</label>
        <textarea class="form-control login-input" id="area_of_expertise" rows="1" placeholder="Briefly describe your areas of expertise" maxlength="100"></textarea>
        <div class="char-counter"><span id="area_of_expertise_count">0</span>/100</div>
    </div>
    <div class="form-group mb-3">
        <label for="expertise_description" class="form-label">Expertise Description</label>
        <textarea class="form-control login-input" id="expertise_description" rows="4" placeholder="Briefly describe your professional background and areas of expertise" maxlength="1000"></textarea>
        <div class="char-counter"><span id="expertise_description_count">0</span>/1000</div>
    </div>
</div>
```

**Replace with:**
```html
<!-- ========== Section 3: Professional Details ========== -->
<div class="section-box">
    <div class="section-header">
        <h5><i class="fas fa-briefcase me-2"></i>Professional Details</h5>
    </div>
    <div class="form-group mb-4">
        <label for="area_of_expertise" class="form-label">Area of Expertise</label>
        <textarea class="form-control login-input" id="area_of_expertise" rows="1" placeholder="Briefly describe your areas of expertise" maxlength="100"></textarea>
        <div class="char-counter"><span id="area_of_expertise_count">0</span>/100</div>
    </div>
    <div class="form-group mb-4">
        <label for="expertise_description" class="form-label">Expertise Description</label>
        <textarea class="form-control login-input" id="expertise_description" rows="4" placeholder="Briefly describe your professional background and areas of expertise" maxlength="1000"></textarea>
        <div class="char-counter"><span id="expertise_description_count">0</span>/1000</div>
    </div>
    <!-- CV Upload for Professional Details -->
    <div class="form-group mb-3">
        <label for="cv_upload_professional" class="form-label">Upload CV / Resume (Optional)</label>
        <div class="input-group">
            <input type="file" class="form-control login-input" id="cv_upload_professional" accept=".pdf,.doc,.docx" aria-describedby="cv_help">
            <small id="cv_help" class="form-text text-muted d-block mt-1">Supported formats: PDF, DOC, DOCX (max 5MB). This CV will be stored with your registration.</small>
        </div>
        <div class="error-msg" id="cv_upload_professional_error"></div>
        <div id="cv_upload_professional_status" class="mt-2"></div>
    </div>
</div>
```

**What added:**
- New file input `cv_upload_professional` for Professional Details
- Help text explaining it's optional and stored with registration
- Error and status message divs

---

### Change 3: Add Success Modal at End of Form

**Location:** After form closing tag (after `</form>`) and before footer

**Add this code:**
```html
<!-- Success Modal -->
<div id="successModal" class="success-modal" style="display:none;">
    <div class="modal-content">
        <div class="modal-header success-header">
            <h5 class="modal-title"><i class="fas fa-check-circle"></i> Registration Successful</h5>
        </div>
        <div class="modal-body">
            <div class="success-message">
                <p class="mb-3">Your registration has been submitted successfully!</p>
                
                <div class="registration-details">
                    <div class="detail-row">
                        <span class="detail-label">Registration ID:</span>
                        <span class="detail-value" id="registrationId">UNNS/20260602/N001</span>
                        <button type="button" class="btn btn-sm btn-outline-primary ms-2" id="copyIdBtn">
                            <i class="fas fa-copy"></i> Copy
                        </button>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value" id="registrationName">-</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">Email:</span>
                        <span class="detail-value" id="registrationEmail">-</span>
                    </div>
                </div>

                <div class="alert alert-info mt-4" role="alert">
                    <i class="fas fa-info-circle"></i>
                    <strong>Save your Registration ID</strong> — You'll need it to track your application.
                    A confirmation email has been sent to your registered email address.
                </div>
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-primary" onclick="window.location.reload();">
                <i class="fas fa-redo"></i> Register Another SME
            </button>
            <button type="button" class="btn btn-secondary" onclick="window.location.href='/';">
                <i class="fas fa-home"></i> Back to Home
            </button>
        </div>
    </div>
</div>

<style>
    .success-modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }
    .modal-content {
        background: white;
        border-radius: 12px;
        box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        max-width: 500px;
        width: 90%;
        animation: slideUp 0.3s ease;
    }
    .modal-header {
        padding: 20px;
        border-bottom: 1px solid #e9ecef;
    }
    .success-header {
        background: linear-gradient(135deg, #0a66c2 0%, #004182 100%);
        color: white;
    }
    .modal-body {
        padding: 30px 20px;
    }
    .success-message p {
        font-size: 16px;
        color: #333;
    }
    .registration-details {
        background: #f8f9fa;
        border-left: 4px solid #0a66c2;
        padding: 15px;
        border-radius: 8px;
        margin: 20px 0;
    }
    .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px 0;
        border-bottom: 1px solid #dee2e6;
    }
    .detail-row:last-child {
        border-bottom: none;
    }
    .detail-label {
        font-weight: 600;
        color: #495057;
        min-width: 100px;
    }
    .detail-value {
        color: #0a66c2;
        font-weight: 500;
        word-break: break-all;
    }
    .modal-footer {
        padding: 15px 20px;
        border-top: 1px solid #e9ecef;
        display: flex;
        gap: 10px;
        justify-content: flex-end;
    }
    @keyframes slideUp {
        from {
            transform: translateY(30px);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
</style>
```

---

## Part 2: JavaScript Changes (js/script.js)

### Background
The existing script.js already has:
- State/district cascading dropdowns
- Form validation logic
- CV file upload toggle (radio buttons)
- Character counters

We'll **enhance** these with:
- CV parsing to backend
- Form submission to Django
- Professional Details CV handler

### Change 1: Find and Enhance the Form Submit Handler

**Find existing form submission** (around line 250-300):

```javascript
form.addEventListener("submit", function (e) {
    e.preventDefault();
    // ... existing validation ...
    alert("Registration submitted successfully!");
});
```

**Replace with this enhanced version:**

```javascript
form.addEventListener("submit", function (e) {
    e.preventDefault();

    // Validate mobile
    const mobile = document.getElementById('contact_number').value.trim();
    const mobileRegex = /^[5-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
        showError('contact_number_error', 'Please enter a valid 10-digit mobile number');
        return;
    }

    // Validate required fields
    const firstName = document.getElementById('first_name').value.trim();
    const lastName = document.getElementById('last_name').value.trim();
    const email = document.getElementById('email_id').value.trim();
    const address = document.getElementById('address_of_institute').value.trim();
    const state = document.getElementById('state_id').value.trim();
    const district = document.getElementById('district_id').value.trim();
    const city = document.getElementById('city_name').value.trim();
    const pin = document.getElementById('pin_code').value.trim();

    if (!firstName || !lastName || !email || !address || !state || !district || !city || !pin) {
        alert('Please fill in all required fields');
        return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showError('email_id_error', 'Please enter a valid email address');
        return;
    }

    // Validate that CV import was used if CV source selected
    const selectedSource = document.querySelector('input[name="importSource"]:checked')?.value;
    if (selectedSource === 'cv' && !window.cvFileDataImport) {
        alert('Please upload and parse your CV to import details');
        return;
    }

    // Validate that LinkedIn URL exists if LinkedIn source selected
    const linkedinUrl = document.getElementById('personal_linkedin_url').value.trim();
    if (selectedSource === 'linkedin' && !linkedinUrl) {
        alert('Please provide your LinkedIn profile URL');
        return;
    }

    // Prepare FormData for file uploads
    const formData = new FormData();
    
    // Add all form fields
    formData.append('first_name', firstName);
    formData.append('last_name', lastName);
    formData.append('email_id', email);
    formData.append('personal_linkedin_url', linkedinUrl);
    formData.append('contact_number', mobile);
    formData.append('area_of_expertise', document.getElementById('area_of_expertise').value);
    formData.append('expertise_description', document.getElementById('expertise_description').value);
    formData.append('address_of_institute', address);
    formData.append('state_id', state);
    formData.append('district_id', district);
    formData.append('city_name', city);
    formData.append('pin_code', pin);
    formData.append('import_source', selectedSource || 'linkedin');

    // Add CV file if present in Professional Details
    const cvFileInput = document.getElementById('cv_upload_professional');
    if (cvFileInput && cvFileInput.files.length > 0) {
        formData.append('cv_file', cvFileInput.files[0]);
    }

    // Show loading state
    const submitBtn = document.getElementById('submitBtn');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';

    // Submit to Django backend
    fetch('/api/register/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
        }
    })
    .then(response => response.json())
    .then(data => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;

        if (data.success) {
            // Hide form and show success modal
            document.querySelector('.login-form-container').style.display = 'none';
            
            // Display success modal
            const successModal = document.getElementById('successModal');
            document.getElementById('registrationId').innerText = data.registration_id;
            document.getElementById('registrationName').innerText = firstName + ' ' + lastName;
            document.getElementById('registrationEmail').innerText = email;
            successModal.style.display = 'flex';
        } else {
            alert('Error: ' + (data.message || 'Registration failed. Please try again.'));
            console.error('Server error:', data);
        }
    })
    .catch(error => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
        console.error('Error:', error);
        alert('Error submitting registration. Please check your connection and try again.');
    });
});

// Copy registration ID to clipboard
document.addEventListener('click', function(e) {
    if (e.target.id === 'copyIdBtn') {
        const registrationId = document.getElementById('registrationId').innerText;
        navigator.clipboard.writeText(registrationId).then(() => {
            const btn = e.target;
            const originalText = btn.innerHTML;
            btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
            setTimeout(() => {
                btn.innerHTML = originalText;
            }, 2000);
        });
    }
});
```

---

### Change 2: Add CV Parser Function for Import Details

**Add this function after the form submit handler** (around line 350):

```javascript
// ============================================================
// CV PARSING FOR IMPORT DETAILS
// ============================================================

var cvFileDataImport = null;  // Track if CV import was successful

function uploadAndParseCV(file) {
    const validTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!validTypes.includes(file.type)) {
        showError('cvFile_error', 'Invalid file type. Please upload PDF, DOC, or DOCX.');
        showCvImportStatus('✗ Invalid file type', 'error');
        return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
        showError('cvFile_error', 'File is too large. Maximum 5MB allowed.');
        showCvImportStatus('✗ File exceeds 5MB limit', 'error');
        return;
    }
    
    showCvImportStatus('Processing your CV...', 'processing');
    
    const formData = new FormData();
    formData.append('cv', file);
    
    fetch('/api/parse-cv/', {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success && data.extracted_data) {
            const extracted = data.extracted_data;
            
            // Auto-fill Personal Details
            if (extracted.first_name) {
                document.getElementById('first_name').value = extracted.first_name;
                updateCharCounter('first_name');
            }
            if (extracted.last_name) {
                document.getElementById('last_name').value = extracted.last_name;
                updateCharCounter('last_name');
            }
            if (extracted.email) {
                document.getElementById('email_id').value = extracted.email;
                updateCharCounter('email_id');
            }
            if (extracted.contact_number) {
                document.getElementById('contact_number').value = extracted.contact_number;
            }
            if (extracted.city) {
                document.getElementById('city_name').value = extracted.city;
                updateCharCounter('city_name');
            }
            if (extracted.state) {
                // Populate state dropdown
                const stateSelect = document.getElementById('state_id');
                const stateOption = Array.from(stateSelect.options).find(
                    opt => opt.value.toLowerCase() === extracted.state.toLowerCase()
                );
                if (stateOption) {
                    stateSelect.value = stateOption.value;
                    // Trigger district update
                    updateDistricts();
                }
            }
            
            cvFileDataImport = true;  // Mark CV import as successful
            showCvImportStatus('✓ CV parsed successfully! Details have been auto-filled.', 'success');
        } else {
            cvFileDataImport = false;
            showCvImportStatus('✗ Could not parse CV. ' + (data.message || 'Please fill details manually.'), 'error');
        }
    })
    .catch(error => {
        cvFileDataImport = false;
        console.error('Error:', error);
        showCvImportStatus('✗ Error uploading CV. Please try again.', 'error');
    });
}

function showCvImportStatus(message, type) {
    const statusDiv = document.getElementById('cvImportStatus');
    statusDiv.innerText = message;
    statusDiv.className = 'import-status ' + (type === 'success' ? 'success' : type === 'error' ? 'error' : '');
}

// Handle CV file input change
document.addEventListener('change', function(e) {
    if (e.target.id === 'cvFile' && e.target.files.length > 0) {
        uploadAndParseCV(e.target.files[0]);
    }
    if (e.target.id === 'cv_upload_professional' && e.target.files.length > 0) {
        const file = e.target.files[0];
        if (file.size > 5 * 1024 * 1024) {
            showError('cv_upload_professional_error', 'File is too large. Maximum 5MB allowed.');
        } else {
            document.getElementById('cv_upload_professional_error').innerText = '';
        }
    }
});

// Handle drag & drop for CV upload zone
const uploadZone = document.getElementById('uploadZone');
if (uploadZone) {
    uploadZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        
        if (e.dataTransfer.files.length > 0) {
            document.getElementById('cvFile').files = e.dataTransfer.files;
            uploadAndParseCV(e.dataTransfer.files[0]);
        }
    });
}
```

---

### Change 3: Add Helper Function to Update Character Counter

**Add this function** (if not already present):

```javascript
function updateCharCounter(fieldId) {
    const field = document.getElementById(fieldId);
    const counter = document.getElementById(fieldId + '_count');
    if (counter) {
        counter.innerText = field.value.length;
    }
}
```

---

### Change 4: Enhance Import Source Toggle

**Find the radio button change handler** for `importLinkedin` and `importCv`:

```javascript
// Should already exist - just add this after it if not there
document.addEventListener('change', function(e) {
    if (e.target.name === 'importSource') {
        cvFileDataImport = null;  // Reset CV import flag when switching
        showCvImportStatus('', '');  // Clear status
    }
});
```

---

# BACKEND IMPLEMENTATION

## Part 1: Create Django Project

### Step 1: Navigate to Backend and Create Virtual Environment

```bash
cd /Users/nitingupta/Desktop/intern/smeregpage/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# Or on Windows: venv\Scripts\activate
```

### Step 2: Replace requirements.txt

**File:** `/Users/nitingupta/Desktop/intern/smeregpage/backend/requirements.txt`

**Delete all content and replace with:**

```txt
Django==4.2.13
djangorestframework==3.14.0
django-cors-headers==4.3.1
python-decouple==3.8
pdfplumber==0.10.3
python-docx==0.8.11
pypdf==4.1.0
Pillow==10.2.0
gunicorn==21.2.0
psycopg2-binary==2.9.9
```

### Step 3: Install Dependencies

```bash
pip install -r requirements.txt
```

---

## Part 2: Create Django Project Structure

### Step 1: Create Django Project

```bash
django-admin startproject sme_registration .
```

This creates:
- `manage.py`
- `sme_registration/` folder with settings, urls, wsgi, asgi

### Step 2: Create Django App

```bash
python manage.py startapp registration
```

This creates the `registration/` app folder.

---

## Part 3: Configure Django Settings

**File:** `/Users/nitingupta/Desktop/intern/smeregpage/backend/sme_registration/settings.py`

**Find and modify these sections:**

### Replace INSTALLED_APPS:
```python
INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Third-party apps
    'rest_framework',
    'corsheaders',
    
    # Local apps
    'registration',
]
```

### Add MIDDLEWARE (after INSTALLED_APPS):
```python
MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'corsheaders.middleware.CorsMiddleware',  # Add this line
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]
```

### Add CORS Configuration (near the end, before CSRF settings):
```python
# CORS Settings
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://localhost:8080",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:8080",
]

CORS_ALLOW_CREDENTIALS = True
```

### Update DATABASES (around line 80):
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

### Add Media Files Configuration (near end):
```python
# Media files (for CV uploads)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

# Create media/cv_uploads directory
import os
os.makedirs(MEDIA_ROOT / 'cv_uploads', exist_ok=True)
```

### Add REST Framework Configuration:
```python
REST_FRAMEWORK = {
    'DEFAULT_RENDERER_CLASSES': [
        'rest_framework.renderers.JSONRenderer',
    ],
}
```

---

## Part 4: Create Models

**File:** `/Users/nitingupta/Desktop/intern/smeregpage/backend/registration/models.py`

**Create entire file with:**

```python
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
```

---

## Part 5: Create Serializers

**File:** `/Users/nitingupta/Desktop/intern/smeregpage/backend/registration/serializers.py`

**Create entire file with:**

```python
from rest_framework import serializers
from .models import SMERegistration

class SMERegistrationSerializer(serializers.ModelSerializer):
    cv_filename = serializers.SerializerMethodField()
    
    class Meta:
        model = SMERegistration
        fields = [
            'id', 'registration_id', 'first_name', 'last_name', 'email_id',
            'personal_linkedin_url', 'contact_number', 'area_of_expertise',
            'expertise_description', 'cv_file', 'cv_filename',
            'address_of_institute', 'state_id', 'district_id', 'city_name',
            'pin_code', 'import_source', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'registration_id', 'created_at', 'updated_at', 'cv_filename']
    
    def get_cv_filename(self, obj):
        """Return CV filename if present"""
        return obj.get_cv_filename()

class RegistrationCreateSerializer(serializers.Serializer):
    """Serializer for form submission"""
    first_name = serializers.CharField(max_length=50)
    last_name = serializers.CharField(max_length=50)
    email_id = serializers.EmailField()
    personal_linkedin_url = serializers.URLField(max_length=500, required=False, allow_blank=True)
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
        if value[0] not in '56789':
            raise serializers.ValidationError("Contact number must start with 5-9")
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

class CVParseSerializer(serializers.Serializer):
    """Serializer for CV parsing response"""
    first_name = serializers.CharField(required=False, allow_blank=True)
    last_name = serializers.CharField(required=False, allow_blank=True)
    email = serializers.EmailField(required=False, allow_blank=True)
    contact_number = serializers.CharField(required=False, allow_blank=True)
    city = serializers.CharField(required=False, allow_blank=True)
    state = serializers.CharField(required=False, allow_blank=True)
```

---

## Part 6: Create Views

**File:** `/Users/nitingupta/Desktop/intern/smeregpage/backend/registration/views.py`

**Create entire file with:**

```python
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
```

---

## Part 7: Create URL Patterns

**File:** `/Users/nitingupta/Desktop/intern/smeregpage/backend/registration/urls.py`

**Create entire file with:**

```python
from django.urls import path
from . import views

app_name = 'registration'

urlpatterns = [
    path('parse-cv/', views.parse_cv, name='parse_cv'),
    path('register/', views.register, name='register'),
    path('get/<str:registration_id>/', views.get_registration, name='get_registration'),
]
```

---

## Part 8: Update Main URLs

**File:** `/Users/nitingupta/Desktop/intern/smeregpage/backend/sme_registration/urls.py`

**Replace entire content with:**

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('registration.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

---

## Part 9: Register Model in Admin

**File:** `/Users/ntingupta/Desktop/intern/smeregpage/backend/registration/admin.py`

**Replace entire content with:**

```python
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
```

---

# INTEGRATION & DEPLOYMENT

## Part 1: Create Database and Run Migrations

```bash
cd /Users/nitingupta/Desktop/intern/smeregpage/backend

# Activate virtual environment
source venv/bin/activate

# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser for admin panel
python manage.py createsuperuser
# Follow prompts to create admin user
```

---

## Part 2: Create Media Directory

```bash
# Create media and cv_uploads directories
mkdir -p media/cv_uploads
chmod 755 media
chmod 755 media/cv_uploads
```

---

## Part 3: Update Frontend API URLs

**File:** `/Users/nitingupta/Desktop/intern/smeregpage/frontend/js/script.js`

**Find these API endpoints and verify they point to Django:**

```javascript
// Should be:
fetch('/api/parse-cv/', {
    method: 'POST',
    body: formData,
    headers: {
        'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
    }
})

// And:
fetch('/api/register/', {
    method: 'POST',
    body: formData,
    headers: {
        'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
    }
})
```

**If running on different hosts, use full URLs:**
```javascript
const API_BASE = 'http://localhost:8000';

fetch(API_BASE + '/api/parse-cv/', {...})
fetch(API_BASE + '/api/register/', {...})
```

---

## Part 4: Run Django Development Server

```bash
cd /Users/nitingupta/Desktop/intern/smeregpage/backend

# Activate virtual environment (if not already)
source venv/bin/activate

# Run development server
python manage.py runserver 8000
```

Output should show:
```
Starting development server at http://127.0.0.1:8000/
```

---

## Part 5: Run Frontend Server

**In a new terminal:**

```bash
cd /Users/nitingupta/Desktop/intern/smeregpage/frontend

# If using Python's built-in server
python -m http.server 3000

# Or if using Node.js http-server
npx http-server -p 3000
```

Now frontend is accessible at `http://localhost:3000`

---

# TESTING GUIDE

## Phase 1: Manual Testing

### Test 1: LinkedIn Import Toggle
1. Open registration form
2. In "Import Details" section, click "LinkedIn Profile URL" radio button
3. Verify: LinkedIn URL input field is visible
4. Click "Upload CV" radio button
5. Verify: CV upload zone appears instead

### Test 2: CV Parsing (Happy Path)
1. Select "Upload CV" option
2. Prepare a test CV file (PDF with basic info)
3. Drag and drop CV onto upload zone (or use browse button)
4. Observe: "Processing your CV..." message appears
5. After 2-3 seconds: "CV parsed successfully!" message
6. Verify: Personal Details auto-filled:
   - first_name
   - last_name
   - email_id
   - contact_number
   - city_name
   - state_id (if found)

### Test 3: CV Parsing (Error Cases)
1. Try uploading invalid file (e.g., .txt or .jpg)
2. Verify: Error message "Invalid file type"
3. Try uploading empty PDF
4. Verify: Graceful error message
5. Try uploading file > 5MB
6. Verify: Error message about file size

### Test 4: Professional Details CV Field
1. Scroll to "Professional Details" section
2. Locate new "Upload CV / Resume (Optional)" field
3. Upload valid CV file
4. Verify: File name displayed / no error
5. Upload invalid file (wrong format)
6. Verify: Error message shown

### Test 5: Form Submission (CV Source)
1. Select "Upload CV" in Import Details
2. Upload and parse a CV successfully
3. Fill remaining required fields (address, state, district, city, pin)
4. Click "Submit Registration"
5. Observe: "Submitting..." button state
6. After 2-3 seconds: Success modal appears
7. Verify in success modal:
   - Registration ID format: `UNNS/20260602/N001` (correct date/serial)
   - Name displayed correctly
   - Email displayed correctly
8. Verify buttons work:
   - "Register Another SME" → Form reloads
   - "Back to Home" → Navigates home

### Test 6: Form Submission (LinkedIn Source)
1. Select "LinkedIn Profile URL"
2. Enter LinkedIn URL manually (e.g., `https://www.linkedin.com/in/example`)
3. Fill all other required fields
4. Click "Submit Registration"
5. Verify: Success modal with registration ID

### Test 7: Validation Tests
1. Leave required fields empty → Submission blocked with error
2. Enter invalid email → Error message
3. Enter invalid phone (< 10 digits) → Error message
4. Enter invalid PIN (< 6 digits) → Error message
5. Try CV source without uploading file → Error message

### Test 8: Database Persistence
1. Submit a registration successfully
2. Check database via Django admin:
   ```bash
   # Go to http://localhost:8000/admin
   # Login with superuser credentials
   # View SME Registrations
   ```
3. Verify: All form data saved correctly
4. Verify: registration_id generated correctly
5. Verify: CV file stored in media/cv_uploads/

### Test 9: Multiple Registrations (Same Day)
1. Submit first registration → ID: `UNNS/20260602/N001`
2. Submit second registration → ID should be `UNNS/20260602/N002`
3. Verify: Serial number incremented

### Test 10: Multiple Registrations (Different Day)
1. Submit registration on Day 1 → ID: `UNNS/20260602/N001`
2. Manually update system date to Day 2
3. Submit registration on Day 2 → ID should be `UNNS/20260603/N001`
4. Verify: Date changed, serial reset to N001

---

## Phase 2: API Testing (with cURL)

### Test CV Parse Endpoint
```bash
curl -X POST http://localhost:8000/api/parse-cv/ \
  -F "cv=@/path/to/sample.pdf"
```

Expected response:
```json
{
  "success": true,
  "message": "CV parsed successfully",
  "extracted_data": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "contact_number": "9876543210",
    "city": "Delhi",
    "state": "Delhi"
  }
}
```

### Test Registration Endpoint
```bash
curl -X POST http://localhost:8000/api/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email_id": "john@example.com",
    "contact_number": "9876543210",
    "personal_linkedin_url": "https://www.linkedin.com/in/johndoe",
    "area_of_expertise": "Python, Django",
    "expertise_description": "Experienced Django developer",
    "address_of_institute": "123 Main St",
    "state_id": "Delhi",
    "district_id": "Central Delhi",
    "city_name": "Delhi",
    "pin_code": "110001",
    "import_source": "linkedin"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Registration successful",
  "registration_id": "UNNS/20260602/N001",
  "registration": {
    "id": 1,
    "registration_id": "UNNS/20260602/N001",
    "first_name": "John",
    "last_name": "Doe",
    ...
  }
}
```

---

## Phase 3: Frontend Console Checks

1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Test form submission and check:
   - No JavaScript errors
   - API calls show in Network tab
   - Responses are valid JSON
   - CORS errors (if any) shown in red

---

## Phase 4: Browser Compatibility

Test on:
- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (if on macOS)
- Mobile browsers (iOS Safari, Chrome mobile)

Verify:
- Form layout responsive on mobile
- File drag-and-drop works
- Success modal displays correctly

---

## Known Limitations & Troubleshooting

### Issue: CV parsing returns empty data
**Cause:** Complex CV formatting or unsupported languages
**Solution:** Manual field fill available; regex patterns can be enhanced

### Issue: CORS errors on form submission
**Cause:** Frontend and backend on different origins
**Solution:** Verify CORS_ALLOWED_ORIGINS in Django settings

### Issue: File upload fails
**Cause:** Media directory permissions or incorrect path
**Solution:** Ensure `media/cv_uploads/` writable; check Django MEDIA_ROOT

### Issue: Registration ID not generating
**Cause:** Migration not applied
**Solution:** Run `python manage.py migrate`

### Issue: Admin panel won't load
**Cause:** Superuser not created
**Solution:** Run `python manage.py createsuperuser`

---

## Deployment Checklist

- [ ] Django SECRET_KEY changed from default
- [ ] DEBUG = False in production
- [ ] ALLOWED_HOSTS updated with domain
- [ ] Database migrated (PostgreSQL recommended)
- [ ] Static files collected: `python manage.py collectstatic`
- [ ] Media directory with proper permissions
- [ ] Email configuration (for confirmation emails)
- [ ] HTTPS enabled
- [ ] Gunicorn or similar WSGI server running
- [ ] Nginx or Apache reverse proxy configured
- [ ] Backups configured
- [ ] Logs monitored

---

**End of Implementation Guide**

For questions or issues during implementation, refer to specific sections above or check Django/DRF documentation at https://docs.djangoproject.com and https://www.django-rest-framework.org
