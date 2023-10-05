<template>
  <div v-auto-animate>
    <label :for="id" class="block text-sm font-medium leading-6 text-gray-900">
      {{ label }}
      <font-awesome-icon
        v-if="required"
        class="text-red-500 ml-2"
        :icon="['fas', 'asterisk']"
      />
    </label>
    <div class="mt-2">
      <input
        v-model.trim="modelValueRef"
        ref="inputElement"
        :type="type"
        :name="name"
        :id="id"
        :placeholder="placeholder"
        :autocomplete="autocomplete ? 'on' : 'off'"
        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-stone-600 sm:text-sm sm:leading-6"
      />
      <p v-if="error" class="text-red-600 text-sm m-0 p-0">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  label: string;
  required?: boolean;
  modelValue: string | undefined;
  type: string;
  name: string;
  id: string;
  placeholder?: string;
  autocomplete?: string;
  error?: string;
  autofocus?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['update:modelValue']);

const {
  label,
  required,
  modelValue,
  type,
  name,
  id,
  placeholder,
  autocomplete,
  error,
  autofocus,
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
