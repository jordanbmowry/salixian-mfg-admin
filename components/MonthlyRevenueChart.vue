<template>
  <ClientOnly>
    <div>
      <h2 class="text-center mb-6">Total Revenue by month</h2>
      <BarChart :chartData="chartData" :options="options" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { BarChart } from 'vue-chart-3';
import type { ChartData } from 'chart.js';
import { ref, watchEffect } from 'vue';

const props = defineProps({
  monthlyRevenueData: {
    type: Object,
    required: true,
  },
});

const chartData = ref<ChartData>({ labels: [], datasets: [] });

watchEffect(() => {
  chartData.value = {
    labels: props.monthlyRevenueData.months,
    datasets: [
      {
        label: 'Monthly Revenues',
        data: props.monthlyRevenueData.revenues,
        backgroundColor: 'rgba(144, 238, 144, 0.2)',
        borderColor: 'rgba(0, 128, 0, 1)',
        borderWidth: 1,
      },
    ],
  };
});

const options = ref({
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      beginAtZero: true,
    },
    y: {
      beginAtZero: true,
    },
  },
});
</script>
