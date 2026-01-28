// المساعد الذكي لـ sulaf.pdf - الإصدار الكامل
class AIAssistant {
    constructor() {
        this.conversationHistory = [];
        this.isGenerating = false;
        this.userProgress = {
            dailyWords: 0,
            weeklyGoals: {},
            achievements: []
        };
        this.init();
    }

    async init() {
        // تحميل محادثات سابقة
        const savedHistory = localStorage.getItem('ai_conversation_history');
        if (savedHistory) {
            this.conversationHistory = JSON.parse(savedHistory);
        }
        
        // تحميل تقدم المستخدم
        const savedProgress = localStorage.getItem('ai_user_progress');
        if (savedProgress) {
            this.userProgress = JSON.parse(savedProgress);
        }
        
        console.log('🤖 المساعد الذكي جاهز للعمل');
    }

    saveConversationHistory() {
        localStorage.setItem('ai_conversation_history', JSON.stringify(this.conversationHistory));
    }

    saveUserProgress() {
        localStorage.setItem('ai_user_progress', JSON.stringify(this.userProgress));
    }

    async sendMessage(message, context = {}) {
        if (this.isGenerating) {
            return { error: 'جاري معالجة طلب سابق، يرجى الانتظار' };
        }

        this.isGenerating = true;

        try {
            // إضافة رسالة المستخدم إلى السجل
            const userMessage = {
                role: 'user',
                content: message,
                timestamp: new Date().toISOString(),
                context: context
            };
            this.conversationHistory.push(userMessage);

            // التحقق من نوع الطلب
            const response = await this.processMessage(message, context);
            
            // إضافة رد المساعد إلى السجل
            const assistantMessage = {
                role: 'assistant',
                content: response.content,
                type: response.type,
                timestamp: new Date().toISOString(),
                metadata: response.metadata || {}
            };
            this.conversationHistory.push(assistantMessage);

            // تحديث التقدم
            this.updateUserProgress(message, response.type);

            // حفظ السجل
            this.saveConversationHistory();
            this.saveUserProgress();

            this.isGenerating = false;
            return response;

        } catch (error) {
            console.error('خطأ في المساعد الذكي:', error);
            this.isGenerating = false;
            
            return {
                content: 'عذراً، حدث خطأ في المعالجة. يرجى المحاولة مرة أخرى.<br><br><em>يمكنك المحاولة مرة أخرى أو استخدام إحدى الميزات الأخرى:</em>',
                type: 'error',
                suggestions: [
                    'اقتراح فكرة رواية جديدة',
                    'تطوير شخصية',
                    'نصائح للكتابة',
                    'توصيات قراءة'
                ]
            };
        }
    }

    async processMessage(message, context) {
        // تحليل النص لفهم النية
        const intent = this.analyzeIntent(message);
        
        switch (intent.type) {
            case 'greeting':
                return this.handleGreeting();
            
            case 'novel_idea':
                return await this.generateNovelIdea(message, context);
            
            case 'character_development':
                return await this.developCharacter(message, context);
            
            case 'plot_suggestion':
                return await this.suggestPlot(message, context);
            
            case 'writing_help':
                return await this.helpWithWriting(message, context);
            
            case 'world_building':
                return await this.buildWorld(message, context);
            
            case 'novel_recommendation':
                return await this.recommendNovels(message, context);
            
            case 'writing_tips':
                return await this.provideWritingTips(message, context);
            
            case 'creative_writing':
                return await this.generateCreativeContent(message, context);
            
            case 'editing_help':
                return await this.helpWithEditing(message, context);
            
            case 'motivation':
                return await this.provideMotivation(message, context);
            
            case 'progress_tracking':
                return await this.showProgress(message, context);
            
            case 'export_content':
                return await this.exportContent(message, context);
            
            case 'feedback':
                return await this.provideFeedback(message, context);
            
            default:
                return await this.generalResponse(message, context);
        }
    }

    analyzeIntent(message) {
        const lowerMessage = message.toLowerCase();
        
        // التحيات
        if (/(مرحبا|اهلا|سلام|السلام عليكم|اهلا وسهلا|صباح الخير|مساء الخير)/.test(lowerMessage)) {
            return { type: 'greeting' };
        }
        
        // أفكار روايات
        if (/(اقترح|افكار|فكرة|رواية جديد|ابدأ رواية|اريد كتابة|عندي فكرة)/.test(lowerMessage)) {
            return { type: 'novel_idea' };
        }
        
        // تطوير شخصيات
        if (/(شخصية|بط|شخصيات|شخصية بط|تطوير شخصية|شخصيتي|بناء شخصية)/.test(lowerMessage)) {
            return { type: 'character_development' };
        }
        
        // اقتراح حبكة
        if (/(حبكة|قصة|احداث|سرد|سير احداث|تطور القصة|نهاية)/.test(lowerMessage)) {
            return { type: 'plot_suggestion' };
        }
        
        // مساعدة في الكتابة
        if (/(اكتب|كيف اكتب|مساعده في الكتابه|كتابة|صعوبة في|مشكلة في الكتابة)/.test(lowerMessage)) {
            return { type: 'writing_help' };
        }
        
        // بناء العالم
        if (/(عالم|عالم خيالي|بناء عالم|مملكة|مدينة|قرية|مكان)/.test(lowerMessage)) {
            return { type: 'world_building' };
        }
        
        // توصية روايات
        if (/(اقترح رواية|روايات|اقرأ|تنصح|توصية|اريد اقرأ|مش عارف اقرأ ايه)/.test(lowerMessage)) {
            return { type: 'novel_recommendation' };
        }
        
        // نصائح كتابية
        if (/(نصائح|نصيحه|تلميح|كيف اتحسن|تطوير|تحسين|اسلوب)/.test(lowerMessage)) {
            return { type: 'writing_tips' };
        }
        
        // كتابة إبداعية
        if (/(مشهد|اكتب لي|ابدأ|افتتاحي|مقدمة|مشهد معركة|حوار|وصف)/.test(lowerMessage)) {
            return { type: 'creative_writing' };
        }
        
        // تحرير وتعديل
        if (/(تحرير|تعديل|تصحيح|مراجعة|تدقيق|نقد|تقيم)/.test(lowerMessage)) {
            return { type: 'editing_help' };
        }
        
        // تحفيز
        if (/(تحفيز|تشجيع|كمل|ملل|تعب|احباط|فقدت الامل)/.test(lowerMessage)) {
            return { type: 'motivation' };
        }
        
        // تتبع التقدم
        if (/(تقدمي|كم كتبت|انجازات|اهداف|تتبع|احصائيات)/.test(lowerMessage)) {
            return { type: 'progress_tracking' };
        }
        
        // تصدير المحتوى
        if (/(حفظ|تصدير|PDF|ملف|طباعة|نسخ|انشاء ملف)/.test(lowerMessage)) {
            return { type: 'export_content' };
        }
        
        // ملاحظات وتقييم
        if (/(رأيك|تقييمك|ملاحظات|نقد بناء|تقييم)/.test(lowerMessage)) {
            return { type: 'feedback' };
        }
        
        return { type: 'general' };
    }

    handleGreeting() {
        const greetings = [
            "مرحباً! أنا مساعدك الذكي في كتابة الروايات. كيف يمكنني مساعدتك اليوم؟",
            "أهلاً وسهلاً بك! مستعد لمساعدتك في رحلتك الكتابية. ما الذي تود أن تتحدث عنه؟",
            "سلامٌ عليكم! أنا هنا لأقدم لك الدعم والإلهام في كتابة رواياتك الفانتازيا.",
            "مرحباً بك في عالم الكتابة الإبداعية! أنا مساعدك الخاص، كيف يمكنني خدمتك؟",
            "أهلًا بك مجددًا! سعيد برؤيتك. هل تود الاستمرار من حيث توقفنا أم تبدأ بشيء جديد؟"
        ];
        
        const quickActions = [
            { icon: "💡", text: "اقتراح فكرة رواية", action: "novel_idea" },
            { icon: "🎭", text: "تطوير شخصية", action: "character_development" },
            { icon: "✍️", text: "مساعدة في الكتابة", action: "writing_help" },
            { icon: "📚", text: "توصيات قراءة", action: "novel_recommendation" },
            { icon: "🎯", text: "تتبع تقدمي", action: "progress_tracking" },
            { icon: "💪", text: "تحفيز وإلهام", action: "motivation" }
        ];
        
        const randomGreeting = greetings[Math.floor(Math.random() * greetings.length)];
        
        const response = `
            <div class="ai-greeting">
                <h4>${randomGreeting}</h4>
                
                <div class="quick-actions-grid">
                    ${quickActions.map(action => `
                        <button class="quick-action-btn" data-action="${action.action}">
                            <span class="action-icon">${action.icon}</span>
                            <span class="action-text">${action.text}</span>
                        </button>
                    `).join('')}
                </div>
                
                <div class="recent-conversations">
                    <h5>🔄 محادثات سريعة:</h5>
                    <div class="recent-list" id="recentConversationsList">
                        ${this.getRecentConversations()}
                    </div>
                </div>
                
                <div class="daily-tip">
                    <h5>💡 نصيحة اليوم:</h5>
                    <p>${this.getDailyTip()}</p>
                </div>
            </div>
        `;
        
        return {
            content: response,
            type: 'greeting',
            metadata: { quickActions }
        };
    }

    async generateNovelIdea(message, context) {
        // تحليل النص لفهم نوع الفكرة المطلوبة
        const themes = this.extractThemes(message);
        
        // قوالب لأفكار روايات
        const novelTemplates = [
            {
                title: "حارس النسيان",
                concept: "في عالم حيث الذكريات سلعة ثمينة، يكتشف حارس أرشيف الذكريات أن ذاكرته الخاصة قد تم التلاعب بها. يبدأ رحلة لاستعادة ماضيه الحقيقي ويكتشف مؤامرة تهدد بمسح ذاكرة البشرية جمعاء.",
                elements: ["ذاكرة", "أرشيف سري", "تلاعب", "هوية", "مؤامرة", "استكشاف الذات"],
                genre: "فانتازيا نفسية",
                targetAudience: "الشباب والكبار",
                wordCount: "80-100 ألف كلمة",
                conflict: "صراع داخلي بين الهوية الحقيقية والهوية المصنوعة"
            },
            {
                title: "أميرة الظل",
                concept: "أميرة شابة تملك قدرة على التحكم بالظلال، تُجبر على الفرار من مملكتها عندما تكتشف أن والدها الملك يحاول سرقة قواها. في رحلتها، تكتشف تاريخاً مظلماً لمملكتها وتواجه خياراً صعباً بين العودة للعرش أو خلق مملكة جديدة.",
                elements: ["ظلال", "هروب", "خيانة", "قدرات خارقة", "صراع داخلي", "استقلال"],
                genre: "فانتازيا مظلمة",
                targetAudience: "الشباب",
                wordCount: "70-90 ألف كلمة",
                conflict: "صراع بين الولاء للعائلة والولاء للذات"
            },
            {
                title: "سفينة الأحلام",
                concept: "في عالم حيث الأحلام تصبح حقيقة، يبحر صياد أحلام شاب على سفينة قادرة على الإبحار بين أحلام البشر. عندما تبدأ أحلام الكوابيس في الغزو، يجب أن يجمع فريقاً من صيادي الأحلام لإنقاذ الواقع من الانهيار.",
                elements: ["أحلام", "إبحار", "فريق", "كوابيس", "إنقاذ العالم", "تعاون"],
                genre: "فانتازيا مغامرات",
                targetAudience: "جميع الأعمار",
                wordCount: "90-110 ألف كلمة",
                conflict: "صراع بين الخير والشر في عالم الأحلام"
            },
            {
                title: "وريث العناصر",
                concept: "فتاة من قرية صغيرة تكتشف أنها الوريثة الأخيرة لقوى العناصر الأربعة. بينما تحاول إتقان قواها، تكتشف أن عائلتها قد أخفت عنها سراً كبيراً عن أصلها الحقيقي ودورها في حرب قديمة.",
                elements: ["عناصر", "وراثة", "أسرار عائلية", "تدريب", "مصير", "تقبل الذات"],
                genre: "فانتازيا ملحمية",
                targetAudience: "الشباب",
                wordCount: "100-120 ألف كلمة",
                conflict: "صراع بين المصير المفروض والاختيار الشخصي"
            },
            {
                title: "ساعة الساحر",
                concept: "ساحر شاب يكتشف ساعة سحرية يمكنها إبطاء الوقت، ولكن كل استخدام لها يكلفه ذاكرة من ماضيه. عليه أن يوازن بين استخدام قوته لمساعدة الآخرين والمحافظة على هويته.",
                elements: ["وقت", "ذاكرة", "تضحية", "سحر", "أخلاقيات", "توازن"],
                genre: "فانتازيا أخلاقية",
                targetAudience: "الكبار",
                wordCount: "60-80 ألف كلمة",
                conflict: "صراع بين الرغبة في المساعدة والخوف من فقدان الهوية"
            }
        ];
        
        // اختيار قالب مناسب بناءً على الموضوعات المستخرجة
        let selectedTemplate;
        if (themes.length > 0) {
            selectedTemplate = novelTemplates.find(template => 
                template.elements.some(element => 
                    themes.some(theme => element.includes(theme))
                )
            ) || novelTemplates[Math.floor(Math.random() * novelTemplates.length)];
        } else {
            selectedTemplate = novelTemplates[Math.floor(Math.random() * novelTemplates.length)];
        }
        
        const response = `
            <div class="novel-idea-card">
                <div class="idea-header">
                    <h4>🎨 فكرة رواية: <strong>${selectedTemplate.title}</strong></h4>
                    <div class="idea-meta">
                        <span class="badge genre">${selectedTemplate.genre}</span>
                        <span class="badge audience">${selectedTemplate.targetAudience}</span>
                        <span class="badge length">${selectedTemplate.wordCount}</span>
                    </div>
                </div>
                
                <div class="idea-content">
                    <div class="concept-section">
                        <h5>💡 الفكرة الأساسية:</h5>
                        <p>${selectedTemplate.concept}</p>
                    </div>
                    
                    <div class="elements-section">
                        <h5>🧩 العناصر الرئيسية:</h5>
                        <div class="elements-grid">
                            ${selectedTemplate.elements.map(el => `
                                <span class="element-tag">${el}</span>
                            `).join('')}
                        </div>
                    </div>
                    
                    <div class="conflict-section">
                        <h5>⚡ الصراع المركزي:</h5>
                        <p>${selectedTemplate.conflict}</p>
                    </div>
                </div>
                
                <div class="idea-prompts">
                    <h5>💡 أفكار للبدء:</h5>
                    <div class="prompts-grid">
                        <div class="prompt-card">
                            <h6>مشهد افتتاحي</h6>
                            <p>اكتب المشهد الذي يكتشف فيه البطل/البطلة قدرته/قدرتها لأول مرة</p>
                            <button class="btn-small" onclick="startSceneWriting('${selectedTemplate.title}')">
                                <i class="fas fa-pen"></i> ابدأ
                            </button>
                        </div>
                        
                        <div class="prompt-card">
                            <h6>تطوير الشخصية</h6>
                            <p>أنشئ ملفاً تعريفياً للشخصية الرئيسية مع خلفيتها ودوافعها</p>
                            <button class="btn-small" onclick="startCharacterDevelopment('${selectedTemplate.title}')">
                                <i class="fas fa-user"></i> ابدأ
                            </button>
                        </div>
                        
                        <div class="prompt-card">
                            <h6>بناء العالم</h6>
                            <p>صِف مكاناً رئيسياً في عالم الرواية باستخدام الحواس الخمس</p>
                            <button class="btn-small" onclick="startWorldBuilding('${selectedTemplate.title}')">
                                <i class="fas fa-globe"></i> ابدأ
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="idea-actions">
                    <button class="btn-primary" onclick="saveNovelIdea('${selectedTemplate.title}')">
                        <i class="fas fa-save"></i> حفظ الفكرة
                    </button>
                    <button class="btn-outline" onclick="modifyNovelIdea('${selectedTemplate.title}')">
                        <i class="fas fa-edit"></i> تعديل الفكرة
                    </button>
                    <button class="btn-outline" onclick="generateAnotherIdea()">
                        <i class="fas fa-redo"></i> فكرة أخرى
                    </button>
                </div>
                
                <div class="idea-timeline">
                    <h5>📅 جدول زمني مقترح:</h5>
                    <div class="timeline">
                        <div class="timeline-item">
                            <span class="timeline-week">الأسبوع 1-2</span>
                            <span class="timeline-task">التخطيط والبحث</span>
                        </div>
                        <div class="timeline-item">
                            <span class="timeline-week">الأسبوع 3-8</span>
                            <span class="timeline-task">كتابة المسودة الأولى</span>
                        </div>
                        <div class="timeline-item">
                            <span class="timeline-week">الأسبوع 9-10</span>
                            <span class="timeline-task">المراجعة والتحرير</span>
                        </div>
                        <div class="timeline-item">
                            <span class="timeline-week">الأسبوع 11-12</span>
                            <span class="timeline-task">التصحيح النهائي</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        return {
            content: response,
            type: 'novel_idea',
            metadata: {
                template: selectedTemplate,
                themes: themes
            }
        };
    }

    async developCharacter(message, context) {
        // استخراج نوع الشخصية المطلوبة
        const characterTypes = {
            hero: ["بطل", "بطلة", "رئيسي", "أساسي", "محوري"],
            sidekick: ["مساعد", "صديق", "رفيق", "داعم"],
            villain: ["شرير", "خصم", "عدو", "أنتاغونست"],
            mentor: ["مرشد", "معلم", "حكيم", "خبير"],
            love_interest: ["حبيب", "حبيبة", "رومانسي", "علاقة حب"]
        };
        
        let requestedType = 'hero';
        for (const [type, keywords] of Object.entries(characterTypes)) {
            if (keywords.some(keyword => message.includes(keyword))) {
                requestedType = type;
                break;
            }
        }
        
        const characterTemplates = {
            hero: {
                name: "كايلان",
                type: "البطل/البطلة",
                description: "الشخصية الرئيسية التي تقود القصة، تتطور وتتغير عبر الأحداث",
                questions: [
                    "ما هو الاسم؟ ولماذا اختيار هذا الاسم؟",
                    "كم العمر؟ وما هي المرحلة العمرية؟",
                    "ما هي الصفات الجسدية المميزة؟",
                    "ما هي نقاط القوة الأساسية؟",
                    "ما هي نقاط الضعف والعيوب؟",
                    "ما هو الدافع الرئيسي في القصة؟",
                    "ما هو أكبر خوف أو هاجس؟",
                    "ما هي القيم والمعتقدات الأساسية؟",
                    "ما هي العلاقات المهمة مع الآخرين؟",
                    "كيف ستتغير الشخصية بنهاية القصة؟"
                ],
                archetypes: ["البطل الكلاسيكي", "البطل المضطرب", "البطل العادي", "البطل المضحك"],
                developmentArc: ["الرحلة", "التحدي", "التحول", "العودة"]
            },
            sidekick: {
                name: "ساري",
                type: "الصديق/المساعد",
                description: "الشخصية الداعمة التي تساعد البطل وتقدم الدعم العاطفي",
                questions: [
                    "كيف التقي بالبطل؟",
                    "ما هي العلاقة بينهما؟",
                    "كيف يساعد البطل؟",
                    "ما هي مهاراته الخاصة؟",
                    "هل لديه أجندة خفية؟",
                    "ما الذي يربطه بالبطل حقاً؟",
                    "كيف يتطور عبر القصة؟",
                    "هل سيبقى مخلصاً حتى النهاية؟"
                ]
            },
            villain: {
                name: "مالاكار",
                type: "الخصم/الشرير",
                description: "الشخصية المعارضة التي تخلق الصراع والتحدي للبطل",
                questions: [
                    "لماذا هو/هي شرير؟",
                    "ما هي أهدافه/ها الحقيقية؟",
                    "ما هي قواه/قواها ومهاراته/ها؟",
                    "هل لديه/لديها ماضي مأساوي؟",
                    "ما هي نقاط ضعفه/ها؟",
                    "هل يمكن إنقاذه/إنقاذها؟",
                    "كيف يرى/ترى نفسه/نفسها؟",
                    "هل لديه/لديها مبادئ أو قيم؟"
                ]
            }
        };
        
        const template = characterTemplates[requestedType] || characterTemplates.hero;
        
        const response = `
            <div class="character-development">
                <div class="character-header">
                    <h4>🎭 تطوير شخصية: <strong>${template.type}</strong></h4>
                    <div class="character-archetypes">
                        ${template.archetypes ? template.archetypes.map(arch => `
                            <span class="archetype-tag">${arch}</span>
                        `).join('') : ''}
                    </div>
                </div>
                
                <div class="character-description">
                    <p>${template.description}</p>
                </div>
                
                <div class="character-form">
                    <h5>📝 معلومات الشخصية:</h5>
                    <div class="form-grid">
                        <div class="form-group">
                            <label for="charName"><i class="fas fa-signature"></i> الاسم</label>
                            <input type="text" id="charName" value="${template.name}" placeholder="اسم الشخصية">
                        </div>
                        
                        <div class="form-group">
                            <label for="charAge"><i class="fas fa-birthday-cake"></i> العمر</label>
                            <input type="number" id="charAge" placeholder="عمر الشخصية">
                        </div>
                        
                        <div class="form-group">
                            <label for="charRole"><i class="fas fa-user-tag"></i> الدور</label>
                            <input type="text" id="charRole" value="${template.type}" readonly>
                        </div>
                        
                        <div class="form-group full-width">
                            <label for="charAppearance"><i class="fas fa-eye"></i> المظهر</label>
                            <textarea id="charAppearance" rows="2" placeholder="صِف المظهر الجسدي..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="charStrengths"><i class="fas fa-shield-alt"></i> نقاط القوة</label>
                            <textarea id="charStrengths" rows="3" placeholder="المهارات، القدرات، الصفات الإيجابية..."></textarea>
                        </div>
                        
                        <div class="form-group">
                            <label for="charWeaknesses"><i class="fas fa-exclamation-triangle"></i> نقاط الضعف</label>
                            <textarea id="charWeaknesses" rows="3" placeholder="المخاوف، العيوب، الصفات السلبية..."></textarea>
                        </div>
                        
                        <div class="form-group full-width">
                            <label for="charBackground"><i class="fas fa-history"></i> الخلفية</label>
                            <textarea id="charBackground" rows="4" placeholder="الماضي، العائلة، التجارب المؤثرة..."></textarea>
                        </div>
                        
                        <div class="form-group full-width">
                            <label for="charMotivation"><i class="fas fa-bullseye"></i> الدوافع والأهداف</label>
                            <textarea id="charMotivation" rows="3" placeholder="ما الذي يدفع الشخصية؟ ماذا تريد؟"></textarea>
                        </div>
                    </div>
                </div>
                
                <div class="character-questions">
                    <h5>❓ أسئلة للتطوير العميق:</h5>
                    <div class="questions-list">
                        ${template.questions.map((q, i) => `
                            <div class="question-item">
                                <span class="question-number">${i + 1}</span>
                                <span class="question-text">${q}</span>
                                <textarea class="question-answer" placeholder="أجب هنا..." rows="2"></textarea>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                ${template.developmentArc ? `
                <div class="character-arc">
                    <h5>📈 مسار تطور الشخصية:</h5>
                    <div class="arc-timeline">
                        ${template.developmentArc.map((stage, i) => `
                            <div class="arc-stage">
                                <div class="stage-number">${i + 1}</div>
                                <div class="stage-content">
                                    <h6>${stage}</h6>
                                    <textarea class="stage-description" placeholder="كيف تظهر هذه المرحلة في القصة؟" rows="2"></textarea>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                ` : ''}
                
                <div class="character-relationships">
                    <h5>🤝 العلاقات مع الشخصيات الأخرى:</h5>
                    <div class="relationships-grid">
                        <div class="relationship-card">
                            <h6>مع البطل</h6>
                            <textarea placeholder="طبيعة العلاقة، كيف التقيا، التطور..." rows="3"></textarea>
                        </div>
                        <div class="relationship-card">
                            <h6>مع العائلة</h6>
                            <textarea placeholder="العلاقات العائلية، التأثير، الصراعات..." rows="3"></textarea>
                        </div>
                        <div class="relationship-card">
                            <h6>مع الأصدقاء</h6>
                            <textarea placeholder
