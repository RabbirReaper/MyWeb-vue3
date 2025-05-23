<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'
import axios from 'axios'
import chartShow from './chartShow.vue';
import showByCategory from './showByCategory.vue'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const selectedType = ref('default')
const cashFlows = ref([])
const cashFlowsGroupedByDate = reactive({});
const incomeCategories = ref([])
const expenseCategories = ref([])
const cashFlowsGroupedByCategory = reactive({});

const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const selectedMonth = ref(0)
const dataRange = ref({})
const today = ref()


const sortedCashFlowsGroupedByDate = computed(() => {
  return Object.fromEntries(
    Object.entries(cashFlowsGroupedByDate)
      .sort((a, b) => new Date(b[0]) - new Date(a[0]))
  );
});

const sortedCashFlowsGroupedByCategory = computed(() => {
  return Object.fromEntries(Object.entries(cashFlowsGroupedByCategory)
    .sort((a, b) => {
      return b[1].total - a[1].total; // 由小到大排序，若要大到小，則使用 totalB - totalA
    })
  )
})

const getIncomeCategory = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/incomeCategory`
    });
    incomeCategories.value = response.data;
  } catch (error) {
    console.error('Error fetching cash flows:', error);
  }
};

const getExpenseCategory = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/expenseCategory`
    });
    expenseCategories.value = response.data;
  } catch (error) {
    console.error('Error fetching cash flows:', error);
  }
};

const getcashFlow = async (start, end) => {
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/cashFlow?start=${start}&end=${end}`,
    });
    // console.log(start)
    // console.log(end)
    return response.data
  } catch (error) {
    console.error('Error fetching cash flows:', error);
  }
};

const addCashFlowInDate = (week, date, type, category, cashFlowindex) => {
  // 檢查是否已存在該日期的項目，若不存在則初始化
  if (!cashFlowsGroupedByDate[date]) {
    cashFlowsGroupedByDate[date] = {
      total: 0,
      week: week,
      categories: {}
    };
  }
  if (!cashFlowsGroupedByDate[date].categories[category]) {
    cashFlowsGroupedByDate[date].categories[category] = {
      total: 0,
      type: type,
      indexInCashFlows: []
    }
  }

  // 增加新的 cashFlowItem 到指定日期的 cashFlow 陣列中
  cashFlowsGroupedByDate[date].categories[category].indexInCashFlows.push(cashFlowindex)

  // 更新 total
  cashFlowsGroupedByDate[date].categories[category].total += cashFlows.value[cashFlowindex].amount
  if (type == 'income') cashFlowsGroupedByDate[date].total += cashFlows.value[cashFlowindex].amount
  else cashFlowsGroupedByDate[date].total -= cashFlows.value[cashFlowindex].amount
};

const addCashFlowInCategory = (type, category, cashFlowindex) => {
  // 檢查是否已存在該日期的項目，若不存在則初始化
  if (!cashFlowsGroupedByCategory[category]) {
    cashFlowsGroupedByCategory[category] = {
      total: 0,
      type: type,
      indexInCashFlows: []
    };
  }

  // 增加新的 cashFlowItem 到指定日期的 cashFlow 陣列中
  cashFlowsGroupedByCategory[category].indexInCashFlows.push(cashFlowindex);

  // 更新 total
  cashFlowsGroupedByCategory[category].total += cashFlows.value[cashFlowindex].amount;
};

const isNegative = (number) => {
  return number < 0;
}


const formatDate = (date, isEndDate = false) => {
  // 如果是結束日期，顯示時減一天
  const displayDate = isEndDate
    ? new Date(date.getTime() - 24 * 60 * 60 * 1000)
    : date;

  return {
    formatted: displayDate.toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }),
    raw: date // 保留原始日期用於數據查詢
  };
};

// 更新日期範圍的函數
const updateDateRange = (baseDate) => {
  const tenthOfMonth = new Date(baseDate.getFullYear(), baseDate.getMonth(), 10)
  const x = 1
  if (baseDate.getDate() >= x) {
    dataRange.value.start = formatDate(new Date(baseDate.getFullYear(), baseDate.getMonth(), x))
    dataRange.value.end = formatDate(new Date(baseDate.getFullYear(), baseDate.getMonth() + 1, x), true)
  } else {
    dataRange.value.start = formatDate(new Date(baseDate.getFullYear(), baseDate.getMonth() - 1, x))
    dataRange.value.end = formatDate(new Date(baseDate.getFullYear(), baseDate.getMonth(), x), true)
  }
}

const initCashFlowData = () => {
  // 重置 ref 類型資料
  selectedType.value = 'default'
  cashFlows.value = []
  incomeCategories.value = []
  expenseCategories.value = []

  // 重置 reactive 物件
  Object.keys(cashFlowsGroupedByDate).forEach(key => {
    delete cashFlowsGroupedByDate[key]
  })

  Object.keys(cashFlowsGroupedByCategory).forEach(key => {
    delete cashFlowsGroupedByCategory[key]
  })
}

const updateCashFlowData = async (start, end) => {
  initCashFlowData()

  cashFlows.value = await getcashFlow(start, end);
  await getIncomeCategory()
  await getExpenseCategory()

  cashFlows.value.forEach((cashFlow, index) => {
    addCashFlowInDate(daysOfWeek[new Date(cashFlow.date).getDay()], new Date(cashFlow.date).toLocaleDateString(), cashFlow.type.name, cashFlow.category.name, index)
    addCashFlowInCategory(cashFlow.type.name, cashFlow.category.name, index)
  });
}

watch(selectedMonth, () => {
  // 根據選擇的月份計算基準日期
  const baseDate = new Date(
    today.value.getFullYear(),
    today.value.getMonth() - selectedMonth.value,
    today.value.getDate()
  )

  // 更新日期範圍
  updateDateRange(baseDate)

  // 更新現金流數據
  updateCashFlowData(dataRange.value.start.raw, dataRange.value.end.raw)
})

onMounted(async () => {
  today.value = new Date()
  updateDateRange(today.value)
  await updateCashFlowData(dataRange.value.start.raw, dataRange.value.end.raw)
  // console.log(cashFlowsGroupedByDate)
})


</script>

<template>
  <div class="row mt-2">
    <div class="mb-2">
      <!-- <h1 class="text-center fs-1">Accounting tool</h1> -->
      <h1 v-if="dataRange.start" class="text-center">{{ dataRange.start.formatted }} - {{ dataRange.end.formatted }}
      </h1>
      <div class="text-center">
        <div>
          <button class="btn btn-primary me-2" @click="selectedMonth--">after (往後)</button>
          <button class="btn btn-secondary" @click="selectedMonth++">before (往前)</button>
        </div>
      </div>
    </div>


    <div class="text-center">
      <div class="form-check form-check-inline mb-3">
        <input class="form-check-input" type="radio" id="default" value="default" name="printType"
          v-model="selectedType" />
        <label class="form-check-label" for="default">default</label>
      </div>
      <div class="form-check form-check-inline mb-3">
        <input class="form-check-input" type="radio" id="Detail" value="Detail" name="printType"
          v-model="selectedType" />
        <label class="form-check-label" for="Detail">Detail</label>
      </div>
      <div class="form-check form-check-inline mb-3">
        <input class="form-check-input" type="radio" id="Category" value="Category" name="printType"
          v-model="selectedType" />
        <label class="form-check-label" for="Category">Category</label>
      </div>
      <div class="form-check form-check-inline mb-3">
        <input class="form-check-input" type="radio" id="ChartShow" value="ChartShow" name="printType"
          v-model="selectedType" />
        <label class="form-check-label" for="ChartShow">ChartShow</label>
      </div>
    </div>

    <div v-if="selectedType === 'default' || selectedType === 'Detail'" class="d-grid justify-content-center"
      style="grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); gap: 1rem; justify-items: center; ">
      <div v-for="(dateCashFlow, date) in sortedCashFlowsGroupedByDate" :key="date" class="card border-dark m-3"
        style="width: 18rem;">
        <div class="card-header bg-transparent border-success">
          <a class="fs-2 mb-0 text-decoration-none"
            :href="'showDetail/' + date.split('/').shift() + '/' + date.split('/')[1] + '/' + date.split('/')[2]"
            :class="{ 'text-success': !isNegative(dateCashFlow.total), 'text-danger': isNegative(dateCashFlow.total) }">
            {{ dateCashFlow.total }}
          </a>
        </div>

        <div class="card-body">
          <ul class="card-text" v-if="selectedType === 'Detail'">
            <li v-for="(categoriesCashFlow, category) in dateCashFlow.categories" :key="category">
              <ul>
                <li v-for="cashFlowIndex in categoriesCashFlow.indexInCashFlows" :key="cashFlowIndex"
                  :class="{ 'text-success': cashFlows[cashFlowIndex].type.name === 'income', 'text-danger': cashFlows[cashFlowIndex].type.name === 'expense' }">
                  {{ cashFlows[cashFlowIndex].description }} : {{ cashFlows[cashFlowIndex].amount }}
                </li>
              </ul>
            </li>
          </ul>

          <ul class="card-text" v-else-if="selectedType === 'default'">
            <li v-for="(categoriesCashFlow, category) in dateCashFlow.categories" :key="category"
              :class="{ 'text-success': categoriesCashFlow.type === 'income', 'text-danger': categoriesCashFlow.type === 'expense' }">
              {{ category }} : {{ categoriesCashFlow.total }} </li>
          </ul>
        </div>

        <div class="card-footer">
          <p class="text-end text-muted pb-0 mb-0">{{ dateCashFlow.week }} {{ date }}</p>
        </div>
      </div>
    </div>

    <div v-else-if="selectedType == 'Category'" class="d-grid justify-content-center"
      style="grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); gap: 1rem;">

      <showByCategory :sortedCashFlowsGroupedByCategory="sortedCashFlowsGroupedByCategory" :cashFlows="cashFlows" />


    </div>

    <div v-else>
      <chartShow :cashFlowsGroupedByCategory="cashFlowsGroupedByCategory" />

    </div>

  </div>
</template>

<style scoped></style>