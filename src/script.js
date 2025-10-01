// Основной скрипт для сайта
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 ALACRITY MAJESTIC RP загружен!');
    
    // Инициализация всех компонентов
    initScrollEffects();
    initModal();
    initFormValidation();
    initThemeToggle();
    initSmoothScrolling();
    initAnimations();
    initPhoneMask();
});

// Эффекты при скролле
function initScrollEffects() {
    const header = document.querySelector('.site-header');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Анимация появления элементов при скролле
        animateOnScroll();
    });
}

// Анимации при скролле
function animateOnScroll() {
    const animatedElements = document.querySelectorAll('.product-card, .sub-heading');
    
    animatedElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;
        
        if (elementTop < windowHeight - 100) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Инициализация начальных анимаций
function initAnimations() {
    const elements = document.querySelectorAll('.product-card, .sub-heading');
    
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    });
    
    // Запускаем первую проверку
    setTimeout(animateOnScroll, 100);
}

// Работа с модальным окном
function initModal() {
    const dialog = document.getElementById('contactDialog');
    const openButton = document.getElementById('openModal');
    const closeButton = document.getElementById('closeModal');
    const form = document.getElementById('contactForm');

    if (openButton && dialog) {
        openButton.addEventListener('click', () => {
            dialog.showModal();
            document.body.style.overflow = 'hidden';
        });
    }

    if (closeButton && dialog) {
        closeButton.addEventListener('click', () => {
            dialog.close();
            document.body.style.overflow = '';
        });
    }

    // Закрытие по клику вне модального окна
    if (dialog) {
        dialog.addEventListener('click', (e) => {
            const dialogDimensions = dialog.getBoundingClientRect();
            if (
                e.clientX < dialogDimensions.left ||
                e.clientX > dialogDimensions.right ||
                e.clientY < dialogDimensions.top ||
                e.clientY > dialogDimensions.bottom
            ) {
                dialog.close();
                document.body.style.overflow = '';
            }
        });
    }

    // Закрытие по ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dialog && dialog.open) {
            dialog.close();
            document.body.style.overflow = '';
        }
    });

    // Обработка отправки формы
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (validateForm(form)) {
                showSuccessMessage();
                form.reset();
                if (dialog) {
                    dialog.close();
                    document.body.style.overflow = '';
                }
            }
        });
    }
}

// Валидация формы
function initFormValidation() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const fields = [
        { id: 'name', validate: validateName },
        { id: 'email', validate: validateEmail },
        { id: 'phone', validate: validatePhone },
        { id: 'message', validate: validateMessage }
    ];

    fields.forEach(field => {
        const element = document.getElementById(field.id);
        if (element) {
            element.addEventListener('blur', () => {
                field.validate(element);
            });

            element.addEventListener('input', () => {
                clearError(element);
            });
        }
    });
}

function validateForm(form) {
    let isValid = true;
    
    const validations = [
        { element: document.getElementById('name'), validator: validateName },
        { element: document.getElementById('email'), validator: validateEmail },
        { element: document.getElementById('phone'), validator: validatePhone },
        { element: document.getElementById('message'), validator: validateMessage }
    ];

    validations.forEach(({ element, validator }) => {
        if (element && !validator(element)) {
            isValid = false;
        }
    });

    return isValid;
}

function validateName(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById('nameError');
    
    if (!value) {
        showError(input, errorElement, 'Имя обязательно для заполнения');
        return false;
    }
    
    if (value.length < 2) {
        showError(input, errorElement, 'Имя должно содержать минимум 2 символа');
        return false;
    }
    
    clearError(input);
    return true;
}

function validateEmail(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById('emailError');
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!value) {
        showError(input, errorElement, 'Email обязателен для заполнения');
        return false;
    }
    
    if (!emailRegex.test(value)) {
        showError(input, errorElement, 'Введите корректный email адрес');
        return false;
    }
    
    clearError(input);
    return true;
}

function validatePhone(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById('phoneError');
    
    if (!value && !input.hasAttribute('required')) {
        clearError(input);
        return true;
    }
    
    const phoneRegex = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    
    if (!phoneRegex.test(value)) {
        showError(input, errorElement, 'Введите телефон в формате: +7 (999) 123-45-67');
        return false;
    }
    
    clearError(input);
    return true;
}

function validateMessage(input) {
    const value = input.value.trim();
    const errorElement = document.getElementById('messageError');
    
    if (!value) {
        showError(input, errorElement, 'Сообщение обязательно для заполнения');
        return false;
    }
    
    if (value.length < 10) {
        showError(input, errorElement, 'Сообщение должно содержать минимум 10 символов');
        return false;
    }
    
    clearError(input);
    return true;
}

function showError(input, errorElement, message) {
    input.setAttribute('aria-invalid', 'true');
    if (errorElement) {
        errorElement.textContent = message;
    }
    input.classList.add('error');
    
    // Анимация ошибки
    input.style.animation = 'shake 0.5s ease-in-out';
    setTimeout(() => {
        input.style.animation = '';
    }, 500);
}

function clearError(input) {
    input.setAttribute('aria-invalid', 'false');
    const errorId = input.id + 'Error';
    const errorElement = document.getElementById(errorId);
    if (errorElement) {
        errorElement.textContent = '';
    }
    input.classList.remove('error');
}

function showSuccessMessage() {
    const successMessage = document.createElement('div');
    successMessage.className = 'product-card highlight';
    successMessage.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 1000;
        padding: var(--space-4);
        background: var(--gradient-primary);
        color: white;
        border-radius: var(--radius-xl);
        box-shadow: var(--shadow-2xl);
        max-width: 350px;
        animation: slideInRight 0.5s ease-out;
    `;
    successMessage.innerHTML = `
        <div class="product-card__title" style="color: white;">🎉 Успешно!</div>
        <p class="text-paragraph" style="color: rgba(255,255,255,0.9); margin: 0;">
            Ваше сообщение отправлено. Мы свяжемся с вами в ближайшее время!
        </p>
    `;
    
    document.body.appendChild(successMessage);
    
    setTimeout(() => {
        successMessage.style.animation = 'slideOutRight 0.5s ease-in forwards';
        setTimeout(() => {
            successMessage.remove();
        }, 500);
    }, 5000);
}

// Переключение темы
function initThemeToggle() {
    let themeToggle = document.querySelector('.theme-toggle');
    
    if (!themeToggle) {
        themeToggle = document.createElement('button');
        themeToggle.className = 'button theme-toggle';
        themeToggle.innerHTML = '🌓';
        themeToggle.title = 'Переключить тему';
        themeToggle.setAttribute('aria-label', 'Переключить тему');
        
        themeToggle.addEventListener('click', toggleTheme);
        document.body.appendChild(themeToggle);
    } else {
        themeToggle.addEventListener('click', toggleTheme);
    }

    // Проверяем сохраненную тему или системные настройки
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
        document.body.classList.add('theme-dark');
        themeToggle.innerHTML = '☀️';
    }
}

function toggleTheme() {
    const isDark = document.body.classList.toggle('theme-dark');
    const themeToggle = document.querySelector('.theme-toggle');
    
    themeToggle.innerHTML = isDark ? '☀️' : '🌙';
    themeToggle.style.animation = 'rotate 0.6s ease-in-out';
    
    setTimeout(() => {
        themeToggle.style.animation = '';
    }, 600);
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Плавная прокрутка
function initSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href !== '') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    const headerHeight = document.querySelector('.site-header').offsetHeight;
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

// Маска для телефона
function initPhoneMask() {
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Убираем первую 7 или 8
            if (value.startsWith('7') || value.startsWith('8')) {
                value = value.substring(1);
            }
            
            // Форматируем номер
            let formattedValue = '+7 (';
            
            if (value.length > 0) {
                formattedValue += value.substring(0, 3);
            }
            if (value.length > 3) {
                formattedValue += ') ' + value.substring(3, 6);
            }
            if (value.length > 6) {
                formattedValue += '-' + value.substring(6, 8);
            }
            if (value.length > 8) {
                formattedValue += '-' + value.substring(8, 10);
            }
            
            e.target.value = formattedValue;
        });

        // Валидация при потере фокуса
        phoneInput.addEventListener('blur', function() {
            if (this.value && this.value.length < 18) {
                this.setCustomValidity('Введите полный номер телефона');
            } else {
                this.setCustomValidity('');
            }
        });
    }
}

// Добавляем CSS анимации
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
    
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
    
    @keyframes rotate {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }
    
    .error {
        border-color: #ef4444 !important;
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
    }
`;
document.head.appendChild(style);

// Обработка изображений
function preloadImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        if (img.complete) {
            img.classList.add('loaded');
        } else {
            img.addEventListener('load', function() {
                this.classList.add('loaded');
            });
        }
    });
}

// Инициализация при полной загрузке
window.addEventListener('load', function() {
    preloadImages();
    console.log('✨ Сайт полностью загружен!');
});