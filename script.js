// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBw32ChJGt88McrBRLOv1PIYLT0uvGXFFk",
  authDomain: "family-shopping-list-37ef6.firebaseapp.com",
  projectId: "family-shopping-list-37ef6",
  storageBucket: "family-shopping-list-37ef6.firebasestorage.app",
  messagingSenderId: "307187394411",
  appId: "1:307187394411:web:41e7a93687f89bc748ce2e"
};

console.log("Script loaded! Firebase config:", firebaseConfig);

class ShoppingList {
    constructor() {
        console.log("ShoppingList constructor called");
        this.items = [];
        this.initializeElements();
        this.bindEvents();
        
        console.log("Initializing Firebase...");
        this.initializeFirebase();
    }

    initializeElements() {
        this.itemInput = document.getElementById('itemInput');
        this.addBtn = document.getElementById('addBtn');
        this.itemList = document.getElementById('itemList');
        this.clearCompleted = document.getElementById('clearCompleted');
        this.clearAll = document.getElementById('clearAll');
        this.itemCount = document.getElementById('itemCount');
        this.completedCount = document.getElementById('completedCount');
        
        this.userName = localStorage.getItem('shoppingList_userName') || this.promptUserName();
    }

    promptUserName() {
        const name = prompt("Welcome to Family Shopping List! Please enter your name (e.g., Mom, Dad, Kid):", "Family Member");
        if (name && name.trim()) {
            localStorage.setItem('shoppingList_userName', name.trim());
            return name.trim();
        }
        return "Family Member";
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addItem());
        this.itemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addItem();
        });
        this.clearCompleted.addEventListener('click', () => this.clearCompletedItems());
        this.clearAll.addEventListener('click', () => this.clearAllItems());
    }

    initializeFirebase() {
        try {
            console.log("Attempting Firebase initialization...");
            // Firebase v8 syntax
            firebase.initializeApp(firebaseConfig);
            this.db = firebase.firestore();
            console.log("✅ Firebase initialized successfully!");
            
            this.setupFirebaseListener();
        } catch (error) {
            console.log("❌ Firebase init failed:", error);
            this.loadFromLocalStorage();
            this.render();
        }
    }

    setupFirebaseListener() {
        console.log("Setting up Firebase listener...");
        this.db.collection('shoppingList').orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                console.log("🔥 Firebase update received! Items:", snapshot.size);
                this.items = [];
                snapshot.forEach(doc => {
                    console.log("Document data:", doc.data());
                    this.items.push(doc.data());
                });
                this.render();
            }, (error) => {
                console.error("❌ Firebase listener error:", error);
            });
    }

    async addItem() {
        const text = this.itemInput.value.trim();
        if (text === '') return;

        const newItem = {
            id: Date.now(),
            text: text,
            completed: false,
            addedBy: this.userName,
            addedAt: new Date().toLocaleString(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        };

        try {
            await this.db.collection('shoppingList').doc(newItem.id.toString()).set(newItem);
            console.log("Item saved to Firebase!");
        } catch (error) {
            console.error("Failed to save to Firebase:", error);
            this.items.push(newItem);
            this.saveToLocalStorage();
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
            } catch (error) {
                console.error("Failed to update Firebase:", error);
                this.saveToLocalStorage();
            }
            this.render();
        }
    }

    async deleteItem(id) {
        try {
            await this.db.collection('shoppingList').doc(id.toString()).delete();
        } catch (error) {
            console.error("Failed to delete from Firebase:", error);
            this.items = this.items.filter(item => item.id !== id);
            this.saveToLocalStorage();
        }
        this.render();
    }

    async clearCompletedItems() {
        const completedItems = this.items.filter(item => item.completed);
        for (const item of completedItems) {
            try {
                await this.db.collection('shoppingList').doc(item.id.toString()).delete();
            } catch (error) {
                console.error("Failed to delete from Firebase:", error);
            }
        }
    }

    async clearAllItems() {
        if (this.items.length === 0) return;
        
        if (confirm('Are you sure you want to clear all items?')) {
            for (const item of this.items) {
                try {
                    await this.db.collection('shoppingList').doc(item.id.toString()).delete();
                } catch (error) {
                    console.error("Failed to delete from Firebase:", error);
                }
            }
        }
    }

    render() {
        this.itemList.innerHTML = '';
        
        const sortedItems = [...this.items].sort((a, b) => {
            if (a.completed !== b.completed) {
                return a.completed ? 1 : -1;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
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
        
        document.querySelector('header p').textContent = `Hello ${this.userName}! Add items and check them off when purchased.`;
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

// Initialize the shopping list when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new ShoppingList();
});
