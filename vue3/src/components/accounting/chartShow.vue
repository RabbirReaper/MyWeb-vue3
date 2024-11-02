<template>
  <div>
    <div class="row mt-4">
      <div class="col-12">
        <div class="card mb-4">
          <div class="card-header">
            <h3>支出收入比例分析</h3>
          </div>
          <div class="card-body">
            <div class="row align-items-center">
              <div class="col-md-6">
                <Doughnut :data="expenseRatioData" :options="expenseRatioOptions" class="mx-auto"
                  style="max-width: 300px;" />
              </div>
              <div class="col-md-6">
                <div class="summary-box p-4">
                  <h4 class="mb-3">財務概要</h4>
                  <div class="summary-item">
                    <div>總收入：<span class="text-success">{{ formatAmount(totalIncome) }}</span></div>
                  </div>
                  <div class="summary-item">
                    <div>總支出：<span class="text-danger">{{ formatAmount(totalExpense) }}</span></div>
                  </div>
                  <div class="summary-item">
                    <div>收支比：<span :class="expenseRatio <= 100 ? 'text-success' : 'text-danger'">
                        {{ expenseRatio }}%
                      </span></div>
                  </div>
                  <div class="summary-item">
                    <div>結餘：<span :class="netIncome >= 0 ? 'text-success' : 'text-danger'">
                        {{ formatAmount(netIncome) }}
                      </span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="row">
      <!-- 原有的收入支出圓餅圖 -->
      <div class="col-md-6">
        <!-- 收入分析卡片 (保持不變) -->
        <div class="card mb-4">
          <div class="card-header">
            <h3>收入分析</h3>
          </div>
          <div class="card-body">
            <Pie :data="incomeChartData" :options="chartOptions" class="mx-auto" style="max-width: 400px;" />
            <div class="mt-3">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>類別</th>
                    <th>金額</th>
                    <th>佔比</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in sortedIncomeDetails" :key="index">
                    <td>{{ item.category }}</td>
                    <td>{{ formatAmount(item.amount) }}</td>
                    <td>{{ item.percentage }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <!-- 支出分析卡片 (保持不變) -->
        <div class="card mb-4">
          <div class="card-header">
            <h3>支出分析</h3>
          </div>
          <div class="card-body">
            <Pie :data="expenseChartData" :options="chartOptions" class="mx-auto" style="max-width: 400px;" />
            <div class="mt-3">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>類別</th>
                    <th>金額</th>
                    <th>佔比</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(item, index) in sortedExpenseDetails" :key="index">
                    <td>{{ item.category }}</td>
                    <td>{{ formatAmount(item.amount) }}</td>
                    <td>{{ item.percentage }}%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增的支出占收入比例分析卡片 -->

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Pie, Doughnut } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

const props = defineProps({
  cashFlowsGroupedByCategory: {
    type: Object,
    required: true
  }
})

// 圖表顏色配置
const chartColors = [
  '#6094D1', '#E6B800', '#5EB683', '#D96D6B', '#8D86C9',
  '#D89C56', '#B985C5', '#56A8A4', '#CCAD4E', '#D67C8C'
]



// 格式化金額
const formatAmount = (amount) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// 計算總收入
const totalIncome = computed(() => {
  return Object.values(props.cashFlowsGroupedByCategory)
    .filter(value => value.type === 'income')
    .reduce((sum, value) => sum + value.total, 0)
})

// 計算總支出
const totalExpense = computed(() => {
  return Object.values(props.cashFlowsGroupedByCategory)
    .filter(value => value.type === 'expense')
    .reduce((sum, value) => sum + value.total, 0)
})

// 計算淨收入（結餘）
const netIncome = computed(() => {
  return totalIncome.value - totalExpense.value
})

// 計算支出占收入比例
const expenseRatio = computed(() => {
  return ((totalExpense.value / totalIncome.value) * 100).toFixed(1)
})

// 原有的收入明細計算 (保持不變)
const incomeDetails = computed(() => {
  const incomeItems = Object.entries(props.cashFlowsGroupedByCategory)
    .filter(([_, value]) => value.type === 'income')

  return incomeItems.map(([category, value]) => ({
    category,
    amount: value.total,
    percentage: Number(((value.total / totalIncome.value) * 100).toFixed(1))
  }))
})

// 原有的支出明細計算 (保持不變)
const expenseDetails = computed(() => {
  const expenseItems = Object.entries(props.cashFlowsGroupedByCategory)
    .filter(([_, value]) => value.type === 'expense')

  return expenseItems.map(([category, value]) => ({
    category,
    amount: value.total,
    percentage: Number(((value.total / totalExpense.value) * 100).toFixed(1))
  }))
})

// 排序後的收入和支出數據 (保持不變)
const sortedIncomeDetails = computed(() => {
  return [...incomeDetails.value].sort((a, b) => b.percentage - a.percentage)
})

const sortedExpenseDetails = computed(() => {
  return [...expenseDetails.value].sort((a, b) => b.percentage - a.percentage)
})

// 收入支出圓餅圖數據 (保持不變)
const incomeChartData = computed(() => ({
  labels: sortedIncomeDetails.value.map(item => `${item.category} (${item.percentage}%)`),
  datasets: [{
    data: sortedIncomeDetails.value.map(item => item.amount),
    backgroundColor: chartColors.slice(0, sortedIncomeDetails.value.length),
    borderWidth: 1
  }]
}))

const expenseChartData = computed(() => ({
  labels: sortedExpenseDetails.value.map(item => `${item.category} (${item.percentage}%)`),
  datasets: [{
    data: sortedExpenseDetails.value.map(item => item.amount),
    backgroundColor: chartColors.slice(0, sortedExpenseDetails.value.length),
    borderWidth: 1
  }]
}))

// 新增：支出收入比例環形圖數據
const expenseRatioData = computed(() => ({
  labels: ['支出', '剩餘'],
  datasets: [{
    data: [
      Number(expenseRatio.value),
      Math.max(0, 100 - Number(expenseRatio.value))
    ],
    backgroundColor: ['#FF6384', '#36A2EB'],
    borderWidth: 1
  }]
}))

// 原有的圖表配置
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          const label = context.label || '';
          const value = context.raw || 0;
          return `${label}: ${formatAmount(value)}`;
        }
      }
    }
  }
}

// 新增：支出比例環形圖配置
const expenseRatioOptions = {
  responsive: true,
  cutout: '70%',
  plugins: {
    legend: {
      position: 'bottom'
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.label}: ${context.raw}%`;
        }
      }
    }
  }
}
</script>

<style scoped>

.table {
  font-size: 0.9rem;
}

.summary-box {
  background-color: #f8f9fa;
  border-radius: 8px;
}

.summary-item {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.text-success {
  color: #28a745;
  font-weight: bold;
}

.text-danger {
  color: #dc3545;
  font-weight: bold;
}
</style>