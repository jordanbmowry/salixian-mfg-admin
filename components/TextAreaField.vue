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
      <p v-if="error" class="text-red-600 text-sm m-0 p-0">
        {{ error }}
      </p>
    </div>
    <p class="mt-3 text-sm leading-6 text-gray-600">
      {{ description }}
    </p>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  modelValue: string | undefined;
  name: string;
  id: string;
  error?: string;
  description?: string;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const { label, modelValue, name, id, error, description } = toRefs(props);

const modelValueRef = ref<string>(modelValue.value || '');

watch(modelValueRef, (newValue) => {
  emit('update:modelValue', newValue);
});

watch(modelValue, (newVal) => {
  modelValueRef.value = newVal ?? '';
});
</script>
