// الجافاسكريبت الرئيسي لموقع Sulaf.PDF

// تهيئة الموقع عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تهيئة متغيرات المستخدم
    initializeUserState();
    
    // تهيئة الأحداث
    initializeEvents();
    
    // تهيئة البحث
    initializeSearch();
    
    // تهيئة الذكاء الاصطناعي
    initializeAI();
    
    // تهيئة تحميل الروايات
    initializeUpload();
    
    // تهيئة التصميم الداكن
    initializeDarkMode();
    
    // تهيئة التصميم المتجاوب
    initializeResponsive();
    
    // عرض رسالة ترحيب
    showWelcomeMessage();
});

// تهيئة حالة المستخدم
function initializeUserState() {
    // التحقق مما إذا كان المستخدم قد سجل دخوله
    const isLoggedIn = localStorage.getItem('sulafUserLoggedIn') === 'true';
    const userName = localStorage.getItem('sulafUserName');
    
    if (isLoggedIn && userName) {
        updateUserInterface(userName);
    }
}

// تحديث واجهة المستخدم بناءً على حالة تسجيل الدخول
function updateUserInterface(userName) {
    const userAccountElement = document.getElementById('user-account');
    if (userAccountElement) {
        userAccountElement.innerHTML = `
            <i class="fas fa-user"></i>
            <span>${userName}</span>
        `;
        userAccountElement.href = "#account";
    }
}

// تهيئة الأحداث
function initializeEvents() {
    // حدث لزر الذكاء الاصطناعي
    const generateStoryBtn = document.getElementById('generate-story');
    const askAiBtn = document.getElementById('ask-ai');
    const aiModal = document.getElementById('ai-modal');
    
    if (generateStoryBtn) {
        generateStoryBtn.addEventListener('click', function() {
            openAiModal();
            generateStoryIdea();
        });
    }
    
    if (askAiBtn) {
        askAiBtn.addEventListener('click', openAiModal);
    }
    
    // حدث لإغلاق نافذة الذكاء الاصطناعي
    const closeModalBtn = document.querySelector('.close-modal');
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeAiModal);
    }
    
    // حدث لإغلاق نافذة الذكاء الاصطناعي بالنقر خارجها
    if (aiModal) {
        aiModal.addEventListener('click', function(e) {
            if (e.target === aiModal) {
                closeAiModal();
            }
        });
    }
    
    // أحداث أزرار التحميل والقراءة
    const downloadButtons = document.querySelectorAll('.download-btn');
    const readButtons = document.querySelectorAll('.read-btn');
    
    downloadButtons.forEach(button => {
        button.addEventListener('click', function() {
            downloadBook(this);
        });
    });
    
    readButtons.forEach(button => {
        button.addEventListener('click', function() {
            readBook(this);
        });
    });
    
    // حدث لزر رفع الرواية
    const uploadBtn = document.querySelector('.upload-btn');
    const uploadModal = document.getElementById('upload-modal');
    
    if (uploadBtn) {
        uploadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            openUploadModal();
        });
    }
    
    // حدث لإغلاق نافذة رفع الرواية
    const closeUploadModalBtn = document.querySelector('.close-upload-modal');
    if (closeUploadModalBtn) {
        closeUploadModalBtn.addEventListener('click', closeUploadModal);
    }
    
    // حدث لإغلاق نافذة رفع الرواية بالنقر خارجها
    if (uploadModal) {
        uploadModal.addEventListener('click', function(e) {
            if (e.target === uploadModal) {
                closeUploadModal();
            }
        });
    }
    
    // حدث لإرسال نموذج رفع الرواية
    const uploadForm = document.getElementById('upload-form');
    if (uploadForm) {
        uploadForm.addEventListener('submit', handleUploadSubmit);
    }
    
    // حدث لإرسال رسالة للذكاء الاصطناعي
    const sendAiBtn = document.getElementById('send-ai');
    const aiInput = document.getElementById('ai-input');
    
    if (sendAiBtn && aiInput) {
        sendAiBtn.addEventListener('click', sendAiMessage);
        
        aiInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                sendAiMessage();
            }
        });
    }
    
    // أحداث الأزرار السريعة للذكاء الاصطناعي
    const quickActions = document.querySelectorAll('.quick-action');
    quickActions.forEach(action => {
        action.addEventListener('click', function() {
            handleQuickAction(this.textContent);
        });
    });
    
    // حدث لقائمة الجوال
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMobileMenu);
    }
}

// تهيئة البحث
function initializeSearch() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', performSearch);
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }
}

// تنفيذ البحث
function performSearch() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    
    if (query) {
        // في التطبيق الحقيقي، هنا يتم إرسال طلب البحث للخادم
        // نحن نعرض رسالة توضيحية فقط
        alert(`سيتم البحث عن: "${query}"\n\nفي التطبيق الكامل، ستظهر هنا نتائج البحث من قواعد البيانات.`);
        
        // تسجيل نشاط البحث
        logActivity('search', query);
        
        // مسح حقل البحث
        searchInput.value = '';
    } else {
        alert('يرجى إدخال نص للبحث');
    }
}

// تهيئة الذكاء الاصطناعي
function initializeAI() {
    // لا يوجد تهيئة إضافية مطلوبة حالياً
}

// فتح نافذة الذكاء الاصطناعي
function openAiModal() {
    const aiModal = document.getElementById('ai-modal');
    if (aiModal) {
        aiModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // التركيز على حقل الإدخال
        const aiInput = document.getElementById('ai-input');
        if (aiInput) {
            setTimeout(() => {
                aiInput.focus();
            }, 300);
        }
    }
}

// إغلاق نافذة الذكاء الاصطناعي
function closeAiModal() {
    const aiModal = document.getElementById('ai-modal');
    if (aiModal) {
        aiModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// إنشاء فكرة رواية باستخدام الذكاء الاصطناعي
function generateStoryIdea() {
    const aiChat = document.querySelector('.ai-chat');
    if (!aiChat) return;
    
    // أفكار روايات فانتازيا مسبقة
    const storyIdeas = [
        "فارس شاب يكتشف أنه آخر سليل لسلالة ساحرة قديمة، ويجب أن يتعلم السحر لمواجهة شر قديم يستيقظ.",
        "في عالم حيث الحيوانات تتكلم وتتعايش مع البشر، تكتشف فتاة صغيرة أنها تستطيع التواصل مع وحوش أسطورية.",
        "مكتبة سحرية تحتوي على كتب تتنبأ بالمستقبل، وتبدأ مغامرة شاب عندما يكتشف أن اسمه مذكور في أحد هذه الكتب.",
        "عالم موازي حيث السحر جزء من الحياة اليومية، وشخص من عالمنا يجد نفسه فجأة هناك دون معرفة السبب.",
        "مجموعة من الأصدقاء يكتشفون بوابة إلى عالم خيالي أثناء رحلة تخييم، ويجدون أنفسهم في وسط صراع بين ممالك سحرية."
    ];
    
    // اختيار فكرة عشوائية
    const randomIdea = storyIdeas[Math.floor(Math.random() * storyIdeas.length)];
    
    // إضافة الرسالة إلى الدردشة
    const aiMessage = document.createElement('div');
    aiMessage.className = 'ai-message';
    aiMessage.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <p>ها هي فكرة رواية فانتازيا مقترحة:</p>
            <p><strong>${randomIdea}</strong></p>
            <p>هل تريدني أن أطور هذه الفكرة أكثر؟</p>
        </div>
    `;
    
    aiChat.appendChild(aiMessage);
    aiChat.scrollTop = aiChat.scrollHeight;
    
    // تسجيل نشاط توليد الفكرة
    logActivity('ai_generate_story', 'فكرة رواية فانتازيا');
}

// إرسال رسالة للذكاء الاصطناعي
function sendAiMessage() {
    const aiInput = document.getElementById('ai-input');
    const aiChat = document.querySelector('.ai-chat');
    
    if (!aiInput || !aiChat) return;
    
    const message = aiInput.value.trim();
    
    if (!message) {
        alert('يرجى إدخال رسالة');
        return;
    }
    
    // إضافة رسالة المستخدم
    const userMessage = document.createElement('div');
    userMessage.className = 'ai-message';
    userMessage.style.flexDirection = 'row-reverse';
    userMessage.innerHTML = `
        <div class="message-avatar" style="background: linear-gradient(135deg, #ff6b6b, #ff8e53);">
            <i class="fas fa-user"></i>
        </div>
        <div class="message-content">
            <p>${message}</p>
        </div>
    `;
    
    aiChat.appendChild(userMessage);
    
    // مسح حقل الإدخال
    aiInput.value = '';
    
    // إضافة رسالة الرد الآلي (محاكاة للذكاء الاصطناعي)
    setTimeout(() => {
        const aiResponse = document.createElement('div');
        aiResponse.className = 'ai-message';
        
        // ردود مسبقة للذكاء الاصطناعي
        const responses = [
            "هذا سؤال مثير للاهتمام! بالنسبة لروايات الفانتازيا، أنصح بالتركيز على بناء عالم متكامل وشخصيات ذات دوافع واضحة.",
            "بناءً على سؤالك، أقترح أن تبدأ بتطوير نظام سحر فريد لروايتك، حيث يكون للسحر قواعد وحدود واضحة.",
            "لإنشاء شخصيات لا تنسى في رواية فانتازيا، حاول أن تعطي لكل شخصية نقاط ضعف وتطلعات تجعل القارئ يتعاطف معها.",
            "أحد العناصر المهمة في روايات الفانتازيا هو الصراع. تأكد من وجود تحديات حقيقية تواجهها شخصياتك الرئيسية.",
            "لجعل روايتك فريدة، حاول دمج عناصر من الثقافة العربية في عالم الفانتازيا الذي تبنيه."
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        aiResponse.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <p>${randomResponse}</p>
                <p>هل تريد مساعدة في شيء آخر متعلق بروايتك؟</p>
            </div>
        `;
        
        aiChat.appendChild(aiResponse);
        aiChat.scrollTop = aiChat.scrollHeight;
        
        // تسجيل نشاط المحادثة مع الذكاء الاصطناعي
        logActivity('ai_conversation', message.substring(0, 50) + '...');
    }, 1000);
}

// معالجة الأزرار السريعة للذكاء الاصطناعي
function handleQuickAction(actionText) {
    const aiInput = document.getElementById('ai-input');
    if (aiInput) {
        aiInput.value = actionText;
        sendAiMessage();
    }
}

// تهيئة تحميل الروايات
function initializeUpload() {
    // لا يوجد تهيئة إضافية مطلوبة حالياً
}

// فتح نافذة رفع الرواية
function openUploadModal() {
    // التحقق مما إذا كان المستخدم مسجلاً دخوله
    const isLoggedIn = localStorage.getItem('sulafUserLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('يجب تسجيل الدخول أولاً لرفع رواية');
        window.location.href = 'login.html';
        return;
    }
    
    const uploadModal = document.getElementById('upload-modal');
    if (uploadModal) {
        uploadModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

// إغلاق نافذة رفع الرواية
function closeUploadModal() {
    const uploadModal = document.getElementById('upload-modal');
    if (uploadModal) {
        uploadModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// معالجة إرسال نموذج رفع الرواية
function handleUploadSubmit(e) {
    e.preventDefault();
    
    const bookTitle = document.getElementById('book-title').value;
    const bookAuthor = document.getElementById('book-author').value;
    const bookDescription = document.getElementById('book-description').value;
    const fileType = document.querySelector('input[name="file-type"]:checked').value;
    const bookFile = document.getElementById('book-file').files[0];
    
    if (!bookFile) {
        alert('يرجى اختيار ملف الرواية');
        return;
    }
    
    // التحقق من نوع الملف
    const allowedExtensions = fileType === 'pdf' ? ['.pdf'] : ['.txt', '.docx'];
    const fileName = bookFile.name.toLowerCase();
    const isValidExtension = allowedExtensions.some(ext => fileName.endsWith(ext));
    
    if (!isValidExtension) {
        alert(`نوع الملف غير صحيح. الرجاء اختيار ملف من نوع ${allowedExtensions.join(', ')}`);
        return;
    }
    
    // محاكاة رفع الملف (في التطبيق الحقيقي، سيتم رفع الملف للخادم)
    alert(`تم استلام رواية "${bookTitle}" بنجاح!\n\nسيتم مراجعتها من قبل الإدارة قبل نشرها.`);
    
    // تسجيل نشاط رفع الرواية
    logActivity('upload_book', bookTitle);
    
    // إغلاق النافذة وإعادة تعيين النموذج
    closeUploadModal();
    e.target.reset();
}

// تحميل رواية
function downloadBook(button) {
    const bookCard = button.closest('.book-card');
    const bookTitle = bookCard.querySelector('.book-title').textContent;
    const bookAuthor = bookCard.querySelector('.book-author').textContent;
    
    // محاكاة التحميل (في التطبيق الحقيقي، سيتم تحميل الملف من الخادم)
    alert(`سيبدأ تحميل رواية "${bookTitle}" للكاتب ${bookAuthor}\n\nفي التطبيق الكامل، سيتم تنزيل الملف مباشرة.`);
    
    // تسجيل نشاط التحميل
    logActivity('download_book', bookTitle);
    
    // زيادة عداد التحميلات
    const downloadCountElement = bookCard.querySelector('.book-stats span:first-child');
    if (downloadCountElement) {
        const currentCount = parseInt(downloadCountElement.textContent.replace(/\D/g, ''));
        if (!isNaN(currentCount)) {
            const newCount = currentCount + 1;
            downloadCountElement.innerHTML = `<i class="fas fa-download"></i> ${formatNumber(newCount)}`;
        }
    }
}

// قراءة رواية
function readBook(button) {
    const bookCard = button.closest('.book-card');
    const bookTitle = bookCard.querySelector('.book-title').textContent;
    
    // محاكاة القراءة (في التطبيق الحقيقي، ستفتح نافذة قراءة)
    alert(`سيتم فتح قارئ رواية "${bookTitle}"\n\nفي التطبيق الكامل، ستفتح نافذة القراءة مع خيارات تحكم كاملة.`);
    
    // تسجيل نشاط القراءة
    logActivity('read_book', bookTitle);
}

// تهيئة التصميم الداكن
function initializeDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        // التحقق من تفضيلات المستخدم
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('sulafTheme');
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
            enableDarkMode();
        }
        
        themeToggle.addEventListener('click', toggleDarkMode);
    }
}

// تبديل التصميم الداكن
function toggleDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const isDarkMode = document.documentElement.hasAttribute('data-theme');
    
    if (isDarkMode) {
        disableDarkMode();
    } else {
        enableDarkMode();
    }
    
    // تحديث أيقونة الزر
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// تفعيل التصميم الداكن
function enableDarkMode() {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('sulafTheme', 'dark');
}

// تعطيل التصميم الداكن
function disableDarkMode() {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('sulafTheme', 'light');
}

// تهيئة التصميم المتجاوب
function initializeResponsive() {
    // إضافة حدث لتغيير حجم النافذة
    window.addEventListener('resize', handleResize);
    
    // معالجة أولية
    handleResize();
}

// معالجة تغيير حجم النافذة
function handleResize() {
    const bottomNav = document.querySelector('.bottom-nav');
    
    if (bottomNav) {
        // إخفاء شريط التنقل السفلي على الشاشات الكبيرة
        if (window.innerWidth > 992) {
            bottomNav.style.display = 'none';
        } else {
            bottomNav.style.display = 'flex';
        }
    }
}

// تبديل قائمة الجوال
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
        navLinks.classList.toggle('active');
        
        // تحريك الزر عند التنشيط
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.classList.toggle('active');
        }
    }
}

// عرض رسالة ترحيب
function showWelcomeMessage() {
    // التحقق مما إذا كانت هذه هي أول زيارة
    const firstVisit = !localStorage.getItem('sulafFirstVisit');
    
    if (firstVisit) {
        setTimeout(() => {
            alert('مرحباً بك في Sulaf.PDF!\n\nأكبر مكتبة عربية لروايات الفانتازيا.\nاستكشف، اقرأ، وأنشر رواياتك معنا.');
            localStorage.setItem('sulafFirstVisit', 'true');
        }, 1000);
    }
}

// تسجيل النشاط (محاكاة)
function logActivity(type, details) {
    // في التطبيق الحقيقي، سيتم إرسال هذا للسيرفر
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] نشاط: ${type} - ${details}`);
}

// تنسيق الأرقام (مثل 1000 إلى 1K)
function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

// دالة لفتح صفحة الخارجية لتحميل الروايات (محاكاة)
function openExternalSite(siteName) {
    const sites = {
        'goodreads': 'https://www.goodreads.com/',
        'hindawi': 'https://www.hindawi.org/',
        'neelwafurat': 'https://www.neelwafurat.com/',
        'kotob': 'https://www.kotob.com/'
    };
    
    if (sites[siteName]) {
        // في التطبيق الحقيقي، يمكن فتح الرابط في نافذة جديدة
        alert(`سيتم فتح موقع ${siteName} العربي للروايات.\n\nفي التطبيق الكامل، ستتم إضافة محتوى هذه المواقع مباشرة إلى التطبيق.`);
        // window.open(sites[siteName], '_blank');
    }
}

// تصدير الدوال للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeUserState,
        updateUserInterface,
        openAiModal,
        closeAiModal,
        generateStoryIdea,
        sendAiMessage,
        downloadBook,
        readBook,
        toggleDarkMode
    };
}
