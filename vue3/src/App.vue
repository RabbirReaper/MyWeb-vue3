<script setup>
  import AboutMe from './components/AboutMe.vue';


</script>


<template>
  <div class="main-1">
    <header>
      <div class="container">
        <h1 style="font-size: 300%;">Rabbir's Web</h1>
      </div>
      <hr/>
        <div class="list">
          <a>Home</a>
          <a>About me</a>
        </div>
      <hr/>
    </header>
    <body>
      <AboutMe/>

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
    margin: 5px 10px
  }
  a{
    margin: 10px;
    font-size: 20px;
    font-weight:normal;
  }
</style>