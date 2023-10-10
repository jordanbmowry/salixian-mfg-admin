<script setup lang="ts">
import { formatMoney, formatDate } from '~/utils';

const numberOfCustomers = ref<number>();
const numberOfOrders = ref<number>();
const totalRevenue = ref<number>();
const selectedDates = ref<string[]>([
  new Date(new Date().getFullYear(), 0, 1).toISOString(),
  new Date().toISOString(),
]);
const monthlyRevenueData = ref<{ months: number[]; revenues: number[] }>();
const orderStatusData = ref<{ counts: number[]; statuses: string[] }>();
const isErrorShowing = ref(false);
const isLoading = ref(false);

const fetchData = async (url: string) => {
  try {
    isLoading.value = true;
    const data = await useFetchWithCache(url);
    // @ts-ignore
    const {
      revenue,
      orderCount,
      customerCount,
      monthlyRevenue,
      orderStatusDistribution,
    } = data.value?.data;
    numberOfCustomers.value = customerCount;
    numberOfOrders.value = orderCount;
    totalRevenue.value = revenue;
    monthlyRevenueData.value = monthlyRevenue;
    orderStatusData.value = orderStatusDistribution;
  } catch (error) {
    isErrorShowing.value = true;
    console.error('Error fetching the data: ', error);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  fetchData(
    `/stats?startDate=${selectedDates.value[0]}&endDate=${selectedDates.value[1]}`
  );
});

watch(selectedDates, () => {
  if (selectedDates.value.length === 2) {
    fetchData(
      `/stats?startDate=${selectedDates.value[0]}&endDate=${selectedDates.value[1]}`
    );
  }
});

const formattedNumberOfCustomers = computed(() => {
  return numberOfCustomers.value?.toLocaleString();
});
const formattedStartDate = computed(() => formatDate(selectedDates.value[0]));
const formattedEndDate = computed(() => formatDate(selectedDates.value[1]));

const formattedNumberOfOrders = computed(() =>
  numberOfOrders.value?.toLocaleString()
);

const formattedTotalRevenue = computed(() =>
  // @ts-ignore
  formatMoney(totalRevenue?.value)
);

const stats = ref([
  {
    id: 1,
    name: 'Customers',
    stat: formattedNumberOfCustomers,
    icon: 'ic:round-supervised-user-circle',
  },
  {
    id: 2,
    name: 'Orders',
    stat: formattedNumberOfOrders,
    icon: 'icon-park-outline:notes',
  },
  {
    id: 3,
    name: 'Revenue',
    stat: formattedTotalRevenue,
    icon: 'ic:baseline-attach-money',
  },
]);
</script>

<template>
  <NotificationToast
    type="error"
    :isVisible="isErrorShowing"
    :dismissible="true"
    @dismiss="() => (isErrorShowing = false)"
    message="Failed to fetch data."
  />
  <div>
    <h1 class="font-semibold leading-6 text-4xl pb-10">Dashboard</h1>
    <TableLoader v-if="isLoading" />
    <div v-else>
      <DatePicker type="date" v-model="selectedDates" range />

      <h2 class="text-3xl font-semibold leading-6 text-gray-900 pt-10 pb-6">
        Stats:
        <span class="text-xl"
          >{{ formattedStartDate }} - {{ formattedEndDate }}</span
        >
      </h2>

      <dl class="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="item in stats"
          :key="item.id"
          class="relative overflow-hidden rounded-lg bg-white px-4 pb-12 pt-5 shadow sm:px-6 sm:pt-6"
        >
          <dt>
            <div class="absolute rounded-md bg-stone-500 p-3">
              <Icon class="text-white" :name="item.icon" />
            </div>
            <p class="ml-16 truncate text-sm font-medium text-gray-500">
              {{ item.name }}
            </p>
          </dt>
          <dd class="ml-16 flex items-baseline pb-6 sm:pb-7">
            <p class="text-2xl font-semibold text-gray-900">{{ item.stat }}</p>
          </dd>
        </div>
      </dl>
      <div class="grid xl:grid-cols-2 gap-4 mt-10">
        <MonthlyRevenueChart
          v-if="monthlyRevenueData"
          :monthlyRevenueData="monthlyRevenueData"
        />
        <OrderStatusDistributionChart
          v-if="orderStatusData"
          :orderStatusDistributionData="orderStatusData"
        />
      </div>
    </div>
  </div>
</template>
