<script setup>
  import {useRoute} from "vue-router"

  const  route = useRoute()
  console.log(route.params)
</script>


<template>
  <div class="container">
    <h1>Hello I am Notes</h1>
  </div>
</template>