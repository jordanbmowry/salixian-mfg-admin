<template>
  <div class="container flex flex-col h-full">
    <div class="placeholder-rows flex-grow overflow-hidden flex flex-col">
      <div
        v-for="row in rows"
        :key="'p-row-' + row"
        class="placeholder-row placeholder flex-grow h-4 my-2"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  rows: {
    type: Number,
    default: 10,
  },
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
