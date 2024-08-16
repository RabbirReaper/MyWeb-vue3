import express from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv';

dotenv.config()
const app = express()
const port = 3000

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

// console.log(process.env.BOT_Token);
// const fiedJSON =  JSON.parse( await fs.readFile("./public/data.json"))

// const modifyJSON = async(modifiedJSON) => {
//   fs.writeFile('./public/data.json', modifiedJSON)
// }

// app.get('/getOrder' , async(req,res) => {
//   // res.send(fiedJSON.order)
//   res.send("hi")
// })

app.post('/sendMsgToChannel', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
