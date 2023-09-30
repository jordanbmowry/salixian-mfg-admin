<template>
  <div>
    <h2>Total Revenue by month</h2>
    <BarChart :chartData="chartData" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { BarChart } from 'vue-chart-3';
import type { ChartData } from 'chart.js';
import { ref } from 'vue';

const props = defineProps({
  monthlyRevenueData: {
    type: Object,
    required: true,
  },
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

const chartData = ref({
  labels: props.monthlyRevenueData.months.map((month: string) => month),
  datasets: [
    {
      label: 'Monthly Revenues',
      data: props.monthlyRevenueData.revenues,
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    },
  ],
});
</script>
