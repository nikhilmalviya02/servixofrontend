import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBD4Ab_zL6Qt4UxXZdL1Yxe-ZY8KKHsZmY",
  authDomain: "servexago-96a95.firebaseapp.com",
  projectId: "servexago-96a95",
  storageBucket: "servexago-96a95.firebasestorage.app",
  messagingSenderId: "630271904128",
  appId: "1:630271904128:web:04eeb191c78efcb6cd965"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();

// Configure Google Provider
provider.setCustomParameters({
  prompt: 'select_account'
});
