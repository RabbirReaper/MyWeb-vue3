<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'
import axios from 'axios'

const cashFlows = ref([])



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

const translateDate = (dateString) => {
  const date = new Date(dateString);
  // console.log(typeof date);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
};

const cashFlowGroups = ref({});
onMounted(async () => {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const startDay = new Date(today)
  startDay.setDate(today.getDate() - 30)
  today.setDate(today.getDate()+1)
  const fetchedCashFlows = await getcashFlow(startDay, today);
  const groupedCashFlows = fetchedCashFlows.reduce((acc, cashFlow) => {
    const date = new Date(cashFlow.date).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(cashFlow);

    return acc;
  }, {});
  
  const sortedCashFlowGroups = Object.entries(groupedCashFlows).sort((a, b) => {
    return new Date(b[0]) - new Date(a[0]); 
  });

  
  cashFlowGroups.value = Object.fromEntries(sortedCashFlowGroups);
  // console.log(cashFlowGroups.value)
});
</script>

<template>
  <div>
    <h1>Hello I am accounting tool</h1>

    <!-- <div>
      <div v-if="cashFlows.length > 0">
        <div v-for="item in cashFlows" :key="item._id">
          <ul>
            <li> {{ item.description }} {{ item.amount }} {{ item.type.name }} {{ item.category.name }} {{
              translateDate(item.date) }}</li>
          </ul>
        </div>
      </div>
    </div> -->

    <div v-for="(cashFlows, date) in cashFlowGroups" :key="date">
      <h3>{{ date }}</h3>
      <div v-for="item in cashFlows" :key="item._id">
        {{ item.description }} {{ item.amount }} {{ item.type.name }} {{ item.category.name }} {{
          translateDate(item.date) }}
      </div>
    </div>


  </div>

</template>

<style scoped></style>