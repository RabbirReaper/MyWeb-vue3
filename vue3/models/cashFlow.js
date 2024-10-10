import mongoose from 'mongoose';

const cashFlowSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: true
  },
  type: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'CashFlowType',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: function() {
      return this.type.toString() === '670675c7b17c230881c73bfb' ? 'ExpenseCategory' : 'IncomeCategory';
    }
  },
  date: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    required: true
  }
});

const CashFlow = mongoose.model('CashFlow', cashFlowSchema);
export default CashFlow;
