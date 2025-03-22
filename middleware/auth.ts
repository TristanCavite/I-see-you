export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = await getCurrentUser();

  // If user is NOT logged in and tries to access a protected page, redirect to login
  if (!user && to.name !== 'index') {
    return navigateTo('/');
  }

  // If user IS logged in and tries to access the login page, redirect to dashboard
  if (user && to.name === 'login') {
    return navigateTo('dashboard');
  }
});
