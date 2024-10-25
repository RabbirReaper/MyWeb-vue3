import express, { json } from 'express'
import cors from 'cors'
import axios from 'axios'
import dotenv from 'dotenv'
import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'
import { join } from 'path'
import mongoose from 'mongoose'
import CashFlow from './models/cashFlow.js'
import CashFlowType from './models/cashFlowType.js'
import ExpenseCategory from './models/expenseCategory.js'
import IncomeCategory from './models/incomeCategory.js'

dotenv.config()
const app = express()
const port = 3000

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

mongoose.connect('mongodb://127.0.0.1:27017/accounting')
  .then(() => {
    console.log("Connection OPEN!!!")
  })
  .catch((err) => {
    console.log("OH NOOOOO")
    console.log(err)
  })


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const filePath = join(__dirname, 'src', 'data', 'anonymousMsg.json');


app.post('/sendMsgToChannel', async (req, res) => {
  const data = await fs.readFile(filePath, 'utf8');
  let anonymousMsg = JSON.parse(data);
  anonymousMsg.push({
    "id": req.body.order,
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
    method: 'post',
    url: `https://discord.com/api/channels/${process.env.Application_ID}/messages`,
    headers: {
      Authorization: `Bot ${process.env.BOT_Token}`
    },
    data: {
      content: req.body.msg
    }
  })
  await Promise.all([
    await axios({
      method: 'put',
      url: `https://discord.com/api/channels/${process.env.Application_ID}/messages/${msgresponse.data.id}/reactions/%F0%9F%91%8D/@me`,
      headers: {
        Authorization: `Bot ${process.env.BOT_Token}`
      }
    }),
    await axios({
      method: 'put',
      url: `https://discord.com/api/channels/${process.env.Application_ID}/messages/${msgresponse.data.id}/reactions/%F0%9F%A7%90/@me`,
      headers: {
        Authorization: `Bot ${process.env.BOT_Token}`
      }
    })
  ])
  res.send('Done!')
})

app.get('/getanonymousMsg', async (req, res) => {
  const data = await fs.readFile(filePath, 'utf8');
  const jsonData = JSON.parse(data); // 將讀取到的字符串轉換為 JSON 對象
  res.json(jsonData);
})

app.get('/cashFlow', async (req, res) => {
  const { start, end } = req.query;
  // console.log(start)
  // console.log(end)
  const cashFlows = await CashFlow.find({
    date: {
      $gte: start,
      $lt: end
    }
  })
    .populate('type', 'name')
    .populate('category', 'name')
  res.json(cashFlows)
})

app.get('/cashFlow/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const cashFlow = await CashFlow.findById(id)
      .populate('type', 'name')
      .populate('category', 'name');

    if (!cashFlow) {
      return res.status(404).json({ error: '找不到指定的流水記錄' });
    }

    res.json(cashFlow);
  } catch (error) {
    // console.error(error);
    return res.status(500).json({ error: '伺服器錯誤' });
  }
});


app.get('/cashFlowType', async (req, res) => {
  const cashFlowTypes = await CashFlowType.find({});
  const formattedTypes = cashFlowTypes.map(type => ({
    _id: type._id.toString(),
    name: type.name
  }));
  res.json(formattedTypes);
})
app.get('/expenseCategory', async (req, res) => {
  const expenseCategories = await ExpenseCategory.find({})
  const formattedTypes = expenseCategories.map(type => ({
    _id: type._id.toString(),
    name: type.name
  }));
  res.json(formattedTypes)
})
app.get('/incomeCategory', async (req, res) => {
  const incomeCategories = await IncomeCategory.find({})
  const formattedTypes = incomeCategories.map(type => ({
    _id: type._id.toString(),
    name: type.name
  }))
  res.json(formattedTypes)
})

app.post('/cashFlow', async (req, res, next) => {
  const newCashFlow = new CashFlow(req.body);
  await newCashFlow.save();
  res.status(201).send({ message: 'Cash flow created successfully', data: newCashFlow });
  next()
})
app.post('/category', async (req, res, next) => {
  const newCategory = (req.body.type === 'income' ? new IncomeCategory({ name: req.body.name }) : new ExpenseCategory({ name: req.body.name }));
  await newCategory.save();
  res.status(201).send({ message: 'Cash flow created successfully', data: newCategory });
  next()
})


app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
