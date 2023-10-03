<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="isVisible" :class="toastClass">
        <div class="flex justify-between items-center">
          <div class="flex-shrink-0">
            <component
              :is="iconComponent"
              class="h-5 w-5"
              :class="iconColor"
              aria-hidden="true"
            />
          </div>
          <div class="flex-grow text-center ml-3">
            <h3 :class="titleClass">{{ message }}</h3>
            <div
              v-if="listMessages && listMessages.length"
              class="mt-2 text-sm"
              :class="textClass"
            >
              <ul role="list" class="space-y-1">
                <li v-for="msg in listMessages" :key="msg">{{ msg }}</li>
              </ul>
            </div>
          </div>
          <div v-if="dismissible">
            <button
              class="cursor-pointer"
              type="button"
              :class="buttonClass"
              @click="dismissToast"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import {
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon,
} from '@heroicons/vue/20/solid';

interface Props {
  type?: 'success' | 'error' | 'warning';
  message: string;
  isVisible: boolean;
  dismissible: boolean;
  listMessages?: string[];
}

const props = withDefaults(defineProps<Props>(), {
  type: 'success',
});

const emit = defineEmits(['dismiss']);

const toastClass = computed(() => ({
  'fixed top-0 left-0 w-full z-50 rounded-md p-4': true,
  'bg-green-50': props.type === 'success',
  'bg-red-50': props.type === 'error',
  'bg-yellow-50': props.type === 'warning',
}));

const iconComponent = computed(() => {
  switch (props.type) {
    case 'success':
      return CheckCircleIcon;
    case 'error':
      return XCircleIcon;
    case 'warning':
      return ExclamationTriangleIcon;
    default:
      return null;
  }
});

const iconColor = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-400';
    case 'error':
      return 'text-red-400';
    case 'warning':
      return 'text-yellow-400';
    default:
      return '';
  }
});

const titleClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-sm font-medium text-green-800';
    case 'error':
      return 'text-sm font-medium text-red-800';
    case 'warning':
      return 'text-sm font-medium text-yellow-800';
    default:
      return '';
  }
});

const textClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'text-green-700';
    case 'error':
      return 'text-red-700';
    case 'warning':
      return 'text-yellow-700';
    default:
      return '';
  }
});

const buttonClass = computed(() => {
  switch (props.type) {
    case 'success':
      return 'rounded-md px-2 py-1.5 text-sm font-medium hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50';
    case 'error':
      return 'rounded-md px-2 py-1.5 text-sm font-medium hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50';
    case 'warning':
      return 'rounded-md px-2 py-1.5 text-sm font-medium hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50';
    default:
      return '';
  }
});

function dismissToast() {
  emit('dismiss');
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.z-50 {
  z-index: 50;
}
</style>
