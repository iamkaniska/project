import mongoose from 'mongoose';

const interviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  jobRole: {
    type: String,
    required: true
  },
  questions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question'
  }],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  participants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'completed'],
      default: 'pending'
    },
    feedback: String,
    score: Number
  }],
  scheduledDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'completed'],
    default: 'draft'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Interview = mongoose.model('Interview', interviewSchema);

export default Interview;