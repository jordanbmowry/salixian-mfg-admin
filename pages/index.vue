<script setup lang="ts">
const baseURL = useRuntimeConfig().public.baseURL;
const users = ref(null);

const onClick = async () => {
  try {
    const response = await useFetch(`${baseURL}/users`, {
      credentials: 'include',
    });
    // @ts-ignore
    users.value = response.data.value;
  } catch (error) {
    // Handle the error here
    console.error(error);
  }
};
</script>

<template>
  <button @click="onClick">Get users</button>
  <div v-if="users">{{ users }}</div>
</template>
