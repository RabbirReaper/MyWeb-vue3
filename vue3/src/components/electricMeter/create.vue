<template>
  <form class="row g-2 g-md-3 needs-validation" @submit.prevent="handleSubmit" novalidate>
    <h1 class="text-center fs-1 px-2">新增電錶記錄</h1>
    <div class="col-12 col-md-6 offset-md-3 px-2 px-md-0 validated-form">
      <div class="mb-2 mb-md-3">
        <label for="reading" class="form-label">電錶讀數</label>
        <div class="input-group has-validation">
          <input class="form-control" 
            :class="{ 'is-invalid': errors.reading, 'is-valid': reading > 0 && !errors.reading }"
            type="number" 
            step="0.1"
            id="reading" 
            v-model="reading" 
            @input="validateField('reading')" 
            required
            placeholder="請輸入電錶讀數">
          <span class="input-group-text">度</span>
          <div class="invalid-feedback">
            請輸入有效的電錶讀數。
          </div>
        </div>
      </div>

      <div class="mb-2 mb-md-3">
        <label for="date" class="form-label">記錄日期</label>
        <input type="date" 
          class="form-control" 
          :class="{ 'is-invalid': errors.date, 'is-valid': date && !errors.date }"
          v-model="date" 
          @input="validateField('date')" 
          required>
        <div class="invalid-feedback">
          請選擇記錄日期。
        </div>
      </div>

      <div class="mb-2 mb-md-3">
        <label for="time" class="form-label">記錄時間</label>
        <input type="time" 
          class="form-control" 
          :class="{ 'is-invalid': errors.time, 'is-valid': time && !errors.time }"
          v-model="time" 
          @input="validateField('time')" 
          required>
        <div class="invalid-feedback">
          請選擇記錄時間。
        </div>
      </div>

      <div class="mb-2 mb-md-3" v-if="lastReading && lastReading.reading && reading > 0">
        <div class="alert alert-info">
          <small>
            上次記錄：{{ formatNumber(lastReading.reading) }} 度 ({{ formatDateTime(lastReading.date) }})
            <br>
            預估期間用量：{{ formatNumber(Math.max(0, reading - lastReading.reading)) }} 度
            <br>
            間隔天數：{{ calculateDaysDiff() }} 天
            <br>
            預估平均日用量：{{ formatNumber(calculateDaysDiff() > 0 ? Math.max(0, reading - lastReading.reading) / calculateDaysDiff() : 0) }} 度/天
            <br>
            預估期間費用：{{ formatCurrency(Math.max(0, reading - lastReading.reading) * 5.5) }}
          </small>
        </div>
      </div>

      <div class="mb-2 mb-md-3">
        <button class="btn btn-primary" type="submit" :disabled="!isFormValid">
          提交記錄
        </button>
        <button class="btn btn-secondary ms-2" type="button" @click="resetForm">
          重置
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const router = useRouter()

const reading = ref(0)
const date = ref(new Date().toISOString().split('T')[0])
const time = ref(new Date().toTimeString().slice(0, 5))
const lastReading = ref(null)

const errors = reactive({
  reading: false,
  date: false,
  time: false
})

// 驗證單個欄位
const validateField = (field) => {
  errors[field] = false

  switch (field) {
    case 'reading':
      if (!reading.value || reading.value <= 0) {
        errors.reading = true
      }
      break
    case 'date':
      if (!date.value) {
        errors.date = true
      }
      break
    case 'time':
      if (!time.value) {
        errors.time = true
      }
      break
  }
}

// 計算整個表單是否有效
const isFormValid = computed(() => {
  return !Object.values(errors).some(error => error) &&
    reading.value > 0 &&
    date.value &&
    time.value
})

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

// 計算天數差 - 修正時區處理
const calculateDaysDiff = () => {
  if (!lastReading.value || !date.value || !time.value) return 0
  
  // 建立當前記錄時間（當地時間）
  const currentDateTime = new Date(`${date.value}T${time.value}:00`)
  // 上次記錄時間
  const lastDateTime = new Date(lastReading.value.date)
  
  const timeDiff = Math.abs(currentDateTime - lastDateTime)
  const diffDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24))
  
  return Math.max(1, diffDays)
}

// 重置表單
const resetForm = () => {
  reading.value = 0
  date.value = new Date().toISOString().split('T')[0]
  time.value = new Date().toTimeString().slice(0, 5)
  Object.keys(errors).forEach(key => errors[key] = false)
}

// 提交表單
const handleSubmit = async (event) => {
  // 再次驗證所有欄位
  Object.keys(errors).forEach(validateField)

  if (!isFormValid.value) {
    event.stopPropagation()
    return
  }

  try {
    await postElectricMeterReading()
    router.push({ path: '/Tool/electricMeter/show' })
  } catch (error) {
    console.error('Error submitting form:', error)
    alert('提交失敗，請重試')
  }
}

// 獲取最後一筆記錄
const getLastReading = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/electricMeter/last`
    });
    lastReading.value = response.data || null
  } catch (error) {
    console.error('Error fetching last reading:', error);
    lastReading.value = null
  }
}

// 提交電錶記錄
const postElectricMeterReading = async () => {
  // 直接使用當地時間字串，讓後端處理
  const datetimeString = `${date.value}T${time.value}:00`
  
  return await axios({
    method: 'post',
    url: `${API_BASE_URL}/electricMeter`,
    data: {
      reading: reading.value,
      date: datetimeString
    }
  })
}

onMounted(async () => {
  await getLastReading()
});
</script>

<style></style>