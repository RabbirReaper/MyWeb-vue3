<template>
  <div class="row">
    <h1 class="text-center fs-1">Create</h1>
    <div class="col-6 offset-3 validated-form">
      <div v-if="cashFlowTypes.length > 0">
        <div class="form-check form-check-inline mb-3" v-for="item in cashFlowTypes" :key="item._id">
          <input class="form-check-input" type="radio" :id="item._id" :value="item" v-model="selectedType"
            name="cashFlowType" />
          <label class="form-check-label" :for="item._id">{{ item.name }}</label>
        </div>
      </div>

      <div v-if="selectedType.name === 'income' && incomeCategories.length > 0">
        <div class="container-1 d-flex me-3">
          <div v-for="item in incomeCategories" :key="item._id" style="margin-right: 1em">
            <p :for="item._id">{{ item.name }}</p>
          </div>
        </div>
      </div>

      <div v-if="selectedType.name === 'expense' && expenseCategories.length > 0">
        <div class="container-1 d-flex me-3">
          <div v-for="item in expenseCategories" :key="item._id" style="margin-right: 1em">
            <p :for="item._id">{{ item.name }}</p>
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label" for="category">category</label>
        <input class="form-control" type="text" id="category" v-model="category">
      </div>

      <button class="btn btn-primary" @click="postCategory">add</button>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'
import axios from 'axios'
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const selectedType = ref({ name: 'income' })
const selectedCategory = ref(null)
const category = ref("")

const cashFlowTypes = ref([])
const incomeCategories = ref([])
const expenseCategories = ref([])

const getcashFlowType = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `${API_BASE_URL}/cashFlowType`
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
      url: `${API_BASE_URL}/incomeCategory`
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
      url: `${API_BASE_URL}/expenseCategory`
    });
    expenseCategories.value = response.data;
  } catch (error) {
    console.error('Error fetching cash flows:', error);
  }
};
const postCategory = async () => {
  const res = await axios({
    method: 'post',
    url: `${API_BASE_URL}/category`,
    data: {
      type: selectedType.value.name,
      name: category.value
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

</style>