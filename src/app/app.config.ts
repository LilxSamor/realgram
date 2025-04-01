import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { getStorage, provideStorage } from '@angular/fire/storage';
import { authConfig } from './auth/auth.config';
import { provideAuth as provideAuth_alias } from 'angular-auth-oidc-client';
import { provideHttpClient } from '@angular/common/http';

const firebaseConfig = {
  apiKey: "",
  authDomain: "realgram-second.firebaseapp.com",
  projectId: "realgram-second",
  storageBucket: "realgram-second.firebasestorage.app",
  messagingSenderId: "1096328313170",
  appId: "1:1096328313170:web:e561d7786a5276fa42a28b",
  measurementId: "G-R6EFFWRQYP",
  databaseURL: 'https://realgram-second-default-rtdb.europe-west1.firebasedatabase.app'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(),
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    provideFirebaseApp(() => 
      initializeApp({ 
        apiKey: "",
        authDomain: "realgram-second.firebaseapp.com",
        projectId: "realgram-second",
        storageBucket: "realgram-second.firebasestorage.app",
        messagingSenderId: "1096328313170",
        appId: "1:1096328313170:web:e561d7786a5276fa42a28b",
        measurementId: "G-R6EFFWRQYP",
        databaseURL: 'https://realgram-second-default-rtdb.europe-west1.firebasedatabase.app'
      })),
      { provide: FIREBASE_OPTIONS, useValue: firebaseConfig },
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideDatabase(() => getDatabase()), 
      provideAnimationsAsync(), provideDatabase(() => getDatabase()), provideStorage(() => getStorage()), provideAuth_alias(authConfig)
    ],
};
