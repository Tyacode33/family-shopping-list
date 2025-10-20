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
        this.initializeElements();
        this.bindEvents();
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
        
        // CREATE THE NAME CHANGE BUTTON
        this.createNameChangeButton();
        
        this.userName = localStorage.getItem('shoppingList_userName') || this.promptUserName();
        this.updateUserDisplay();
    }

    createNameChangeButton() {
        const nameButton = document.createElement('button');
        nameButton.id = 'changeNameBtn';
        nameButton.innerHTML = '👤 Change Name';
        nameButton.className = 'change-name-btn';
        
        const header = document.querySelector('header');
        header.appendChild(nameButton);
        
        this.changeNameBtn = nameButton;
    }

    promptUserName() {
        const name = prompt("Welcome! Enter your name (e.g., Mom, Dad, Kid):", "Family Member");
        if (name && name.trim()) {
            localStorage.setItem('shoppingList_userName', name.trim());
            return name.trim();
        }
        return "Family Member";
    }

    changeName() {
        const newName = prompt("Change your display name:", this.userName);
        if (newName && newName.trim()) {
            this.userName = newName.trim();
            localStorage.setItem('shoppingList_userName', this.userName);
            this.updateUserDisplay();
            alert(`Name changed to: ${this.userName}`);
        }
    }

    updateUserDisplay() {
        document.querySelector('header p').textContent = `Hello ${this.userName}! Add items and check them off when purchased.`;
        this.changeNameBtn.innerHTML = `👤 ${this.userName}`;
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addItem());
        this.itemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addItem();
        });
        this.clearCompleted.addEventListener('click', () => this.clearCompletedItems());
        this.clearAll.addEventListener('click', () => this.clearAllItems());
        this.changeNameBtn.addEventListener('click', () => this.changeName());
    }

    initializeFirebase() {
        try {
            firebase.initializeApp(firebaseConfig);
            this.db = firebase.firestore();
            this.setupFirebaseListener();
        } catch (error) {
            this.loadFromLocalStorage();
            this.render();
        }
    }

    setupFirebaseListener() {
        this.db.collection('shoppingList').orderBy('createdAt', 'desc')
            .onSnapshot((snapshot) => {
                this.items = [];
                snapshot.forEach(doc => {
                    this.items.push(doc.data());
                });
                this.render();
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
        } catch (error) {
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
                this.saveToLocalStorage();
            }
            this.render();
        }
    }

    async deleteItem(id) {
        try {
            await this.db.collection('shoppingList').doc(id.toString()).delete();
        } catch (error) {
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
            } catch (error) {}
        }
    }

    async clearAllItems() {
        if (this.items.length === 0) return;
        if (confirm('Are you sure you want to clear all items?')) {
            for (const item of this.items) {
                try {
                    await this.db.collection('shoppingList').doc(item.id.toString()).delete();
                } catch (error) {}
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

document.addEventListener('DOMContentLoaded', () => {
    new ShoppingList();
});

