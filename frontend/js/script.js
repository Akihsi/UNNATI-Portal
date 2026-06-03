(function () {
    'use strict';

    // ── Data ────────────────────────────────────────────────

    var states = [
        'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
        'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand',
        'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
        'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
        'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
        'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
        'Andaman And Nicobar Islands', 'Chandigarh', 'Dadra And Nagar Haveli',
        'Daman And Diu', 'Delhi', 'Jammu And Kashmir', 'Ladakh',
        'Lakshadweep', 'Puducherry'
    ];

    var districts = {
        'Andhra Pradesh': ['Anantapur', 'Chittoor', 'East Godavari', 'Guntur', 'Krishna', 'Kurnool', 'Nellore', 'Prakasam', 'Srikakulam', 'Visakhapatnam', 'Vizianagaram', 'West Godavari', 'YSR Kadapa'],
        'Arunachal Pradesh': ['Tawang', 'West Kameng', 'East Kameng', 'Papum Pare', 'Lower Subansiri', 'Upper Subansiri', 'West Siang', 'East Siang'],
        'Assam': ['Barpeta', 'Bongaigaon', 'Cachar', 'Darrang', 'Dhemaji', 'Dibrugarh', 'Goalpara', 'Guwahati (Kamrup Metro)', 'Jorhat', 'Kamrup', 'Nagaon', 'Sivasagar', 'Tinsukia'],
        'Bihar': ['Araria', 'Aurangabad', 'Begusarai', 'Bhagalpur', 'Darbhanga', 'Gaya', 'Muzaffarpur', 'Nalanda', 'Patna', 'Purnia', 'Saran', 'Vaishali'],
        'Chhattisgarh': ['Bastar', 'Bilaspur', 'Durg', 'Janjgir-Champa', 'Korba', 'Raigarh', 'Raipur', 'Rajnandgaon', 'Surguja'],
        'Delhi': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'North East Delhi', 'North West Delhi', 'Shahdara', 'South Delhi', 'South East Delhi', 'South West Delhi', 'West Delhi'],
        'Goa': ['North Goa', 'South Goa'],
        'Gujarat': ['Ahmedabad', 'Anand', 'Baroda (Vadodara)', 'Bharuch', 'Bhavnagar', 'Gandhinagar', 'Jamnagar', 'Junagadh', 'Kutch', 'Mehsana', 'Rajkot', 'Surat', 'Valsad'],
        'Haryana': ['Ambala', 'Faridabad', 'Gurugram', 'Hisar', 'Karnal', 'Kurukshetra', 'Panchkula', 'Panipat', 'Rohtak', 'Sonipat'],
        'Himachal Pradesh': ['Bilaspur', 'Hamirpur', 'Kangra', 'Kullu', 'Mandi', 'Shimla', 'Solan', 'Una'],
        'Jharkhand': ['Bokaro', 'Deoghar', 'Dhanbad', 'Giridih', 'Hazaribagh', 'Jamshedpur (East Singhbhum)', 'Palamu', 'Ranchi', 'West Singhbhum'],
        'Karnataka': ['Bagalkot', 'Ballari', 'Belagavi', 'Bengaluru Urban', 'Bengaluru Rural', 'Dakshina Kannada', 'Dharwad', 'Hassan', 'Kolar', 'Mandya', 'Mysuru', 'Shivamogga', 'Tumakuru', 'Udupi', 'Vijayapura'],
        'Kerala': ['Alappuzha', 'Ernakulam', 'Idukki', 'Kannur', 'Kasaragod', 'Kollam', 'Kottayam', 'Kozhikode', 'Malappuram', 'Palakkad', 'Thiruvananthapuram', 'Thrissur', 'Wayanad'],
        'Madhya Pradesh': ['Bhopal', 'Chhindwara', 'Gwalior', 'Indore', 'Jabalpur', 'Mandla', 'Rewa', 'Sagar', 'Satna', 'Ujjain'],
        'Maharashtra': ['Ahmednagar', 'Akola', 'Amravati', 'Aurangabad', 'Beed', 'Bhandara', 'Chandrapur', 'Dhule', 'Gadchiroli', 'Jalgaon', 'Kolhapur', 'Mumbai City', 'Mumbai Suburban', 'Nagpur', 'Nanded', 'Nashik', 'Pune', 'Ratnagiri', 'Sangli', 'Satara', 'Solapur', 'Thane'],
        'Manipur': ['Bishnupur', 'Chandel', 'Churachandpur', 'Imphal East', 'Imphal West', 'Senapati', 'Thoubal', 'Ukhrul'],
        'Meghalaya': ['East Garo Hills', 'East Khasi Hills', 'Jaintia Hills', 'Ri Bhoi', 'South Garo Hills', 'West Garo Hills', 'West Khasi Hills'],
        'Mizoram': ['Aizawl', 'Champhai', 'Hnahthial', 'Kolasib', 'Lawngtlai', 'Lunglei', 'Mamit', 'Saitual', 'Serchhip'],
        'Nagaland': ['Dimapur', 'Kiphire', 'Kohima', 'Longleng', 'Mokokchung', 'Mon', 'Peren', 'Phek', 'Tuensang', 'Wokha', 'Zunheboto'],
        'Odisha': ['Angul', 'Balasore', 'Bargarh', 'Bhadrak', 'Cuttack', 'Ganjam', 'Jajpur', 'Kendrapara', 'Khordha', 'Koraput', 'Mayurbhanj', 'Puri', 'Sambalpur', 'Sundargarh'],
        'Punjab': ['Amritsar', 'Bathinda', 'Faridkot', 'Fatehgarh Sahib', 'Firozpur', 'Gurdaspur', 'Hoshiarpur', 'Jalandhar', 'Ludhiana', 'Moga', 'Mohali (SAS Nagar)', 'Patiala', 'Rupnagar'],
        'Rajasthan': ['Ajmer', 'Alwar', 'Banswara', 'Bharatpur', 'Bikaner', 'Jaipur', 'Jaisalmer', 'Jodhpur', 'Kota', 'Nagaur', 'Pali', 'Sikar', 'Udaipur'],
        'Sikkim': ['East Sikkim', 'North Sikkim', 'South Sikkim', 'West Sikkim'],
        'Tamil Nadu': ['Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul', 'Erode', 'Kanchipuram', 'Kanyakumari', 'Madurai', 'Nagapattinam', 'Namakkal', 'Perambalur', 'Salem', 'Sivaganga', 'Thanjavur', 'The Nilgiris', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli', 'Tiruvallur', 'Tiruvannamalai', 'Vellore', 'Viluppuram', 'Virudhunagar'],
        'Telangana': ['Adilabad', 'Bhadradri-Kothagudem', 'Hyderabad', 'Jagtial', 'Jangaon', 'Karimnagar', 'Khammam', 'Mahabubabad', 'Mahabubnagar', 'Mancherial', 'Medak', 'Medchal-Malkajgiri', 'Nagarkurnool', 'Nalgonda', 'Nizamabad', 'Peddapalli', 'Ranga Reddy', 'Sangareddy', 'Siddipet', 'Suryapet', 'Vikarabad', 'Warangal Urban', 'Yadadri-Bhongir'],
        'Tripura': ['Dhalai', 'Gomati', 'Khowai', 'North Tripura', 'Sepahijala', 'South Tripura', 'Unakoti', 'West Tripura'],
        'Uttar Pradesh': ['Agra', 'Aligarh', 'Allahabad (Prayagraj)', 'Ayodhya', 'Azamgarh', 'Bareilly', 'Basti', 'Budaun', 'Bulandshahr', 'Etawah', 'Firozabad', 'Ghaziabad', 'Gonda', 'Gorakhpur', 'Hapur', 'Jhansi', 'Kanpur Nagar', 'Kushinagar', 'Lucknow', 'Mathura', 'Meerut', 'Mirzapur', 'Moradabad', 'Muzaffarnagar', 'Noida (Gautam Buddha Nagar)', 'Saharanpur', 'Sambhal', 'Shahjahanpur', 'Sitapur', 'Sultanpur', 'Unnao', 'Varanasi'],
        'Uttarakhand': ['Almora', 'Chamoli', 'Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Pithoragarh', 'Rudraprayag', 'Tehri Garhwal', 'Udham Singh Nagar', 'Uttarkashi'],
        'West Bengal': ['Bankura', 'Birbhum', 'Cooch Behar', 'Darjeeling', 'Hooghly', 'Howrah', 'Jalpaiguri', 'Kalimpong', 'Kolkata', 'Malda', 'Murshidabad', 'Nadia', 'North 24 Parganas', 'Paschim Bardhaman', 'Paschim Medinipur', 'Purba Bardhaman', 'Purba Medinipur', 'South 24 Parganas'],
        'Andaman And Nicobar Islands': ['Nicobar', 'North and Middle Andaman', 'South Andaman'],
        'Chandigarh': ['Chandigarh'],
        'Dadra And Nagar Haveli': ['Dadra and Nagar Haveli'],
        'Daman And Diu': ['Daman', 'Diu'],
        'Jammu And Kashmir': ['Anantnag', 'Baramulla', 'Budgam', 'Doda', 'Jammu', 'Kathua', 'Kulgam', 'Kupwara', 'Poonch', 'Pulwama', 'Rajouri', 'Ramban', 'Reasi', 'Samba', 'Shopian', 'Srinagar', 'Udhampur'],
        'Ladakh': ['Kargil', 'Leh'],
        'Lakshadweep': ['Lakshadweep'],
        'Puducherry': ['Karaikal', 'Mahe', 'Puducherry', 'Yanam']
    };

    var ALLOWED_CV_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    var MAX_CV_SIZE = 5 * 1024 * 1024; // 5MB

    // ── DOM refs ────────────────────────────────────────────

    var form = document.getElementById('registrationForm');
    var importLinkedin = document.getElementById('importLinkedin');
    var importCv = document.getElementById('importCv');
    var linkedinImportField = document.querySelector('.import-linkedin-field');
    var cvImportField = document.querySelector('.import-cv-field');
    var uploadZone = document.getElementById('uploadZone');
    var cvFileInput = document.getElementById('cvFile');
    var browseBtn = document.getElementById('browseBtn');
    var removeFileBtn = document.getElementById('removeFile');
    var fileNameSpan = document.getElementById('fileName');
    var uploadContent = document.querySelector('.upload-zone-content');
    var uploadFileInfo = document.querySelector('.upload-zone-file');

    var stateSelect = document.getElementById('state_id');
    var districtSelect = document.getElementById('district_id');
    var cityInput = document.getElementById('city_name');
    var pinInput = document.getElementById('pin_code');
    var contactInput = document.getElementById('contact_number');
    var firstNameInput = document.getElementById('first_name');
    var lastNameInput = document.getElementById('last_name');

    var cvFileData = null;

    // ── Utility ─────────────────────────────────────────────

    function populateSelect(el, options, placeholder) {
        el.innerHTML = '<option value="">' + placeholder + '</option>';
        options.forEach(function (opt) {
            var o = document.createElement('option');
            o.value = opt;
            o.textContent = opt;
            el.appendChild(o);
        });
    }

    function getEl(id) { return document.getElementById(id); }

    function showError(id, msg) {
        var el = getEl(id);
        if (el) el.textContent = msg;
    }

    function clearErrors() {
        document.querySelectorAll('.error-msg').forEach(function (e) { e.textContent = ''; });
        document.querySelectorAll('.login-input.error').forEach(function (e) { e.classList.remove('error'); });
    }

    function markError(inputId, errorId, msg) {
        var inp = getEl(inputId);
        if (inp) inp.classList.add('error');
        showError(errorId, msg);
    }

    function setupCharCounter(inputId, countId, maxLen) {
        var input = getEl(inputId);
        var count = getEl(countId);
        if (!input || !count) return;
        input.addEventListener('input', function () {
            var len = this.value.length;
            count.textContent = len;
            var counter = this.parentNode.querySelector('.char-counter');
            if (counter) {
                counter.classList.remove('warning', 'danger');
                if (len >= maxLen) counter.classList.add('danger');
                else if (len >= maxLen * 0.8) counter.classList.add('warning');
            }
        });
    }

    // ── Init dropdowns ──────────────────────────────────────

    populateSelect(stateSelect, states, 'Select State/UT');

    // ── Import Toggle ───────────────────────────────────────

    function toggleImportSource() {
        if (importLinkedin.checked) {
            linkedinImportField.style.display = 'block';
            cvImportField.style.display = 'none';
        } else {
            linkedinImportField.style.display = 'none';
            cvImportField.style.display = 'block';
        }
    }

    importLinkedin.addEventListener('change', toggleImportSource);
    importCv.addEventListener('change', toggleImportSource);
    toggleImportSource();

    // ── File Upload (Drag & Drop + Browse) ─────────────────

    function handleFile(file) {
        if (!file) return;

        if (ALLOWED_CV_TYPES.indexOf(file.type) === -1) {
            showError('cvFile_error', 'Invalid file type. Please upload PDF, DOC, or DOCX.');
            return;
        }
        if (file.size > MAX_CV_SIZE) {
            showError('cvFile_error', 'File too large. Maximum size is 5MB.');
            return;
        }

        showError('cvFile_error', '');
        cvFileData = file;
        fileNameSpan.textContent = file.name;
        uploadContent.style.display = 'none';
        uploadFileInfo.style.display = 'flex';
        uploadZone.classList.add('has-file');
    }

    function removeFile() {
        cvFileData = null;
        cvFileInput.value = '';
        uploadContent.style.display = 'block';
        uploadFileInfo.style.display = 'none';
        uploadZone.classList.remove('has-file');
        showError('cvFile_error', '');
    }

    browseBtn.addEventListener('click', function () {
        cvFileInput.click();
    });

    cvFileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) handleFile(this.files[0]);
    });

    uploadZone.addEventListener('dragover', function (e) {
        e.preventDefault();
        this.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', function (e) {
        e.preventDefault();
        this.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', function (e) {
        e.preventDefault();
        this.classList.remove('dragover');
        if (e.dataTransfer.files && e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
    });

    removeFileBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        removeFile();
    });

    // ── State → District ────────────────────────────────────

    function updateDistricts() {
        var state = stateSelect.value;
        var dists = districts[state] || [];
        populateSelect(districtSelect, dists, 'Select District');
    }

    stateSelect.addEventListener('change', updateDistricts);

    // ── Input sanitation ────────────────────────────────────

    firstNameInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^A-Za-z\s]/g, '');
    });

    lastNameInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^A-Za-z\s]/g, '');
    });

    cityInput.addEventListener('input', function () {
        this.value = this.value.replace(/[^A-Za-z\s]/g, '');
    });

    pinInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 6);
    });

    contactInput.addEventListener('input', function () {
        this.value = this.value.replace(/\D/g, '').slice(0, 10);
    });

    // ── Char counters ───────────────────────────────────────

    setupCharCounter('linkedin_import_url', 'linkedin_import_url_count', 500);
    setupCharCounter('first_name', 'first_name_count', 50);
    setupCharCounter('last_name', 'last_name_count', 50);
    setupCharCounter('personal_linkedin_url', 'personal_linkedin_url_count', 500);
    setupCharCounter('email_id', 'email_id_count', 150);
    setupCharCounter('expertise_description', 'expertise_description_count', 1000);
    setupCharCounter('address_of_institute', 'address_of_institute_count', 500);
    setupCharCounter('city_name', 'city_name_count', 100);

    // ── Validation ──────────────────────────────────────────

    function validate() {
        clearErrors();
        var valid = true;

        // first_name
        var fn = firstNameInput.value.trim();
        if (!fn) {
            markError('first_name', 'first_name_error', 'Please enter first name');
            valid = false;
        } else if (fn.length > 50) {
            markError('first_name', 'first_name_error', 'First name must be 50 characters or less');
            valid = false;
        }

        // last_name
        var ln = lastNameInput.value.trim();
        if (!ln) {
            markError('last_name', 'last_name_error', 'Please enter last name');
            valid = false;
        } else if (ln.length > 50) {
            markError('last_name', 'last_name_error', 'Last name must be 50 characters or less');
            valid = false;
        }

        // email
        var email = getEl('email_id').value.trim();
        if (!email) {
            markError('email_id', 'email_id_error', 'Please enter email id');
            valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            markError('email_id', 'email_id_error', 'Please enter a valid email address');
            valid = false;
        } else if (email.length > 150) {
            markError('email_id', 'email_id_error', 'Email must be 150 characters or less');
            valid = false;
        }

        // mobile
        var mobile = contactInput.value.trim();
        if (!mobile) {
            markError('contact_number', 'contact_number_error', 'Please enter mobile number');
            valid = false;
        } else if (!/^[5-9][0-9]{9}$/.test(mobile)) {
            markError('contact_number', 'contact_number_error', 'Please enter a valid 10-digit mobile number');
            valid = false;
        }

        // personal_linkedin_url (optional but validate if provided)
        var linkedinUrl = getEl('personal_linkedin_url').value.trim();
        if (linkedinUrl && !/^https?:\/\/.+/.test(linkedinUrl)) {
            markError('personal_linkedin_url', 'personal_linkedin_url_error', 'Please enter a valid URL starting with http:// or https://');
            valid = false;
        }

        // linkedin_import_url (optional but validate if provided and linkedin toggle is active)
        if (importLinkedin.checked) {
            var impUrl = getEl('linkedin_import_url').value.trim();
            if (impUrl && !/^https?:\/\/.+/.test(impUrl)) {
                markError('linkedin_import_url', 'linkedin_import_url_error', 'Please enter a valid URL starting with http:// or https://');
                valid = false;
            }
        }

        // address
        var addr = getEl('address_of_institute').value.trim();
        if (!addr) {
            markError('address_of_institute', 'address_of_institute_error', 'Please enter address');
            valid = false;
        } else if (addr.length > 500) {
            markError('address_of_institute', 'address_of_institute_error', 'Address must be 500 characters or less');
            valid = false;
        }

        // state_id
        var st = stateSelect.value.trim();
        if (!st) {
            markError('state_id', 'state_id_error', 'Please select state/UT');
            valid = false;
        }

        // district_id
        var dist = districtSelect.value.trim();
        if (!dist) {
            markError('district_id', 'district_id_error', 'Please select district');
            valid = false;
        }

        // city
        var city = cityInput.value.trim();
        if (!city) {
            markError('city_name', 'city_name_error', 'Please enter city name');
            valid = false;
        } else if (!/^[A-Za-z\s]+$/.test(city)) {
            markError('city_name', 'city_name_error', 'City name should contain only letters and spaces');
            valid = false;
        } else if (city.length > 100) {
            markError('city_name', 'city_name_error', 'City name must be 100 characters or less');
            valid = false;
        }

        // pin_code
        var pin = pinInput.value.trim();
        if (!pin) {
            markError('pin_code', 'pin_code_error', 'Please enter pin code');
            valid = false;
        } else if (!/^[0-9]{6}$/.test(pin)) {
            markError('pin_code', 'pin_code_error', 'Pin code must be 6 digits');
            valid = false;
        }

        return valid;
    }

    // ── Submit handler ──────────────────────────────────────

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
    fetch(`${API_BASE}/api/register/`, {
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


document.addEventListener('change', function(e) {
    if (e.target.name === 'importSource') {
        cvFileDataImport = null;  // Reset CV import flag when switching
        showCvImportStatus('', '');  // Clear status
    }
});
function updateCharCounter(fieldId) {
    const field = document.getElementById(fieldId);
    const counter = document.getElementById(fieldId + '_count');
    if (counter) {
        counter.innerText = field.value.length;
    }
}
// ============================================================
// CV PARSING FOR IMPORT DETAILS
// ============================================================
window.addEventListener("message", function(event) {

    const data = event.data;

    if(data.first_name) {
        document.getElementById("first_name").value =
            data.first_name;
    }

    if(data.last_name) {
        document.getElementById("last_name").value =
            data.last_name;
    }

    if(data.email) {
        document.getElementById("email_id").value =
            data.email;
    }

});
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
    
const API_BASE = 'http://127.0.0.1:8000';

    fetch(`${API_BASE}/api/parse-cv/`, {        
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

document
    .getElementById("linkedinLoginBtn")
    .addEventListener("click", function () {

        window.open(
            "http://127.0.0.1:8000/api/auth/linkedin/",
            "LinkedInLogin",
            "width=700,height=700"
        );

    });

window.addEventListener("message", function(event){

    if(event.data.type !== "linkedin_profile"){
        return;
    }

    const profile = event.data.profile;

    document.getElementById("first_name").value =
        profile.given_name || "";

    document.getElementById("last_name").value =
        profile.family_name || "";

    document.getElementById("email_id").value =
        profile.email || "";

    document.getElementById("personal_linkedin_url").value =
        profile.linkedin_url || "";

});


})();
