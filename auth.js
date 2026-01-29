// الجافاسكريبت للمصادقة في موقع Sulaf.PDF

// تهيئة صفحة المصادقة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة أحداث المصادقة
    initializeAuthEvents();
    
    // التحقق مما إذا كان المستخدم مسجلاً دخوله
    checkLoginStatus();
});

// تهيئة أحداث المصادقة
function initializeAuthEvents() {
    // تبديل بين تسجيل الدخول والتسجيل
    const switchToRegister = document.getElementById('switch-to-register');
    const switchToLogin = document.getElementById('switch-to-login');
    const loginCard = document.querySelector('.auth-card');
    const registerCard = document.getElementById('register-card');
    
    if (switchToRegister) {
        switchToRegister.addEventListener('click', function(e) {
            e.preventDefault();
            loginCard.style.display = 'none';
            registerCard.style.display = 'block';
            registerCard.classList.add('active');
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', function(e) {
            e.preventDefault();
            registerCard.style.display = 'none';
            loginCard.style.display = 'block';
            registerCard.classList.remove('active');
        });
    }
    
    // إظهار/إخفاء كلمة المرور
    const showPasswordBtn = document.getElementById('show-password');
    const showRegPasswordBtn = document.getElementById('show-reg-password');
    
    if (showPasswordBtn) {
        showPasswordBtn.addEventListener('click', function() {
            togglePasswordVisibility('password', this);
        });
    }
    
    if (showRegPasswordBtn) {
        showRegPasswordBtn.addEventListener('click', function() {
            togglePasswordVisibility('reg-password', this);
        });
    }
    
    // التحقق من قوة كلمة المرور
    const regPasswordInput = document.getElementById('reg-password');
    if (regPasswordInput) {
        regPasswordInput.addEventListener('input', checkPasswordStrength);
    }
    
    // معالجة نموذج تسجيل الدخول
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // معالجة نموذج التسجيل
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // فتح نافذة استعادة كلمة المرور
    const forgotPasswordLink = document.querySelector('.forgot-password');
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', function(e) {
            e.preventDefault();
            openForgotPasswordModal();
        });
    }
    
    // إغلاق نافذة استعادة كلمة المرور
    const closeModalBtns = document.querySelectorAll('.close-modal');
    closeModalBtns.forEach(btn => {
        btn.addEventListener('click', closeForgotPasswordModal);
    });
    
    // إغلاق نافذة استعادة كلمة المرور بالنقر خارجها
    if (forgotPasswordModal) {
        forgotPasswordModal.addEventListener('click', function(e) {
            if (e.target === forgotPasswordModal) {
                closeForgotPasswordModal();
            }
        });
    }
    
    // معالجة استعادة كلمة المرور
    const sendResetLinkBtn = document.getElementById('send-reset-link');
    if (sendResetLinkBtn) {
        sendResetLinkBtn.addEventListener('click', handlePasswordReset);
    }
    
    // المصادقة الاجتماعية
    const googleBtn = document.querySelector('.google-btn');
    const facebookBtn = document.querySelector('.facebook-btn');
    
    if (googleBtn) {
        googleBtn.addEventListener('click', function() {
            socialAuth('google');
        });
    }
    
    if (facebookBtn) {
        facebookBtn.addEventListener('click', function() {
            socialAuth('facebook');
        });
    }
}

// التحقق من حالة تسجيل الدخول
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('sulafUserLoggedIn') === 'true';
    
    if (isLoggedIn) {
        // توجيه المستخدم إلى الصفحة الرئيسية إذا كان مسجلاً دخوله
        window.location.href = 'index.html';
    }
}

// إظهار/إخفاء كلمة المرور
function togglePasswordVisibility(passwordFieldId, button) {
    const passwordField = document.getElementById(passwordFieldId);
    const icon = button.querySelector('i');
    
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        icon.className = 'fas fa-eye-slash';
    } else {
        passwordField.type = 'password';
        icon.className = 'fas fa-eye';
    }
}

// التحقق من قوة كلمة المرور
function checkPasswordStrength() {
    const password = document.getElementById('reg-password').value;
    const strengthBar = document.querySelector('.strength-bar');
    const strengthText = document.querySelector('.strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    // حساب قوة كلمة المرور
    let strength = 0;
    
    // طول كلمة المرور
    if (password.length >= 8) strength += 1;
    if (password.length >= 12) strength += 1;
    
    // أحرف كبيرة وصغيرة
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 1;
    
    // أرقام
    if (/\d/.test(password)) strength += 1;
    
    // رموز خاصة
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    
    // تحديث شريط القوة
    const width = (strength / 5) * 100;
    strengthBar.style.width = `${width}%`;
    
    // تحديث النص واللون
    let color, text;
    
    if (strength <= 1) {
        color = '#d63031'; // أحمر
        text = 'ضعيفة';
    } else if (strength <= 3) {
        color = '#fdcb6e'; // أصفر
        text = 'متوسطة';
    } else {
        color = '#00b894'; // أخضر
        text = 'قوية';
    }
    
    strengthBar.style.backgroundColor = color;
    strengthText.textContent = `قوة كلمة المرور: ${text}`;
    strengthText.style.color = color;
}

// معالجة تسجيل الدخول
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const rememberMe = document.getElementById('remember-me').checked;
    
    // التحقق البسيط من المدخلات (في التطبيق الحقيقي، سيتم التحقق من الخادم)
    if (!email || !password) {
        showAuthMessage('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAuthMessage('البريد الإلكتروني غير صحيح', 'error');
        return;
    }
    
    // محاكاة تسجيل الدخول (في التطبيق الحقيقي، سيتم إرسال البيانات للخادم)
    // هنا نستخدم بيانات تجريبية للمحاكاة
    const mockUsers = [
        { email: 'test@example.com', password: 'password123', name: 'مستخدم تجريبي' },
        { email: 'adlep@x.com', password: 'adlep123', name: 'Adlep X' }
    ];
    
    const user = mockUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        // تسجيل الدخول الناجح
        loginSuccess(user.name, rememberMe);
    } else {
        // فشل تسجيل الدخول
        showAuthMessage('البريد الإلكتروني أو كلمة المرور غير صحيحة', 'error');
    }
}

// معالجة التسجيل
function handleRegister(e) {
    e.preventDefault();
    
    const name = document.getElementById('reg-name').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value.trim();
    const confirmPassword = document.getElementById('reg-confirm-password').value.trim();
    const acceptTerms = document.getElementById('accept-terms').checked;
    
    // التحقق من المدخلات
    if (!name || !email || !password || !confirmPassword) {
        showAuthMessage('يرجى ملء جميع الحقول', 'error');
        return;
    }
    
    if (!isValidEmail(email)) {
        showAuthMessage('البريد الإلكتروني غير صحيح', 'error');
        return;
    }
    
    if (password.length < 8) {
        showAuthMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAuthMessage('كلمات المرور غير متطابقة', 'error');
        return;
    }
    
    if (!acceptTerms) {
        showAuthMessage('يجب الموافقة على الشروط والأحكام', 'error');
        return;
    }
    
    // محاكاة التسجيل (في التطبيق الحقيقي، سيتم إرسال البيانات للخادم)
    // التحقق مما إذا كان البريد الإلكتروني مستخدماً مسبقاً
    const existingUsers = JSON.parse(localStorage.getItem('sulafUsers') || '[]');
    
    if (existingUsers.some(user => user.email === email)) {
        showAuthMessage('هذا البريد الإلكتروني مستخدم بالفعل', 'error');
        return;
    }
    
    // إضافة المستخدم الجديد
    const newUser = {
        name: name,
        email: email,
        password: password, // في التطبيق الحقيقي، سيتم تشفير كلمة المرور
        joinedDate: new Date().toISOString()
    };
    
    existingUsers.push(newUser);
    localStorage.setItem('sulafUsers', JSON.stringify(existingUsers));
    
    // تسجيل الدخول تلقائياً بعد التسجيل
    loginSuccess(name, true);
}

// نجاح تسجيل الدخول
function loginSuccess(userName, rememberMe) {
    // حفظ حالة تسجيل الدخول
    localStorage.setItem('sulafUserLoggedIn', 'true');
    localStorage.setItem('sulafUserName', userName);
    
    if (rememberMe) {
        localStorage.setItem('sulafRememberMe', 'true');
    } else {
        localStorage.removeItem('sulafRememberMe');
    }
    
    // عرض رسالة النجاح
    showAuthMessage(`مرحباً بك ${userName}! تم تسجيل الدخول بنجاح.`, 'success');
    
    // توجيه إلى الصفحة الرئيسية بعد تأخير بسيط
    setTimeout(() => {
        window.location.href = 'index.html';
    }, 1500);
}

// فتح نافذة استعادة كلمة المرور
function openForgotPasswordModal() {
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    if (forgotPasswordModal) {
        forgotPasswordModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // التركيز على حقل الإدخال
        const resetEmail = document.getElementById('reset-email');
        if (resetEmail) {
            setTimeout(() => {
                resetEmail.focus();
            }, 300);
        }
    }
}

// إغلاق نافذة استعادة كلمة المرور
function closeForgotPasswordModal() {
    const forgotPasswordModal = document.getElementById('forgot-password-modal');
    if (forgotPasswordModal) {
        forgotPasswordModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // إعادة تعيين النموذج
        const resetForm = document.getElementById('reset-email');
        if (resetForm) {
            resetForm.value = '';
        }
    }
}

// معالجة استعادة كلمة المرور
function handlePasswordReset() {
    const email = document.getElementById('reset-email').value.trim();
    
    if (!email) {
        alert('يرجى إدخال البريد الإلكتروني');
        return;
    }
    
    if (!isValidEmail(email)) {
        alert('البريد الإلكتروني غير صحيح');
        return;
    }
    
    // محاكاة إرسال رابط استعادة كلمة المرور
    alert(`تم إرسال رابط إعادة تعيين كلمة المرور إلى ${email}\n\nفي التطبيق الحقيقي، ستتلقى بريداً إلكترونياً مع رابط التعيين.`);
    
    // تسجيل نشاط استعادة كلمة المرور
    logActivity('password_reset_request', email);
    
    // إغلاق النافذة
    closeForgotPasswordModal();
}

// المصادقة الاجتماعية
function socialAuth(provider) {
    // محاكاة المصادقة الاجتماعية (في التطبيق الحقيقي، سيتم استخدام واجهات برمجة التطبيقات الخاصة)
    alert(`سيتم توجيهك إلى صفحة مصادقة ${provider}\n\nفي التطبيق الكامل، ستتم مصادقتك عبر ${provider} وسيتم إنشاء حساب لك تلقائياً.`);
    
    // تسجيل نشاط المصادقة الاجتماعية
    logActivity(`social_auth_${provider}`, 'بدء العملية');
    
    // في التطبيق الحقيقي، بعد المصادقة الناجحة:
    // loginSuccess('مستخدم ' + provider, true);
}

// التحقق من صيغة البريد الإلكتروني
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// عرض رسالة مصادقة
function showAuthMessage(message, type) {
    // إزالة أي رسالة سابقة
    const existingMessage = document.querySelector('.auth-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // إنشاء عنصر الرسالة
    const messageElement = document.createElement('div');
    messageElement.className = `auth-message auth-message-${type}`;
    messageElement.textContent = message;
    
    // إضافة الأنماط
    messageElement.style.cssText = `
        padding: 1rem;
        margin: 1rem 0;
        border-radius: var(--border-radius);
        font-weight: 600;
        text-align: center;
        animation: slideIn 0.3s ease;
    `;
    
    if (type === 'success') {
        messageElement.style.backgroundColor = 'rgba(0, 184, 148, 0.1)';
        messageElement.style.color = '#00b894';
        messageElement.style.border = '1px solid #00b894';
    } else {
        messageElement.style.backgroundColor = 'rgba(214, 48, 49, 0.1)';
        messageElement.style.color = '#d63031';
        messageElement.style.border = '1px solid #d63031';
    }
    
    // إضافة الرسالة قبل النموذج
    const authForm = document.querySelector('.auth-form');
    if (authForm) {
        authForm.insertBefore(messageElement, authForm.firstChild);
    }
    
    // إزالة الرسالة تلقائياً بعد 5 ثوانٍ
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 300);
        }
    }, 5000);
}

// تسجيل النشاط (محاكاة)
function logActivity(type, details) {
    // في التطبيق الحقيقي، سيتم إرسال هذا للسيرفر
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] نشاط مصادقة: ${type} - ${details}`);
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem('sulafUserLoggedIn');
    localStorage.removeItem('sulafUserName');
    localStorage.removeItem('sulafRememberMe');
    
    // توجيه إلى صفحة تسجيل الدخول
    window.location.href = 'login.html';
}

// تصدير الدوال للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleLogin,
        handleRegister,
        logout,
        isValidEmail
    };
}
