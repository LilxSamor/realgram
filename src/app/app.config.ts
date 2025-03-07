import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FIREBASE_OPTIONS } from '@angular/fire/compat';
import { environment } from '../environments/environment';
import { UserPostService } from './services/user-post.service';
import { getStorage, provideStorage } from '@angular/fire/storage';

const firebaseConfig = {
  apiKey: "AIzaSyDXb195ky45HzIbUZSvPP9K6b66v9y5iAE",
  authDomain: "test-1eded.firebaseapp.com",
  projectId: "test-1eded",
  storageBucket: "test-1eded.firebasestorage.app",
  messagingSenderId: "7885630519",
  appId: "1:7885630519:web:2ebc98afa61dd3fbcae3b2",
  measurementId: "G-SLPQBDPKSS",
  databaseURL: 'https://test-1eded-default-rtdb.europe-west1.firebasedatabase.app'
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes), 
    /**provideClientHydration(withEventReplay())
    importProvidersFrom([
      provideFirebaseApp(() => initializeApp(environment.firebase)),
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideDatabase(() => getDatabase()), 
      provideAnimationsAsync()
    ])*/
 
    provideFirebaseApp(() => 
      initializeApp({ 
        apiKey: "AIzaSyDXb195ky45HzIbUZSvPP9K6b66v9y5iAE",
        authDomain: "test-1eded.firebaseapp.com",
        projectId: "test-1eded",
        storageBucket: "test-1eded.firebasestorage.app",
        messagingSenderId: "7885630519",
        appId: "1:7885630519:web:2ebc98afa61dd3fbcae3b2",
        measurementId: "G-SLPQBDPKSS",
        databaseURL: 'https://test-1eded-default-rtdb.europe-west1.firebasedatabase.app'
      })),
      { provide: FIREBASE_OPTIONS, useValue: firebaseConfig },
      provideAuth(() => getAuth()),
      provideFirestore(() => getFirestore()),
      provideDatabase(() => getDatabase()), 
      provideAnimationsAsync(), provideDatabase(() => getDatabase()), provideStorage(() => getStorage())
    ],
};
