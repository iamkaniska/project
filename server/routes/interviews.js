import express from 'express';
import Interview from '../models/Interview.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all interviews
router.get('/', auth, async (req, res) => {
  try {
    let interviews;
    
    // Different queries based on user role
    if (req.user.role === 'admin') {
      // Admins can see all interviews
      interviews = await Interview.find()
        .populate('createdBy', 'name email')
        .populate('questions')
        .populate('participants.user', 'name email');
    } else if (req.user.role === 'recruiter') {
      // Recruiters see interviews they created
      interviews = await Interview.find({ createdBy: req.user._id })
        .populate('createdBy', 'name email')
        .populate('questions')
        .populate('participants.user', 'name email');
    } else {
      // Job seekers see interviews they're participating in
      interviews = await Interview.find({
        'participants.user': req.user._id
      })
        .populate('createdBy', 'name email')
        .populate('questions')
        .populate('participants.user', 'name email');
    }
    
    res.json(interviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get interview by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('createdBy', 'name email')
      .populate('questions')
      .populate('participants.user', 'name email');
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Check if user is authorized to view this interview
    const isCreator = interview.createdBy._id.toString() === req.user._id.toString();
    const isParticipant = interview.participants.some(
      p => p.user._id.toString() === req.user._id.toString()
    );
    
    if (req.user.role !== 'admin' && !isCreator && !isParticipant) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    res.json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new interview
router.post('/', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const { title, description, jobRole, questions, participants, scheduledDate } = req.body;
    
    const interview = new Interview({
      title,
      description,
      jobRole,
      questions,
      participants: participants || [],
      scheduledDate,
      createdBy: req.user._id,
      status: scheduledDate ? 'scheduled' : 'draft'
    });
    
    await interview.save();
    res.status(201).json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update an interview
router.put('/:id', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const { title, description, jobRole, questions, participants, scheduledDate, status } = req.body;
    const updateData = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (jobRole) updateData.jobRole = jobRole;
    if (questions) updateData.questions = questions;
    if (participants) updateData.participants = participants;
    if (scheduledDate) updateData.scheduledDate = scheduledDate;
    if (status) updateData.status = status;
    
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Check if user is admin or the creator of the interview
    if (
      req.user.role !== 'admin' && 
      interview.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    const updatedInterview = await Interview.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    )
      .populate('createdBy', 'name email')
      .populate('questions')
      .populate('participants.user', 'name email');
    
    res.json(updatedInterview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update participant status and feedback
router.put('/:id/participant', auth, async (req, res) => {
  try {
    const { status, feedback, score } = req.body;
    
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    // Find the participant
    const participantIndex = interview.participants.findIndex(
      p => p.user.toString() === req.user._id.toString()
    );
    
    if (participantIndex === -1) {
      return res.status(404).json({ message: 'Participant not found' });
    }
    
    // Update participant data
    if (status) interview.participants[participantIndex].status = status;
    if (feedback) interview.participants[participantIndex].feedback = feedback;
    if (score) interview.participants[participantIndex].score = score;
    
    await interview.save();
    
    res.json(interview);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete an interview
router.delete('/:id', auth, authorize('recruiter', 'admin'), async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
     
    // Check if user is admin or the creator of the interview
    if (
      req.user.role !== 'admin' && 
      interview.createdBy.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    
    await Interview.findByIdAndDelete(req.params.id);
    res.json({ message: 'Interview deleted' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;