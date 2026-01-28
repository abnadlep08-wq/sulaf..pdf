// قاعدة بيانات sulaf.pdf باستخدام IndexedDB
class SulafDatabase {
    constructor() {
        this.db = null;
        this.init();
    }

    // تهيئة قاعدة البيانات
    async init() {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(CONFIG.DB_NAME, CONFIG.DB_VERSION);

            request.onerror = (event) => {
                console.error('خطأ في فتح قاعدة البيانات:', event.target.error);
                reject(event.target.error);
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('✅ قاعدة البيانات جاهزة');
                resolve(this.db);
            };

            request.onupgradeneeded = (event) => {
                const db = event.target.result;

                // تخزين المستخدمين
                if (!db.objectStoreNames.contains('users')) {
                    const usersStore = db.createObjectStore('users', { keyPath: 'id' });
                    usersStore.createIndex('email', 'email', { unique: true });
                    usersStore.createIndex('username', 'username', { unique: true });
                }

                // تخزين الروايات
                if (!db.objectStoreNames.contains('novels')) {
                    const novelsStore = db.createObjectStore('novels', { keyPath: 'id' });
                    novelsStore.createIndex('authorId', 'authorId');
                    novelsStore.createIndex('category', 'category');
                    novelsStore.createIndex('status', 'status');
                    novelsStore.createIndex('createdAt', 'createdAt');
                }

                // تخزين الفصول
                if (!db.objectStoreNames.contains('chapters')) {
                    const chaptersStore = db.createObjectStore('chapters', { keyPath: 'id' });
                    chaptersStore.createIndex('novelId', 'novelId');
                    chaptersStore.createIndex('chapterNumber', 'chapterNumber');
                }

                // تخزين التنزيلات
                if (!db.objectStoreNames.contains('downloads')) {
                    const downloadsStore = db.createObjectStore('downloads', { keyPath: 'id' });
                    downloadsStore.createIndex('userId', 'userId');
                    downloadsStore.createIndex('novelId', 'novelId');
                    downloadsStore.createIndex('date', 'date');
                }

                // تخزين المفضلة
                if (!db.objectStoreNames.contains('favorites')) {
                    const favoritesStore = db.createObjectStore('favorites', { keyPath: 'id' });
                    favoritesStore.createIndex('userId', 'userId');
                    favoritesStore.createIndex('novelId', 'novelId');
                }

                // تخزين التصنيفات
                if (!db.objectStoreNames.contains('categories')) {
                    const categoriesStore = db.createObjectStore('categories', { keyPath: 'id' });
                    categoriesStore.createIndex('slug', 'slug', { unique: true });
                }

                // تخزين المؤلفين
                if (!db.objectStoreNames.contains('authors')) {
                    const authorsStore = db.createObjectStore('authors', { keyPath: 'id' });
                    authorsStore.createIndex('slug', 'slug', { unique: true });
                }

                // تخزين التعليقات
                if (!db.objectStoreNames.contains('comments')) {
                    const commentsStore = db.createObjectStore('comments', { keyPath: 'id' });
                    commentsStore.createIndex('novelId', 'novelId');
                    commentsStore.createIndex('chapterId', 'chapterId');
                    commentsStore.createIndex('userId', 'userId');
                }

                // تخزين الإشعارات
                if (!db.objectStoreNames.contains('notifications')) {
                    const notificationsStore = db.createObjectStore('notifications', { keyPath: 'id' });
                    notificationsStore.createIndex('userId', 'userId');
                    notificationsStore.createIndex('read', 'read');
                }

                // تخزين الإحصائيات
                if (!db.objectStoreNames.contains('statistics')) {
                    const statsStore = db.createObjectStore('statistics', { keyPath: 'id' });
                    statsStore.createIndex('date', 'date');
                }

                // تخزين الإعدادات
                if (!db.objectStoreNames.contains('settings')) {
                    const settingsStore = db.createObjectStore('settings', { keyPath: 'key' });
                }

                console.log('📦 تم إنشاء قاعدة البيانات بنجاح');
            };
        });
    }

    // === دوال المستخدمين ===
    async registerUser(userData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            
            // توليد معرف فريد
            userData.id = CONFIG.generateId();
            userData.createdAt = new Date().toISOString();
            userData.updatedAt = userData.createdAt;
            userData.isActive = true;
            userData.role = 'user';
            userData.avatar = CONFIG.USER_SETTINGS.DEFAULT_AVATAR + userData.id;
            userData.stats = {
                novels: 0,
                downloads: 0,
                favorites: 0,
                comments: 0
            };
            
            const request = store.add(userData);
            
            request.onsuccess = () => {
                // إضافة الإعدادات الافتراضية للمستخدم
                this.saveSetting(`user_${userData.id}_settings`, {
                    theme: 'light',
                    notifications: true,
                    autoSave: true,
                    fontSize: 16,
                    fontFamily: 'Cairo',
                    readingMode: 'page'
                });
                
                resolve({ success: true, user: userData });
            };
            
            request.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    async loginUser(email, password) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const index = store.index('email');
            const request = index.get(email);
            
            request.onsuccess = (event) => {
                const user = event.target.result;
                if (user && user.password === password && user.isActive) {
                    // تحديث وقت آخر دخول
                    user.lastLogin = new Date().toISOString();
                    this.updateUser(user.id, { lastLogin: user.lastLogin });
                    
                    // إخفاء كلمة المرور قبل الإرجاع
                    delete user.password;
                    resolve({ success: true, user });
                } else {
                    resolve({ success: false, error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' });
                }
            };
            
            request.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    async getUser(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readonly');
            const store = transaction.objectStore('users');
            const request = store.get(id);
            
            request.onsuccess = (event) => {
                const user = event.target.result;
                if (user) {
                    delete user.password;
                    resolve({ success: true, user });
                } else {
                    resolve({ success: false, error: 'المستخدم غير موجود' });
                }
            };
            
            request.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    async updateUser(id, updates) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['users'], 'readwrite');
            const store = transaction.objectStore('users');
            
            const getRequest = store.get(id);
            
            getRequest.onsuccess = () => {
                const user = getRequest.result;
                if (user) {
                    Object.assign(user, updates);
                    user.updatedAt = new Date().toISOString();
                    
                    const updateRequest = store.put(user);
                    
                    updateRequest.onsuccess = () => {
                        delete user.password;
                        resolve({ success: true, user });
                    };
                    
                    updateRequest.onerror = (event) => {
                        reject({ success: false, error: event.target.error });
                    };
                } else {
                    resolve({ success: false, error: 'المستخدم غير موجود' });
                }
            };
            
            getRequest.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    // === دوال الروايات ===
    async addNovel(novelData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['novels'], 'readwrite');
            const store = transaction.objectStore('novels');
            
            // بيانات الرواية الأساسية
            novelData.id = CONFIG.generateId();
            novelData.createdAt = new Date().toISOString();
            novelData.updatedAt = novelData.createdAt;
            novelData.views = 0;
            novelData.downloads = 0;
            novelData.rating = 0;
            novelData.ratingCount = 0;
            novelData.status = novelData.status || 'draft';
            novelData.isPublished = novelData.status === 'published';
            novelData.isFeatured = false;
            novelData.isNew = true;
            novelData.tags = novelData.tags || [];
            novelData.chapters = novelData.chapters || 0;
            novelData.cover = novelData.cover || CONFIG.NOVEL_SETTINGS.DEFAULT_COVER;
            
            // إضافة الرواية
            const request = store.add(novelData);
            
            request.onsuccess = async () => {
                // تحديث إحصائيات المؤلف
                if (novelData.authorId) {
                    const author = await this.getUser(novelData.authorId);
                    if (author.success) {
                        author.user.stats.novels += 1;
                        await this.updateUser(novelData.authorId, { 
                            stats: author.user.stats 
                        });
                    }
                }
                
                resolve({ success: true, novel: novelData });
            };
            
            request.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    async getNovel(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['novels'], 'readonly');
            const store = transaction.objectStore('novels');
            const request = store.get(id);
            
            request.onsuccess = async (event) => {
                const novel = event.target.result;
                if (novel) {
                    // زيادة عدد المشاهدات
                    novel.views += 1;
                    await this.updateNovel(id, { views: novel.views });
                    
                    // جلب معلومات المؤلف
                    if (novel.authorId) {
                        const author = await this.getUser(novel.authorId);
                        if (author.success) {
                            novel.author = author.user;
                        }
                    }
                    
                    resolve({ success: true, novel });
                } else {
                    resolve({ success: false, error: 'الرواية غير موجودة' });
                }
            };
            
            request.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    async getNovels(filter = {}) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['novels'], 'readonly');
            const store = transaction.objectStore('novels');
            const request = store.getAll();
            
            request.onsuccess = async (event) => {
                let novels = event.target.result;
                
                // تطبيق الفلاتر
                if (filter.category) {
                    novels = novels.filter(n => n.category === filter.category);
                }
                if (filter.authorId) {
                    novels = novels.filter(n => n.authorId === filter.authorId);
                }
                if (filter.status) {
                    novels = novels.filter(n => n.status === filter.status);
                }
                if (filter.search) {
                    const searchTerm = filter.search.toLowerCase();
                    novels = novels.filter(n => 
                        n.title.toLowerCase().includes(searchTerm) ||
                        n.description.toLowerCase().includes(searchTerm) ||
                        n.tags.some(tag => tag.toLowerCase().includes(searchTerm))
                    );
                }
                
                // الترتيب
                if (filter.sortBy) {
                    novels.sort((a, b) => {
                        if (filter.sortBy === 'newest') {
                            return new Date(b.createdAt) - new Date(a.createdAt);
                        } else if (filter.sortBy === 'popular') {
                            return b.views - a.views;
                        } else if (filter.sortBy === 'downloads') {
                            return b.downloads - a.downloads;
                        } else if (filter.sortBy === 'rating') {
                            return b.rating - a.rating;
                        }
                        return 0;
                    });
                }
                
                // التقسيم
                if (filter.page && filter.limit) {
                    const start = (filter.page - 1) * filter.limit;
                    const end = start + filter.limit;
                    novels = novels.slice(start, end);
                }
                
                resolve({ success: true, novels, total: novels.length });
            };
            
            request.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    async updateNovel(id, updates) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['novels'], 'readwrite');
            const store = transaction.objectStore('novels');
            
            const getRequest = store.get(id);
            
            getRequest.onsuccess = () => {
                const novel = getRequest.result;
                if (novel) {
                    Object.assign(novel, updates);
                    novel.updatedAt = new Date().toISOString();
                    
                    const updateRequest = store.put(novel);
                    
                    updateRequest.onsuccess = () => {
                        resolve({ success: true, novel });
                    };
                    
                    updateRequest.onerror = (event) => {
                        reject({ success: false, error: event.target.error });
                    };
                } else {
                    resolve({ success: false, error: 'الرواية غير موجودة' });
                }
            };
            
            getRequest.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    async deleteNovel(id) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['novels', 'chapters', 'favorites'], 'readwrite');
            const novelsStore = transaction.objectStore('novels');
            const chaptersStore = transaction.objectStore('chapters');
            const favoritesStore = transaction.objectStore('favorites');
            
            // حذف الرواية
            const deleteRequest = novelsStore.delete(id);
            
            deleteRequest.onsuccess = async () => {
                // حذف الفصول المرتبطة
                const chapters = await this.getChapters(id);
                if (chapters.success) {
                    chapters.chapters.forEach(chapter => {
                        chaptersStore.delete(chapter.id);
                    });
                }
                
                // حذف من المفضلة
                const favoritesIndex = favoritesStore.index('novelId');
                const getFavorites = favoritesIndex.getAll(id);
                
                getFavorites.onsuccess = (event) => {
                    event.target.result.forEach(fav => {
                        favoritesStore.delete(fav.id);
                    });
                };
                
                resolve({ success: true });
            };
            
            deleteRequest.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    // === دوال الفصول ===
    async addChapter(chapterData) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['chapters', 'novels'], 'readwrite');
            const chaptersStore = transaction.objectStore('chapters');
            const novelsStore = transaction.objectStore('novels');
            
            // بيانات الفصل
            chapterData.id = CONFIG.generateId();
            chapterData.createdAt = new Date().toISOString();
            chapterData.updatedAt = chapterData.createdAt;
            chapterData.views = 0;
            chapterData.comments = 0;
            chapterData.wordCount = chapterData.content.split(' ').length;
            
            // إضافة الفصل
            const chapterRequest = chaptersStore.add(chapterData);
            
            chapterRequest.onsuccess = async () => {
                // تحديث عدد فصول الرواية
                const novel = await this.getNovel(chapterData.novelId);
                if (novel.success) {
                    novel.novel.chapters += 1;
                    await this.updateNovel(chapterData.novelId, { 
                        chapters: novel.novel.chapters 
                    });
                }
                
                resolve({ success: true, chapter: chapterData });
            };
            
            chapterRequest.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    async getChapters(novelId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['chapters'], 'readonly');
            const store = transaction.objectStore('chapters');
            const index = store.index('novelId');
            const request = index.getAll(novelId);
            
            request.onsuccess = (event) => {
                const chapters = event.target.result;
                chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
                resolve({ success: true, chapters });
            };
            
            request.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    // === دوال التنزيلات ===
    async addDownload(userId, novelId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['downloads', 'novels'], 'readwrite');
            const downloadsStore = transaction.objectStore('downloads');
            const novelsStore = transaction.objectStore('novels');
            
            // بيانات التنزيل
            const downloadData = {
                id: CONFIG.generateId(),
                userId,
                novelId,
                date: new Date().toISOString(),
                device: navigator.userAgent,
                format: 'pdf'
            };
            
            // إضافة التنزيل
            const downloadRequest = downloadsStore.add(downloadData);
            
            downloadRequest.onsuccess = async () => {
                // تحديث عدد تنزيلات الرواية
                const novel = await this.getNovel(novelId);
                if (novel.success) {
                    novel.novel.downloads += 1;
                    await this.updateNovel(novelId, { 
                        downloads: novel.novel.downloads 
                    });
                }
                
                // تحديث إحصائيات المستخدم
                if (userId) {
                    const user = await this.getUser(userId);
                    if (user.success) {
                        user.user.stats.downloads += 1;
                        await this.updateUser(userId, { 
                            stats: user.user.stats 
                        });
                    }
                }
                
                resolve({ success: true, download: downloadData });
            };
            
            downloadRequest.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    // === دوال المفضلة ===
    async toggleFavorite(userId, novelId) {
        return new Promise(async (resolve, reject) => {
            const transaction = this.db.transaction(['favorites'], 'readwrite');
            const store = transaction.objectStore('favorites');
            const index = store.index('novelId');
            
            // التحقق إذا كانت موجودة بالفعل
            const getRequest = index.getAll(novelId);
            
            getRequest.onsuccess = async (event) => {
                const favorites = event.target.result;
                const existing = favorites.find(f => f.userId === userId);
                
                if (existing) {
                    // إزالة من المفضلة
                    const deleteRequest = store.delete(existing.id);
                    
                    deleteRequest.onsuccess = async () => {
                        // تحديث إحصائيات المستخدم
                        const user = await this.getUser(userId);
                        if (user.success) {
                            user.user.stats.favorites -= 1;
                            await this.updateUser(userId, { 
                                stats: user.user.stats 
                            });
                        }
                        
                        resolve({ success: true, isFavorite: false });
                    };
                } else {
                    // إضافة إلى المفضلة
                    const favoriteData = {
                        id: CONFIG.generateId(),
                        userId,
                        novelId,
                        date: new Date().toISOString()
                    };
                    
                    const addRequest = store.add(favoriteData);
                    
                    addRequest.onsuccess = async () => {
                        // تحديث إحصائيات المستخدم
                        const user = await this.getUser(userId);
                        if (user.success) {
                            user.user.stats.favorites += 1;
                            await this.updateUser(userId, { 
                                stats: user.user.stats 
                            });
                        }
                        
                        resolve({ success: true, isFavorite: true });
                    };
                }
            };
        });
    }

    async getFavorites(userId) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['favorites', 'novels'], 'readonly');
            const favoritesStore = transaction.objectStore('favorites');
            const novelsStore = transaction.objectStore('novels');
            
            const index = favoritesStore.index('userId');
            const request = index.getAll(userId);
            
            request.onsuccess = async (event) => {
                const favorites = event.target.result;
                const novelIds = favorites.map(f => f.novelId);
                
                // جلب بيانات الروايات
                const novels = [];
                for (const novelId of novelIds) {
                    const novelRequest = novelsStore.get(novelId);
                    const novel = await new Promise(res => {
                        novelRequest.onsuccess = () => res(novelRequest.result);
                    });
                    if (novel) novels.push(novel);
                }
                
                resolve({ success: true, favorites: novels });
            };
            
            request.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    // === دوال التصنيفات ===
    async getCategories() {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['categories'], 'readonly');
            const store = transaction.objectStore('categories');
            const request = store.getAll();
            
            request.onsuccess = (event) => {
                const categories = event.target.result;
                
                // إذا لم تكن هناك تصنيفات، إنشاء الافتراضية
                if (categories.length === 0) {
                    const defaultCategories = [
                        { id: 1, name: "فانتازيا", slug: "fantasy", color: "#6d28d9", icon: "fa-dragon", description: "روايات خيالية وعوالم سحرية", count: 0 },
                        { id: 2, name: "مغامرة", slug: "adventure", color: "#10b981", icon: "fa-compass", description: "مغامرات وإثارة واستكشاف", count: 0 },
                        { id: 3, name: "رومانسية", slug: "romance", color: "#ef4444", icon: "fa-heart", description: "حب وعواطف وعلاقات", count: 0 },
                        { id: 4, name: "غموض", slug: "mystery", color: "#8b5cf6", icon: "fa-search", description: "ألغاز وجرائم وتحقيقات", count: 0 },
                        { id: 5, name: "رعب", slug: "horror", color: "#1f2937", icon: "fa-ghost", description: "رعب وتشويق وإثارة", count: 0 },
                        { id: 6, name: "خيال علمي", slug: "sci-fi", color: "#3b82f6", icon: "fa-rocket", description: "تكنولوجيا ومستقبل وفضاء", count: 0 },
                        { id: 7, name: "تاريخي", slug: "historical", color: "#f59e0b", icon: "fa-landmark", description: "أحداث تاريخية وشخصيات", count: 0 },
                        { id: 8, name: "كوميدي", slug: "comedy", color: "#fbbf24", icon: "fa-laugh", description: "فكاهة وضحك ومواقف مضحكة", count: 0 }
                    ];
                    
                    // إضافة التصنيفات الافتراضية
                    const writeTransaction = this.db.transaction(['categories'], 'readwrite');
                    const writeStore = writeTransaction.objectStore('categories');
                    
                    defaultCategories.forEach(category => {
                        writeStore.add(category);
                    });
                    
                    writeTransaction.oncomplete = () => {
                        resolve({ success: true, categories: defaultCategories });
                    };
                } else {
                    resolve({ success: true, categories });
                }
            };
            
            request.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    // === دوال الإحصائيات ===
    async getStatistics() {
        return new Promise(async (resolve, reject) => {
            const today = new Date().toISOString().split('T')[0];
            
            const transaction = this.db.transaction([
                'users', 'novels', 'downloads', 
                'favorites', 'comments'
            ], 'readonly');
            
            const usersStore = transaction.objectStore('users');
            const novelsStore = transaction.objectStore('novels');
            const downloadsStore = transaction.objectStore('downloads');
            const favoritesStore = transaction.objectStore('favorites');
            
            // إحصائيات المستخدمين
            const usersRequest = usersStore.count();
            const activeUsers = await new Promise(resolve => {
                const index = usersStore.index('isActive');
                const request = index.count(true);
                request.onsuccess = () => resolve(request.result);
            });
            
            // إحصائيات الروايات
            const novelsRequest = novelsStore.count();
            const publishedNovels = await new Promise(resolve => {
                const index = novelsStore.index('isPublished');
                const request = index.count(true);
                request.onsuccess = () => resolve(request.result);
            });
            
            // إحصائيات التنزيلات
            const downloadsRequest = downloadsStore.count();
            
            // إحصائيات المفضلة
            const favoritesRequest = favoritesStore.count();
            
            transaction.oncomplete = () => {
                resolve({
                    success: true,
                    statistics: {
                        totalUsers: usersRequest.result,
                        activeUsers,
                        totalNovels: novelsRequest.result,
                        publishedNovels,
                        totalDownloads: downloadsRequest.result,
                        totalFavorites: favoritesRequest.result,
                        date: today
                    }
                });
            };
        });
    }

    // === دوال الإعدادات ===
    async saveSetting(key, value) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readwrite');
            const store = transaction.objectStore('settings');
            
            const setting = { key, value };
            const request = store.put(setting);
            
            request.onsuccess = () => {
                resolve({ success: true });
            };
            
            request.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    async getSetting(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['settings'], 'readonly');
            const store = transaction.objectStore('settings');
            const request = store.get(key);
            
            request.onsuccess = (event) => {
                const result = event.target.result;
                resolve({ 
                    success: true, 
                    value: result ? result.value : null 
                });
            };
            
            request.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    // === دوال النسخ الاحتياطي ===
    async backupData() {
        return new Promise(async (resolve, reject) => {
            try {
                const backup = {
                    users: await this.getAll('users'),
                    novels: await this.getAll('novels'),
                    chapters: await this.getAll('chapters'),
                    categories: await this.getAll('categories'),
                    settings: await this.getAll('settings'),
                    backupDate: new Date().toISOString()
                };
                
                resolve({ success: true, backup });
            } catch (error) {
                reject({ success: false, error });
            }
        });
    }

    async restoreData(backup) {
        return new Promise(async (resolve, reject) => {
            try {
                // حذف البيانات الحالية
                await this.clearAll();
                
                // استعادة البيانات
                for (const [storeName, data] of Object.entries(backup)) {
                    if (storeName !== 'backupDate') {
                        await this.bulkAdd(storeName, data);
                    }
                }
                
                resolve({ success: true });
            } catch (error) {
                reject({ success: false, error });
            }
        });
    }

    // === دوال مساعدة ===
    async getAll(storeName) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readonly');
            const store = transaction.objectStore(storeName);
            const request = store.getAll();
            
            request.onsuccess = (event) => {
                resolve(event.target.result);
            };
            
            request.onerror = (event) => {
                reject(event.target.error);
            };
        });
    }

    async bulkAdd(storeName, items) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction([storeName], 'readwrite');
            const store = transaction.objectStore(storeName);
            
            items.forEach(item => {
                store.add(item);
            });
            
            transaction.oncomplete = () => {
                resolve({ success: true });
            };
            
            transaction.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    async clearAll() {
        const storeNames = [
            'users', 'novels', 'chapters', 'downloads', 
            'favorites', 'categories', 'comments', 
            'notifications', 'statistics', 'settings'
        ];
        
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(storeNames, 'readwrite');
            
            storeNames.forEach(storeName => {
                const store = transaction.objectStore(storeName);
                store.clear();
            });
            
            transaction.oncomplete = () => {
                resolve({ success: true });
            };
            
            transaction.onerror = (event) => {
                reject({ success: false, error: event.target.error });
            };
        });
    }

    // === تهيئة البيانات الافتراضية ===
    async initializeDefaultData() {
        try {
            // التحقق إذا كانت البيانات موجودة بالفعل
            const novels = await this.getAll('novels');
            if (novels.length === 0) {
                console.log('📝 جاري تهيئة البيانات الافتراضية...');
                
                // إنشاء مستخدم افتراضي
                const adminUser = {
                    id: CONFIG.generateId(),
                    username: 'admin',
                    email: 'admin@sulaf.pdf',
                    password: 'admin123',
                    name: 'مدير النظام',
                    bio: 'مدير موقع sulaf.pdf ومحب للروايات الفانتازيا',
                    avatar: CONFIG.USER_SETTINGS.DEFAULT_AVATAR + 'admin',
                    role: 'admin',
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    stats: {
                        novels: 5,
                        downloads: 1250,
                        favorites: 42,
                        comments: 89
                    }
                };
                
                await this.registerUser(adminUser);
                
                // إنشاء روايات افتراضية
                const defaultNovels = [
                    {
                        title: "أسطورة التنين الأزرق",
                        authorId: adminUser.id,
                        authorName: "أحمد الشقيري",
                        description: "رواية فانتازيا ملحمية تحكي قصة التنين الأزرق الأسطوري وحارسه البشري في عالم مليء بالسحر والمغامرات. تدور أحداث الرواية في عالم 'أراثيا' حيث يتعاون البطل 'كايلان' مع التنين 'أزور' لمواجهة قوى الظلام التي تهدد المملكة.",
                        category: "فانتازيا",
                        tags: ["فانتازيا", "مغامرة", "تنين", "سحر", "ملحمي"],
                        cover: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        status: "published",
                        chapters: 25,
                        pages: 320,
                        language: "ar",
                        rating: 4.7,
                        views: 12500,
                        downloads: 3250,
                        wordCount: 85000
                    },
                    {
                        title: "مملكة الظلال",
                        authorId: adminUser.id,
                        authorName: "سارة النجار",
                        description: "في مملكة تسيطر عليها قوى الظلام، تخرج الأميرة 'ليانا' في رحلة محفوفة بالمخاطر لاستعادة النور إلى عالمها. تتحدى التقاليد وتواجه أعداء أقوياء في سبيل إنقاذ شعبها.",
                        category: "فانتازيا",
                        tags: ["فانتازيا", "رومانسية", "قوى خارقة", "ملوك"],
                        cover: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        status: "published",
                        chapters: 18,
                        pages: 280,
                        language: "ar",
                        rating: 4.5,
                        views: 8900,
                        downloads: 1980,
                        wordCount: 72000
                    },
                    {
                        title: "صائدو الأحلام",
                        authorId: adminUser.id,
                        authorName: "خالد العلي",
                        description: "مجموعة من الصيادين المهرة الذين يسافرون بين عوالم الأحلام لاصطياد الكوابيس وتحقيق أمنيات البشر. يكتشف البطل 'زين' سراً خطيراً يهدد بتدمير الحد الفاصل بين الواقع والحلم.",
                        category: "مغامرة",
                        tags: ["مغامرة", "خيال علمي", "أحلام", "سفر بين العوالم"],
                        cover: "https://images.unsplash.com/photo-1531685250784-7569952593d2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        status: "published",
                        chapters: 22,
                        pages: 350,
                        language: "ar",
                        rating: 4.3,
                        views: 7500,
                        downloads: 1750,
                        wordCount: 95000
                    },
                    {
                        title: "سيف النور",
                        authorId: adminUser.id,
                        authorName: "فاطمة الزهراء",
                        description: "قصة فارس شاب من قرية نائية يكتشف سيفاً مقدساً يمنحه قوى خارقة لمواجهة قوى الشر التي تهدد مملكته. في رحلته، يتعلم دروساً قيّمة عن الشجاعة والتضحية والإيمان.",
                        category: "فانتازيا",
                        tags: ["فانتازيا", "مغامرة", "فروسية", "معارك", "سحر"],
                        cover: "https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        status: "published",
                        chapters: 30,
                        pages: 400,
                        language: "ar",
                        rating: 4.8,
                        views: 21000,
                        downloads: 5210,
                        wordCount: 120000
                    },
                    {
                        title: "بوابة الزمن",
                        authorId: adminUser.id,
                        authorName: "محمد السعدون",
                        description: "مغامرة عبر الزمن إلى عوالم سحيقة حيث يواجه البطل 'سامر' تحديات تختبر قدراته وشجاعته. يكتشف أسراراً عن ماضيه ومستقبله تغير حياته إلى الأبد.",
                        category: "مغامرة",
                        tags: ["مغامرة", "سفر عبر الزمن", "مستقبل", "تقنية"],
                        cover: "https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                        status: "published",
                        chapters: 20,
                        pages: 310,
                        language: "ar",
                        rating: 4.4,
                        views: 8900,
                        downloads: 1890,
                        wordCount: 78000
                    }
                ];
                
                for (const novelData of defaultNovels) {
                    await this.addNovel(novelData);
                }
                
                console.log('✅ تم تهيئة البيانات الافتراضية بنجاح');
            }
        } catch (error) {
            console.error('❌ خطأ في تهيئة البيانات الافتراضية:', error);
        }
    }
}

// إنشاء نسخة واحدة من قاعدة البيانات
const sulafDB = new SulafDatabase();

// جعل قاعدة البيانات متاحة عالمياً
window.sulafDB = sulafDB;

console.log('📊 قاعدة بيانات sulaf.pdf جاهزة للاستخدام');
