<template>
    <div class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative animate-fade-in">

        <div class="flex justify-between items-center border-b pb-3 mb-4">
          <slot name="header"></slot>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-2xl">
            <LucideX />
          </button>
        </div>
  
 
        <div class="mb-4">
          <slot name="body"></slot>
        </div>
  
        <div class="flex justify-end gap-2 border-t pt-3">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { LucideX } from 'lucide-vue-next';
  
  export default {
    components: { LucideX },
    emits: ['close']
  };
  </script>
  
  <style scoped>
  @keyframes fade-in {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  
  .animate-fade-in {
    animation: fade-in 0.2s ease-out;
  }
  </style>