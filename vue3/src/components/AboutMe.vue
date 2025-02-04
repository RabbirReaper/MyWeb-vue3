<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

const leetCodeContestData = ref()
const getLeetCodeContestData = async () => {
  try {
    const response = await axios({
      method: 'get',
      url: `https://alfa-leetcode-api.onrender.com/Rabbir_Reaper/contest`,
    });
    console.log(response.data)
    leetCodeContestData.value = response.data
    console.log(leetCodeContestData.value)
  } catch (error) {
    console.error('Error fetching cash flows:', error);
  }
}

onMounted(async () => {
  await getLeetCodeContestData()
})

</script>

<template>
  <div>
    <img src="https://leetcode-stats.vercel.app/api?username=Rabbir_Reaper&theme=Dark" alt="lettCode">
    <img src="https://www.nkust.edu.tw/var/file/0/1000/img/327/722355975.jpg" alt="map">
    <div v-if="leetCodeContestData">
      <p >contestRating : {{ Math.round(leetCodeContestData.contestRating) }}</p>
      <p>contestTopPercentage : {{ leetCodeContestData.contestTopPercentage }}</p>
    </div>

  </div>



</template>

<style scoped>
img {
  max-width: 100%;
}
</style>