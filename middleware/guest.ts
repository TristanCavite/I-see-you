import { getAuth, onAuthStateChanged } from "firebase/auth";
import { navigateTo } from 'nuxt/app';

export default defineNuxtRouteMiddleware((to, from) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (user) {
    return navigateTo('/dashboard');
  }

  return new Promise((resolve) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(navigateTo('/dashboard'));
      } else {
        resolve(true);
      }
    });
  });
});