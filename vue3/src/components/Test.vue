<template>
  <div class="container my-5">
    <div class="row">
      <div class="col-12">
        <div class="progress-container">
          <!-- 進度線 -->
          <div class="progress-line">
            <div 
              class="progress-fill"
              :style="{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`
              }"
            ></div>
          </div>
          
          <!-- 步驟項目 -->
          <div class="steps-wrapper">
            <div 
              v-for="step in steps"
              :key="step.id"
              :class="['step-item', getStepStatus(step.id)]"
            >
              <div class="step-circle">
                <span class="step-icon">
                  {{ getStepStatus(step.id) === 'completed' ? '✓' : step.icon }}
                </span>
              </div>
              <div class="step-label">
                <span class="step-title">{{ step.title }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 測試按鈕 (可移除) -->
        <div class="text-center mt-4">
          <button 
            class="btn btn-outline-primary me-2"
            @click="previousStep"
            :disabled="currentStep === 1"
          >
            上一步
          </button>
          <button 
            class="btn btn-primary"
            @click="nextStep"
            :disabled="currentStep === steps.length"
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// 響應式數據
const currentStep = ref(2) // 預設在第3步（已付款）

// 步驟配置
const steps = ref([
  { id: 1, title: '送出訂單', icon: '📄' },
  { id: 2, title: '未付款', icon: '⏳' },
  { id: 3, title: '已付款', icon: '✓' }
])

// 方法
const getStepStatus = (stepId) => {
  // 如果已經到達最後一步，所有步驟都顯示為完成（藍色）
  if (currentStep.value === steps.value.length) {
    return 'completed'
  }
  
  // 否則按正常邏輯
  if (stepId < currentStep.value) return 'completed'
  if (stepId === currentStep.value) return 'current'
  return 'pending'
}

const nextStep = () => {
  if (currentStep.value < steps.value.length) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

// 暴露給父組件使用（如果需要）
defineExpose({
  currentStep,
  nextStep,
  previousStep,
  setStep: (step) => { currentStep.value = step }
})
</script>

<style scoped>
.progress-container {
  position: relative;
  padding: 20px 0;
  margin: 40px 0;
}

.progress-line {
  position: absolute;
  top: 50%;
  left: 60px;
  right: 60px;
  height: 4px;
  background: linear-gradient(90deg, #e9ecef 0%, #f8f9fa 100%);
  border-radius: 2px;
  transform: translateY(-50%);
  z-index: 1;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #0d6efd 0%, #0b5ed7 50%, #0a58ca 100%);
  border-radius: 2px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 0 8px rgba(13, 110, 253, 0.3);
}

.steps-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.step-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  flex: 1;
  max-width: 120px;
}

.step-circle {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  margin-bottom: 12px;
  position: relative;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.step-item.pending .step-circle {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 3px solid #dee2e6;
  color: #6c757d;
}

.step-item.current .step-circle {
  background: linear-gradient(135deg, #198754 0%, #20c997 100%);
  border: 3px solid #ffffff;
  color: white;
  transform: scale(1.1);
  box-shadow: 0 6px 20px rgba(25, 135, 84, 0.4);
}

.step-item.completed .step-circle {
  background: linear-gradient(135deg, #0d6efd 0%, #6610f2 100%);
  border: 3px solid #ffffff;
  color: white;
  box-shadow: 0 4px 16px rgba(13, 110, 253, 0.3);
}

.step-icon {
  font-size: 18px;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
}

.step-label {
  text-align: center;
  margin-top: 4px;
}

.step-title {
  font-size: 14px;
  font-weight: 500;
  transition: color 0.3s ease;
  display: block;
  line-height: 1.3;
}

.step-item.pending .step-title {
  color: #6c757d;
}

.step-item.current .step-title {
  color: #198754;
  font-weight: 600;
}

.step-item.completed .step-title {
  color: #0d6efd;
  font-weight: 600;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .progress-line {
    left: 40px;
    right: 40px;
  }
  
  .step-circle {
    width: 48px;
    height: 48px;
  }
  
  .step-icon {
    font-size: 16px;
  }
  
  .step-title {
    font-size: 12px;
  }
  
  .step-item {
    max-width: 80px;
  }
}

/* 動畫效果 */
.step-item.current .step-circle::before {
  content: '';
  position: absolute;
  top: -3px;
  left: -3px;
  right: -3px;
  bottom: -3px;
  border-radius: 50%;
  background: linear-gradient(45deg, #198754, #20c997);
  z-index: -1;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.05);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* Hover 效果 */
.step-item:hover .step-circle {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.step-item.current:hover .step-circle {
  transform: scale(1.1) translateY(-2px);
}
</style>