import mongoose from 'mongoose';

const cashFlowTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

const CashFlowType = mongoose.model('CashFlowType', cashFlowTypeSchema);
export default CashFlowType;
