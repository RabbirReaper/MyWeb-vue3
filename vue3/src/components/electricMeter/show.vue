<template>
  <div class="row mt-2">
    <div class="mb-4">
      <h1 class="text-center fs-1">電錶記錄分析</h1>
      
      <!-- 電價設定 -->
      <div class="col-12 col-md-6 offset-md-3 mb-4">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">電價設定</h5>
          </div>
          <div class="card-body">
            <div class="input-group">
              <span class="input-group-text">每度電價</span>
              <input type="number" 
                class="form-control" 
                step="0.1" 
                v-model="electricityRate" 
                @input="updateCalculations">
              <span class="input-group-text">元</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 統計摘要 -->
    <div class="row mb-4" v-if="Array.isArray(readings) && readings.length > 0">
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title text-primary">總記錄數</h5>
            <h3 class="card-text">{{ readings.length }}</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title text-info">平均日用量</h5>
            <h3 class="card-text">{{ formatNumber(averageDailyUsage) }} 度</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title text-warning">預估月用量</h5>
            <h3 class="card-text">{{ formatNumber(predictedMonthlyUsage) }} 度</h3>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card text-center">
          <div class="card-body">
            <h5 class="card-title text-success">預估月費用</h5>
            <h3 class="card-text">{{ formatCurrency(predictedMonthlyCost) }}</h3>
          </div>
        </div>
      </div>
    </div>

    <!-- 圖表區域 -->
    <div class="row mb-4" v-if="Array.isArray(readings) && readings.length > 1">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">電錶讀數趨勢</h5>
          </div>
          <div class="card-body">
            <Line :data="readingChartData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>

    <div class="row mb-4" v-if="Array.isArray(readings) && readings.length > 1">
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">平均日用量趨勢</h5>
          </div>
          <div class="card-body">
            <Line :data="usageChartData" :options="usageChartOptions" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">期間費用趨勢</h5>
          </div>
          <div class="card-body">
            <Line :data="costChartData" :options="costChartOptions" />
          </div>
        </div>
      </div>
    </div>

    <!-- 記錄表格 -->
    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-header">
            <h5 class="mb-0">記錄明細</h5>
          </div>
          <div class="card-body">
            <div class="table-responsive" v-if="Array.isArray(readings) && readings.length > 0">
              <table class="table table-striped">
                <thead>
                  <tr>
                    <th>記錄日期</th>
                    <th>電錶讀數</th>
                    <th>間隔天數</th>
                    <th>期間用量</th>
                    <th>平均日用量</th>
                    <th>期間費用</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="reading in sortedReadings" :key="reading._id">
                    <td>{{ formatDateTime(reading.date) }}</td>
                    <td>{{ formatNumber(reading.reading || 0) }} 度</td>
                    <td>
                      <span v-if="reading.daysDiff">{{ reading.daysDiff }} 天</span>
                      <span v-else class="text-muted">首次記錄</span>
                    </td>
                    <td>{{ formatNumber(reading.periodUsage || 0) }} 度</td>
                    <td>{{ formatNumber(reading.dailyUsage || 0) }} 度</td>
                    <td>{{ formatCurrency(reading.cost || 0) }}</td>
                    <td>
                      <button class="btn btn-sm btn-outline-danger" @click="deleteReading(reading._id)">
                        刪除
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="text-center py-4">
              <p class="text-muted">尚無記錄資料</p>
              <router-link to="/Tool/electricMeter/create" class="btn btn-primary">
                新增第一筆記錄
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js'
import axios from 'axios'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const readings = ref([])
const electricityRate = ref(5.5)

// 格式化數字
const formatNumber = (num) => {
  return new Intl.NumberFormat('zh-TW', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(num)
}

// 格式化貨幣
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

// 格式化日期時間 - 確保顯示當地時間
const formatDateTime = (dateStr) => {
  const date = new Date(dateStr)
  return date.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Taipei' // 明確指定台灣時區
  })
}

// 排序後的記錄
const sortedReadings = computed(() => {
  if (!Array.isArray(readings.value)) return []
  return [...readings.value].sort((a, b) => new Date(b.date) - new Date(a.date))
})

// 計算平均日用量
const averageDailyUsage = computed(() => {
  if (!Array.isArray(readings.value) || readings.value.length === 0) return 0
  const totalUsage = readings.value.reduce((sum, reading) => sum + (reading.dailyUsage || 0), 0)
  return totalUsage / readings.value.length
})

// 預測月用量
const predictedMonthlyUsage = computed(() => {
  return averageDailyUsage.value * 30
})

// 預測月費用
const predictedMonthlyCost = computed(() => {
  return predictedMonthlyUsage.value * electricityRate.value
})

// 電錶讀數圖表數據
const readingChartData = computed(() => {
  if (!Array.isArray(readings.value) || readings.value.length === 0) {
    return {
      labels: [],
      datasets: [{
        label: '電錶讀數 (度)',
        data: [],
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    }
  }
  
  const sortedData = [...readings.value].sort((a, b) => new Date(a.date) - new Date(b.date))
  return {
    labels: sortedData.map(r => new Date(r.date).toLocaleDateString('zh-TW')),
    datasets: [{
      label: '電錶讀數 (度)',
      data: sortedData.map(r => r.reading || 0),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }
})

// 用量圖表數據 - 顯示平均日用量
const usageChartData = computed(() => {
  if (!Array.isArray(readings.value) || readings.value.length === 0) {
    return {
      labels: [],
      datasets: [{
        label: '平均日用量 (度)',
        data: [],
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4,
        fill: true
      }]
    }
  }
  
  const sortedData = [...readings.value].sort((a, b) => new Date(a.date) - new Date(b.date))
  return {
    labels: sortedData.map(r => new Date(r.date).toLocaleDateString('zh-TW')),
    datasets: [{
      label: '平均日用量 (度)',
      data: sortedData.map(r => r.dailyUsage || 0),
      borderColor: '#10B981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }
})

// 費用圖表數據 - 顯示期間費用
const costChartData = computed(() => {
  if (!Array.isArray(readings.value) || readings.value.length === 0) {
    return {
      labels: [],
      datasets: [{
        label: '期間費用 (元)',
        data: [],
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true
      }]
    }
  }
  
  const sortedData = [...readings.value].sort((a, b) => new Date(a.date) - new Date(b.date))
  return {
    labels: sortedData.map(r => new Date(r.date).toLocaleDateString('zh-TW')),
    datasets: [{
      label: '期間費用 (元)',
      data: sortedData.map(r => r.cost || 0),
      borderColor: '#F59E0B',
      backgroundColor: 'rgba(245, 158, 11, 0.1)',
      tension: 0.4,
      fill: true
    }]
  }
})

// 圖表選項
const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${formatNumber(context.raw)}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false
    }
  }
}

const usageChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${formatNumber(context.raw)}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

const costChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top',
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `${context.dataset.label}: ${formatCurrency(context.raw)}`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true
    }
  }
}

// 獲取所有記錄
const getElectricMeterReadings = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/electricMeter`
    });
    readings.value = Array.isArray(response.data) ? response.data : []
  } catch (error) {
    console.error('Error fetching readings:', error);
    readings.value = [] // 確保在錯誤時設置為空陣列
  }
}

// 刪除記錄
const deleteReading = async (id) => {
  if (!confirm('確定要刪除這筆記錄嗎？')) return
  
  try {
    await axios({
      method: 'delete',
      url: `${API_BASE_URL}/electricMeter/${id}`
    })
    await getElectricMeterReadings()
  } catch (error) {
    console.error('Error deleting reading:', error)
    alert('刪除失敗，請重試')
  }
}

// 更新計算（當電價改變時）
const updateCalculations = () => {
  // 重新計算費用（如果需要的話，可以調用API更新）
  console.log('電價更新為:', electricityRate.value)
}

onMounted(async () => {
  await getElectricMeterReadings()
})
</script>

<style scoped>
.table-responsive {
  margin-top: 1rem;
}

.card {
  margin-bottom: 1rem;
}

.btn-sm {
  padding: 0.25rem 0.5rem;
  font-size: 0.875rem;
}
</style>