// الجافاسكريبت للوحة التحكم في موقع Sulaf.PDF

// تهيئة لوحة التحكم عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // التحقق من صلاحيات المدير
    checkAdminAccess();
    
    // تهيئة أحداث لوحة التحكم
    initializeAdminEvents();
    
    // تحميل البيانات الأولية
    loadDashboardData();
    
    // تهيئة التصميم الداكن للوحة التحكم
    initializeAdminDarkMode();
    
    // تهيئة التصميم المتجاوب للوحة التحكم
    initializeAdminResponsive();
});

// التحقق من صلاحيات المدير
function checkAdminAccess() {
    // في التطبيق الحقيقي، سيتم التحقق من صلاحيات المستخدم مع الخادم
    // هنا نتحقق فقط مما إذا كان المستخدم مسجلاً دخوله
    const isLoggedIn = localStorage.getItem('sulafUserLoggedIn') === 'true';
    
    if (!isLoggedIn) {
        alert('يجب تسجيل الدخول أولاً للوصول إلى لوحة التحكم');
        window.location.href = 'login.html';
        return;
    }
    
    // يمكن إضافة المزيد من التحقق للصلاحيات الإدارية
    const userName = localStorage.getItem('sulafUserName');
    if (userName !== 'Adlep X') {
        alert('ليس لديك صلاحيات للوصول إلى لوحة التحكم');
        window.location.href = 'index.html';
        return;
    }
}

// تهيئة أحداث لوحة التحكم
function initializeAdminEvents() {
    // حدث لزر إضافة رواية
    const addBookBtn = document.getElementById('add-book');
    const addBookModal = document.getElementById('add-book-modal');
    
    if (addBookBtn) {
        addBookBtn.addEventListener('click', function() {
            openAddBookModal();
        });
    }
    
    // حدث لإغلاق نافذة إضافة رواية
    const closeAdminModalBtn = document.querySelector('.close-admin-modal');
    if (closeAdminModalBtn) {
        closeAdminModalBtn.addEventListener('click', closeAddBookModal);
    }
    
    // حدث لإغلاق نافذة إضافة رواية بالنقر خارجها
    if (addBookModal) {
        addBookModal.addEventListener('click', function(e) {
            if (e.target === addBookModal) {
                closeAddBookModal();
            }
        });
    }
    
    // حدث لإرسال نموذج إضافة رواية
    const adminBookForm = document.getElementById('admin-book-form');
    if (adminBookForm) {
        adminBookForm.addEventListener('submit', handleAdminAddBook);
    }
    
    // أحداث أزرار الإجراءات في الجدول
    const editButtons = document.querySelectorAll('.action-btn.edit');
    const deleteButtons = document.querySelectorAll('.action-btn.delete');
    const viewButtons = document.querySelectorAll('.action-btn.view');
    const approveButtons = document.querySelectorAll('.action-btn.approve');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            editBook(this);
        });
    });
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            deleteBook(this);
        });
    });
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewBook(this);
        });
    });
    
    approveButtons.forEach(button => {
        button.addEventListener('click', function() {
            approveBook(this);
        });
    });
    
    // حدث لزر الإشعارات
    const notificationsBtn = document.querySelector('.notifications-btn');
    const notificationsModal = document.getElementById('notifications-modal');
    
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function() {
            openNotificationsModal();
        });
    }
    
    // حدث لإغلاق نافذة الإشعارات
    const closeNotificationsBtn = document.querySelector('.close-notifications');
    if (closeNotificationsBtn) {
        closeNotificationsBtn.addEventListener('click', closeNotificationsModal);
    }
    
    // حدث لإغلاق نافذة الإشعارات بالنقر خارجها
    if (notificationsModal) {
        notificationsModal.addEventListener('click', function(e) {
            if (e.target === notificationsModal) {
                closeNotificationsModal();
            }
        });
    }
    
    // حدث لزر تبديل الثيم
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleAdminDarkMode);
    }
    
    // حدث لزر تبديل الشريط الجانبي
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', toggleSidebar);
    }
    
    // حدث لزر تسجيل الخروج
    const logoutBtn = document.querySelector('.nav-item.logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            adminLogout();
        });
    }
    
    // أحداث التصفية والبحث
    const filterBtn = document.querySelector('.btn-secondary');
    const adminSearch = document.querySelector('.admin-search input');
    const adminSearchBtn = document.querySelector('.admin-search button');
    
    if (filterBtn) {
        filterBtn.addEventListener('click', showFilterOptions);
    }
    
    if (adminSearch && adminSearchBtn) {
        adminSearchBtn.addEventListener('click', performAdminSearch);
        
        adminSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performAdminSearch();
            }
        });
    }
    
    // أحداث أزرار الترقيم
    const pageButtons = document.querySelectorAll('.page-btn:not(.disabled)');
    pageButtons.forEach(button => {
        button.addEventListener('click', function() {
            handlePagination(this);
        });
    });
}

// تحميل بيانات لوحة التحكم
function loadDashboardData() {
    // في التطبيق الحقيقي، سيتم جلب البيانات من الخادم
    // هنا نستخدم بيانات تجريبية
    setTimeout(() => {
        // تحديث العدادات
        updateStats();
        
        // تحديث قائمة الإشعارات
        updateNotifications();
        
        // تسجيل نشاط التحميل
        logActivity('admin_dashboard_loaded', 'تم تحميل بيانات لوحة التحكم');
    }, 500);
}

// تحديث الإحصائيات
function updateStats() {
    // في التطبيق الحقيقي، سيتم جلب البيانات الحقيقية من الخادم
    // هنا نقوم فقط بتحديث عشوائي للأرقام لعرض الديناميكية
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach((stat, index) => {
        const currentValue = parseInt(stat.textContent.replace(/,/g, ''));
        if (!isNaN(currentValue)) {
            // زيادة عشوائية بنسبة 1-5%
            const increase = Math.floor(Math.random() * 5) + 1;
            const newValue = currentValue + Math.floor(currentValue * (increase / 100));
            
            // تحديث الرقم بتأثير
            animateCounter(stat, currentValue, newValue);
        }
    });
}

// تأثير عدادات متحركة
function animateCounter(element, start, end) {
    const duration = 1000; // مدة الحركة بالمللي ثانية
    const steps = 60; // عدد الخطوات
    const stepValue = (end - start) / steps;
    const stepTime = duration / steps;
    
    let current = start;
    let step = 0;
    
    const timer = setInterval(() => {
        current += stepValue;
        step++;
        
        // تنسيق الرقم مع فواصل الآلاف
        element.textContent = Math.floor(current).toLocaleString('ar-EG');
        
        if (step >= steps) {
            clearInterval(timer);
            element.textContent = end.toLocaleString('ar-EG');
        }
    }, stepTime);
}

// تحديث الإشعارات
function updateNotifications() {
    // في التطبيق الحقيقي، سيتم جلب الإشعارات من الخادم
    // هنا نضيف إشعار جديد كل فترة لعرض الديناميكية
    const notificationsList = document.querySelector('.notifications-list');
    if (!notificationsList) return;
    
    // أمثلة للإشعارات
    const notificationExamples = [
        {
            icon: 'fas fa-book',
            text: 'رواية جديدة تحتاج المراجعة: "أسرار العالم السفلي"',
            time: 'منذ ساعة'
        },
        {
            icon: 'fas fa-user-plus',
            text: '5 مستخدمين جدد قاموا بالتسجيل اليوم',
            time: 'منذ 3 ساعات'
        },
        {
            icon: 'fas fa-download',
            text: 'وصل عدد التحميلات إلى 500 هذا اليوم',
            time: 'منذ 5 ساعات'
        },
        {
            icon: 'fas fa-robot',
            text: 'الذكاء الاصطناعي قام بإنشاء 3 روايات جديدة',
            time: 'منذ يوم'
        }
    ];
    
    // اختيار إشعار عشوائي
    const randomNotification = notificationExamples[Math.floor(Math.random() * notificationExamples.length)];
    
    // إضافة الإشعار الجديد
    const notificationItem = document.createElement('div');
    notificationItem.className = 'notification-item unread';
    notificationItem.innerHTML = `
        <div class="notification-icon">
            <i class="${randomNotification.icon}"></i>
        </div>
        <div class="notification-content">
            <p>${randomNotification.text}</p>
            <span class="notification-time">${randomNotification.time}</span>
        </div>
    `;
    
    // إضافة الإشعار في البداية
    notificationsList.insertBefore(notificationItem, notificationsList.firstChild);
    
    // تحديث عداد الإشعارات
    updateNotificationCount();
}

// تحديث عداد الإشعارات
function updateNotificationCount() {
    const notificationCount = document.querySelector('.notification-count');
    const unreadNotifications = document.querySelectorAll('.notification-item.unread').length;
    
    if (notificationCount) {
        notificationCount.textContent = unreadNotifications;
        
        if (unreadNotifications === 0) {
            notificationCount.style.display = 'none';
        } else {
            notificationCount.style.display = 'flex';
        }
    }
}

// فتح نافذة إضافة رواية
function openAddBookModal() {
    const addBookModal = document.getElementById('add-book-modal');
    if (addBookModal) {
        addBookModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // تعيين التاريخ الحالي كتاريخ النشر الافتراضي
        const currentDate = new Date().toISOString().split('T')[0];
        const dateField = document.getElementById('admin-book-date');
        if (dateField) {
            dateField.value = currentDate;
        }
    }
}

// إغلاق نافذة إضافة رواية
function closeAddBookModal() {
    const addBookModal = document.getElementById('add-book-modal');
    if (addBookModal) {
        addBookModal.classList.remove('active');
        document.body.style.overflow = 'auto';
        
        // إعادة تعيين النموذج
        const adminBookForm = document.getElementById('admin-book-form');
        if (adminBookForm) {
            adminBookForm.reset();
        }
    }
}

// معالجة إضافة رواية من لوحة التحكم
function handleAdminAddBook(e) {
    e.preventDefault();
    
    const bookTitle = document.getElementById('admin-book-title').value.trim();
    const bookAuthor = document.getElementById('admin-book-author').value.trim();
    const bookDescription = document.getElementById('admin-book-description').value.trim();
    const bookCategory = document.getElementById('admin-book-category').value;
    const bookType = document.getElementById('admin-book-type').value;
    const bookStatus = document.getElementById('admin-book-status').value;
    const bookFile = document.getElementById('admin-book-file').files[0];
    const bookCover = document.getElementById('admin-book-cover').files[0];
    
    if (!bookTitle || !bookAuthor) {
        showAdminMessage('يرجى ملء الحقول المطلوبة', 'error');
        return;
    }
    
    if (!bookFile) {
        showAdminMessage('يرجى اختيار ملف الرواية', 'error');
        return;
    }
    
    // محاكاة إضافة الرواية (في التطبيق الحقيقي، سيتم رفع الملف للخادم)
    alert(`تم إضافة رواية "${bookTitle}" بنجاح!\n\nستظهر في الموقع بعد مراجعتها.`);
    
    // تسجيل نشاط إضافة الرواية
    logActivity('admin_add_book', bookTitle);
    
    // إغلاق النافذة وإعادة تعيين النموذج
    closeAddBookModal();
    e.target.reset();
    
    // تحديث الجدول (في التطبيق الحقيقي، سيتم إعادة تحميل البيانات)
    setTimeout(() => {
        addBookToTable({
            title: bookTitle,
            author: bookAuthor,
            category: bookCategory,
            type: bookType,
            status: bookStatus
        });
    }, 500);
}

// إضافة رواية إلى الجدول
function addBookToTable(bookData) {
    const tableBody = document.querySelector('.admin-table tbody');
    if (!tableBody) return;
    
    // إنشاء صف جديد
    const newRow = document.createElement('tr');
    
    // الحصول على رقم الصف التالي
    const rowCount = tableBody.querySelectorAll('tr').length + 1;
    
    // تحديد الحالة والنوع
    const statusClass = bookData.status === 'active' ? 'active' : 'pending';
    const statusText = bookData.status === 'active' ? 'نشط' : 'قيد المراجعة';
    const badgeClass = bookData.type === 'pdf' ? 'badge-pdf' : 'badge-text';
    const badgeText = bookData.type === 'pdf' ? 'PDF' : 'نص';
    
    // إعداد محتوى الصف
    newRow.innerHTML = `
        <td>${rowCount}</td>
        <td class="book-cell">
            <div class="book-avatar">
                <div class="avatar-placeholder">
                    <i class="fas fa-book"></i>
                </div>
            </div>
            <div class="book-details">
                <h4>${bookData.title}</h4>
                <p>${bookData.category === 'fantasy' ? 'فانتازيا' : bookData.category}</p>
            </div>
        </td>
        <td>${bookData.author}</td>
        <td><span class="badge ${badgeClass}">${badgeText}</span></td>
        <td>0</td>
        <td>
            <div class="rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <span>0.0</span>
            </div>
        </td>
        <td><span class="status ${statusClass}">${statusText}</span></td>
        <td>
            <div class="action-buttons">
                <button class="action-btn edit" title="تعديل">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="action-btn delete" title="حذف">
                    <i class="fas fa-trash"></i>
                </button>
                <button class="action-btn view" title="عرض">
                    <i class="fas fa-eye"></i>
                </button>
            </div>
        </td>
    `;
    
    // إضافة الصف في البداية
    tableBody.insertBefore(newRow, tableBody.firstChild);
    
    // إضافة أحداث للأزرار الجديدة
    const editBtn = newRow.querySelector('.action-btn.edit');
    const deleteBtn = newRow.querySelector('.action-btn.delete');
    const viewBtn = newRow.querySelector('.action-btn.view');
    
    if (editBtn) editBtn.addEventListener('click', function() { editBook(this); });
    if (deleteBtn) deleteBtn.addEventListener('click', function() { deleteBook(this); });
    if (viewBtn) viewBtn.addEventListener('click', function() { viewBook(this); });
    
    // تحديث العدد الإجمالي
    updateBookCount();
    
    // عرض رسالة نجاح
    showAdminMessage(`تم إضافة رواية "${bookData.title}" بنجاح`, 'success');
}

// تحديث عدد الروايات
function updateBookCount() {
    const bookCountElement = document.querySelector('.nav-item:nth-child(2) .nav-badge');
    const tableRows = document.querySelectorAll('.admin-table tbody tr').length;
    
    if (bookCountElement) {
        bookCountElement.textContent = tableRows;
    }
    
    // تحديث العداد في الإحصائيات
    const bookStat = document.querySelector('.stat-card:nth-child(1) .stat-number');
    if (bookStat) {
        bookStat.textContent = tableRows.toLocaleString('ar-EG');
    }
}

// تعديل رواية
function editBook(button) {
    const row = button.closest('tr');
    const title = row.querySelector('.book-details h4').textContent;
    const author = row.querySelector('td:nth-child(3)').textContent;
    
    // محاكاة التعديل (في التطبيق الحقيقي، ستفتح نافذة التعديل)
    alert(`سيتم فتح نافذة تعديل رواية "${title}"\n\nفي التطبيق الكامل، ستفتح نافذة التعديل مع تفاصيل الرواية.`);
    
    // تسجيل نشاط التعديل
    logActivity('admin_edit_book', title);
}

// حذف رواية
function deleteBook(button) {
    const row = button.closest('tr');
    const title = row.querySelector('.book-details h4').textContent;
    
    // طلب تأكيد
    if (confirm(`هل أنت متأكد من حذف رواية "${title}"؟`)) {
        // محاكاة الحذف (في التطبيق الحقيقي، سيتم إرسال طلب الحذف للخادم)
        row.style.animation = 'fadeOut 0.3s ease';
        
        setTimeout(() => {
            row.remove();
            
            // تحديث أرقام الصفوف
            updateRowNumbers();
            
            // تحديث عدد الروايات
            updateBookCount();
            
            // عرض رسالة نجاح
            showAdminMessage(`تم حذف رواية "${title}" بنجاح`, 'success');
            
            // تسجيل نشاط الحذف
            logActivity('admin_delete_book', title);
        }, 300);
    }
}

// عرض رواية
function viewBook(button) {
    const row = button.closest('tr');
    const title = row.querySelector('.book-details h4').textContent;
    
    // محاكاة العرض (في التطبيق الحقيقي، ستفتح صفحة الرواية)
    alert(`سيتم فتح صفحة رواية "${title}"\n\nفي التطبيق الكامل، ستفتح صفحة عرض كاملة للرواية.`);
    
    // تسجيل نشاط العرض
    logActivity('admin_view_book', title);
}

// الموافقة على رواية
function approveBook(button) {
    const row = button.closest('tr');
    const title = row.querySelector('.book-details h4').textContent;
    const statusElement = row.querySelector('.status');
    
    // محاكاة الموافقة (في التطبيق الحقيقي، سيتم إرسال طلب الموافقة للخادم)
    statusElement.textContent = 'نشط';
    statusElement.className = 'status active';
    
    // تغيير زر الموافقة إلى زر عرض
    const approveBtn = row.querySelector('.action-btn.approve');
    if (approveBtn) {
        approveBtn.innerHTML = '<i class="fas fa-eye"></i>';
        approveBtn.className = 'action-btn view';
        approveBtn.title = 'عرض';
        
        // إضافة حدث جديد
        approveBtn.addEventListener('click', function() { viewBook(this); });
    }
    
    // عرض رسالة نجاح
    showAdminMessage(`تمت الموافقة على رواية "${title}" بنجاح`, 'success');
    
    // تسجيل نشاط الموافقة
    logActivity('admin_approve_book', title);
}

// تحديث أرقام الصفوف
function updateRowNumbers() {
    const rows = document.querySelectorAll('.admin-table tbody tr');
    
    rows.forEach((row, index) => {
        const rowNumberCell = row.querySelector('td:first-child');
        if (rowNumberCell) {
            rowNumberCell.textContent = index + 1;
        }
    });
}

// فتح نافذة الإشعارات
function openNotificationsModal() {
    const notificationsModal = document.getElementById('notifications-modal');
    if (notificationsModal) {
        notificationsModal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // تحديث الإشعارات عند الفتح
        updateNotifications();
    }
}

// إغلاق نافذة الإشعارات
function closeNotificationsModal() {
    const notificationsModal = document.getElementById('notifications-modal');
    if (notificationsModal) {
        notificationsModal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

// تهيئة التصميم الداكن للوحة التحكم
function initializeAdminDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    
    if (themeToggle) {
        // التحقق من تفضيلات المستخدم
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const savedTheme = localStorage.getItem('sulafAdminTheme');
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDarkMode)) {
            enableAdminDarkMode();
        }
    }
}

// تبديل التصميم الداكن للوحة التحكم
function toggleAdminDarkMode() {
    const themeToggle = document.getElementById('theme-toggle');
    const isDarkMode = document.documentElement.hasAttribute('data-theme');
    
    if (isDarkMode) {
        disableAdminDarkMode();
    } else {
        enableAdminDarkMode();
    }
    
    // تحديث أيقونة الزر
    if (themeToggle) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            icon.className = isDarkMode ? 'fas fa-moon' : 'fas fa-sun';
        }
    }
}

// تفعيل التصميم الداكن للوحة التحكم
function enableAdminDarkMode() {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('sulafAdminTheme', 'dark');
}

// تعطيل التصميم الداكن للوحة التحكم
function disableAdminDarkMode() {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('sulafAdminTheme', 'light');
}

// تبديل الشريط الجانبي
function toggleSidebar() {
    const sidebar = document.querySelector('.admin-sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// تسجيل الخروج من لوحة التحكم
function adminLogout() {
    if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
        // في التطبيق الحقيقي، سيتم إرسال طلب تسجيل الخروج للخادم
        localStorage.removeItem('sulafUserLoggedIn');
        localStorage.removeItem('sulafUserName');
        
        // توجيه إلى صفحة تسجيل الدخول
        window.location.href = 'login.html';
    }
}

// عرض خيارات التصفية
function showFilterOptions() {
    // محاكاة عرض خيارات التصفية
    alert('ستفتح هنا قائمة خيارات التصفية حسب:\n- النوع\n- الحالة\n- التاريخ\n- التقييم\n\nفي التطبيق الكامل، ستظهر قائمة منسدلة بخيارات التصفية.');
}

// تنفيذ البحث في لوحة التحكم
function performAdminSearch() {
    const searchInput = document.querySelector('.admin-search input');
    const query = searchInput.value.trim();
    
    if (query) {
        // محاكاة البحث (في التطبيق الحقيقي، سيتم البحث في قاعدة البيانات)
        alert(`سيتم البحث عن: "${query}" في قاعدة البيانات\n\nفي التطبيق الكامل، ستظهر نتائج البحث في الجدول.`);
        
        // تسجيل نشاط البحث
        logActivity('admin_search', query);
        
        // مسح حقل البحث
        searchInput.value = '';
    } else {
        alert('يرجى إدخال نص للبحث');
    }
}

// معالجة الترقيم
function handlePagination(button) {
    const buttonText = button.textContent.trim();
    
    if (buttonText === '»' || buttonText === '«') {
        // الانتقال للصفحة التالية أو السابقة
        alert(`سيتم الانتقال إلى الصفحة ${buttonText === '»' ? 'السابقة' : 'التالي'}\n\nفي التطبيق الكامل، سيتم تحميل البيانات الخاصة بتلك الصفحة.`);
    } else {
        // الانتقال لصفحة محددة
        alert(`سيتم الانتقال إلى الصفحة ${buttonText}\n\nفي التطبيق الكامل، سيتم تحميل البيانات الخاصة بتلك الصفحة.`);
    }
    
    // تحديث أزرار الترقيم النشطة
    const pageButtons = document.querySelectorAll('.page-btn');
    pageButtons.forEach(btn => {
        btn.classList.remove('active');
    });
    
    button.classList.add('active');
}

// عرض رسالة في لوحة التحكم
function showAdminMessage(message, type) {
    // إزالة أي رسالة سابقة
    const existingMessage = document.querySelector('.admin-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // إنشاء عنصر الرسالة
    const messageElement = document.createElement('div');
    messageElement.className = `admin-message admin-message-${type}`;
    messageElement.textContent = message;
    
    // إضافة الأنماط
    messageElement.style.cssText = `
        position: fixed;
        top: 80px;
        left: 50%;
        transform: translateX(-50%);
        padding: 1rem 2rem;
        border-radius: var(--border-radius);
        font-weight: 600;
        text-align: center;
        z-index: 2000;
        animation: slideDown 0.3s ease, fadeOut 0.3s ease 2.7s;
        box-shadow: var(--box-shadow);
    `;
    
    if (type === 'success') {
        messageElement.style.backgroundColor = '#00b894';
        messageElement.style.color = 'white';
    } else {
        messageElement.style.backgroundColor = '#d63031';
        messageElement.style.color = 'white';
    }
    
    // إضافة الرسالة إلى الصفحة
    document.body.appendChild(messageElement);
    
    // إزالة الرسالة تلقائياً بعد 3 ثوانٍ
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.remove();
        }
    }, 3000);
}

// تهيئة التصميم المتجاوب للوحة التحكم
function initializeAdminResponsive() {
    // إضافة حدث لتغيير حجم النافذة
    window.addEventListener('resize', handleAdminResize);
    
    // معالجة أولية
    handleAdminResize();
}

// معالجة تغيير حجم النافذة للوحة التحكم
function handleAdminResize() {
    const sidebar = document.querySelector('.admin-sidebar');
    
    if (sidebar) {
        // إغلاق الشريط الجانبي على الشاشات الصغيرة
        if (window.innerWidth <= 992) {
            sidebar.classList.remove('active');
        } else {
            sidebar.classList.add('active');
        }
    }
}

// تسجيل النشاط (محاكاة)
function logActivity(type, details) {
    // في التطبيق الحقيقي، سيتم إرسال هذا للسيرفر
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] نشاط إداري: ${type} - ${details}`);
}

// تصدير الدوال للاستخدام في ملفات أخرى
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkAdminAccess,
        updateStats,
        showAdminMessage,
        adminLogout
    };
}
