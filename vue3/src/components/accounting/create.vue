<template>
  <div class="row">
    <h1 class="text-center fs-1">New account</h1>
    <div class="col-6 offset-3 validated-form">
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <input class="form-control" type="text" id="description" v-model="description">
      </div>

      <div class="mb-3">
        <label class="form-label" for="amount">Amount</label>
        <div class="input-group">
          <span class="input-group-text" id="price-label">$</span>
          <input class="form-control" type="number" id="amount" v-model="amount">
        </div>
      </div>

      <div class="mb-3">
        <label for="date" class="form0label">Date</label>
        <input type="date" class="form-control" v-model="date">
      </div>

      <div v-if="cashFlowTypes.length > 0">
        <div class="form-check form-check-inline mb-3" v-for="item in cashFlowTypes" :key="item._id">
          <input class="form-check-input" type="radio" :id="item._id" :value="item" v-model="selectedType"
            name="cashFlowType" />
          <label class="form-check-label" :for="item._id">{{ item.name }}</label>
        </div>
      </div>



      <div v-if="selectedType.name === 'income' && incomeCategories.length > 0">
        <div class="form-check form-check-inline mb-3" v-for="item in incomeCategories" :key="item._id">
          <input class="form-check-input" type="radio" :id="item._id" :value="item._id" v-model="selectedCategory"
            name="incomeCategory" />
          <label class="form-check-label" :for="item._id">{{ item.name }}</label>
        </div>
      </div>

      <div v-if="selectedType.name === 'expense' && expenseCategories.length > 0">
        <div class="form-check form-check-inline mb-3" v-for="item in expenseCategories" :key="item._id">
          <input class="form-check-input" type="radio" :id="item._id" :value="item._id" v-model="selectedCategory"
            name="expenseCategory" />
          <label class="form-check-label" :for="item._id">{{ item.name }}</label>
        </div>
      </div>
      <div class="mb-3">
        <button class="btn btn-primary " @click="postCashFlow">Submit</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'
import axios from 'axios'

const selectedType = ref({ name: 'income' })
const selectedCategory = ref(null)
const description = ref("")
const amount = ref(0)
const date = ref(new Date().toISOString().split('T')[0])

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
  const res = await axios({
    method: 'post',
    url: 'http://localhost:3000/cashFlow',
    data: {
      description: description.value,
      amount: amount.value,
      type: selectedType.value._id,
      category: selectedCategory.value,
      date: date.value
    }
  }).catch((e) => {
    console.log(e)
  })
}

onMounted(async () => {
  await getcashFlowType()
  await getincomeCategory()
  await getexpenseCategory()
  selectedType.value = cashFlowTypes.value[0]
});

</script>

<style>
.container-1 {
  display: flex;
  margin-right: 1em;
}
</style>