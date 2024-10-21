<script setup>
import { RouterView } from 'vue-router'
import { ref, onMounted } from 'vue'
import { RouterLink } from 'vue-router'; 
</script>


<template>
  <div class="container mx-auto">
    <header>
      <!-- <div class="text-center">
        <p class="fs-1">Rabbir's Web</p>
      </div> -->
      <!-- <hr class="mt-5 mb-1"/> -->
      <div class="navbar navbar-expand-lg navbar-light pe-2">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0 fs-5">
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="nav-link active" to="/">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="nav-link active" to="/Tool">Tool</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="nav-link active" to="/Game">Game</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink class="nav-link" active-class="nav-link active" to="/aboutme">About me</RouterLink>
          </li>
        </ul>
        <p class="navbar-nav  mb-2 mb-lg-0 fs-5">Rabbir's Web</p>
      </div>

      <hr class="mt-1 mb-1" />
    </header>
    <main>
      <RouterView />

    </main>
  </div>
</template>


<style scoped></style>