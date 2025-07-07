<template>
  <div>
    <RouterLink :to="`/Tool/accounting`"
      class="card text-left text-decoration-none mt-3 pt-3 ps-3 bg-secondary custom-card">
      <h3>
        記帳工具
      </h3>
      <p>
        管理您的收入與支出，分析財務狀況。
      </p>
    </RouterLink>
    <RouterLink :to="`/Tool/electricMeter`"
      class="card text-left text-decoration-none mt-3 pt-3 ps-3 bg-secondary custom-card">
      <h3>
        電錶統計工具
      </h3>
      <p>
        記錄電錶讀數，分析用電量與費用趨勢。
      </p>
    </RouterLink>
  </div>
</template>

<style scoped>
.custom-card {
  background-color: #ffcc00;
  /* 自定義卡片背景色 */
  transition: transform 0.3s ease;
  /* 增加動畫效果 */
}

.custom-card:hover {
  transform: translateY(-5px);
  /* 滑過時卡片向上移動 */
}

.custom-card h3,
.custom-card p {
  color: white;
  /* 調整文字顏色 */
}
</style>