/**
 * Poo-Poo Dog Tracker - Chart Service
 * Copyright (c) 2024-2025 Giampietro Leonoro & Monica Amato. All Rights Reserved.
 */

import Chart from 'chart.js/auto';
import { CHART_COLORS, POOP_TYPES } from '../utils/constants.js';
import { formatDate } from '../utils/helpers.js';

export class ChartService {
  constructor() {
    this.charts = new Map();
  }

  /**
   * Create type distribution chart (pie/doughnut)
   */
  createTypeChart(canvasId, poops) {
    // Destroy existing chart
    this.destroyChart(canvasId);

    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    // Count types
    const typeCounts = {};
    poops.forEach(poop => {
      typeCounts[poop.type] = (typeCounts[poop.type] || 0) + 1;
    });

    // Prepare data
    const labels = [];
    const data = [];
    const colors = [];

    Object.entries(typeCounts).forEach(([type, count]) => {
      labels.push(POOP_TYPES[type]?.label || type);
      data.push(count);
      colors.push(CHART_COLORS[type] || '#999999');
    });

    const chart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors,
          borderWidth: 2,
          borderColor: '#fff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: 'Fredoka',
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        }
      }
    });

    this.charts.set(canvasId, chart);
    return chart;
  }

  /**
   * Create timeline chart (line/bar)
   */
  createTimelineChart(canvasId, poops, days = 30) {
    this.destroyChart(canvasId);

    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    // Group poops by date
    const dailyCounts = {};
    const now = new Date();

    // Initialize last N days
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      dailyCounts[dateStr] = { healthy: 0, problems: 0 };
    }

    // Count poops
    poops.forEach(poop => {
      const dateStr = new Date(poop.timestamp).toISOString().split('T')[0];
      if (dailyCounts[dateStr]) {
        if (poop.type === 'healthy') {
          dailyCounts[dateStr].healthy++;
        } else {
          dailyCounts[dateStr].problems++;
        }
      }
    });

    // Prepare data
    const labels = Object.keys(dailyCounts).map(dateStr => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' });
    });

    const healthyData = Object.values(dailyCounts).map(d => d.healthy);
    const problemsData = Object.values(dailyCounts).map(d => d.problems);

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Sane ✅',
            data: healthyData,
            borderColor: CHART_COLORS.healthy,
            backgroundColor: CHART_COLORS.healthy + '40',
            tension: 0.3,
            fill: true
          },
          {
            label: 'Problemi ⚠️',
            data: problemsData,
            borderColor: CHART_COLORS.diarrhea,
            backgroundColor: CHART_COLORS.diarrhea + '40',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: 'Fredoka',
                size: 12
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });

    this.charts.set(canvasId, chart);
    return chart;
  }

  /**
   * Create food correlation chart
   */
  createFoodChart(canvasId, poops) {
    this.destroyChart(canvasId);

    const ctx = document.getElementById(canvasId);
    if (!ctx) return null;

    // Group by food and count problems
    const foodStats = {};

    poops.forEach(poop => {
      if (!poop.food) return;

      if (!foodStats[poop.food]) {
        foodStats[poop.food] = { total: 0, healthy: 0, problems: 0 };
      }

      foodStats[poop.food].total++;

      if (poop.type === 'healthy') {
        foodStats[poop.food].healthy++;
      } else {
        foodStats[poop.food].problems++;
      }
    });

    // Sort by total count and take top 10
    const sortedFoods = Object.entries(foodStats)
      .sort((a, b) => b[1].total - a[1].total)
      .slice(0, 10);

    const labels = sortedFoods.map(([food]) => food);
    const healthyData = sortedFoods.map(([, stats]) => stats.healthy);
    const problemsData = sortedFoods.map(([, stats]) => stats.problems);

    const chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Sane ✅',
            data: healthyData,
            backgroundColor: CHART_COLORS.healthy,
            stack: 'Stack 0'
          },
          {
            label: 'Problemi ⚠️',
            data: problemsData,
            backgroundColor: CHART_COLORS.diarrhea,
            stack: 'Stack 0'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: {
                family: 'Fredoka',
                size: 12
              }
            }
          },
          tooltip: {
            callbacks: {
              footer: function(tooltipItems) {
                const index = tooltipItems[0].dataIndex;
                const healthy = healthyData[index];
                const problems = problemsData[index];
                const total = healthy + problems;
                const problemRate = ((problems / total) * 100).toFixed(1);
                return `Tasso problemi: ${problemRate}%`;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              font: {
                size: 10
              },
              maxRotation: 45,
              minRotation: 45
            }
          },
          y: {
            stacked: true,
            beginAtZero: true,
            ticks: {
              stepSize: 1
            }
          }
        }
      }
    });

    this.charts.set(canvasId, chart);
    return chart;
  }

  /**
   * Update all charts with new data
   */
  updateAllCharts(poops) {
    this.charts.forEach((chart, canvasId) => {
      if (canvasId.includes('type')) {
        this.createTypeChart(canvasId, poops);
      } else if (canvasId.includes('timeline')) {
        this.createTimelineChart(canvasId, poops);
      } else if (canvasId.includes('food')) {
        this.createFoodChart(canvasId, poops);
      }
    });
  }

  /**
   * Destroy specific chart
   */
  destroyChart(canvasId) {
    const chart = this.charts.get(canvasId);
    if (chart) {
      chart.destroy();
      this.charts.delete(canvasId);
    }
  }

  /**
   * Destroy all charts
   */
  destroyAllCharts() {
    this.charts.forEach(chart => chart.destroy());
    this.charts.clear();
  }

  /**
   * Get chart instance
   */
  getChart(canvasId) {
    return this.charts.get(canvasId);
  }
}
