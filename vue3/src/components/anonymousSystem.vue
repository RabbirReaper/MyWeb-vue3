<script setup>
import { computed, reactive, ref, watch, onMounted } from 'vue'
import bothead from "../assets/bothead.svg"
import axios from 'axios'

const anonymousMsg = ref(null)
const order = ref('0')
onMounted(async () => {
  await getanonyMsg()
  if (anonymousMsg.value == null) console.log("!!!")
  order.value = anonymousMsg.value.length + 1
})

const getanonyMsg = async () => {
  const res = await axios({
    method: 'get',
    url: 'http://localhost:3000/getanonymousMsg'
  })
  anonymousMsg.value = res.data
}



const currentDate = ref("")
const currentDate2 = ref("")

setInterval(() => {
  const date = new Date()
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hours = ref(date.getHours())
  const minutes = date.getMinutes()
  const seconds = date.getSeconds()
  let tense = ""
  if (hours > 12) {
    tense = '下午'
    hours.value -= 12;
  } else {
    tense = '上午'
  }
  const hoursString = `${hours.value}`.padStart(2, '0')
  const minutesString = `${minutes}`.padStart(2, '0')
  const secondsString = `${seconds}`.padStart(2, '0')
  currentDate.value = `${tense} ${hoursString}:${minutesString}:${secondsString}`
  currentDate2.value = `${year}/${month}/${day} ${tense} ${hoursString}:${minutesString}:${secondsString}`

}, 1000)

const msg = ref('')
const sendMsg = async () => {
  if (msg.value.length > 1000) {
    alert("Your messenger too long ! \n Please reset your commit.")
    return
  }
  alert(msg.value)
  const input_msg = `#${order.value} | ${currentDate2.value}\n-=-=-=-=-=-\n${msg.value}\n-=-=-=-=-=-`

  const res = await axios({
    method: 'post',
    url: 'http://localhost:3000/sendMsgToChannel',
    data: {
      msg: input_msg,
      onlyMsg: msg.value,
      order: order.value
    }
  })
  await getanonyMsg()
  order.value = anonymousMsg.value.length + 1
  alert(res.data)
}




</script>

<template>
  <div class="container">
    <div class="container-1">
      <div class="container-2">
        <div style="font-size:20px">✍️ 撰寫區</div>
        <br>
        <div>
          <textarea type="text" v-model="msg" id="input_area" placeholder="write..."></textarea>
        </div>
      </div>

      <div class="container-3">
        <div style="font-size:20px">📄 預覽</div>
        <br>
        <div class="ccenter">
          <div id="output_area">
            <img :src="bothead" alt="pic" width="45" height="45">
            <div></div>

            <div id="output_area_2">
              <div style="font-size: 16px;">Rabbix_bot <span id="bot_1"> 應用 </span><span
                  id="time_1">{{ currentDate }}</span></div>
              <div id="time_2">#{{ order }} | {{ currentDate2 }}</div>
              <div>-=-=-=-=-=-</div>
              <div>
                <div id="content">{{ msg }}</div>
              </div>
              <div>-=-=-=-=-=-</div>
            </div>

          </div>
        </div>
      </div>
    </div>
    <br><br>
    <button @click="sendMsg()" class="shake">傳送資料</button>
  </div>
</template>

<style scoped>
body {
  background-color: #9fefff0a;
}

.container {
  margin-top: 50px;
}

.container-1 {
  display: flex;
  flex-direction: row;
}

.container-2 {
  flex: 1;
}

.container-3 {
  flex: 1;
  border-left: 1px solid #ffffff35;
}


#input_area {
  font-size: 18px;
  width: 360px;
  min-height: 300px;
  height: auto;
  padding: 20px;
  resize: none;
}

.ccenter {
  display: flex;
  justify-content: center;
  /* 水平置中 */
  align-items: center;
  /* 垂直置中 */
}

#output_area {
  display: grid;
  grid-template-columns: 50px 10px 300px;

  font-size: 18px;
  text-align: left;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  width: 380px;
  max-width: 380;
  min-height: 310px;
  height: auto;
  background: #313338;
  resize: none;
  border-radius: 10px;
  padding: 20px;
}

#output_area_2 {
  display: grid;
  grid-template-rows: 30px 30px 20px 1fr 20px;
  box-sizing: border-box;
}

#content {
  /* width: auto; */
  max-width: 300px;

  box-sizing: border-box;
  overflow-wrap: break-word;
  white-space: pre-wrap;

}

#bot_1 {
  font-size: 14px;
  /* line-height:50px; */
  /* padding:10px; */
  background: #1465cf;
  border-radius: 10px;
}

#time_1 {
  font-size: 14px;
  color: #5f5f64;
}

#time_2 {
  font-size: 16px;
  /* color: #5f5f64; */
}

#para1 {
  color: blueviolet;
}

.shake {
  border: 2px red solid;
  animation: shake 5s infinite;
}

@keyframes shake {
  0% {
    border-color: red;
  }

  50% {
    border-color: blue;
  }

  100% {
    border-color: red;
  }
}
</style>