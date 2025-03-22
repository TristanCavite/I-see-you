<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">

import { useColorMode } from '#imports';

import { useCurrentUser } from 'vuefire';
import { useRouter } from 'vue-router';

const user = useCurrentUser();
const router = useRouter();

// Redirect user to the login page if they are logged out (handles logout event)
watch(user, (newUser, oldUser) => {
  if (oldUser && !newUser) {
    router.replace('/');
  }
});



useHead({
  title: "I see you",
  link: [
    {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",  // Explicit size declaration
      href: "/logo.png",
    },
    
  ],
  meta: [
    {
      name: "description",
      content: "A stalker site.",
    },
  ],
});



const colorMode = useColorMode();
colorMode.preference = 'light'; // Force light mode on load
</script>