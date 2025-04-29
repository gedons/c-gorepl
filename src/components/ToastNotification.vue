<template>
    <transition name="fade">
      <div v-if="show" class="toast toast-success font-semibold" :class="typeClasses">
        <svg class="w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
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
  .toast {
    position: fixed;
    bottom: 1rem;
    right: 1rem;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    display: flex;
    align-items: center;
    color: white;
  }
  
  .toast-success {
    background-color: #10B981; /* Tailwind's green-500 */
  }
  
  .toast-error {
    background-color: #EF4444; /* Tailwind's red-500 */
  }
  
  .check-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.5rem;
    animation: checkmark 0.3s ease;
  }
  
  @keyframes checkmark {
    0% {
      transform: scale(0);
      opacity: 0;
    }
    50% {
      transform: scale(1.2);
    }
    100% {
      transform: scale(1);
      opacity: 1;
    }
  }
  
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
  </style>