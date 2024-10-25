<template>
  <div class="row">
    <h1 class="text-center fs-1">Show Detail by {{ date.year }}-{{ date.month }}-{{ date.date }}</h1>
    <div v-if="cashFlows" class="col-6 offset-3">
      <ul>
        <li v-for="cashFlow in cashFlows" :key="cashFlow._id">
          <router-link class="text-decoration-none text-decoration-none" :class="{ 'text-success': cashFlow.type.name === 'income', 'text-danger': cashFlow.type.name === 'expense'}" :to="{ path: `../../${cashFlow._id}` }">{{ cashFlow.description }} : {{ cashFlow.amount }} {{ cashFlow.type.name }}</router-link>
        </li>
      </ul>
    </div>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRoute } from 'vue-router'
import { RouterLink } from 'vue-router';

const route = useRoute()
const date = { year: route.params.year, month: route.params.month, date: route.params.date }
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

onMounted(async () => {
  const startDay = new Date(date.year, (date.month - 1), date.date)
  const today = new Date(startDay)
  today.setDate(today.getDate() + 1)
  console.log(startDay)
  console.log(today)
  cashFlows.value = await getcashFlow(startDay, today);
})
</script>


<style scoped></style>