<template>
  <div>
    <h2>Order Status Distribution by Month</h2>
    <BarChart :chartData="chartData" :options="options" />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect, defineProps } from 'vue';
import { BarChart } from 'vue-chart-3';
import type { ChartData } from 'chart.js';

const props = defineProps({
  orderStatusDistributionData: {
    type: Object,
    required: true,
  },
});

const isDataAvailable = ref(
  props.orderStatusDistributionData !== null &&
    props.orderStatusDistributionData !== undefined
);

const chartData = ref<ChartData>({ labels: [], datasets: [] });

const options = ref({
  plugins: {
    legend: {
      display: true,
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

watchEffect(() => {
  if (isDataAvailable.value) {
    const statusCounts: Record<string, Record<string, number>> = {};
    props.orderStatusDistributionData.date.forEach((date, index) => {
      const status = props.orderStatusDistributionData.statuses[index];
      const count = props.orderStatusDistributionData.counts[index];
      statusCounts[date] = statusCounts[date] || {};
      statusCounts[date][status] = (statusCounts[date][status] || 0) + count;
    });

    const labels = Object.keys(statusCounts);
    const allStatuses = Array.from(
      new Set(props.orderStatusDistributionData.statuses)
    );
    const datasets = allStatuses.map((status) => ({
      label: status,
      data: labels.map((label) => statusCounts[label][status] || 0),
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      borderColor: 'rgba(75, 192, 192, 1)',
      borderWidth: 1,
    }));

    chartData.value = {
      labels,
      datasets,
    };
  }
});
</script>
