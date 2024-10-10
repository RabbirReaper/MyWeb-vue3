<script setup>
import { ref } from 'vue'
// import fs from 'fs'

const x = ref([7, 2, 3, 4, 5])


</script>



<template>

  <body>
    <p>I'm Game</p>
    <form action="/fff">
      <div>
        <input type="radio" id="one" name="ccc">
        <label for="one">check one</label>
        <input type="radio" id="two" name="ccc">
        <label for="two">check two</label>
        <input type="radio" id="three" name="ccc">
        <label for="three">check three</label>
      </div>
      <br>
      <button>this is a button</button>
    </form>

    <section>
      <h1>My name is red</h1>
      <h2>no red</h2>
      <div class="ggg">
        <h1>My name is light blue</h1>
        <h2>I don't know</h2>
      </div>
    </section>
    <button class="beautiful">Beautiful</button>
    <div class="container">
      <div>1</div>
      <div>2</div>
      <div>3</div>
      <div>4</div>
      <div>5</div>
    </div>

    <div id="myDiv">
      <p>這是第一段。<b>這是粗體文字</b></p>
      <p>這是第二段。</p>
    </div>
  </body>
</template>

<style scoped>
@media (max-width: 1000px) {
  p {
    text-align: center;
    color: rgb(64, 0, 255);
  }
}

@media (max-width: 600px) {
  p {
    text-align: center;
    color: red;
  }
}

body{
  transform: 1;
}


h1:hover {
  color: lightblue;
  font-weight: bold;
}

.beautiful {
  background: none;
  color: #ffa260;
  border: 2px solid;
  padding: 1em 1.5em;
  font-size: 1.5em;
  transition: all 0.2s;
}

.beautiful:hover {
  border-color: #f1ff5c;
  color: white;
  box-shadow: 0 0.5em 1em -0.8em #f1ff5c;
  transform: translateY(-0.25em);
}

.container {
  background-color: white;
  height: 500px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
}

.container div {
  font-size: 5em;
  text-align: center;
  width: 200px;
  height: 200px;
  flex-basis: 300px;
  flex-grow: 1;
}

.container div:nth-of-type(1) {
  background: lightblue;
  flex-grow: 2;
  flex-shrink: 2;
}

.container div:nth-of-type(2) {
  background: rgb(190, 230, 173);
}

.container div:nth-of-type(3) {
  background: rgb(55, 13, 145);
}

.container div:nth-of-type(4) {
  background: rgb(201, 201, 9);
}

.container div:nth-of-type(5) {
  background: rgb(240, 93, 1);
}
</style>