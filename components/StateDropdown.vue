<template>
  <div class="sm:col-span-full xl:sm:col-span-2">
    <label
      :for="inputId"
      class="block text-sm font-medium leading-6 text-gray-900"
    >
      {{ label }}
      <font-awesome-icon
        class="text-red-500 ml-2"
        :icon="['fas', 'asterisk']"
      />
    </label>
    <Listbox as="div" v-model="selectedState">
      <div class="relative">
        <ListboxButton
          @click="focusHiddenInput"
          :id="inputId"
          class="relative w-full cursor-default rounded-md bg-white py-1.5 pl-3 pr-10 text-left text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        >
          <span class="block truncate">{{ selectedState.name }}</span>
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
          >
            <input
              v-model="searchQuery"
              class="w-0 h-0 opacity-0 overflow-hidden absolute"
              @input="onSearchInput"
              ref="hiddenInput"
            />
            <ListboxOption
              as="template"
              v-for="state in filteredStates"
              :key="state.value"
              :value="state"
              v-slot="{ active, selected }"
              @click="updateSelectedState(state)"
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
                  {{ state.name }}
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

<script setup>
import { ref, defineProps, defineEmits, watch, computed, nextTick } from 'vue';
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/vue';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  modelValue: {
    type: String,
    default: '',
  },
  error: String,
  states: {
    type: Array,
    required: true,
  },
});

const { modelValue, states } = toRefs(props);
const emit = defineEmits(['update:modelValue']);

const inputId = `state-dropdown-${Math.random().toString(36).substr(2, 9)}`;
const defaultState = { name: '', value: '' };
const selectedState = ref(
  states.value.find((s) => s.value === modelValue.value) || defaultState
);
const searchQuery = ref('');
const hiddenInput = ref(null);

const filteredStates = computed(() => {
  if (!searchQuery.value) return states.value;
  return states.value.filter((state) =>
    state.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const focusHiddenInput = () => {
  nextTick(() => {
    hiddenInput.value.focus();
  });
};

const updateSelectedState = (newState) => {
  selectedState.value = newState;
  emit('update:modelValue', selectedState.value);
  searchQuery.value = '';
};

watch(
  modelValue,
  (newVal) => {
    const matchedState = states.value.find((s) => s.value === newVal);
    if (matchedState) {
      selectedState.value = matchedState;
    }
  },
  { immediate: true }
);
</script>
