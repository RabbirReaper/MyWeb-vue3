<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'
import axios from 'axios'

const selectedType = ref('default')

const getcashFlow = async (start, end) => {
  try {
    const response = await axios({
      method: 'get',
      url: `http://localhost:3000/cashFlow?start=${start}&end=${end}`,
    });
    // console.log(response.data)
    // cashFlows.value = response.data;
    return response.data
  } catch (error) {
    console.error('Error fetching cash flows:', error);
  }
};

const isNegative = (number) => {
  return number < 0;
}


const cashFlowGroups = ref({});
const cashFlowGroupsTotalAmount = ref({});
onMounted(async () => {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startDay = new Date(today)
  startDay.setDate(today.getDate() - 30)
  today.setDate(today.getDate() + 1)
  const fetchedCashFlows = await getcashFlow(startDay, today);
  const groupedCashFlows = fetchedCashFlows.reduce((acc, cashFlow) => {
    const date = new Date(cashFlow.date).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = []
      cashFlowGroupsTotalAmount.value[date] = {
        Food: 0,
        Entertainment: 0,
        Transportation: 0,
        else: 0,
        Salary: 0,
        total: 0,
        Allowance: 0,
        week: ""
      }
    }
    acc[date].push(cashFlow);
    cashFlowGroupsTotalAmount.value[date].total += (cashFlow.type.name === 'income' ? cashFlow.amount : -cashFlow.amount)

    // console.log(cashFlow.category.name)
    if (cashFlow.category.name === 'Food') cashFlowGroupsTotalAmount.value[date].Food += cashFlow.amount
    if (cashFlow.category.name === 'Entertainment') cashFlowGroupsTotalAmount.value[date].Entertainment += cashFlow.amount
    if (cashFlow.category.name === 'Transportation') cashFlowGroupsTotalAmount.value[date].Transportation += cashFlow.amount
    if (cashFlow.category.name === 'Salary') cashFlowGroupsTotalAmount.value[date].Salary += cashFlow.amount
    if (cashFlow.category.name === 'Allowance') cashFlowGroupsTotalAmount.value[date].Allowance += cashFlow.amount
    if (cashFlow.category.name === 'else') cashFlowGroupsTotalAmount.value[date].else += cashFlow.amount
    const newDate = new Date(cashFlow.date)
    cashFlowGroupsTotalAmount.value[date].week = daysOfWeek[newDate.getDay()]
    return acc;
  }, {});
  // console.log(cashFlowGroupsTotalAmount.value)
  const sortedCashFlowGroups = Object.entries(groupedCashFlows).sort((a, b) => {
    return new Date(b[0]) - new Date(a[0]);
  });


  cashFlowGroups.value = Object.fromEntries(sortedCashFlowGroups);
  console.log(cashFlowGroups.value)
});
</script>

<template>
  <div class="row mt-2">
    <h1 class="text-center fs-1">Accounting tool</h1>
    <div class="text-center">
      <div class="form-check form-check-inline mb-3">
        <input class="form-check-input" type="radio" id="default" value="default" name="printType" v-model="selectedType" />
        <label class="form-check-label" for="default">default</label>
      </div>
      <div class="form-check form-check-inline mb-3">
        <input class="form-check-input" type="radio" id="Detail" value="Detail" name="printType" v-model="selectedType"/>
        <label class="form-check-label" for="Detail">Detail</label>
      </div>
    </div>
    <div class="d-grid justify-content-center" style="grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr)); gap: 1rem;">
      <div v-for="(cashFlows, date) in cashFlowGroups" :key="date" class="card border-dark m-3" style="width: 18rem;">
        <div class="card-header bg-transparent border-success">
          <p class="fs-2 mb-0"
            :class="{ 'text-success': !isNegative(cashFlowGroupsTotalAmount[date].total), 'text-danger': isNegative(cashFlowGroupsTotalAmount[date].total) }">
            {{ cashFlowGroupsTotalAmount[date].total }}
          </p>
        </div>
        <div class="card-body">
          <ul class="card-text" v-if="selectedType === 'default'">
            <li v-if="cashFlowGroupsTotalAmount[date].Food !== 0" class="text-danger">
              Food : {{ cashFlowGroupsTotalAmount[date].Food }}
            </li>
            <li v-if="cashFlowGroupsTotalAmount[date].Entertainment !== 0" class="text-danger">
              Entertainment : {{ cashFlowGroupsTotalAmount[date].Entertainment }}
            </li>
            <li v-if="cashFlowGroupsTotalAmount[date].Transportation !== 0" class="text-danger">
              Transportation : {{ cashFlowGroupsTotalAmount[date].Transportation }}
            </li>
            <li v-if="cashFlowGroupsTotalAmount[date].else !== 0" class="text-danger">
              else : {{ cashFlowGroupsTotalAmount[date].else }}
            </li>
            <li v-if="cashFlowGroupsTotalAmount[date].Allowance !== 0" class="text-success">
              Allowance : {{ cashFlowGroupsTotalAmount[date].Allowance }}
            </li>
            <li v-if="cashFlowGroupsTotalAmount[date].Salary !== 0" class="text-success">
              Salary : {{ cashFlowGroupsTotalAmount[date].Salary }}
            </li>
          </ul>
          <ul class="card-text" v-else>
            <li v-for="cashFlow in cashFlows" :key="cashFlow._id"
              :class="{ 'text-success': cashFlow.type.name === 'income', 'text-danger': cashFlow.type.name === 'expense' }">
              {{ cashFlow.description }} : {{ cashFlow.amount }} </li>
          </ul>
        </div>
        <div class="card-footer">
          <p class="text-end text-muted pb-0 mb-0">{{ cashFlowGroupsTotalAmount[date].week }} {{ date }}</p>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped></style>