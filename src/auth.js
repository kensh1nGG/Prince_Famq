// Полная система авторизации и управления контентом
class AuthSystem {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.posts = JSON.parse(localStorage.getItem('posts')) || [];
        
        this.init();
    }

    init() {
        this.initializeDefaultData();
        this.updateUI();
        this.loadUsers();
        this.loadPosts();
        this.displayPosts();
        this.updateStats();
    }

    // Инициализация тестовых данных
    initializeDefaultData() {
        let needSave = false;

        if (this.users.length === 0) {
            // Создаем администратора
            this.users.push({
                id: 1,
                username: 'admin',
                email: 'admin@alacrity-rp.ru',
                password: 'admin123',
                role: 'admin',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });

            // Создаем обычного пользователя
            this.users.push({
                id: 2,
                username: 'user',
                email: 'user@example.com',
                password: 'user123',
                role: 'user',
                createdAt: new Date().toISOString(),
                lastLogin: new Date().toISOString()
            });

            needSave = true;
        }

        if (this.posts.length === 0) {
            // Создаем тестовые посты
            this.posts.push({
                id: 1,
                title: 'Добро пожаловать в ALACRITY RP! 🎉',
                content: 'Мы рады приветствовать вас в нашей семье! Здесь вы найдете дружное сообщество, интересные ивенты и круглосуточную поддержку. Присоединяйтесь к нам и станьте частью самой перспективной семьи на сервере Phoenix RP!',
                category: 'news',
                imageUrl: '',
                author: 'admin',
                authorId: 1,
                createdAt: new Date().toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                likes: 15,
                comments: []
            });

            this.posts.push({
                id: 2,
                title: '🎮 Грядущий ивент: Битва кланов',
                content: 'Приготовьтесь к эпическому сражению! В эту субботу состоится масштабный ивент "Битва кланов" с ценными призами и уникальными наградами. Не пропустите!',
                category: 'events',
                imageUrl: '',
                author: 'admin',
                authorId: 1,
                createdAt: new Date(Date.now() - 86400000).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                likes: 8,
                comments: []
            });

            this.posts.push({
                id: 3,
                title: '📚 Гайд для новичков',
                content: 'Новые участники! Ознакомьтесь с нашим руководством для начинающих. Узнайте о правилах сервера, основах RolePlay и как быстро влиться в наше сообщество.',
                category: 'guides',
                imageUrl: '',
                author: 'admin',
                authorId: 1,
                createdAt: new Date(Date.now() - 172800000).toLocaleDateString('ru-RU', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                }),
                likes: 12,
                comments: []
            });

            needSave = true;
        }

        if (needSave) {
            this.saveUsers();
            this.savePosts();
        }
    }

    // Регистрация
    register(username, email, password) {
        // Простая валидация
        if (username.length < 3) {
            this.showNotification('Логин должен содержать минимум 3 символа!', 'error');
            return false;
        }

        if (password.length < 6) {
            this.showNotification('Пароль должен содержать минимум 6 символов!', 'error');
            return false;
        }

        if (this.users.find(user => user.username === username)) {
            this.showNotification('Пользователь с таким логином уже существует!', 'error');
            return false;
        }

        if (this.users.find(user => user.email === email)) {
            this.showNotification('Пользователь с таким email уже существует!', 'error');
            return false;
        }

        const user = {
            id: Date.now(),
            username,
            email,
            password,
            role: 'user',
            createdAt: new Date().toISOString(),
            lastLogin: null
        };

        this.users.push(user);
        this.saveUsers();
        
        this.showNotification('Регистрация успешна! Теперь вы можете войти.', 'success');
        this.showTab('login');
        return true;
    }

    // Вход
    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        
        if (user) {
            user.lastLogin = new Date().toISOString();
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            this.saveUsers();
            this.updateUI();
            this.showNotification(`Добро пожаловать, ${user.username}!`, 'success');
            return true;
        } else {
            this.showNotification('Неверный логин или пароль!', 'error');
            return false;
        }
    }

    // Выход
    logout() {
        this.showNotification(`До свидания, ${this.currentUser.username}!`, 'info');
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.updateUI();
    }

    // Сохранение пользователей
    saveUsers() {
        localStorage.setItem('users', JSON.stringify(this.users));
        this.updateStats();
    }

    // Загрузка пользователей
    loadUsers() {
        const savedUsers = localStorage.getItem('users');
        if (savedUsers) {
            this.users = JSON.parse(savedUsers);
        }
    }

    // Загрузка постов
    loadPosts() {
        const savedPosts = localStorage.getItem('posts');
        if (savedPosts) {
            this.posts = JSON.parse(savedPosts);
        }
    }

    // Сохранение постов
    savePosts() {
        localStorage.setItem('posts', JSON.stringify(this.posts));
        this.updateStats();
    }

    // Добавление поста
    addPost(title, content, category, imageUrl = '') {
        if (!this.currentUser) {
            this.showNotification('Необходимо войти в систему!', 'error');
            return false;
        }

        if (this.currentUser.role !== 'admin') {
            this.showNotification('Только администраторы могут публиковать посты!', 'error');
            return false;
        }

        // Простая валидация
        if (title.trim().length === 0) {
            this.showNotification('Заголовок не может быть пустым!', 'error');
            return false;
        }

        if (content.trim().length === 0) {
            this.showNotification('Содержание поста не может быть пустым!', 'error');
            return false;
        }

        const post = {
            id: Date.now(),
            title: title.trim(),
            content: content.trim(),
            category,
            imageUrl: imageUrl.trim(),
            author: this.currentUser.username,
            authorId: this.currentUser.id,
            createdAt: new Date().toLocaleDateString('ru-RU', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            }),
            likes: 0,
            comments: []
        };

        this.posts.unshift(post);
        this.savePosts();
        this.displayPosts();
        this.displayAdminPosts();
        
        this.showNotification('Пост успешно опубликован!', 'success');
        return true;
    }

    // Удаление поста
    deletePost(postId) {
        if (!this.currentUser) {
            this.showNotification('Необходимо войти в систему!', 'error');
            return;
        }

        const post = this.posts.find(p => p.id === postId);
        if (!post) return;

        // Проверяем права: автор или администратор
        if (post.authorId !== this.currentUser.id && this.currentUser.role !== 'admin') {
            this.showNotification('Вы можете удалять только свои посты!', 'error');
            return;
        }

        if (confirm('Вы уверены, что хотите удалить этот пост?')) {
            this.posts = this.posts.filter(p => p.id !== postId);
            this.savePosts();
            this.displayPosts();
            this.displayAdminPosts();
            this.showNotification('Пост удален!', 'success');
        }
    }

    // Лайк поста
    likePost(postId) {
        if (!this.currentUser) {
            this.showNotification('Необходимо войти в систему!', 'error');
            return;
        }

        const post = this.posts.find(p => p.id === postId);
        if (post) {
            post.likes++;
            this.savePosts();
            this.displayPosts();
            this.showNotification('Лайк добавлен!', 'success');
        }
    }

    // Отображение постов на главной странице
    displayPosts() {
        const postsList = document.getElementById('postsList');
        if (!postsList) return;

        console.log('Отображение постов. Всего постов:', this.posts.length);
        
        if (this.posts.length === 0) {
            postsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <h3>Пока нет постов</h3>
                    <p>Будьте первым, кто опубликует что-то интересное!</p>
                </div>
            `;
            return;
        }

        // Показываем только последние 6 постов на главной
        const recentPosts = this.posts.slice(0, 6);
        
        postsList.innerHTML = recentPosts.map(post => `
            <div class="post-card">
                ${post.imageUrl ? `
                    <img src="${post.imageUrl}" alt="${post.title}" class="post-image" 
                         onerror="this.style.display='none'">
                ` : ''}
                <div class="post-category">${this.getCategoryLabel(post.category)}</div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-content">${post.content.substring(0, 150)}${post.content.length > 150 ? '...' : ''}</p>
                <div class="post-meta">
                    <span class="post-author">👤 ${post.author}</span>
                    <span class="post-date">📅 ${post.createdAt}</span>
                    <span class="post-likes">❤️ ${post.likes}</span>
                </div>
                <div class="post-actions">
                    <button class="btn btn-primary btn-small" onclick="auth.likePost(${post.id})">❤️ Лайк</button>
                    ${this.currentUser && (this.currentUser.id === post.authorId || this.currentUser.role === 'admin') ? 
                        `<button class="btn btn-danger btn-small" onclick="auth.deletePost(${post.id})">🗑️ Удалить</button>` : ''}
                </div>
            </div>
        `).join('');

        console.log('Посты отображены успешно');
    }

    // Отображение всех постов (для страницы posts.html)
    displayAllPosts() {
        const postsList = document.getElementById('postsList');
        if (!postsList) return;

        console.log('Отображение всех постов. Всего постов:', this.posts.length);

        if (this.posts.length === 0) {
            postsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <h3>Пока нет постов</h3>
                    <p>Здесь будут отображаться все публикации нашего сообщества</p>
                </div>
            `;
            return;
        }

        postsList.innerHTML = this.posts.map(post => `
            <div class="post-card">
                ${post.imageUrl ? `
                    <img src="${post.imageUrl}" alt="${post.title}" class="post-image" 
                         onerror="this.style.display='none'">
                ` : ''}
                <div class="post-category">${this.getCategoryLabel(post.category)}</div>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-content">${post.content}</p>
                <div class="post-meta">
                    <span class="post-author">👤 ${post.author}</span>
                    <span class="post-date">📅 ${post.createdAt}</span>
                    <span class="post-likes">❤️ ${post.likes}</span>
                </div>
                <div class="post-actions">
                    <button class="btn btn-primary btn-small" onclick="auth.likePost(${post.id})">❤️ Лайк</button>
                    ${this.currentUser && (this.currentUser.id === post.authorId || this.currentUser.role === 'admin') ? 
                        `<button class="btn btn-danger btn-small" onclick="auth.deletePost(${post.id})">🗑️ Удалить</button>` : ''}
                </div>
            </div>
        `).join('');

        console.log('Все посты отображены успешно');
    }

    // Отображение постов для админа
    displayAdminPosts() {
        const adminPostsList = document.getElementById('adminPostsList');
        if (!adminPostsList || !this.currentUser || this.currentUser.role !== 'admin') return;

        const adminPosts = this.posts.filter(post => post.authorId === this.currentUser.id);
        
        if (adminPosts.length === 0) {
            adminPostsList.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📝</div>
                    <h3>У вас пока нет постов</h3>
                    <p>Создайте свой первый пост используя форму выше</p>
                </div>
            `;
            return;
        }

        adminPostsList.innerHTML = adminPosts.map(post => `
            <div class="post-card admin-post">
                <div class="post-header">
                    <h4>${post.title}</h4>
                    <button class="btn btn-danger btn-small" onclick="auth.deletePost(${post.id})">🗑️ Удалить</button>
                </div>
                <div class="post-category">${this.getCategoryLabel(post.category)}</div>
                <p class="post-preview">${post.content.substring(0, 100)}${post.content.length > 100 ? '...' : ''}</p>
                <div class="post-meta">
                    <span>📅 ${post.createdAt}</span>
                    <span>❤️ ${post.likes} лайков</span>
                    <span>💬 ${post.comments.length} комментариев</span>
                </div>
            </div>
        `).join('');
    }

    // Получение метки категории
    getCategoryLabel(category) {
        const labels = {
            'news': '📰 Новости',
            'events': '🎉 Ивенты',
            'updates': '🔄 Обновления',
            'guides': '📚 Гайды',
            'announcements': '📢 Объявления'
        };
        return labels[category] || '📄 Пост';
    }

    // Обновление статистики
    updateStats() {
        const totalUsers = document.getElementById('totalUsers');
        const totalPosts = document.getElementById('totalPosts');
        const totalAdmins = document.getElementById('totalAdmins');
        const totalLikes = document.getElementById('totalLikes');

        if (totalUsers) totalUsers.textContent = this.users.length;
        if (totalPosts) totalPosts.textContent = this.posts.length;
        if (totalAdmins) totalAdmins.textContent = this.users.filter(u => u.role === 'admin').length;
        if (totalLikes) {
            const totalLikesCount = this.posts.reduce((sum, post) => sum + post.likes, 0);
            totalLikes.textContent = totalLikesCount;
        }
    }

    // Обновление интерфейса
    updateUI() {
        const authSection = document.getElementById('authSection');
        const mainContent = document.getElementById('mainContent');
        const userContent = document.getElementById('userContent');
        const adminPanel = document.getElementById('adminPanel');
        const loginBtn = document.getElementById('loginBtn');
        const userInfo = document.getElementById('userInfo');

        if (this.currentUser) {
            if (authSection) authSection.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
            if (userContent) userContent.style.display = 'block';
            
            // Обновляем информацию в личном кабинете
            const userName = document.getElementById('userName');
            const userRole = document.getElementById('userRole');
            const userEmail = document.getElementById('userEmail');
            const userRegDate = document.getElementById('userRegDate');

            if (userName) userName.textContent = this.currentUser.username;
            if (userRole) userRole.textContent = this.currentUser.role === 'admin' ? '👑 Администратор' : '👤 Пользователь';
            if (userEmail) userEmail.textContent = this.currentUser.email;
            if (userRegDate) userRegDate.textContent = new Date(this.currentUser.createdAt).toLocaleDateString('ru-RU');

            if (this.currentUser.role === 'admin') {
                if (adminPanel) adminPanel.style.display = 'block';
                this.displayUsers();
                this.displayAdminPosts();
                this.updateStats();
            } else {
                if (adminPanel) adminPanel.style.display = 'none';
            }

            if (loginBtn) loginBtn.style.display = 'none';
            if (userInfo) {
                userInfo.innerHTML = `
                    <span>👋 Привет, ${this.currentUser.username}!</span>
                    <button class="btn btn-secondary" onclick="auth.logout()">🚪 Выйти</button>
                    <button class="theme-toggle" onclick="toggleTheme()">🌙</button>
                `;
            }
        } else {
            if (authSection) authSection.style.display = 'none';
            if (mainContent) mainContent.style.display = 'block';
            if (userContent) userContent.style.display = 'none';
            if (adminPanel) adminPanel.style.display = 'none';
            
            if (loginBtn) loginBtn.style.display = 'inline-block';
            if (userInfo) {
                userInfo.innerHTML = `
                    <button class="theme-toggle" onclick="toggleTheme()">🌙</button>
                    <a href="#" class="btn btn-primary" onclick="showAuth()">🔑 Войти</a>
                `;
            }
        }

        this.displayPosts();
    }

    // Отображение пользователей (для админа)
    displayUsers() {
        const userList = document.getElementById('userList');
        if (!userList) return;

        if (this.users.length === 0) {
            userList.innerHTML = '<div class="empty-state"><p>Нет пользователей</p></div>';
            return;
        }

        userList.innerHTML = this.users.map(user => `
            <div class="user-item">
                <div>
                    <strong>${user.username}</strong>
                    <p>📧 ${user.email} • ${user.role === 'admin' ? '👑 Админ' : '👤 Пользователь'} • 📅 ${new Date(user.createdAt).toLocaleDateString('ru-RU')}</p>
                    ${user.lastLogin ? `<small>Последний вход: ${new Date(user.lastLogin).toLocaleDateString('ru-RU')}</small>` : ''}
                </div>
                <div class="user-actions">
                    <button class="btn btn-danger btn-small" onclick="auth.deleteUser(${user.id})" ${user.role === 'admin' ? 'disabled' : ''}>
                        🗑️ Удалить
                    </button>
                    ${user.role !== 'admin' ? `
                        <button class="btn btn-success btn-small" onclick="auth.makeAdmin(${user.id})">
                            👑 Сделать админом
                        </button>
                    ` : ''}
                </div>
            </div>
        `).join('');
    }

    // Удаление пользователя
    deleteUser(id) {
        if (!this.currentUser || this.currentUser.role !== 'admin') {
            this.showNotification('Только администраторы могут удалять пользователей!', 'error');
            return;
        }

        const user = this.users.find(u => u.id === id);
        if (!user) return;

        if (user.role === 'admin') {
            this.showNotification('Нельзя удалить администратора!', 'error');
            return;
        }

        if (confirm(`Вы уверены, что хотите удалить пользователя ${user.username}?`)) {
            this.users = this.users.filter(u => u.id !== id);
            // Также удаляем посты пользователя
            this.posts = this.posts.filter(post => post.authorId !== id);
            this.saveUsers();
            this.savePosts();
            this.displayUsers();
            this.displayPosts();
            this.showNotification(`Пользователь ${user.username} удален!`, 'success');
        }
    }

    // Назначение администратора
    makeAdmin(id) {
        if (!this.currentUser || this.currentUser.role !== 'admin') {
            this.showNotification('Только администраторы могут назначать других администраторов!', 'error');
            return;
        }

        const user = this.users.find(u => u.id === id);
        if (user) {
            user.role = 'admin';
            this.saveUsers();
            this.displayUsers();
            this.showNotification(`Пользователь ${user.username} теперь администратор! 👑`, 'success');
        }
    }

    // Показать уведомление
    showNotification(message, type = 'info') {
        // Создаем элемент уведомления
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Добавляем стили для уведомления
        if (!document.querySelector('.notification-styles')) {
            const styles = document.createElement('style');
            styles.className = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1000;
                    max-width: 400px;
                    animation: slideInRight 0.3s ease;
                }
                .notification-content {
                    background: var(--bg-color);
                    border: 1px solid var(--border-color);
                    border-radius: var(--radius);
                    padding: 1rem;
                    box-shadow: var(--shadow-lg);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                }
                .notification-success .notification-content {
                    border-left: 4px solid var(--success-color);
                }
                .notification-error .notification-content {
                    border-left: 4px solid var(--danger-color);
                }
                .notification-info .notification-content {
                    border-left: 4px solid var(--primary-color);
                }
                .notification-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--text-light);
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOutRight {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            if (notification.parentElement) {
                notification.style.animation = 'slideOutRight 0.3s ease forwards';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }
}

// Глобальный объект авторизации
let auth;

// Функции для работы с интерфейсом
function showTab(tabName) {
    document.querySelectorAll('.auth-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('[id$="Tab"]').forEach(tab => tab.style.display = 'none');
    
    event.target.classList.add('active');
    const tabElement = document.getElementById(tabName + 'Tab');
    if (tabElement) {
        tabElement.style.display = 'block';
    }
}

function showAdminTab(tabName) {
    document.querySelectorAll('.admin-tab').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.admin-section').forEach(section => section.classList.remove('active'));
    
    event.target.classList.add('active');
    const tabElement = document.getElementById(tabName + 'Tab');
    if (tabElement) {
        tabElement.classList.add('active');
    }
}

function showAuth() {
    const authSection = document.getElementById('authSection');
    const mainContent = document.getElementById('mainContent');
    
    if (authSection) authSection.style.display = 'block';
    if (mainContent) mainContent.style.display = 'none';
}

function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    if (auth) {
        auth.register(username, email, password);
    }
    event.target.reset();
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    if (auth && auth.login(username, password)) {
        const authSection = document.getElementById('authSection');
        const mainContent = document.getElementById('mainContent');
        
        if (authSection) authSection.style.display = 'none';
        if (mainContent) mainContent.style.display = 'block';
    }
    event.target.reset();
}

function logout() {
    if (auth) {
        auth.logout();
    }
}

function addPost(event) {
    event.preventDefault();
    
    const title = document.getElementById('postTitle').value;
    const content = document.getElementById('postContent').value;
    const category = document.getElementById('postCategory').value;
    const imageUrl = document.getElementById('postImage').value;

    if (auth) {
        auth.addPost(title, content, category, imageUrl);
    }
}

// Переключение темы
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    localStorage.setItem('theme', document.body.classList.contains('dark-theme') ? 'dark' : 'light');
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Загрузка темы
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Инициализация системы авторизации
    auth = new AuthSystem();
    
    console.log('Система авторизации инициализирована');
    console.log('Пользователи:', auth.users);
    console.log('Посты:', auth.posts);
});

// Функция для отображения всех постов (для страницы posts.html)
function displayAllPosts() {
    if (typeof auth !== 'undefined' && auth) {
        auth.displayAllPosts();
    }
}