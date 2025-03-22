<template>
    <div 
      v-if="show" 
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
    <div class="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm max-h-[80vh] border border-gray-300">
        <div class="overflow-y-auto max-h-[70vh] px-2">
        <div class="flex justify-between items-center border-b pb-3 mb-4">
          <h2 class="text-xl font-bold">Add Person</h2>
          <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-2xl">
            &times;
          </button>
        </div>
        <div class="space-y-4">
          <div v-for="(value, key) in personData" :key="key">
            <Placeholder :text="formatPlaceholder(key)" class="block text-gray-600 font-semibold mb-1" />
            <input 
              v-model="personData[key]" 
              :placeholder="formatPlaceholder(key)" 
              class="w-full p-2 border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div class="flex justify-end gap-2 border-t pt-3 mt-4">
          <button @click="$emit('close')" class="bg-gray-500 text-white px-4 py-2 rounded">
            Cancel
          </button>
          <button @click="$emit('save', personData)" class="bg-green-500 text-white px-4 py-2 rounded">
            Save
          </button>
        </div>
      </div>
    </div>
    </div>
  </template>
  
  <script setup>
  import Placeholder from '@/components/Ui/Placeholder.vue';
  import { defineProps, defineEmits } from 'vue';
  
  defineProps({
    show: Boolean,
    personData: Object
  });
  
  defineEmits(['close', 'save']);
  
  const formatPlaceholder = (key) => {
    return key
      .replace(/([A-Z])/g, ' $1') // Adds space before capital letters (e.g., "firstName" → "First Name")
      .replace(/^./, (str) => str.toUpperCase()); // Capitalizes the first letter
  };
  </script>
  