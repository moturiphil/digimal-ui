<template>
  <!-- Your chart HTML template here -->
  <canvas class="bar" style="margin-bottom: 20px;" height="190"></canvas>
</template>

<script>
import Chart from 'chart.js';

export default {
  name: 'ChartJs',
  mounted() {
    const chartElement = document.querySelector('.bar');
    new Chart(chartElement, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            data: [20, 60, 50, 45, 50, 60, 70, 40, 45, 35, 25, 30],
            backgroundColor: '#001737',
            barPercentage: 0.6,
          },
          {
            data: [10, 40, 30, 40, 60, 55, 45, 35, 30, 20, 15, 20],
            backgroundColor: '#1ce1ac',
            barPercentage: 0.6,
          },
        ],
      },
      options: {
        maintainAspectRatio: true,
        responsive: true,
        legend: {
          display: false,
          labels: {
            display: false,
          },
        },
        scales: {
          yAxes: [
            {
              gridLines: {
                color: '#e5e9f2',
              },
              ticks: {
                beginAtZero: true,
                fontSize: 10,
                fontColor: '#182b49',
                max: 80,
              },
            },
          ],
          xAxes: [
            {
              gridLines: {
                display: false,
              },
              ticks: {
                beginAtZero: true,
                fontSize: 11,
                fontColor: '#182b49',
              },
            },
          ],
        },
      },
    });
  },
};
</script>
