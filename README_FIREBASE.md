# Enabling Firebase real-time sync

This project now includes Firebase-ready code in `script.js` and a user prompt for a display name. To enable real-time synchronization using Firebase Firestore follow these steps.

1) Create a Firebase project
- Go to https://console.firebase.google.com and create a new project.
- Enable Firestore (Database → Create database → Production or Test mode).

2) Get your Firebase config
- Project settings → General → Your apps → Add web app.
- Copy the `firebaseConfig` object and replace the placeholder values in `script.js`.

3) Add Firebase SDK to `index.html`
- In your `index.html` head (before `script.js`) add:

```html
<!-- Firebase SDKs -->
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js"></script>
<script src="https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore-compat.js"></script>
```

4) Enable the initialization in `script.js`
- Uncomment `this.initializeFirebase();` in the `ShoppingList` constructor.
- Optionally replace `saveItems()` to also persist to Firestore:

```js
// When adding an item
await this.saveToFirebase(newItem);
```

5) Security rules
- For quick testing you can use permissive rules, but for production update Firestore security rules to require proper access control.

6) Test
- Open the site in multiple browsers/devices and add/remove items to see real-time updates.

If you want, I can:
- Wire the Firebase initialization into the code and switch to real-time writes/reads.
- Add anonymous auth so users can identify without prompting for a display name.
- Provide a minimal Firestore rules file example.

Tell me which you'd like me to do and I'll update the code accordingly.
