<template>
  <div>
    <h1>Create</h1>
    <div>
      <label for="description">description</label>
      <input type="text" id="description" v-model="description">
    </div>
    <div>
      <label for="amount">amount</label>
      <input type="number" id="amount" v-model="amount">
    </div>

    <div v-if="cashFlowTypes.length > 0">
      <div class="container-1">
        <div v-for="item in cashFlowTypes" :key="item._id">
          <input type="radio" :id="item._id" :value="item" v-model="selectedType" name="cashFlowType" />
          <label :for="item._id">{{ item.name }}</label>
        </div>
      </div>
    </div>

    <div v-if="selectedType.name === 'income' && incomeCategories.length > 0">
      <div class="container-1">
        <div v-for="item in incomeCategories" :key="item._id">
          <input type="radio" :id="item._id" :value="item._id" v-model="selectedCategory" name="incomeCategory" />
          <label :for="item._id">{{ item.name }}</label>
        </div>
      </div>
    </div>

    <div v-if="selectedType.name === 'expense' && expenseCategories.length > 0">
      <div class="container-1">
        <div v-for="item in expenseCategories" :key="item._id">
          <input type="radio" :id="item._id" :value="item._id" v-model="selectedCategory" name="expenseCategory" />
          <label :for="item._id">{{ item.name }}</label>
        </div>
      </div>
    </div>
    <button @click="postCashFlow">Submit</button>

  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'
import axios from 'axios'

const selectedType = ref({ name: 'income' })
const selectedCategory = ref(null)
const description = ref("")
const amount = ref(0)

const cashFlowTypes = ref([])
const incomeCategories = ref([])
const expenseCategories = ref([])

const getcashFlowType = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: 'http://localhost:3000/cashFlowType'
    });
    cashFlowTypes.value = response.data
  } catch (error) {
    console.error('Error fetching cash flows:', error);
  }
};
const getincomeCategory = async () => {
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
const getexpenseCategory = async () => {
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
const postCashFlow = async () => {
  const date = new Date()
  const res = await axios({
    method: 'post',
    url: 'http://localhost:3000/cashFlow',
    data: {
      description: description.value,
      amount: amount.value,
      type: selectedType.value._id,
      category: selectedCategory.value,
      date: date
    }
  }).catch((e) => {
    console.log(e)
  })
}

onMounted(async () => {
  await getcashFlowType()
  await getincomeCategory()
  await getexpenseCategory()
  selectedType.value= cashFlowTypes.value[0]
});

</script>

<style>
.container-1 {
  display: flex;
  margin-right: 1em;
}
</style>