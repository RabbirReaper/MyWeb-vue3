<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'; 
</script>

<template>
  <div>
    <header style="margin-top: 1em;">
      <div class="col">
        <RouterLink class="button-1 router-link" active-class="button-2" to="/Tool/electricMeter/show">顯示記錄</RouterLink>
        <RouterLink class="button-1" active-class="button-2" to="/Tool/electricMeter/create">新增記錄</RouterLink>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.button-1 {
  background-color: #EA4C89;
  border-radius: 8px;
  border-style: none;
  box-sizing: border-box;
  color: #FFFFFF;
  cursor: pointer;
  display: inline-block;
  font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  height: 40px;
  line-height: 20px;
  list-style: none;
  margin-right: 2em;
  outline: none;
  padding: 10px 16px;
  position: relative;
  text-align: center;
  text-decoration: none;
  transition: color 100ms;
  vertical-align: baseline;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-1:hover,
.button-1:focus {
  background-color: #F082AC;
}

.button-2 {
  background-color: rgba(61, 84, 87, 0.05);
  border-radius: 8px;
  border-width: 0;
  color: #6e779d;
  cursor: pointer;
  display: inline-block;
  font-family: "Haas Grot Text R Web", "Helvetica Neue", Helvetica, Arial, sans-serif;
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  list-style: none;
  margin-right: 2em;
  padding: 10px 12px;
  text-align: center;
  transition: all 200ms;
  vertical-align: baseline;
  white-space: nowrap;
  user-select: none;
  -webkit-user-select: none;
  touch-action: manipulation;
}

.button-2:hover,
.button-2:focus {
  background-color: #209aca;
}
</style>