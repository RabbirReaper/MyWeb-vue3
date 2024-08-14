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
    <RouterLink :to="`/AnnoySystem`" class="container" >
      <h3>
        This is a annoy system.
      </h3>
      <p>
        Annoy system is annoy system.
      </p>
      
    </RouterLink>
  </div>
</template>

<style scoped>
  .container {
    text-decoration: none;
    display: block;
    margin: 20px auto; /* Adds space between each block */
    padding: 1px 30px;/* Adds padding inside the block */
    border: 1px solid #ccc; /* Adds a subtle border around each block */
    border-radius: 8px; /* Rounds the corners of each block */
    background-color: #443f3f; /* Light background color */
    cursor: pointer; /* Changes the cursor to indicate that it's clickable */
    transition: transform 0.2s, box-shadow 0.2s; /* Adds smooth animations */
    color: inherit;
  }
  .container:hover {
    transform: translateY(-3px); /* Slightly lifts the block */
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2); /* Increases shadow on hover */
  }
</style>