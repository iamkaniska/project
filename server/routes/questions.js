import express from 'express';
import Question from '../models/Question.js';
import { auth, authorize } from '../middleware/auth.js';
import { generateAIQuestions } from '../services/openai.js';

const router = express.Router();

// Get all questions
router.get('/', auth, async (req, res) => {
  try {
    const { category, difficulty, jobRole } = req.query;
    const filter = {};
    
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;
    if (jobRole) filter.jobRole = jobRole;
    
    const questions = await Question.find(filter);
    res.json(questions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get question by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    res.json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new question
router.post('/', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const { text, category, difficulty, jobRole, suggestedAnswer } = req.body;
    
    const question = new Question({
      text,
      category,
      difficulty,
      jobRole,
      suggestedAnswer,
      createdBy: req.user._id
    });
    
    await question.save();
    res.status(201).json(question);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Generate AI questions
router.post('/generate', auth, async (req, res) => {
  try {
    const { jobRole, category, count = 5 } = req.body;
    
    if (!jobRole || !category) {
      return res.status(400).json({ message: 'Job role and category are required' });
    }
    
    const questions = await generateAIQuestions(jobRole, category, count);
    
    // Save generated questions to database
    const savedQuestions = await Promise.all(
      questions.map(async (q) => {
        const question = new Question({
          text: q.text,
          category,
          jobRole,
          suggestedAnswer: q.suggestedAnswer,
          difficulty: q.difficulty || 'intermediate',
          createdBy: req.user._id,
          isAIGenerated: true
        });
        
        await question.save();
        return question;
      })
    );
    
    res.status(201).json(savedQuestions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a question
router.put('/:id', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const { text, category, difficulty, jobRole, suggestedAnswer } = req.body;
    const updateData = {};
    
    if (text) updateData.text = text;
    if (category) updateData.category = category;
    if (difficulty) updateData.difficulty = difficulty;
    if (jobRole) updateData.jobRole = jobRole;
    if (suggestedAnswer) updateData.suggestedAnswer = suggestedAnswer;
    
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Check if user is admin or the creator of the question
    if (
      req.user.role !== 'admin' && 
      question.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedQuestion = await Question.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    );
    
    res.json(updatedQuestion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a question
router.delete('/:id', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Check if user is admin or the creator of the question
    if (
      req.user.role !== 'admin' && 
      question.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Question.findByIdAndDelete(req.params.id);
    res.json({ message: 'Question deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;