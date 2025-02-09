<script setup>
import { ref } from 'vue'
import bcrypt from 'bcryptjs'

// 定義初始密碼和輸入密碼
const storedHashedPassword = ref('') // 儲存加密的密碼
const passwordInput = ref('') // 使用者輸入的密碼
const message = ref('') // 顯示是否符合的訊息

// 加密密碼並儲存
const setPassword = () => {
  const salt = bcrypt.genSaltSync(10) // 產生鹽 (salt)
  storedHashedPassword.value = bcrypt.hashSync(passwordInput.value, salt) // 將密碼加密
  // hash 異步
  message.value = '密碼已加密並儲存！'
  passwordInput.value = '' // 清空輸入框
}

// 驗證密碼是否正確
const checkPassword = () => {
  const isValid = bcrypt.compareSync(passwordInput.value, storedHashedPassword.value) // 比較密碼
  message.value = isValid ? '密碼符合！' : '密碼不符合！'
  passwordInput.value = '' // 清空輸入框
}
</script>

<template>
  <div class="container mt-5">
    <div class="text-center">
      <h1 class="mb-4">登入驗證</h1>
      <p>儲存與檢查密碼範例 (bcrypt.js)</p>
    </div>

    <div class="card mx-auto p-4" style="max-width: 400px;">
      <div class="mb-3">
        <label for="password" class="form-label">輸入密碼</label>
        <input
          id="password"
          type="password"
          class="form-control"
          v-model="passwordInput"
          placeholder="輸入密碼"
        />
      </div>

      <div class="d-flex justify-content-between">
        <button class="btn btn-success" @click="setPassword">儲存密碼</button>
        <button class="btn btn-primary" @click="checkPassword">檢查密碼</button>
      </div>

      <div class="mt-3">
        <p class="text-center fw-bold" :class="{'text-success': message === '密碼符合！', 'text-danger': message === '密碼不符合！'}">
          {{ message }}
        </p>
      </div>
    </div>
    {{ storedHashedPassword }}
  </div>
</template>

