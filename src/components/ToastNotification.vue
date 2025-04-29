<template>
    <transition name="fade">
      <div v-if="show" class="fixed bottom-4 right-4 px-4 py-2 rounded-lg shadow-lg text-white font-semibold" :class="typeClasses">
        {{ message }}
      </div>
    </transition>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  
  const show = ref(false)
  const message = ref('')
  const type = ref('success')
  
  const typeClasses = computed(() => {
    return {
      'success': 'bg-green-500',
      'error': 'bg-red-500'
    }[type.value]
  })
  
  const showToast = (msg, toastType = 'success', duration = 2000) => {
    message.value = msg
    type.value = toastType
    show.value = true
    setTimeout(() => {
      show.value = false
    }, duration)
  }
  
  defineExpose({ showToast })
  </script>
  
  <style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>