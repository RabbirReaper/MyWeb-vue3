<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'

const route = useRoute();
const id = route.params.id;
const cashFlow = ref({})

const getcashFlowByid = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `http://localhost:3000/cashFlow/${id}`,
    });
    return response.data
  } catch (error) {
    console.error('Error fetching cash flows:', error);
  }
};

onMounted(async () => {
  cashFlow.value = await getcashFlowByid()
  console.log(cashFlow.value)
})

</script>

<template>
  <div v-if="cashFlow.amount">
    <h1>{{ cashFlow.amount }}</h1>
    <h1>{{ cashFlow.type.name }}</h1>

    <h1>{{ cashFlow.category.name }}</h1>
    <!-- <h1>{{ cashFlow.descraption }}</h1> -->
    
  </div>


</template>

<style scoped></style>