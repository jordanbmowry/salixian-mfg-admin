<template>
  <div style="height: 80dvh" class="flex flex-col h-full" ref="container">
    <div
      class="placeholder-rows flex-grow overflow-hidden flex flex-col h-full"
    >
      <div
        v-for="n in computedRows"
        :key="'p-row-' + n"
        class="placeholder-row placeholder flex-grow"
      ></div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  rowHeight: {
    type: Number,
    default: 20,
  },
});

const container = ref(null);
const computedRows = computed(() => {
  if (container.value) {
    const containerHeight = container.value.clientHeight;
    return Math.floor(containerHeight / props.rowHeight);
  }
  return 0;
});

onMounted(() => {
  window.addEventListener('resize', () => {
    computedRows.value;
  });
});
</script>

<style>
@keyframes shimmer {
  0% {
    background-position: -400px 0;
  }
  100% {
    background-position: 400px 0;
  }
}

.placeholder {
  background-color: rgba(114, 145, 141, 0.03);
  background-image: linear-gradient(
    to right,
    rgba(114, 145, 141, 0.03) 0%,
    rgba(114, 145, 141, 0.15) 20%,
    rgba(114, 145, 141, 0.03) 40%,
    rgba(114, 145, 141, 0.03) 100%
  );
  background-size: 800px 100px;
  border-radius: 0.25rem;
  animation-duration: 1s;
  animation-fill-mode: forwards;
  animation-iteration-count: infinite;
  animation-name: shimmer;
  animation-timing-function: linear;
}

.placeholder-row {
  display: flex;
  width: 100%;
  float: left;
  clear: both;
}
</style>
