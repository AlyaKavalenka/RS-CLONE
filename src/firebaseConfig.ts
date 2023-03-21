import { getFirestore } from '@firebase/firestore';
import { getStorage } from 'firebase/storage';
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: 'AIzaSyAbiFDAxDjj6K8w1aXRg2eK44_334NO8zE',
  authDomain: 'clone-telegram-f8585.firebaseapp.com',
  projectId: 'clone-telegram-f8585',
  storageBucket: 'clone-telegram-f8585.appspot.com',
  messagingSenderId: '798731247675',
  appId: '1:798731247675:web:d4c3957eb1d5af47dbbc1e',
  measurementId: 'G-YSJG47WWSG',

};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore();
export const storage = getStorage();
