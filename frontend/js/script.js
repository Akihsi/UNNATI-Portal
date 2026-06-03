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

    // FIX 5: Track CV import state more robustly — null = not attempted,
    // false = attempted but failed, true = parsed successfully,
    // 'uploaded' = file chosen (parse in progress or skipped)
    var cvFileDataImport = null;
    // Also hold a reference to the actual File object so we can copy it
    // to the professional section after a successful parse.
    var cvImportFile = null;

    // Backend base URL (single source of truth)
    var API_BASE = 'http://127.0.0.1:8000';

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

    // FIX 2: unified clearFieldError (was called both clearFieldError and clearError)
    function clearFieldError(inputId, errorId) {
        var input = getEl(inputId);
        var error = getEl(errorId);
        if (input) input.classList.remove('error');
        if (error) error.textContent = '';
    }

    function updateCharCounter(fieldId) {
        var field = getEl(fieldId);
        var counter = getEl(fieldId + '_count');
        if (field && counter) counter.textContent = field.value.length;
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
        // FIX 5: reset CV import state when source changes
        cvFileDataImport = null;
        cvImportFile = null;
        showCvImportStatus('', '');
    }

    importLinkedin.addEventListener('change', toggleImportSource);
    importCv.addEventListener('change', toggleImportSource);
    toggleImportSource();

    // ── File Upload (Drag & Drop + Browse) ─────────────────
    // NOTE: drag/drop listeners are only registered ONCE here.
    // The duplicate block that was at the bottom of the original file is removed.

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

    // FIX: cvFile change — both update the drop-zone UI AND kick off parsing
    cvFileInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            handleFile(this.files[0]);
            uploadAndParseCV(this.files[0]);
        }
    });

    if (uploadZone) {
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
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFile(e.dataTransfer.files[0]);
                uploadAndParseCV(e.dataTransfer.files[0]);
            }
        });
    }

    removeFileBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        removeFile();
        cvFileDataImport = null;
        cvImportFile = null;
        showCvImportStatus('', '');
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

    // ── FIX 1: Inline (while-typing) validation ──────────────

    firstNameInput.addEventListener('input', function () {
        var value = this.value.trim();
        if (!value) {
            markError('first_name', 'first_name_error', 'Please enter first name');
        } else if (value.length > 50) {
            markError('first_name', 'first_name_error', 'Maximum 50 characters allowed');
        } else {
            clearFieldError('first_name', 'first_name_error');
        }
    });

    lastNameInput.addEventListener('input', function () {
        var value = this.value.trim();
        if (!value) {
            markError('last_name', 'last_name_error', 'Please enter last name');
        } else if (value.length > 50) {
            markError('last_name', 'last_name_error', 'Maximum 50 characters allowed');
        } else {
            clearFieldError('last_name', 'last_name_error');
        }
    });

    getEl('email_id').addEventListener('input', function () {
        var value = this.value.trim();
        if (!value) {
            markError('email_id', 'email_id_error', 'Please enter email');
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
            markError('email_id', 'email_id_error', 'Invalid email address');
        } else if (value.length > 150) {
            markError('email_id', 'email_id_error', 'Maximum 150 characters allowed');
        } else {
            clearFieldError('email_id', 'email_id_error');
        }
    });

    // FIX 1+2: contactInput — was referencing undefined `mobile` variable
    contactInput.addEventListener('input', function () {
        var mobile = this.value.trim();
        if (!mobile) {
            markError('contact_number', 'contact_number_error', 'Please enter mobile number');
        } else if (/^[0-5]/.test(mobile)) {
            markError('contact_number', 'contact_number_error', 'Mobile number must start with 6-9');
        } else if (!/^[6-9][0-9]{9}$/.test(mobile)) {
            markError('contact_number', 'contact_number_error', 'Please enter a valid 10-digit mobile number');
        } else {
            clearFieldError('contact_number', 'contact_number_error');
        }
    });

    pinInput.addEventListener('input', function () {
        var value = this.value.trim();
        if (!value) {
            markError('pin_code', 'pin_code_error', 'Please enter pin code');
        } else if (!/^\d{6}$/.test(value)) {
            markError('pin_code', 'pin_code_error', 'PIN must be 6 digits');
        } else {
            clearFieldError('pin_code', 'pin_code_error');
        }
    });

    cityInput.addEventListener('input', function () {
        var value = this.value.trim();
        if (!value) {
            markError('city_name', 'city_name_error', 'Please enter city name');
        } else if (!/^[A-Za-z\s]+$/.test(value)) {
            markError('city_name', 'city_name_error', 'City name should contain only letters and spaces');
        } else if (value.length > 100) {
            markError('city_name', 'city_name_error', 'City name must be 100 characters or less');
        } else {
            clearFieldError('city_name', 'city_name_error');
        }
    });

    getEl('personal_linkedin_url') && getEl('personal_linkedin_url').addEventListener('input', function () {
        var value = this.value.trim();
        if (value && !/^https?:\/\/.+/.test(value)) {
            markError('personal_linkedin_url', 'personal_linkedin_url_error', 'Please enter a valid URL starting with http:// or https://');
        } else {
            clearFieldError('personal_linkedin_url', 'personal_linkedin_url_error');
        }
    });

    stateSelect.addEventListener('change', function () {
        if (!this.value) {
            markError('state_id', 'state_id_error', 'Please select state/UT');
        } else {
            clearFieldError('state_id', 'state_id_error');
        }
    });

    districtSelect.addEventListener('change', function () {
        if (!this.value) {
            markError('district_id', 'district_id_error', 'Please select district');
        } else {
            clearFieldError('district_id', 'district_id_error');
        }
    });

    // ── Full validation (on submit) ─────────────────────────

    function validate() {
        clearErrors();
        var valid = true;

        var fn = firstNameInput.value.trim();
        if (!fn) {
            markError('first_name', 'first_name_error', 'Please enter first name'); valid = false;
        } else if (fn.length > 50) {
            markError('first_name', 'first_name_error', 'First name must be 50 characters or less'); valid = false;
        }

        var ln = lastNameInput.value.trim();
        if (!ln) {
            markError('last_name', 'last_name_error', 'Please enter last name'); valid = false;
        } else if (ln.length > 50) {
            markError('last_name', 'last_name_error', 'Last name must be 50 characters or less'); valid = false;
        }

        var email = getEl('email_id').value.trim();
        if (!email) {
            markError('email_id', 'email_id_error', 'Please enter email id'); valid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            markError('email_id', 'email_id_error', 'Please enter a valid email address'); valid = false;
        } else if (email.length > 150) {
            markError('email_id', 'email_id_error', 'Email must be 150 characters or less'); valid = false;
        }

        var mobile = contactInput.value.trim();
        if (!mobile) {
            markError('contact_number', 'contact_number_error', 'Please enter mobile number'); valid = false;
        } else if (/^[0-5]/.test(mobile)) {
            markError('contact_number', 'contact_number_error', 'Mobile number must start with 6-9'); valid = false;
        } else if (!/^[6-9][0-9]{9}$/.test(mobile)) {
            markError('contact_number', 'contact_number_error', 'Please enter a valid 10-digit mobile number'); valid = false;
        }

        var linkedinUrl = getEl('personal_linkedin_url').value.trim();
        if (linkedinUrl && !/^https?:\/\/.+/.test(linkedinUrl)) {
            markError('personal_linkedin_url', 'personal_linkedin_url_error', 'Please enter a valid URL starting with http:// or https://'); valid = false;
        }

        if (importLinkedin.checked) {
            var impUrl = getEl('linkedin_import_url').value.trim();
            if (impUrl && !/^https?:\/\/.+/.test(impUrl)) {
                markError('linkedin_import_url', 'linkedin_import_url_error', 'Please enter a valid URL starting with http:// or https://'); valid = false;
            }
        }

        var addr = getEl('address_of_institute').value.trim();
        if (!addr) {
            markError('address_of_institute', 'address_of_institute_error', 'Please enter address'); valid = false;
        } else if (addr.length > 500) {
            markError('address_of_institute', 'address_of_institute_error', 'Address must be 500 characters or less'); valid = false;
        }

        var st = stateSelect.value.trim();
        if (!st) { markError('state_id', 'state_id_error', 'Please select state/UT'); valid = false; }

        var dist = districtSelect.value.trim();
        if (!dist) { markError('district_id', 'district_id_error', 'Please select district'); valid = false; }

        var city = cityInput.value.trim();
        if (!city) {
            markError('city_name', 'city_name_error', 'Please enter city name'); valid = false;
        } else if (!/^[A-Za-z\s]+$/.test(city)) {
            markError('city_name', 'city_name_error', 'City name should contain only letters and spaces'); valid = false;
        } else if (city.length > 100) {
            markError('city_name', 'city_name_error', 'City name must be 100 characters or less'); valid = false;
        }

        var pin = pinInput.value.trim();
        if (!pin) {
            markError('pin_code', 'pin_code_error', 'Please enter pin code'); valid = false;
        } else if (!/^[0-9]{6}$/.test(pin)) {
            markError('pin_code', 'pin_code_error', 'Pin code must be 6 digits'); valid = false;
        }

        return valid;
    }

    // ── FIX 3: Prevent form submission on Enter key ─────────

    form.addEventListener('keydown', function (e) {
        // Allow Enter inside textareas only
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });

    // ── CV Parsing ──────────────────────────────────────────

    function showCvImportStatus(message, type) {
        var statusDiv = getEl('cvImportStatus');
        if (!statusDiv) return;
        statusDiv.textContent = message;
        statusDiv.className = 'import-status ' +
            (type === 'success' ? 'success' : type === 'error' ? 'error' : type === 'processing' ? 'processing' : '');
    }

    function uploadAndParseCV(file) {
        if (ALLOWED_CV_TYPES.indexOf(file.type) === -1) {
            showError('cvFile_error', 'Invalid file type. Please upload PDF, DOC, or DOCX.');
            showCvImportStatus('✗ Invalid file type', 'error');
            cvFileDataImport = false;
            return;
        }
        if (file.size > MAX_CV_SIZE) {
            showError('cvFile_error', 'File is too large. Maximum 5MB allowed.');
            showCvImportStatus('✗ File exceeds 5MB limit', 'error');
            cvFileDataImport = false;
            return;
        }

        // FIX 5: save the file reference immediately so we can attach it later
        cvImportFile = file;
        // Mark as "uploaded but parse pending" — treated as valid for submission
        // (parse result will update the flag)
        cvFileDataImport = 'uploaded';

        showCvImportStatus('Processing your CV…', 'processing');

        var formData = new FormData();
        formData.append('cv', file);

        fetch(API_BASE + '/api/parse-cv/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
            }
        })
        .then(function (response) { return response.json(); })
        .then(function (data) {
            if (data.success && data.extracted_data) {
                var extracted = data.extracted_data;

                if (extracted.first_name) { getEl('first_name').value = extracted.first_name; updateCharCounter('first_name'); }
                if (extracted.last_name)  { getEl('last_name').value  = extracted.last_name;  updateCharCounter('last_name'); }
                if (extracted.email)      { getEl('email_id').value   = extracted.email;       updateCharCounter('email_id'); }
                if (extracted.contact_number) { getEl('contact_number').value = extracted.contact_number; }
                if (extracted.city)       { getEl('city_name').value  = extracted.city;        updateCharCounter('city_name'); }

                if (extracted.state) {
                    var opts = Array.from(stateSelect.options);
                    var match = opts.find(function (o) {
                        return o.value.toLowerCase() === extracted.state.toLowerCase();
                    });
                    if (match) { stateSelect.value = match.value; updateDistricts(); }
                }

                // FIX 4: copy the parsed CV file into the professional section upload input
                try {
                    var profInput = getEl('cv_upload_professional');
                    if (profInput && cvImportFile) {
                        var dt = new DataTransfer();
                        dt.items.add(cvImportFile);
                        profInput.files = dt.files;
                        // Clear any earlier size-error on that field
                        showError('cv_upload_professional_error', '');
                    }
                } catch (err) {
                    // DataTransfer not supported in all browsers — fail silently;
                    // the file is still appended via cvImportFile reference in submit
                    console.warn('Could not auto-assign file to professional input:', err);
                }

                cvFileDataImport = true;
                showCvImportStatus('✓ CV parsed successfully! Details have been auto-filled.', 'success');
            } else {
                cvFileDataImport = false;
                showCvImportStatus('✗ Could not parse CV. ' + (data.message || 'Please fill details manually.'), 'error');
            }
        })
        .catch(function (error) {
            cvFileDataImport = false;
            console.error('CV parse error:', error);
            showCvImportStatus('✗ Error uploading CV. Please try again.', 'error');
        });
    }

    // ── Submit handler ──────────────────────────────────────

    form.addEventListener('submit', function (e) {
        e.preventDefault();

        if (!validate()) return;

        var selectedSource = (document.querySelector('input[name="importSource"]:checked') || {}).value;

        // FIX 5: allow submission when file was uploaded (parse may have succeeded,
        // failed, or is still in progress — cvImportFile being set means the user
        // did attach a file, which is all we need to check).
        if (selectedSource === 'cv' && !cvImportFile) {
            alert('Please upload your CV before submitting.');
            return;
        }

        if (selectedSource === 'linkedin') {
            var linkedinUrl = getEl('personal_linkedin_url').value.trim();
            if (!linkedinUrl) {
                alert('Please provide your LinkedIn profile URL');
                return;
            }
        }

        var firstName = firstNameInput.value.trim();
        var lastName  = lastNameInput.value.trim();
        var email     = getEl('email_id').value.trim();
        var mobile    = contactInput.value.trim();

        var formData = new FormData();
        formData.append('first_name',            firstName);
        formData.append('last_name',             lastName);
        formData.append('email_id',              email);
        formData.append('personal_linkedin_url', getEl('personal_linkedin_url').value.trim());
        formData.append('contact_number',        mobile);
        formData.append('area_of_expertise',     getEl('area_of_expertise').value);
        formData.append('expertise_description', getEl('expertise_description').value);
        formData.append('address_of_institute',  getEl('address_of_institute').value.trim());
        formData.append('state_id',              stateSelect.value);
        formData.append('district_id',           districtSelect.value);
        formData.append('city_name',             cityInput.value.trim());
        formData.append('pin_code',              pinInput.value.trim());
        formData.append('import_source',         selectedSource || 'linkedin');

        // FIX 4+5: attach CV file — prefer the professional-section input if it
        // has a file, otherwise fall back to the import CV file reference.
        var profInput = getEl('cv_upload_professional');
        if (profInput && profInput.files && profInput.files.length > 0) {
            formData.append('cv_file', profInput.files[0]);
        } else if (cvImportFile) {
            formData.append('cv_file', cvImportFile);
        }

        var submitBtn = getEl('submitBtn');
        var originalBtnText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting…';

        fetch(API_BASE + '/api/register/', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRFToken': document.querySelector('input[name="csrfmiddlewaretoken"]').value
            }
        })
        .then(function (response) { return response.json(); })
        .then(function (data) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;

            if (data.success) {
                document.querySelector('.login-form-container').style.display = 'none';
                var successModal = getEl('successModal');
                getEl('registrationId').textContent   = data.registration_id;
                getEl('registrationName').textContent = firstName + ' ' + lastName;
                getEl('registrationEmail').textContent = email;
                successModal.style.display = 'flex';
            } else {
                // FIX 2: show the actual server error message on screen, not just alert
                var serverMsg = (data.message || 'Registration failed. Please try again.');
                alert('Error: ' + serverMsg);
                console.error('Server error response:', data);
            }
        })
        .catch(function (error) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
            // FIX 2: print the actual error
            console.error('Submit fetch error:', error);
            alert('Network error: ' + (error.message || error) + '. Please check your connection and try again.');
        });
    });

    // ── Copy registration ID ────────────────────────────────

    document.addEventListener('click', function (e) {
        if (e.target.id === 'copyIdBtn') {
            var registrationId = getEl('registrationId').textContent;
            navigator.clipboard.writeText(registrationId).then(function () {
                var btn = e.target;
                var orig = btn.innerHTML;
                btn.innerHTML = '<i class="fas fa-check"></i> Copied!';
                setTimeout(function () { btn.innerHTML = orig; }, 2000);
            });
        }
    });

    // ── Professional-section CV size check ─────────────────

    document.addEventListener('change', function (e) {
        if (e.target.id === 'cv_upload_professional' && e.target.files.length > 0) {
            var file = e.target.files[0];
            if (file.size > MAX_CV_SIZE) {
                showError('cv_upload_professional_error', 'File is too large. Maximum 5MB allowed.');
            } else {
                showError('cv_upload_professional_error', '');
            }
        }
    });

    // ── LinkedIn OAuth popup ────────────────────────────────

    var linkedinLoginBtn = getEl('linkedinLoginBtn');
    if (linkedinLoginBtn) {
        linkedinLoginBtn.addEventListener('click', function () {
            window.open(API_BASE + '/api/auth/linkedin/', 'LinkedInLogin', 'width=700,height=700');
        });
    }

    // ── FIX: Single consolidated postMessage listener ───────
    // (Original code had two separate window.addEventListener("message", …) blocks
    //  which caused the generic one to fire before the LinkedIn one and interfere.)

    window.addEventListener('message', function (event) {
        var data = event.data;
        if (!data) return;

        // LinkedIn OAuth callback
        if (data.type === 'linkedin_profile') {
            var profile = data.profile;
            if (profile.given_name)   { getEl('first_name').value              = profile.given_name; }
            if (profile.family_name)  { getEl('last_name').value               = profile.family_name; }
            if (profile.email)        { getEl('email_id').value                = profile.email; }
            if (profile.linkedin_url) { getEl('personal_linkedin_url').value   = profile.linkedin_url; }
            return;
        }

        // Generic postMessage auto-fill (e.g. from parent frame)
        if (data.first_name) { getEl('first_name').value = data.first_name; }
        if (data.last_name)  { getEl('last_name').value  = data.last_name; }
        if (data.email)      { getEl('email_id').value   = data.email; }
    });

})();