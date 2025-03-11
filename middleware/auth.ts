import { getAuth, onAuthStateChanged } from "firebase/auth";
import { navigateTo } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = getAuth();

  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(true);
      } else {
        resolve(navigateTo('/'));
      }
    });
  });
}); 