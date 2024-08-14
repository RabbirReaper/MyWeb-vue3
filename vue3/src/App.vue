<script setup>
  import {RouterView } from 'vue-router'
  import {ref,onMounted} from 'vue'  
  import { RouterLink } from 'vue-router';


 
  
</script>


<template>
  <div class="main-1">
    <header>
      <div class="container">
        <h1 style="font-size: 300%;">Rabbir's Web</h1>
      </div>
      <hr/>
        <div class="list">
          <RouterLink class="router-link" active-class="router-link-active" to="/">Home</RouterLink>
          <RouterLink class="router-link" active-class="router-link-active" to="/Tool">Tool</RouterLink>
          <RouterLink class="router-link" active-class="router-link-active" to="/Game">Game</RouterLink>
          <RouterLink class="router-link" active-class="router-link-active" to="/aboutme">About me</RouterLink>
        </div>
      <hr/>
    </header>
    <body>
      <RouterView/>

    </body>
  </div>
</template>


<style scoped>
  .main-1{
    max-width: 1280px;
    margin: 0 auto;
    
    /* text-align: center; */
  }
  .container{
    text-align: center;
  }
  .list{
    display: flex;
    margin: 5px 15px
  }
  a{
    margin: 10px;
    font-size: 20px;
    font-weight:normal;
  }


  .router-link {
    text-decoration: none;
    font-weight: 100;
    margin-right: 50px;
    color:rgb(255, 255, 255);
  }
  
  .router-link-active {
    text-decoration: none;
    font-weight: 900;
    color:rgb(26, 172, 194);
  }
</style>