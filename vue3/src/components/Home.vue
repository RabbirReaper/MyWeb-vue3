<script setup>
import RabbirNotesJson from "../data/RabbirNotes.json"

</script>

<template>
  <div>
    <!-- <RouterLink :to="`/Notes/${data.id}`" class="container" v-for="data in RabbirNotesJson" :key="data.id" >
      {{ data.name }}
      <br/>
      {{ data.p }}
    </RouterLink> -->
    <RouterLink :to="`/anonymousSystem`" class="card text-left text-decoration-none mt-3 pt-3 ps-3 bg-secondary custom-card">
      <h4>
        This is a anonymous system.
      </h4>
      <p>
        anonymous system is anonymous system.
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