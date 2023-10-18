<template>
  <ClientOnly>
    <div>
      <h2 class="text-center mb-6">Order Status Distribution by Month</h2>
      <BarChart :chartData="chartData" :options="options" />
    </div>
  </ClientOnly>
</template>

<script setup lang="ts">
import { BarChart } from 'vue-chart-3';
import type { ChartData } from 'chart.js';

interface OrderStatusDistributionDataProps {
  date: string[];
  statuses: string[];
  counts: number[];
}

const props = defineProps({
  orderStatusDistributionData: {
    type: Object as () => OrderStatusDistributionDataProps,
    required: true,
  },
});

const isDataAvailable = ref(
  props.orderStatusDistributionData !== null &&
    props.orderStatusDistributionData !== undefined
);

const chartData = ref<ChartData<'bar', number[], string>>({
  labels: [],
  datasets: [],
});

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
    const backgroundColors = [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 206, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(153, 102, 255, 0.2)',
    ];
    const borderColors = [
      'rgba(255, 99, 132, 1)',
      'rgba(255, 206, 86, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(153, 102, 255, 1)',
    ];

    const datasets = allStatuses.map((status, index) => ({
      label: status,
      data: labels.map((label) => statusCounts[label][status] || 0),
      backgroundColor: backgroundColors[index],
      borderColor: borderColors[index],
      borderWidth: 1,
    }));

    chartData.value = {
      labels,
      datasets,
    };
  }
});
</script>
