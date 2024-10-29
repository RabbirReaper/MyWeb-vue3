<template>
  <form class="row needs-validation" @submit.prevent="handleSubmit" novalidate ref="form">
    <h1 class="text-center fs-1">New account</h1>
    <div class="col-6 offset-3 validated-form">
      <div class="mb-3">
        <label for="description" class="form-label">Description</label>
        <input class="form-control"
          :class="{ 'is-invalid': errors.description, 'is-valid': description && !errors.description }" type="text"
          id="description" v-model="description" @input="validateField('description')" required>
        <div class="invalid-feedback">
          Please provide a description.
        </div>
      </div>

      <div class="mb-3">
        <label class="form-label" for="amount">Money</label>
        <div class="input-group has-validation">
          <span class="input-group-text" id="price-label">$</span>
          <input class="form-control" :class="{ 'is-invalid': errors.amount, 'is-valid': amount > 0 && !errors.amount }"
            type="number" id="amount" v-model="amount" @input="validateField('amount')" required>
          <div class="invalid-feedback">
            Please enter a valid amount.
          </div>
        </div>
      </div>

      <div class="mb-3">
        <label for="date" class="form-label">Date</label>
        <input type="date" class="form-control" :class="{ 'is-invalid': errors.date, 'is-valid': date && !errors.date }"
          v-model="date" @input="validateField('date')" required>
        <div class="invalid-feedback">
          Please select a date.
        </div>
      </div>

      <div v-if="cashFlowTypes.length > 0" class="mb-3">
        <div class="form-check form-check-inline" v-for="item in cashFlowTypes" :key="item._id">
          <input class="form-check-input"
            :class="{ 'is-invalid': errors.type, 'is-valid': selectedType._id && !errors.type }" type="radio"
            :id="item._id" :value="item" v-model="selectedType" @change="validateField('type')" name="cashFlowType"
            required />
          <label class="form-check-label" :for="item._id">{{ item.name }}</label>
        </div>
        <div class="invalid-feedback d-block" v-if="errors.type">
          Please select a type.
        </div>
      </div>

      <div v-if="selectedType.name === 'income' && incomeCategories.length > 0" class="mb-3">
        <div class="form-check form-check-inline" v-for="item in incomeCategories" :key="item._id">
          <input class="form-check-input"
            :class="{ 'is-invalid': errors.category, 'is-valid': selectedCategory && !errors.category }" type="radio"
            :id="item._id" :value="item._id" v-model="selectedCategory" @change="validateField('category')"
            name="incomeCategory" required />
          <label class="form-check-label" :for="item._id">{{ item.name }}</label>
        </div>
        <div class="invalid-feedback d-block" v-if="errors.category">
          Please select a category.
        </div>
      </div>

      <div v-if="selectedType.name === 'expense' && expenseCategories.length > 0" class="mb-3">
        <div class="form-check form-check-inline" v-for="item in expenseCategories" :key="item._id">
          <input class="form-check-input"
            :class="{ 'is-invalid': errors.category, 'is-valid': selectedCategory && !errors.category }" type="radio"
            :id="item._id" :value="item._id" v-model="selectedCategory" @change="validateField('category')"
            name="expenseCategory" required />
          <label class="form-check-label" :for="item._id">{{ item.name }}</label>
        </div>
        <div class="invalid-feedback d-block" v-if="errors.category">
          Please select a category.
        </div>
      </div>

      <div class="mb-3">
        <button class="btn btn-primary" type="submit">
          Submit
        </button>
      </div>
    </div>
  </form>
</template>

<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'

const router = useRouter()
const form = ref(null)
const selectedType = ref({ _id: '670675c7b17c230881c73bfb', name: 'expense' })
const selectedCategory = ref('6706904a94b6f4f2e46188bf')
const description = ref("")
const amount = ref(0)
const date = ref(new Date().toISOString().split('T')[0])

const errors = reactive({
  description: false,
  amount: false,
  date: false,
  type: false,
  category: false
})

const cashFlowTypes = ref([])
const incomeCategories = ref([])
const expenseCategories = ref([])

// 驗證單個欄位
const validateField = (field) => {
  errors[field] = false

  switch (field) {
    case 'description':
      if (!description.value.trim()) {
        errors.description = true
      }
      break

    case 'amount':
      if (!amount.value || amount.value <= 0) {
        errors.amount = true
      }
      break

    case 'date':
      if (!date.value) {
        errors.date = true
      }
      break

    case 'type':
      if (!selectedType.value || !selectedType.value._id) {
        errors.type = true
      }
      break

    case 'category':
      if (!selectedCategory.value) {
        errors.category = true
      }
      break
  }
}

watch(selectedType, () => {
  console.log('watch')
  validateField('type')
  // 當類型改變時，清空並重新驗證類別
  selectedCategory.value = null
  validateField('category')
})

// 計算整個表單是否有效
const isFormValid = computed(() => {
  return !Object.values(errors).some(error => error) &&
    description.value.trim() &&
    amount.value > 0 &&
    date.value &&
    selectedType.value._id &&
    selectedCategory.value
})

const handleSubmit = async (event) => {
  // 再次驗證所有欄位
  Object.keys(errors).forEach(validateField)

  if (!isFormValid.value) {
    event.stopPropagation()
    return
  }

  try {
    await postCashFlow()
    router.push({ path: '/Tool/accounting/show' })
  } catch (error) {
    console.error('Error submitting form:', error)
  }
}

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
  return await axios({
    method: 'post',
    url: 'http://localhost:3000/cashFlow',
    data: {
      description: description.value,
      amount: amount.value,
      type: selectedType.value._id,
      category: selectedCategory.value,
      date: date.value
    }
  })
}

onMounted(async () => {
  await getcashFlowType()
  await getincomeCategory()
  await getexpenseCategory()
});
</script>

<style></style>