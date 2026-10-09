# Firebase setup: hospitals, doctors, and admin

The `/admin` page writes hospital records to `hospitals` and doctor records to
`doctors`. The public directory reads both collections directly from Firestore.
An empty list means there are no documents yet; a `permission-denied` message
means the Firestore Rules do not allow the requested operation.

## 1. Check the Firebase project configuration

1. Open the Firebase Console and select the project used by this app.
2. In **Project settings → General → Your apps**, confirm the web app's
   `apiKey`, `authDomain`, `projectId`, and `appId`.
3. Put those values in the project-root `.env` file using these variable names:

   ```dotenv
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_APP_ID=your-web-app-id
   ```

4. Restart the Vite server after changing `.env`. Do not share or commit real
   credentials/configuration values.

## 2. Enable sign-in and create Firestore

1. In **Authentication → Sign-in method**, enable **Email link (passwordless
   sign-in)**, which this app uses.
2. In **Authentication → Settings → Authorized domains**, add the domain where
   the app is running (for local development, ensure `localhost` is present).
3. In **Firestore Database**, create a database if one does not exist.

## 3. Add the first admin

1. Run the app and open `/login`. Sign in with the email account that should
   manage the directory.
2. Open `/admin`. If the account is not an admin yet, the page displays its
   Firebase Authentication UID.
3. In **Firestore Database → Data**, create a collection named `admins`.
4. Create a document whose **document ID is exactly that UID**. Add a field
   `role` with string value `admin`.
5. Publish Rules that permit that signed-in user to read only their own
   `admins/{uid}` document. That read is required for the app to recognize the
   account. Sign out and sign in again after creating the document.

Do not let users create or edit their own admin documents from the client.
Create the first admin from the Firebase Console or a trusted server-side
admin tool.

## 4. Check Firestore Rules

The exact rules depend on the rest of your app. Merge equivalent permissions
into the existing rules; do not replace rules for appointments, patients,
reports, or other collections with this partial example.

```text
function signedIn() {
  return request.auth != null;
}

function isAdmin() {
  return signedIn()
    && exists(/databases/$(database)/documents/admins/$(request.auth.uid));
}

match /admins/{uid} {
  allow get: if signedIn() && request.auth.uid == uid;
  allow list, create, update, delete: if false;
}

match /hospitals/{hospitalId} {
  allow read: if true;
  allow create, update, delete: if isAdmin();
}

match /doctors/{doctorId} {
  allow read: if true;
  allow create, update, delete: if isAdmin();
}
```

These are Firestore Rules-language fragments to put inside
`service cloud.firestore { match /databases/{database}/documents { ... } }`.
Review the public-read choice for your directory and merge it with your
existing collection rules before publishing.

## 5. Add and verify records

1. Open `/admin` while signed in as the admin account.
2. Add a hospital first (name and city are required).
3. Select that hospital in the **Doctors** tab, fill in the doctor's name,
   specialty, and experience, then save.
4. The public `/hospitals` and `/doctors` pages use live Firestore listeners and
   should update without a refresh.

If saving or loading fails, the app displays the Firebase error code. For
`permission-denied`, inspect **Firestore Database → Rules** and confirm that
the signed-in account's UID matches the document ID under `admins`. For
`not-found`, confirm that Firestore has been created in the same project as
the app.
