<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'
import axios from 'axios'
import chartShow from './chartShow.vue';


const selectedType = ref('default')
const cashFlows = ref([])
const cashFlowsGroupedByDate = reactive({});
const incomeCategories = ref([])
const expenseCategories = ref([])
const cashFlowsGroupedByCategory = reactive({});
const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

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
      url: 'http://localhost:3000/incomeCategory'
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
      url: 'http://localhost:3000/expenseCategory'
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
      url: `http://localhost:3000/cashFlow?start=${start}&end=${end}`,
    });
    console.log(start)
    console.log(end)
    // console.log(response.data)
    // cashFlows.value = response.data;
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


onMounted(async () => {
  let today = new Date()
  today = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const startDay = new Date(today)
  startDay.setDate(today.getDate() - 30)
  today.setDate(today.getDate() + 1)
  cashFlows.value = await getcashFlow(startDay, today);

  await getIncomeCategory()
  await getExpenseCategory()

  cashFlows.value.forEach((cashFlow, index) => {
    addCashFlowInDate(daysOfWeek[new Date(cashFlow.date).getDay()], new Date(cashFlow.date).toLocaleDateString(), cashFlow.type.name, cashFlow.category.name, index)
    addCashFlowInCategory(cashFlow.type.name, cashFlow.category.name, index)
  });

})


</script>

<template>
  <div class="row mt-2">
    <h1 class="text-center fs-1">Accounting tool</h1>
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
      style="grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); gap: 1rem;">
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
      <div v-for="(categoryCashFlow, catrgory) in sortedCashFlowsGroupedByCategory" :key="catrgory"
        class="card border-dark m-3" style="width: 18rem;">
        <div class="card-header bg-transparent border-success">
          <p class="fs-2 mb-0 text-decoration-none " :class="{
            'text-success': categoryCashFlow.type === 'income',
            'text-danger': categoryCashFlow.type === 'expense'
          }">
            {{ categoryCashFlow.total }}
          </p>
        </div>
        <div class="card-footer">
          <p class="text-end text-muted pb-0 mb-0">{{ catrgory }}</p>
        </div>
      </div>
    </div>

    <div v-else>
      <chartShow :cashFlowsGroupedByCategory="cashFlowsGroupedByCategory" />
    </div>

  </div>
</template>

<style scoped></style>