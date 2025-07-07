import mongoose from 'mongoose';

const electricMeterReadingSchema = new mongoose.Schema({
  reading : {
    type: Number,
    required: true
  },
  dailyUsage: { //自動計算
    type: Number,
    required: true
  },
  cost: { //自動計算
    type: Number,
    required: true
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
});

const ElectricMeterReading = mongoose.model('ElectricMeterReading', electricMeterReadingSchema);
export default ElectricMeterReading;


