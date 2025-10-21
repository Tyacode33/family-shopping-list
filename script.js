// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBw32ChJGt88McrBRLOv1PIYLT0uvGXFFk",
  authDomain: "family-shopping-list-37ef6.firebaseapp.com",
  projectId: "family-shopping-list-37ef6",
  storageBucket: "family-shopping-list-37ef6.firebasestorage.app",
  messagingSenderId: "307187394411",
  appId: "1:307187394411:web:41e7a93687f89bc748ce2e"
};

class ShoppingList {
    constructor() {
        this.items = [];
        this.currentUser = localStorage.getItem('shoppingList_userName') || this.promptUserName();
        this.notificationEnabled = localStorage.getItem('shoppingList_notifications') !== 'false';
        this.processedItemIds = new Set(); // Track items we've already notified about
        this.isFirstLoad = true;
        
        this.initializeElements();
        this.bindEvents();
        this.initializeFirebase();
        this.requestNotificationPermission();
    }

    initializeElements() {
        this.itemInput = document.getElementById('itemInput');
        this.addBtn = document.getElementById('addBtn');
        this.itemList = document.getElementById('itemList');
        this.clearCompleted = document.getElementById('clearCompleted');
        this.clearAll = document.getElementById('clearAll');
        this.itemCount = document.getElementById('itemCount');
        this.completedCount = document.getElementById('completedCount');
        this.changeNameBtn = document.getElementById('changeNameBtn');
        
        // Create notification toggle button
        this.createNotificationToggle();
        
        this.updateUserDisplay();
    }

    createNotificationToggle() {
        // Only create if it doesn't exist
        if (!document.getElementById('notificationBtn')) {
            const notificationBtn = document.createElement('button');
            notificationBtn.id = 'notificationBtn';
            notificationBtn.innerHTML = this.notificationEnabled ? '🔔 ON' : '🔕 OFF';
            notificationBtn.className = 'notification-btn';
            notificationBtn.title = 'Toggle notifications';
            
            const header = document.querySelector('header');
            header.appendChild(notificationBtn);
            
            this.notificationBtn = notificationBtn;
        } else {
            this.notificationBtn = document.getElementById('notificationBtn');
        }
    }

    promptUserName() {
        const name = prompt("Welcome to Family Shopping List! Please enter your name (e.g., Mom, Dad, Kid):", "Family Member");
        if (name && name.trim()) {
            localStorage.setItem('shoppingList_userName', name.trim());
            return name.trim();
        }
        return "Family Member";
    }

    changeName() {
        const newName = prompt("Change your display name:", this.currentUser);
        class ShoppingList {
            constructor() {
                this.items = [];
                this.currentUser = localStorage.getItem('shoppingList_userName') || this.promptUserName();
                this.notificationEnabled = localStorage.getItem('shoppingList_notifications') !== 'false';
                this.processedItemIds = new Set();
                this.isFirstLoad = true;
        
                this.initializeElements();
                this.bindEvents();
                this.initializeFirebase();
                this.requestNotificationPermission();
            }

            initializeElements() {
                this.itemInput = document.getElementById('itemInput');
                this.addBtn = document.getElementById('addBtn');
                this.itemList = document.getElementById('itemList');
                this.clearCompleted = document.getElementById('clearCompleted');
                this.clearAll = document.getElementById('clearAll');
                this.itemCount = document.getElementById('itemCount');
                this.completedCount = document.getElementById('completedCount');
                this.changeNameBtn = document.getElementById('changeNameBtn');
        
                // Create notification toggle button
                this.createNotificationToggle();
        
                this.updateUserDisplay();
            }

            createNotificationToggle() {
                if (!document.getElementById('notificationBtn')) {
                    const notificationBtn = document.createElement('button');
                    notificationBtn.id = 'notificationBtn';
                    notificationBtn.innerHTML = this.notificationEnabled ? '🔔 ON' : '🔕 OFF';
                    notificationBtn.className = 'notification-btn';
                    notificationBtn.title = 'Toggle notifications';
            
                    const header = document.querySelector('header');
                    header.appendChild(notificationBtn);
            
                    this.notificationBtn = notificationBtn;
                } else {
                    this.notificationBtn = document.getElementById('notificationBtn');
                }
            }

            promptUserName() {
                const name = prompt("Welcome to Family Shopping List! Please enter your name (e.g., Mom, Dad, Kid):", "Family Member");
                if (name && name.trim()) {
                    localStorage.setItem('shoppingList_userName', name.trim());
                    return name.trim();
                }
                return "Family Member";
            }

            changeName() {
                const newName = prompt("Change your display name:", this.currentUser);
                if (newName && newName.trim()) {
                    this.currentUser = newName.trim();
                    localStorage.setItem('shoppingList_userName', this.currentUser);
                    this.updateUserDisplay();
                    this.showLocalNotification(`Name changed to ${this.currentUser}`);
                }
            }

            toggleNotifications() {
                this.notificationEnabled = !this.notificationEnabled;
                localStorage.setItem('shoppingList_notifications', this.notificationEnabled.toString());
                this.notificationBtn.innerHTML = this.notificationEnabled ? '🔔 ON' : '🔕 OFF';
        
                if (this.notificationEnabled) {
                    this.requestNotificationPermission();
                }
        
                this.showLocalNotification(`Notifications ${this.notificationEnabled ? 'enabled' : 'disabled'}`);
            }

            updateUserDisplay() {
                document.querySelector('header p').textContent = `Hello ${this.currentUser}! Add items and check them off when purchased.`;
                if (this.changeNameBtn) {
                    this.changeNameBtn.innerHTML = `👤 ${this.currentUser}`;
                }
            }

            bindEvents() {
                this.addBtn.addEventListener('click', () => this.addItem());
                this.itemInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') this.addItem();
                });
                this.clearCompleted.addEventListener('click', () => this.clearCompletedItems());
                this.clearAll.addEventListener('click', () => this.clearAllItems());
        
                // FIXED: Proper event binding for change name button
                if (this.changeNameBtn) {
                    this.changeNameBtn.addEventListener('click', () => {
                        this.changeName();
                    });
                }
        
                if (this.notificationBtn) {
                    this.notificationBtn.addEventListener('click', () => this.toggleNotifications());
                }
            }

            async requestNotificationPermission() {
                if (!this.notificationEnabled) return;
        
                if ('Notification' in window && Notification.permission === 'default') {
                    try {
                        await Notification.requestPermission();
                    } catch (error) {
                        console.log('Notification permission request failed:', error);
                    }
                }
            }

            showLocalNotification(message) {
                const notification = document.createElement('div');
                notification.className = 'in-app-notification';
                notification.textContent = message;
        
                document.body.appendChild(notification);
        
                // Auto-remove after 3 seconds
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.style.animation = 'notificationSlideOut 0.3s ease-in';
                        setTimeout(() => {
                            if (notification.parentNode) {
                                notification.parentNode.removeChild(notification);
                            }
                        }, 300);
                    }
                }, 3000);
            }

            showBrowserNotification(title, message) {
                if (!this.notificationEnabled) return;
        
                if ('Notification' in window && Notification.permission === 'granted') {
                    try {
                        new Notification(title, {
                            body: message,
                            icon: '/favicon.ico'
                        });
                    } catch (error) {
                        console.log('Browser notification failed:', error);
                    }
                }
            }

            initializeFirebase() {
                try {
                    firebase.initializeApp(firebaseConfig);
                    this.db = firebase.firestore();
                    this.setupFirebaseListener();
                } catch (error) {
                    console.log('Firebase init failed, using localStorage:', error);
                    this.loadFromLocalStorage();
                    this.render();
                }
            }

            setupFirebaseListener() {
                this.db.collection('shoppingList').orderBy('createdAt', 'desc')
                    .onSnapshot((snapshot) => {
                        const previousItems = [...this.items];
                        this.items = [];
                
                        let newItemsFromOthers = [];
                
                        snapshot.forEach(doc => {
                            const item = doc.data();
                            this.items.push(item);
                    
                            if (!this.isFirstLoad && 
                                !this.processedItemIds.has(item.id) && 
                                item.addedBy !== this.currentUser) {
                                newItemsFromOthers.push(item);
                            }
                    
                            this.processedItemIds.add(item.id);
                        });
                
                        newItemsFromOthers.forEach(item => {
                            this.showNewItemNotification(item);
                        });
                
                        this.isFirstLoad = false;
                        this.render();
                    }, (error) => {
                        console.error('Firestore listener error:', error);
                    });
            }

            showNewItemNotification(item) {
                const message = `${item.addedBy} added: ${item.text}`;
        
                this.showBrowserNotification('🛒 New Shopping Item', message);
                this.showLocalNotification(message);
            }

            async addItem() {
                const text = this.itemInput.value.trim();
                if (text === '') return;

                const newItem = {
                    id: Date.now(),
                    text: text,
                    completed: false,
                    addedBy: this.currentUser,
                    addedAt: new Date().toLocaleString(),
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                };

                try {
                    await this.db.collection('shoppingList').doc(newItem.id.toString()).set(newItem);
                    this.showLocalNotification(`Added: ${text}`);
                    this.processedItemIds.add(newItem.id);
                } catch (error) {
                    console.error('Failed to save to Firebase:', error);
                    this.items.push(newItem);
                    this.saveToLocalStorage();
                    this.render();
                }

                this.itemInput.value = '';
                this.itemInput.focus();
            }

            async toggleItem(id) {
                const item = this.items.find(item => item.id === id);
                if (item) {
                    item.completed = !item.completed;
                    try {
                        await this.db.collection('shoppingList').doc(id.toString()).update({
                            completed: item.completed
                        });
                        if (item.completed) {
                            this.showLocalNotification(`Completed: ${item.text}`);
                        }
                    } catch (error) {
                        console.error('Failed to update Firebase:', error);
                        this.saveToLocalStorage();
                    }
                    this.render();
                }
            }

            async deleteItem(id) {
                const item = this.items.find(item => item.id === id);
                try {
                    await this.db.collection('shoppingList').doc(id.toString()).delete();
                    if (item) {
                        this.showLocalNotification(`Removed: ${item.text}`);
                    }
                } catch (error) {
                    console.error('Failed to delete from Firebase:', error);
                    this.items = this.items.filter(item => item.id !== id);
                    this.saveToLocalStorage();
                }
                this.render();
            }

            async clearCompletedItems() {
                const completedItems = this.items.filter(item => item.completed);
                if (completedItems.length === 0) return;
        
                for (const item of completedItems) {
                    try {
                        await this.db.collection('shoppingList').doc(item.id.toString()).delete();
                    } catch (error) {
                        console.error('Failed to delete from Firebase:', error);
                    }
                }
        
                this.showLocalNotification(`Cleared ${completedItems.length} completed items`);
            }

            async clearAllItems() {
                if (this.items.length === 0) return;
        
                if (confirm('Are you sure you want to clear all items?')) {
                    for (const item of this.items) {
                        try {
                            await this.db.collection('shoppingList').doc(item.id.toString()).delete();
                        } catch (error) {
                            console.error('Failed to delete from Firebase:', error);
                        }
                    }
                    this.showLocalNotification('Cleared all items');
                }
            }

            render() {
                this.itemList.innerHTML = '';
        
                const sortedItems = [...this.items].sort((a, b) => {
                    if (a.completed !== b.completed) {
                        return a.completed ? 1 : -1;
                    }
                    return b.id - a.id;
                });

                sortedItems.forEach(item => {
                    const li = document.createElement('li');
                    li.className = `list-item ${item.completed ? 'checked' : ''}`;
            
                    li.innerHTML = `
                        <input type="checkbox" ${item.completed ? 'checked' : ''}>
                        <div class="item-content">
                            <span class="item-text">${this.escapeHtml(item.text)}</span>
                            <div class="item-meta">Added by ${this.escapeHtml(item.addedBy)} at ${item.addedAt}</div>
                        </div>
                        <button class="delete-btn" title="Delete item">×</button>
                    `;

                    const checkbox = li.querySelector('input');
                    const deleteBtn = li.querySelector('.delete-btn');

                    checkbox.addEventListener('change', () => this.toggleItem(item.id));
                    deleteBtn.addEventListener('click', () => this.deleteItem(item.id));

                    this.itemList.appendChild(li);
                });

                this.updateStats();
            }

            updateStats() {
                const totalItems = this.items.length;
                const completedItems = this.items.filter(item => item.completed).length;
        
                this.itemCount.textContent = `${totalItems} item${totalItems !== 1 ? 's' : ''}`;
                this.completedCount.textContent = `${completedItems} completed`;
            }

            saveToLocalStorage() {
                localStorage.setItem('familyShoppingList', JSON.stringify(this.items));
            }

            loadFromLocalStorage() {
                const saved = localStorage.getItem('familyShoppingList');
                this.items = saved ? JSON.parse(saved) : [];
            }

            escapeHtml(text) {
                const div = document.createElement('div');
                div.textContent = text;
                return div.innerHTML;
            }
        }

        // Initialize the app
        document.addEventListener('DOMContentLoaded', () => {
            new ShoppingList();
        });

