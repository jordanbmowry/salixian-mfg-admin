<script lang="ts" setup>
useHead({
  title: 'SalixianMFG Admin',
  meta: [
    {
      name: 'msapplication-config',
      content: '/assets/favicons/browserconfig.xml',
    },
    {
      name: 'msapplication-TileColor',
      content: '#DAC0A3',
    },
    {
      name: 'theme-color',
      content: '#0F2C59',
    },
    {
      name: 'description',
      content: 'Front end for managing users, customers, and orders.',
    },

    {
      property: 'og:url',
      content: 'https://www.instagram.com/salixiangunworks/',
    },
    {
      property: 'og:title',
      content: 'SalixianMFG Admin',
    },
    {
      property: 'og:description',
      content: 'Front end for managing users, customers, and orders.',
    },
  ],
});
</script>

<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
