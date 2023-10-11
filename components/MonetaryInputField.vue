<template>
  <div v-auto-animate class="flex flex-col">
    <label :for="id" class="block text-sm font-medium leading-6 text-gray-900">
      {{ label }}
      <font-awesome-icon
        v-if="required"
        class="text-red-500 ml-2"
        :icon="['fas', 'asterisk']"
      />
    </label>
    <div class="relative mt-2 rounded-md shadow-sm">
      <div
        v-if="prefix"
        class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
      >
        <span class="text-gray-500 sm:text-sm">{{ prefix }}</span>
      </div>
      <input
        v-model.trim="modelValueRef"
        ref="inputElement"
        type="number"
        step="0.01"
        :name="name"
        :id="id"
        :placeholder="placeholder"
        :autocomplete="autocomplete ? 'on' : 'off'"
        :aria-required="required"
        :aria-invalid="!!error"
        :aria-describedby="error ? `${id}-error` : undefined"
        class="block w-full rounded-md border-0 py-1.5 pl-7 pr-12 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
      />
      <div
        v-if="suffix"
        class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3"
      >
        <span class="text-gray-500 sm:text-sm" id="currency-description">
          {{ suffix }}
        </span>
      </div>
    </div>
    <p
      v-if="error"
      :id="`${id}-error`"
      class="text-red-600 text-sm m-0 p-0 mt-2"
    >
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, toRefs } from 'vue';

interface Props {
  label: string;
  required?: boolean;
  modelValue: string | undefined;
  name: string;
  id: string;
  placeholder?: string;
  autocomplete?: string;
  error?: string;
  autofocus?: boolean;
  prefix?: string;
  suffix?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const {
  label,
  required,
  modelValue,
  name,
  id,
  placeholder,
  autocomplete,
  error,
  autofocus,
  prefix,
  suffix,
} = toRefs(props);

const modelValueRef = ref<string>(modelValue.value || '');

watch(modelValueRef, (newValue) => {
  emit('update:modelValue', newValue);
});

const inputElement = ref<HTMLInputElement | null>(null);

onMounted(() => {
  if (autofocus.value && inputElement.value) {
    inputElement.value.focus();
  }
});

watch(modelValue, (newVal) => {
  modelValueRef.value = newVal ?? '';
});
</script>
