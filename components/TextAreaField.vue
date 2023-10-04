<!-- TextAreaField.vue -->
<template>
  <div class="col-span-full">
    <label :for="id" class="block text-sm font-medium leading-6 text-gray-900">
      {{ label }}
    </label>
    <div v-auto-animate class="mt-2">
      <textarea
        v-model.trim="modelValueRef"
        :id="id"
        :name="name"
        rows="3"
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
      ></textarea>
      <p v-if="errorRef" class="text-red-600 text-sm m-0 p-0">
        {{ errorRef }}
      </p>
    </div>
    <p class="mt-3 text-sm leading-6 text-gray-600">
      Notes regarding the customer.
    </p>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  label: String,
  modelValue: String,
  name: String,
  id: String,
  error: String,
});

const { label, modelValue, name, id, error } = props;

const modelValueRef = ref(modelValue);
const errorRef = ref(error);

const emit = defineEmits(['update:modelValue']);

watch(modelValueRef, (newVal) => {
  emit('update:modelValue', newVal);
});

watch(errorRef, (newError) => {
  emit('update:error', newError);
});
</script>
