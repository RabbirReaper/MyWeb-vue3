<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'


const route = useRoute();
const router = useRouter()
const id = route.params.id;
const cashFlow = ref({})

const redirect = () => {
  router.push({ path: '/Tool/accounting/show' })
}

const getCashFlowByid = async () => {
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



const deleteCashFlowById = async () => {
  try {
    await axios({
      method: 'delete',
      url: `http://localhost:3000/cashFlow/${id}`,
    })
    router.push({ path: '/Tool/accounting/show' })
  } catch (error) {
    if (error.response && error.response.status === 404) {
      router.push({ path: '/Tool/accounting/show' })
    } else {
      ElMessage.error('刪除失敗：' + error.message)
    }
  }
};

const putCashFlowByid = async () => {
  const res = await axios({
    method: 'put',
    url: `http://localhost:3000/cashFlow/${id}`,
    data: cashFlow.value
  }).catch((e) => {
    console.log(e)
  })
  router.push({ path: '/Tool/accounting/show' })
}

const cashFlowTypes = ref([])
const incomeCategories = ref([])
const expenseCategories = ref([])

const getCashFlowType = async () => {
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


onMounted(async () => {
  await getCashFlowType()
  await getIncomeCategory()
  await getExpenseCategory()
  cashFlow.value = await getCashFlowByid()
  cashFlow.value.date = new Date(cashFlow.value.date).toISOString().split('T')[0];
  console.log(cashFlow.value)
})

</script>

<template>
  <div class="row" v-if="cashFlow.amount">
    <h1 class="text-center fs-1">Id</h1>
    <div class="col-6 offset-3 validated-form">
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <input class="form-control" type="text" id="description" v-model="cashFlow.description">
      </div>

      <div class="mb-3">
        <label class="form-label" for="amount">Money</label>
        <div class="input-group">
          <span class="input-group-text" id="price-label">$</span>
          <input class="form-control" type="number" id="amount" v-model="cashFlow.amount">
        </div>
      </div>

      <div class="mb-3">
        <label for="date" class="form0label">Date</label>
        <input type="date" class="form-control" v-model="cashFlow.date">
      </div>

      <div v-if="cashFlowTypes.length > 0">
        <div class="form-check form-check-inline mb-3" v-for="item in cashFlowTypes" :key="item._id">
          <input class="form-check-input" type="radio" :id="item._id" :value="item" v-model="cashFlow.type"
            name="cashFlowType" />
          <label class="form-check-label" :for="item._id">{{ item.name }}</label>
        </div>
      </div>



      <div v-if="cashFlow.type.name === 'income' && incomeCategories.length > 0">
        <div class="form-check form-check-inline mb-3" v-for="item in incomeCategories" :key="item._id">
          <input class="form-check-input" type="radio" :id="item._id" :value="item" v-model="cashFlow.category"
            name="incomeCategory" />
          <label class="form-check-label" :for="item._id">{{ item.name }}</label>
        </div>
      </div>

      <div v-if="cashFlow.type.name === 'expense' && expenseCategories.length > 0">
        <div class="form-check form-check-inline mb-3" v-for="item in expenseCategories" :key="item._id">
          <input class="form-check-input" type="radio" :id="item._id" :value="item" v-model="cashFlow.category"
            name="expenseCategory" />
          <label class="form-check-label" :for="item._id">{{ item.name }}</label>
        </div>
      </div>
      <div class="row mb-3">
        <div class="col-auto">
          <button class="btn btn-outline-primary" @click="putCashFlowByid">Update</button>
        </div>
        <div class="col-auto">
          <button class="btn btn-outline-danger" @click="deleteCashFlowById">Delete</button>
        </div>
        <div class="col-auto">
          <button class="btn btn-outline-info" @click="redirect">redirect</button>
        </div>
      </div>


    </div>
  </div>
</template>


<style scoped></style>