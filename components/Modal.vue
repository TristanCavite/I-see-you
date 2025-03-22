<template>
  <div 
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    @click.self="$emit('close')"
  >
    <div 
      class="bg-white p-6 rounded-lg shadow-lg relative animate-fade-in"
      :class="modalSize"
    >
      <!-- Header Slot with Default Title -->
      <div class="flex justify-between items-center border-b pb-3 mb-4">
        <slot name="header">
          <h2 class="text-xl font-bold">Modal Title</h2>
        </slot>
        <button @click="$emit('close')" class="text-gray-500 hover:text-gray-700 text-2xl">
          <LucideX />
        </button>
      </div>

      <!-- Body Slot with Default Message -->
      <div class="mb-4">
        <slot name="body">
          <p class="text-gray-600">This is a modal body. Replace it with your content.</p>
        </slot>
      </div>

      <!-- Footer Slot -->
      <div class="flex justify-end gap-2 border-t pt-3">
        <slot name="footer">
          <button @click="$emit('close')" class="bg-gray-500 text-white px-4 py-2 rounded">Close</button>
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { LucideX } from 'lucide-vue-next';

// Props to allow different modal sizes
const props = defineProps({
  size: {
    type: String,
    default: "md", // Default size is medium
    validator: (value) => ["sm", "md", "lg"].includes(value),
  }
});

// Emits event when closing modal
defineEmits(["close"]);

// Dynamic modal width based on size prop
const modalSize = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg"
}[props.size];
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
