import express, { json } from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'
import fs from 'fs/promises'; // 引入 fs/promises 模組
import path from 'path';
import { fileURLToPath } from 'url';
import { join } from 'path';

dotenv.config()
const app = express()
const port = 3000

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())


// 获取当前文件的路径和目录名
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = join(__dirname, 'src', 'data', 'anonymousMsg.json');


app.post('/sendMsgToChannel', async (req, res) => {
  const data = await fs.readFile(filePath, 'utf8');
  let anonymousMsg = JSON.parse(data);
  anonymousMsg.push({
    "id":req.body.order,
    "content": req.body.onlyMsg
  })
  fs.writeFile(filePath, JSON.stringify(anonymousMsg, null, 2), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("JSON data is saved.");
    }
  });
  
  const msgresponse = await axios({
    method:'post',
    url:`https://discord.com/api/channels/${process.env.Application_ID}/messages`,
    headers:{
      Authorization: `Bot ${process.env.BOT_Token}` 
    },
    data:{
      content : req.body.msg
    }
  })
  await Promise.all([
    await axios({
      method:'put',
      url:`https://discord.com/api/channels/${process.env.Application_ID}/messages/${msgresponse.data.id}/reactions/%F0%9F%91%8D/@me`,
      headers:{
        Authorization: `Bot ${process.env.BOT_Token}` 
      }
    }),
    await axios({
      method:'put',
      url:`https://discord.com/api/channels/${process.env.Application_ID}/messages/${msgresponse.data.id}/reactions/%F0%9F%A7%90/@me`,
      headers:{
        Authorization: `Bot ${process.env.BOT_Token}` 
      }
    })
  ])
  res.send('Done!')
})

app.get('/getanonymousMsg',async (req, res) => {
  const data = await fs.readFile(filePath, 'utf8');
  const jsonData = JSON.parse(data); // 將讀取到的字符串轉換為 JSON 對象
  res.json(jsonData);
}) 

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
