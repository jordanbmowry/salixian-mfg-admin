<template>
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
          <button type="button" :class="buttonClass" @click="dismissToast">
            Dismiss
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/vue/20/solid';

const props = defineProps([
  'type',
  'message',
  'isVisible',
  'dismissible',
  'listMessages',
]);
const emit = defineEmits();

const toastClass = {
  'fixed top-0 left-0 w-full z-50 rounded-md p-4': true,
  'bg-green-50': props.type === 'success',
  'bg-red-50': props.type === 'error',
};

const iconComponent = props.type === 'success' ? CheckCircleIcon : XCircleIcon;
const iconColor = props.type === 'success' ? 'text-green-400' : 'text-red-400';
const titleClass =
  props.type === 'success'
    ? 'text-sm font-medium text-green-800'
    : 'text-sm font-medium text-red-800';
const textClass = props.type === 'success' ? 'text-green-700' : 'text-red-700';
const buttonClass = {
  'rounded-md px-2 py-1.5 text-sm font-medium hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50':
    props.type === 'success',
  'rounded-md px-2 py-1.5 text-sm font-medium hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50':
    props.type === 'error',
};

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
