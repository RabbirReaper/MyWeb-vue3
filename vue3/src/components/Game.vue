<script setup>
import { ref, computed, onMounted, watch, nextTick, onUnmounted} from 'vue';
import bcrypt from 'bcryptjs'
import { useCounterStore } from '@/stores/counter'
import { storeToRefs } from 'pinia'

// 獲取store實例
const store = useCounterStore()

// 使用storeToRefs保持響應性
const { count, doubleCount } = storeToRefs(store)

// Actions可以直接使用
function handleClick() {
  store.increment()
}

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

function testClick(event) {
  // 這裡的 event 就是自動傳入的原生事件對象
  console.log(event.target); // 輸出被點擊的元素（按鈕）
  console.log(event.type);   // 輸出 "click"
}

// 響應式狀態
const isExpanded = ref(false); // 是否展開的狀態
const collapseContentRef = ref(null); // 對折疊內容的引用
const actualHeight = ref(0); // 保存實際高度值(數字形式)
const forceUpdate = ref(0); // 用來強制更新computed的標記
const title = ref('折疊標題'); // 折疊標題

// 使用computed來計算內容樣式
const contentStyle = computed(() => {
  // 強制更新標記，當需要重新計算高度時增加此值
  forceUpdate.value;  
  
  if (!isExpanded.value) return '0px';
  
  if (collapseContentRef.value && actualHeight.value === 0) {
    // 需要計算高度
    updateActualHeight();
  }
  
  return actualHeight.value > 0 ? `${actualHeight.value}px` : 'auto';
});

// 更新實際高度的函數
const updateActualHeight = () => {
  if (!collapseContentRef.value) return;
  
  // 臨時移除高度限制來測量真實高度
  const originalStyle = collapseContentRef.value.style.maxHeight;
  collapseContentRef.value.style.maxHeight = 'none';
  
  // 獲取實際高度
  actualHeight.value = collapseContentRef.value.scrollHeight;
  
  // 恢復原始樣式
  collapseContentRef.value.style.maxHeight = originalStyle;
};

// 切換折疊狀態
const toggleCollapse = () => {
  isExpanded.value = !isExpanded.value;
};

// 處理窗口大小調整
const handleResize = () => {
  // 重置高度並觸發重新計算
  actualHeight.value = 0;
  forceUpdate.value++;
};

// 組件掛載後
onMounted(() => {
  // 初始計算內容高度
  nextTick(() => {
    updateActualHeight();
  });
  
  // 監聽窗口大小變化，使用防抖處理優化性能
  window.addEventListener('resize', handleResize);
});

// 監聽內容變化
watch(() => collapseContentRef.value?.innerHTML, () => {
  // 內容變化時強制更新高度
  handleResize();
}, { deep: true });

// 組件卸載時清除事件監聽
onUnmounted(() => {
  window.removeEventListener('resize', handleResize);
});
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
        <input id="password" type="password" class="form-control" v-model="passwordInput" placeholder="輸入密碼" />
      </div>

      <div class="d-flex justify-content-between">
        <button class="btn btn-success" @click="setPassword">儲存密碼</button>
        <button class="btn btn-primary" @click="checkPassword">檢查密碼</button>
      </div>

      <div class="mt-3">
        <p class="text-center fw-bold"
          :class="{ 'text-success': message === '密碼符合！', 'text-danger': message === '密碼不符合！' }">
          {{ message }}
        </p>
      </div>
    </div>
    {{ storedHashedPassword }}
    <div>
      <p>Count: {{ count }}</p>
      <p>Double: {{ doubleCount }}</p>
      <button @click="handleClick">增加</button>
      <button @click="store.increment">也可以直接使用</button>
    </div>
    
    <button @click="testClick">點擊我</button>


    <div>
      <!-- 折疊標題區域 -->
      <button class="collapse-header" @click="toggleCollapse">
        {{ title }}
        <i :class="isExpanded ? 'icon-up' : 'icon-down'"></i>
      </button>
      
      <!-- 折疊內容區域 -->
      <div 
        class="collapse-content" 
        ref="collapseContentRef"
        :style="{ maxHeight: contentStyle }">
        
        <p>這是折疊內容的示例。當內容過多時，會自動計算高度並展開。</p>
        <p>這是第二行內容。</p>

      </div>
    </div>
    <div class="dropdown">
      <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
        Dropdown button
      </button>
      <ul class="dropdown-menu" aria-labelledby="dropdownMenuButton1">
        <li><a class="dropdown-item" href="#">Action</a></li>
        <li><a class="dropdown-item" href="#">Another action</a></li>
        <li><a class="dropdown-item" href="#">Something else here</a></li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.collapse-header {
  cursor: pointer;
  user-select: none;
  padding: 10px;
  background-color: #f1f1f1;
  border-radius: 4px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.collapse-content {
  overflow: hidden;
  transition: max-height 0.5s ease;
}


</style>