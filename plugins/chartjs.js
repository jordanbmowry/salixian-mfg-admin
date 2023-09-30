import {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  BarController,
  CategoryScale,
  LinearScale,
  PieController, // Import PieController
  ArcElement, // Import ArcElement
} from 'chart.js';
export default defineNuxtPlugin(() => {
  Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    BarController,
    PieController,
    ArcElement
  );
});
