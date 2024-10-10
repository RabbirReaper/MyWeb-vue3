<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'
import axios from 'axios'

const cashFlows = ref([]);

const getcashFlow = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: 'http://localhost:3000/cashFlow'
    });
    console.log(response.data)
    cashFlows.value = response.data;
  } catch (error) {
    console.error('Error fetching cash flows:', error);
  }
};

onMounted(() => {
  getcashFlow();
});
</script>

<template>
  <div>
    <h1>Hello I am accounting tool</h1>
    <div v-if="cashFlows.length > 0">
      <div v-for="item in cashFlows" :key="item._id">
        <ul>
          <li> {{ item.description }} {{ item.amount }} {{ item.type.name }} {{ item.category.name }} {{ item.date }}</li>
        </ul>
      </div>
    </div>

  </div>

</template>

<style scoped></style>