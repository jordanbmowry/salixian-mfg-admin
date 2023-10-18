<template>
  <div class="flex items-center justify-between">
    <div v-if="label" class="flex flex-grow flex-col">
      <span class="text-sm font-medium leading-6 text-gray-900">{{
        label
      }}</span>
      <span v-if="description" class="text-sm text-gray-500">{{
        description
      }}</span>
    </div>
    <div
      class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2"
      :class="modelValue ? activeClass : inactiveClass"
      @click="toggle"
    >
      <span
        aria-hidden="true"
        class="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"
        :class="modelValue ? 'translate-x-5' : 'translate-x-0'"
      ></span>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  label: string;
  description: string;
  activeClass: string;
  inactiveClass: string;
}

const props = defineProps<Props>();

const emit = defineEmits(['update:modelValue']);

const toggle = () => {
  emit('update:modelValue', !props.modelValue);
};
</script>
