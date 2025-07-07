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
import ElectricMeterReading from './models/electricMeterReading.js'

dotenv.config()
const app = express()
const port = 3000

app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

mongoose.connect(`${process.env.MongoDB_url}`,)
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
  const { start, end, category } = req.query;
  
  // 建立查詢條件物件
  const queryConditions = {};
  
  // 只有當 start 和 end 都有值時，才添加日期條件
  if (start && end) {
    queryConditions.date = { $gte: start, $lt: end };
  }
  
  // 如果有提供 category 查詢參數，則添加到查詢條件中
  if (category) {
    queryConditions.category = category;
  }
  
  try {
    const cashFlows = await CashFlow.find(queryConditions)
      .populate('type', 'name')
      .populate('category', 'name');
    res.json(cashFlows);
  } catch (error) {
    console.error('Error fetching cash flows:', error);
    res.status(500).json({ error: 'Failed to fetch cash flows' });
  }
});


app.get('/cashFlow/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const cashFlow = await CashFlow.findById(id)
      .populate('type', 'name')
      .populate('category', 'name');

    if (!cashFlow) {
      return res.status(404).json({ error: '找不到指定的cashFlow' });
    }
    // console.log(good)
    res.json(cashFlow);
  } catch (error) {
    console.error(error)
    return res.status(500).json({ error: '伺服器錯誤' });
  }
});

app.get('/cashFlow/category/:categoryId', async (req, res) => {
  const { categoryId } = req.params;

  try {
    const cashFlows = await CashFlow.find({ category: categoryId })
      .populate('type', 'name')
      .populate('category', 'name');

    if (!cashFlows.length) {
      return res.status(404).json({ error: '找不到指定的分類' });
    }

    res.json(cashFlows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: '伺服器錯誤' });
  }
});

app.put('/cashFlow/:id', async (req, res,) => {
  const { id } = req.params;
  const updatedCashFlow  = await CashFlow.findByIdAndUpdate(id, req.body);
  res.status(200).send({ message: 'Update success' });
});


app.delete('/cashFlow/:id', async (req, res) => {
  const { id } = req.params;
  await CashFlow.findByIdAndDelete(id);
  res.status(200).send({ message: 'Delet success' });
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
  await newCashFlow.save().catch(err => console.log(err));
  res.status(201).send({ message: 'Cash flow created successfully', data: newCashFlow });
  next()
})
app.post('/category', async (req, res, next) => {
  const newCategory = (req.body.type === 'income' ? new IncomeCategory({ name: req.body.name }) : new ExpenseCategory({ name: req.body.name }));
  await newCategory.save();
  res.status(201).send({ message: 'Cash flow created successfully', data: newCategory });
  next()
})

// 電錶記錄 API
// 獲取所有電錶記錄
app.get('/electricMeter', async (req, res) => {
  try {
    const readings = await ElectricMeterReading.find({}).sort({ date: -1 });
    res.json(readings);
  } catch (error) {
    console.error('Error fetching electric meter readings:', error);
    res.status(500).json({ error: 'Failed to fetch electric meter readings' });
  }
});

// 獲取最後一筆電錶記錄
app.get('/electricMeter/last', async (req, res) => {
  try {
    const lastReading = await ElectricMeterReading.findOne({}).sort({ date: -1 });
    if (!lastReading) {
      return res.status(404).json({ error: '尚無電錶記錄' });
    }
    res.json(lastReading);
  } catch (error) {
    console.error('Error fetching last electric meter reading:', error);
    res.status(500).json({ error: 'Failed to fetch last electric meter reading' });
  }
});

// 新增電錶記錄 - 簡化版本，只儲存基本數據
app.post('/electricMeter', async (req, res) => {
  try {
    const { reading, date } = req.body;
    
    // 正確處理時區 - 將接收到的時間當作台灣當地時間
    let recordDate;
    if (typeof date === 'string') {
      recordDate = new Date(date);
    } else {
      recordDate = new Date(date);
    }
    
    // 只儲存基本數據，計算邏輯交給前端處理
    const newReading = new ElectricMeterReading({
      reading,
      dailyUsage: 0,      // 前端計算
      periodUsage: 0,     // 前端計算
      daysDiff: 0,        // 前端計算
      cost: 0,            // 前端計算
      date: recordDate
    });
    
    await newReading.save();
    
    res.status(201).json({ 
      message: 'Electric meter reading created successfully', 
      data: newReading 
    });
  } catch (error) {
    console.error('Error creating electric meter reading:', error);
    res.status(500).json({ error: 'Failed to create electric meter reading' });
  }
});

// 刪除電錶記錄
app.delete('/electricMeter/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedReading = await ElectricMeterReading.findByIdAndDelete(id);
    
    if (!deletedReading) {
      return res.status(404).json({ error: '找不到指定的電錶記錄' });
    }
    
    res.status(200).json({ message: 'Electric meter reading deleted successfully' });
  } catch (error) {
    console.error('Error deleting electric meter reading:', error);
    res.status(500).json({ error: 'Failed to delete electric meter reading' });
  }
});

// 重新計算所有現有記錄的API（修正期間用量問題）
app.post('/electricMeter/recalculate', async (req, res) => {
  try {
    console.log('前端將自行處理計算邏輯，此API已停用');
    res.json({ 
      message: '計算邏輯已移至前端處理', 
      note: '請刷新頁面查看正確計算結果'
    });
  } catch (error) {
    res.status(500).json({ error: '操作失敗' });
  }
});

// 修正時區問題的API（一次性使用）
app.post('/electricMeter/fix-timezone', async (req, res) => {
  try {
    console.log('開始修正時區問題...');
    
    // 獲取所有電錶記錄
    const readings = await ElectricMeterReading.find({}).sort({ date: 1 });
    console.log(`找到 ${readings.length} 筆記錄需要修正`);

    // 修正每筆記錄的時間（減去8小時）
    for (const reading of readings) {
      const originalDate = new Date(reading.date);
      const correctedDate = new Date(originalDate.getTime() - (8 * 60 * 60 * 1000));
      
      console.log(`修正記錄 ${reading._id}:`);
      console.log(`  原始時間: ${originalDate.toLocaleString('zh-TW')}`);
      console.log(`  修正時間: ${correctedDate.toLocaleString('zh-TW')}`);
      
      // 只更新時間，計算邏輯交給前端
      await ElectricMeterReading.findByIdAndUpdate(reading._id, {
        date: correctedDate,
        dailyUsage: 0,
        periodUsage: 0,
        daysDiff: 0,
        cost: 0
      });
    }

    res.json({ 
      message: '時區修正完成！計算邏輯將由前端處理。', 
      recordsFixed: readings.length 
    });
    
  } catch (error) {
    console.error('修正時區時發生錯誤:', error);
    res.status(500).json({ error: '修正失敗' });
  }
});

// 根據 ID 獲取特定電錶記錄
app.get('/electricMeter/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const reading = await ElectricMeterReading.findById(id);
    
    if (!reading) {
      return res.status(404).json({ error: '找不到指定的電錶記錄' });
    }
    
    res.json(reading);
  } catch (error) {
    console.error('Error fetching electric meter reading:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})