class ShoppingList {
    constructor() {
        this.items = this.loadItems();
        this.initializeElements();
        this.bindEvents();
        this.render();
    }

    initializeElements() {
        this.itemInput = document.getElementById('itemInput');
        this.addBtn = document.getElementById('addBtn');
        this.itemList = document.getElementById('itemList');
        this.clearCompleted = document.getElementById('clearCompleted');
        this.clearAll = document.getElementById('clearAll');
        this.itemCount = document.getElementById('itemCount');
        this.completedCount = document.getElementById('completedCount');
    }

    bindEvents() {
        this.addBtn.addEventListener('click', () => this.addItem());
        this.itemInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addItem();
        });
        this.clearCompleted.addEventListener('click', () => this.clearCompletedItems());
        this.clearAll.addEventListener('click', () => this.clearAllItems());
    }

    addItem() {
        const text = this.itemInput.value.trim();
        if (text === '') return;

        const newItem = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.items.push(newItem);
        this.saveItems();
        this.render();
        this.itemInput.value = '';
        this.itemInput.focus();
    }

    toggleItem(id) {
        this.items = this.items.map(item => 
            item.id === id ? { ...item, completed: !item.completed } : item
        );
        this.saveItems();
        this.render();
    }

    deleteItem(id) {
        this.items = this.items.filter(item => item.id !== id);
        this.saveItems();
        this.render();
    }

    clearCompletedItems() {
        this.items = this.items.filter(item => !item.completed);
        this.saveItems();
        this.render();
    }

    clearAllItems() {
        if (this.items.length === 0) return;
        
        if (confirm('Are you sure you want to clear all items?')) {
            this.items = [];
            this.saveItems();
            this.render();
        }
    }

    render() {
        this.itemList.innerHTML = '';
        
        this.items.forEach(item => {
            const li = document.createElement('li');
            li.className = `list-item ${item.completed ? 'checked' : ''}`;
            
            li.innerHTML = `
                <input type="checkbox" ${item.completed ? 'checked' : ''}>
                <span class="item-text">${this.escapeHtml(item.text)}</span>
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

    saveItems() {
        localStorage.setItem('familyShoppingList', JSON.stringify(this.items));
    }

    loadItems() {
        const saved = localStorage.getItem('familyShoppingList');
        return saved ? JSON.parse(saved) : [];
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