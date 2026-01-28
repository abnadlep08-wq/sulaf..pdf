// إعدادات موقع sulaf.pdf
const CONFIG = {
    // إعدادات التطبيق
    APP_NAME: "sulaf.pdf",
    VERSION: "1.0.0",
    DEVELOPER: "Adlep X",
    DEVELOPER_INSTAGRAM: "@xlb_me",
    
    // إعدادات قاعدة البيانات
    DB_NAME: "sulaf_pdf_db",
    DB_VERSION: 1,
    
    // إعدادات الذكاء الاصطناعي (استخدام API مجاني)
    AI_API: {
        ENDPOINT: "https://api-inference.huggingface.co/models",
        MODELS: {
            CHAT: "microsoft/DialoGPT-medium",
            TEXT_GENERATION: "gpt2",
            SUMMARIZATION: "facebook/bart-large-cnn",
            TRANSLATION: "Helsinki-NLP/opus-mt-ar-en"
        },
        API_KEY: "https://api.heckai.weight-wave.com/api/ha/v1/chat" // احصل على مفتاح مجاني من huggingface.co
    },
    
    // إعدادات PDF
    PDF_SETTINGS: {
        PAGE_SIZE: "A4",
        FONT_SIZE: 12,
        FONT_FAMILY: "Cairo",
        MARGINS: {
            TOP: 50,
            RIGHT: 50,
            BOTTOM: 50,
            LEFT: 50
        }
    },
    
    // إعدادات التنزيل
    DOWNLOAD_SETTINGS: {
        MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
        ALLOWED_FORMATS: ["pdf", "txt", "epub", "docx"],
        CHUNK_SIZE: 1024 * 1024 // 1MB
    },
    
    // إعدادات الاستضافة
    HOSTING: {
        BASE_URL: window.location.origin,
        API_URL: window.location.origin + "/api",
        CDN_URL: "https://cdn.sulaf.pdf"
    },
    
    // إعدادات الروايات
    NOVEL_SETTINGS: {
        MAX_CHAPTERS: 100,
        MAX_CHAPTER_LENGTH: 10000,
        MIN_CHAPTER_LENGTH: 500,
        ALLOWED_CATEGORIES: [
            "فانتازيا", "مغامرة", "رومانسية", "غموض", "رعب",
            "خيال علمي", "تاريخي", "دراما", "كوميدي", "أكشن"
        ],
        DEFAULT_COVER: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
    },
    
    // إعدادات المستخدم
    USER_SETTINGS: {
        DEFAULT_AVATAR: "https://api.dicebear.com/7.x/avataaars/svg?seed=",
        MAX_UPLOADS_PER_DAY: 10,
        MAX_FAVORITES: 100,
        MAX_DOWNLOADS_PER_DAY: 50
    },
    
    // قوالب HTML للصفحات
    TEMPLATES: {
        NOVEL_CARD: `
            <div class="novel-card" data-id="{{id}}">
                <div class="novel-cover">
                    <img src="{{cover}}" alt="{{title}}" loading="lazy">
                    <div class="novel-badges">
                        <span class="novel-badge novel-type">{{type}}</span>
                        {{#if isNew}}<span class="novel-badge novel-new">جديد</span>{{/if}}
                        {{#if isPopular}}<span class="novel-badge novel-popular">🔥</span>{{/if}}
                    </div>
                </div>
                <div class="novel-info">
                    <h3 class="novel-title">{{title}}</h3>
                    <p class="novel-author">{{author}}</p>
                    <div class="novel-meta">
                        <span class="novel-category">{{category}}</span>
                        <span class="novel-pages">{{pages}} صفحة</span>
                    </div>
                    <div class="novel-rating">
                        <div class="stars">{{{stars}}}</div>
                        <span class="rating-value">{{rating}}</span>
                        <span class="downloads-count">({{downloads}})</span>
                    </div>
                </div>
                <div class="novel-actions">
                    <button class="btn-read" data-id="{{id}}">
                        <i class="fas fa-book-open"></i> اقرأ
                    </button>
                    <button class="btn-download" data-id="{{id}}">
                        <i class="fas fa-download"></i>
                    </button>
                    <button class="btn-favorite" data-id="{{id}}">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        `,
        
        CHAPTER_ITEM: `
            <div class="chapter-item" data-id="{{id}}">
                <div class="chapter-info">
                    <h4>{{title}}</h4>
                    <p class="chapter-meta">
                        <span><i class="far fa-clock"></i> {{date}}</span>
                        <span><i class="fas fa-eye"></i> {{views}}</span>
                        <span><i class="far fa-comment"></i> {{comments}}</span>
                    </p>
                </div>
                <button class="btn-read-chapter" data-id="{{id}}">
                    <i class="fas fa-book-reader"></i> اقرأ
                </button>
            </div>
        `,
        
        AI_MESSAGE: `
            <div class="ai-message {{type}}">
                <div class="ai-avatar">
                    <i class="{{icon}}"></i>
                </div>
                <div class="ai-content">
                    <div class="ai-text">{{{content}}}</div>
                    <div class="ai-time">{{time}}</div>
                </div>
            </div>
        `
    },
    
    // رسائل النظام
    MESSAGES: {
        WELCOME: "مرحباً بك في sulaf.pdf! استكشف عالم الفانتازيا العربي",
        NOVEL_ADDED: "تمت إضافة الرواية بنجاح",
        NOVEL_UPDATED: "تم تحديث الرواية بنجاح",
        NOVEL_DELETED: "تم حذف الرواية بنجاح",
        DOWNLOAD_STARTED: "جاري تحضير ملف التنزيل...",
        DOWNLOAD_COMPLETE: "تم تنزيل الرواية بنجاح!",
        UPLOAD_SUCCESS: "تم رفع الرواية بنجاح",
        LOGIN_SUCCESS: "تم تسجيل الدخول بنجاح",
        REGISTER_SUCCESS: "تم إنشاء حسابك بنجاح",
        ERROR: "حدث خطأ، يرجى المحاولة مرة أخرى",
        NO_INTERNET: "فقدت الاتصال بالإنترنت",
        LOADING: "جاري التحميل...",
        SAVING: "جاري الحفظ...",
        PROCESSING: "جاري المعالجة..."
    },
    
    // ألوان التطبيق
    COLORS: {
        PRIMARY: "#6d28d9",
        PRIMARY_DARK: "#5b21b6",
        SECONDARY: "#fbbf24",
        SUCCESS: "#10b981",
        DANGER: "#ef4444",
        WARNING: "#f59e0b",
        INFO: "#3b82f6",
        DARK: "#1f2937",
        LIGHT: "#f9fafb",
        GRAY: "#9ca3af"
    },
    
    // تحويل التاريخ العربي
    formatDate: (date) => {
        const d = new Date(date);
        const options = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        return d.toLocaleDateString('ar-SA', options);
    },
    
    // تنسيق الأرقام
    formatNumber: (num) => {
        return new Intl.NumberFormat('ar-SA').format(num);
    },
    
    // إنشاء معرف فريد
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // تحقق من الاتصال بالإنترنت
    checkConnection: async () => {
        return navigator.onLine;
    },
    
    // إخفاء البريد الإلكتروني
    hideEmail: (email) => {
        const [name, domain] = email.split('@');
        const hiddenName = name.length > 2 ? 
            name[0] + '*'.repeat(name.length - 2) + name[name.length - 1] : 
            name;
        return hiddenName + '@' + domain;
    },
    
    // حساب قوة كلمة المرور
    passwordStrength: (password) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (/[A-Z]/.test(password)) score++;
        if (/[a-z]/.test(password)) score++;
        if (/[0-9]/.test(password)) score++;
        if (/[^A-Za-z0-9]/.test(password)) score++;
        
        const strength = ['ضعيفة جداً', 'ضعيفة', 'متوسطة', 'قوية', 'قوية جداً'];
        return strength[score - 1] || 'ضعيفة جداً';
    },
    
    // إنشاء نجوم التقييم
    generateStars: (rating) => {
        let stars = '';
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        
        for (let i = 1; i <= 5; i++) {
            if (i <= fullStars) {
                stars += '<i class="fas fa-star"></i>';
            } else if (i === fullStars + 1 && hasHalfStar) {
                stars += '<i class="fas fa-star-half-alt"></i>';
            } else {
                stars += '<i class="far fa-star"></i>';
            }
        }
        return stars;
    }
};

// جعل CONFIG متاحاً بشكل عام
window.CONFIG = CONFIG;
