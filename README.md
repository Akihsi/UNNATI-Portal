# SME Registration

**Date:** June 2, 2026  
**Project:** UNNATI Subject Matter Expert Registration  
**Framework:** Django Backend + Vanilla JS Frontend  

---

## File Structure

```
root/
├── frontend/
│   ├── index.html 
│   ├── js/
│   │   └── script.js 
│   ├── css/
│   │   └── style.css 
│   ├── logo-unnati.png
│   └── logo.png
│
├── backend/
│   ├── requirements.txt 
│   ├── manage.py
│   ├── db.sqlite3
│   ├── media/
│   │   └── cv_uploads/ 
│   ├── sme_registration/
│   │   ├── __init__.py 
│   │   ├── settings.py 
│   │   ├── urls.py
│   │   ├── asgi.py 
│   │   └── wsgi.py 
│   ├── registration/
│   │   ├── migrations/
│   │   │   ├── __init__.py 
│   │   │   └── 0001_initial.py 
│   │   ├── __init__.py 
│   │   ├── models.py 
│   │   ├── views.py 
│   │   ├── serializers.py 
│   │   ├── urls.py 
│   │   ├── apps.py 
│   │   ├── admin.py 
│   │   └── tests.py 
```

---

# BACKEND 

## Part 1: Create Django Project

### Step 1: Navigate to Backend and Create Virtual Environment

```bash
cd root/backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# Or on Windows: venv\Scripts\activate
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```


# INTEGRATION & DEPLOYMENT

## Part 1: Create Database and Run Migrations

```bash
cd /root/backend

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

## Part 3: Run Django Development Server

```bash
cd /root/backend

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
cd /root/frontend

# If using Python's built-in server
python -m http.server 3000

# Or if using Node.js http-server
npx http-server -p 3000
```

Now frontend is accessible at `http://localhost:3000`

---
