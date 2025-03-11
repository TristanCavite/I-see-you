<template>
  <div class="flex flex-col min-h-screen">
    <!-- Navbar -->
    <Navbar />

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Footer from "@/components/Footer.vue";
</script>

<style scoped>

</style>
