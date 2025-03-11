<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
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
</script>