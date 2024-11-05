<template>
  <div>
    <!-- 卡片網格加上 radio buttons -->
    <div class="d-grid justify-content-center"
      style="grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); gap: 1rem;">
      <div v-for="(categoryCashFlow, category) in sortedCashFlowsGroupedByCategory" :key="category"
        class="card border-dark m-3" style="width: 18rem;">
        <div class="card-header bg-transparent border-success d-flex align-items-center">
          <div class="form-check me-2">
            <input class="form-check-input" type="radio" :id="category" :value="category" v-model="selectedCategory"
              name="category-radio">
            <label class="form-check-label" :for="category">
              {{ category }}
            </label>
          </div>
        </div>
        <div class="card-body">
          <p class="fs-2 mb-0 text-decoration-none" :class="{
            'text-success': categoryCashFlow.type === 'income',
            'text-danger': categoryCashFlow.type === 'expense'
          }">
            {{ categoryCashFlow.total }}
          </p>
          <p class="text-end text-muted pb-0 mb-0">{{ category }}</p>
        </div>
      </div>
    </div>

    <!-- 表格區域 - 只顯示選中的類別 -->
    <div v-if="selectedCategory && ananalyzeCashFlows[selectedCategory]" class="mb-4 mt-4">
      <h3>{{ selectedCategory }}</h3>
      <div class="table-responsive">
        <table class="table table-striped table-fixed">
          <colgroup>
            <col style="width: 2%">
            <col style="width: 1%">
            <col style="width: 1%">
            <col style="width: 1%">
            <col style="width: 1%">
          </colgroup>
          <thead>
            <tr>
              <th>描述</th>
              <th class="text-end">總金額</th>
              <th class="text-end">占比</th>
              <th class="text-end">次數</th>
              <th class="text-end">平均金額</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(info, description) in getSortedData(ananalyzeCashFlows[selectedCategory])" :key="description">
              <td>{{ description }}</td>
              <td class="text-end">{{ formatCurrency(info.total) }}</td>
              <td class="text-end">{{ formatCurrencyWithOneDecimal((info.total / props.sortedCashFlowsGroupedByCategory[selectedCategory].total * 100).toFixed(2)) }}
                %</td>
              <td class="text-end">{{ info.times }} 次</td>
              <td class="text-end">{{ formatCurrencyWithOneDecimal((info.total / info.times).toFixed(1)) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 未選擇類別時顯示提示 -->
    <div v-else class="alert alert-info mt-4" role="alert">
      請選擇上方的類別來查看詳細資訊
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

const props = defineProps({
  sortedCashFlowsGroupedByCategory: {
    type: Object,
    required: true
  },
  cashFlows: {
    type: Array,
    required: true
  }
})

const ananalyzeCashFlows = reactive({})
const selectedCategory = ref('')  // 新增 selectedCategory 來追蹤選擇的類別

const formatCurrency = (value) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}
const formatCurrencyWithOneDecimal = (value) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1
  }).format(value)
}

const getSortedData = (data) => {
  return Object.entries(data)
    .sort(([, a], [, b]) => b.total - a.total)
    .reduce((acc, [key, value]) => {
      acc[key] = value
      return acc
    }, {})
}
//props.sortedCashFlowsGroupedByCategory[category].total
const addInAnanalyzeCashFlows = (category, description, amount) => {
  if (!ananalyzeCashFlows[category]) {
    ananalyzeCashFlows[category] = {}
  }

  if (!ananalyzeCashFlows[category][description]) {
    ananalyzeCashFlows[category][description] = {
      total: 0,
      times: 0
    }
  }
  ananalyzeCashFlows[category][description].total += amount
  ananalyzeCashFlows[category][description].times += 1
}

onMounted(() => {
  props.cashFlows.forEach(cashFlow => {
    addInAnanalyzeCashFlows(cashFlow.category.name, cashFlow.description, cashFlow.amount)
  })

  // 可選擇自動選擇第一個類別
  const firstCategory = Object.keys(props.sortedCashFlowsGroupedByCategory)[0]
  if (firstCategory) {
    selectedCategory.value = firstCategory
  }
  
})
</script>

<style scoped>
.table-responsive {
  margin-top: 1rem;
}

.table th,
.table td {
  vertical-align: middle;
}

.form-check-input {
  cursor: pointer;
}

.form-check-label {
  cursor: pointer;
  font-size: 0.9rem;
}

/* 改善卡片樣式 */
.card {
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* 選中的卡片特殊樣式 */
.card .form-check-input:checked~.card-body {
  background-color: rgba(0, 0, 0, 0.02);
}
</style>