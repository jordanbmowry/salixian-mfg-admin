<template>
  <div>
    <label
      :for="inputId"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ label }}
      <font-awesome-icon
        v-if="required"
        class="text-red-500 ml-2"
        :icon="['fas', 'asterisk']"
      />
    </label>
    <Listbox as="div" v-model="selectedItem">
      <div class="relative">
        <ListboxButton
          @click="focusHiddenInput"
          :id="inputId"
          class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-stone-600 sm:text-sm sm:leading-6"
        >
          <span class="block truncate">{{ selectedItem.name }}</span>
          <span
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2"
          >
            <ChevronUpDownIcon
              class="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </ListboxButton>
        <p class="text-red-600 text-sm m-0 p-0" v-if="error">{{ error }}</p>
        <transition
          leave-active-class="transition ease-in duration-100"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ListboxOptions
            class="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            @keydown="handleKeydown"
          >
            <input
              v-model="searchQuery"
              class="w-0 h-0 opacity-0 overflow-hidden absolute"
              ref="hiddenInput"
            />
            <ListboxOption
              as="template"
              v-for="item in filteredItems"
              :key="item.value"
              :value="item"
              v-slot="{ active, selected }"
              @click="updateSelectedItem(item)"
            >
              <li
                :class="[
                  active ? 'bg-stone-600 text-white' : 'text-gray-900',
                  'relative cursor-default select-none py-2 pl-3 pr-9',
                ]"
              >
                <span
                  :class="[
                    selected ? 'font-semibold' : 'font-normal',
                    'block truncate',
                  ]"
                >
                  {{ item.name }}
                </span>
                <span
                  v-if="selected"
                  :class="[
                    active ? 'text-white' : 'text-stone-600',
                    'absolute inset-y-0 right-0 flex items-center pr-4',
                  ]"
                >
                  <CheckIcon class="h-5 w-5" aria-hidden="true" />
                </span>
              </li>
            </ListboxOption>
          </ListboxOptions>
        </transition>
      </div>
    </Listbox>
  </div>
</template>

<script setup lang="ts">
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/20/solid';

interface Item {
  name: string;
  value: string;
}

interface Props {
  required?: boolean;
  label: string;
  modelValue?: string;
  error?: string;
  items: Item[];
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  modelValue: '',
});

const { modelValue, items } = toRefs(props);
const emit = defineEmits(['update:modelValue']);

const inputId = `item-dropdown-${Math.random().toString(36).slice(2, 9)}`;
const defaultItem: Item = { name: '', value: '' };
const selectedItem: Ref<Item> = ref(
  items.value.find((i) => i.value === modelValue.value) || defaultItem
);
const searchQuery = ref('');
const hiddenInput = ref<HTMLInputElement | null>(null);

const filteredItems = computed(() => {
  if (!searchQuery.value) return items.value;
  return items.value.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const focusHiddenInput = () => {
  nextTick(() => {
    hiddenInput.value?.focus();
  });
};

const updateSelectedItem = (newItem: Item) => {
  selectedItem.value = newItem;
  emit('update:modelValue', newItem);
  searchQuery.value = '';
};

watch(
  modelValue,
  (newVal) => {
    const matchedItem = items.value.find((i) => i.value === newVal);
    if (matchedItem) {
      selectedItem.value = matchedItem;
    }
  },
  { immediate: true }
);

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === 'Space') {
    const activeOption = filteredItems.value.findIndex(
      (item) => item === selectedItem.value
    );
    if (activeOption !== -1) {
      updateSelectedItem(filteredItems.value[activeOption]);
    }
  }
};
</script>
