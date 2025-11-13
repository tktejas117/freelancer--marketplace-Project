// routes/proposals.js
const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal'); // Import the Proposal model
const Project = require('../models/Project');   // Import Project model to update it
const verifyToken = require('../middleware/verifyToken'); // Import the middleware
const mongoose = require('mongoose'); // For ObjectId validation
const multer = require('multer'); // Import multer
const path = require('path'); // Import path module for directory handling
const fs = require('fs'); // Import file system module for directory creation

// Ensure the uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir); // Files will be saved in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    // Use the original filename with a timestamp to prevent overwrites
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

// File filter to allow only PDF and DOC/DOCX files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /pdf|doc|docx/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, DOC, and DOCX files are allowed!'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
  fileFilter: fileFilter
});

// POST /api/proposals - Submit a new proposal (Protected, Freelancer only)
router.post('/', verifyToken, upload.single('resume'), async (req, res) => {
  console.log('--- Inside proposals.js POST route handler ---');
  console.log('req.body at start:', req.body); // Should contain text fields like projectId, bidAmount
  console.log('req.file at start:', req.file); // Should contain file details

  try {
    // Ensure only freelancers can submit proposals
    if (req.user.role !== 'freelancer') {
      console.warn('Access Denied: User role is not freelancer.', req.user.role);
      // If a file was uploaded, delete it as the user is not authorized
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(403).json({ message: 'Access Denied: Only freelancers can submit proposals.' });
    }

    const { projectId, bidAmount } = req.body;
    const resumeFilePath = req.file ? req.file.path : null;

    if (!projectId || !bidAmount || !resumeFilePath) {
      console.error('Validation Error: Missing projectId, bidAmount, or resume file.');
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Please provide project ID, bid amount, and a resume file.' });
    }
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      console.error(`Validation Error: Invalid Project ID format: ${projectId}`);
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Invalid project ID format.' });
    }
    if (typeof parseFloat(bidAmount) !== 'number' || parseFloat(bidAmount) <= 0) {
      console.error('Validation Error: Bid amount must be a positive number.', bidAmount);
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Bid amount must be a positive number.' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      console.warn(`Project not found for ID: ${projectId}`);
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Project not found.' });
    }
    if (project.status !== 'open') {
      console.warn(`Cannot submit proposal: Project ${projectId} is not open.`);
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Cannot submit proposal for a project that is not open.' });
    }

    const existingProposal = await Proposal.findOne({ projectId, freelancerId: req.user.id });
    if (existingProposal) {
      console.warn(`Freelancer ${req.user.id} has already submitted a proposal for project ${projectId}.`);
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(409).json({ message: 'You have already submitted a proposal for this project.' });
    }

    const newProposal = new Proposal({
      projectId,
      freelancerId: req.user.id,
      bidAmount: parseFloat(bidAmount),
      resumeFilePath,
    });

    console.log('Attempting to save new proposal:', newProposal);
    const savedProposal = await newProposal.save();
    console.log('Proposal saved successfully:', savedProposal._id);

    project.proposals.push(savedProposal._id);
    await project.save();
    console.log(`Project ${projectId} updated with new proposal ${savedProposal._id}.`);

    res.status(201).json({
      message: 'Proposal submitted successfully!',
      proposal: savedProposal,
    });
  } catch (err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer Error:', err.message);
      return res.status(400).json({ message: `File upload error: ${err.message}` });
    }
    if (err.message === 'Only PDF, DOC, and DOCX files are allowed!') {
      console.error('File Type Error:', err.message);
      return res.status(400).json({ message: err.message });
    }
    if (err.name === 'ValidationError') {
      console.error('Mongoose Validation Error (Proposal):', err.message, err.errors);
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    }
    console.error('Server error during proposal submission:', err);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/proposals/:id/status - Update proposal status (Protected, Client only)
router.put('/:id/status', verifyToken, async (req, res) => {
  console.log('--- Inside proposals.js PUT /:id/status route handler ---');
  console.log('Authenticated user:', req.user);
  console.log('Request params:', req.params); // Contains proposal ID
  console.log('Request body:', req.body); // Contains action (e.g., 'accept', 'reject')

  try {
    const proposalId = req.params.id;
    const { action } = req.body; // 'accept' or 'reject'

    // Basic validation
    if (!mongoose.Types.ObjectId.isValid(proposalId)) {
      console.warn(`Invalid Proposal ID format: ${proposalId}`);
      return res.status(400).json({ message: 'Invalid proposal ID format.' });
    }
    if (!['accept', 'reject'].includes(action)) {
      console.warn(`Invalid action: ${action}`);
      return res.status(400).json({ message: 'Invalid action. Must be "accept" or "reject".' });
    }

    // Fetch the proposal to get its current state and associated project
    const proposal = await Proposal.findById(proposalId).populate('projectId');
    if (!proposal) {
      console.warn(`Proposal not found for ID: ${proposalId}`);
      return res.status(404).json({ message: 'Proposal not found.' });
    }

    // Ensure the authenticated user is the client who owns the project
    if (req.user.role !== 'client' || !proposal.projectId || proposal.projectId.clientId.toString() !== req.user.id) {
      console.warn('Access Denied: User is not the project owner or project not found.');
      return res.status(403).json({ message: 'Access Denied: You are not authorized to perform this action.' });
    }

    const project = proposal.projectId; // Get the populated project object

    if (action === 'accept') {
      // Check if project is already assigned or closed
      if (project.status !== 'open') {
        console.warn(`Cannot accept proposal: Project ${project._id} is not open (current status: ${project.status}).`);
        return res.status(400).json({ message: `Project is already ${project.status}. Cannot accept new proposals.` });
      }

      // 1. Update the accepted proposal's status using findByIdAndUpdate
      const updatedProposal = await Proposal.findByIdAndUpdate(
        proposalId,
        { $set: { status: 'accepted' } },
        { new: true } // Return the updated document
      );
      console.log(`Proposal ${proposalId} accepted.`);

      // 2. Update the project status and assign freelancer using findByIdAndUpdate
      const updatedProject = await Project.findByIdAndUpdate(
        project._id,
        { $set: { status: 'in-progress', assignedFreelancer: proposal.freelancerId } },
        { new: true } // Return the updated document
      );
      console.log(`Project ${project._id} status set to 'in-progress' and assigned to freelancer ${proposal.freelancerId}.`);

      // 3. Reject all other pending proposals for this project
      await Proposal.updateMany(
        {
          projectId: project._id,
          _id: { $ne: proposal._id }, // Not the accepted proposal
          status: 'pending'
        },
        { $set: { status: 'rejected' } }
      );
      console.log(`Other pending proposals for project ${project._id} rejected.`);

      res.status(200).json({
        message: 'Proposal accepted successfully! Project status updated.',
        proposal: updatedProposal,
        project: updatedProject
      });

    } else if (action === 'reject') {
      // Only allow rejection if the proposal is pending
      if (proposal.status !== 'pending') {
        console.warn(`Cannot reject proposal: Proposal ${proposalId} is not pending (current status: ${proposal.status}).`);
        return res.status(400).json({ message: `Cannot reject a proposal that is not pending.` });
      }

      // Update the rejected proposal's status using findByIdAndUpdate
      const updatedProposal = await Proposal.findByIdAndUpdate(
        proposalId,
        { $set: { status: 'rejected' } },
        { new: true } // Return the updated document
      );
      console.log(`Proposal ${proposalId} rejected.`);

      res.status(200).json({
        message: 'Proposal rejected successfully!',
        proposal: updatedProposal
      });
    }

  } catch (err) {
    console.error('Server error during proposal status update:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// NEW: GET /api/proposals/me - Get all proposals submitted by the authenticated freelancer
router.get('/me', verifyToken, async (req, res) => {
  console.log('--- Inside proposals.js GET /me route handler ---');
  console.log('Authenticated user:', req.user);

  try {
    // Ensure only freelancers can access this route
    if (req.user.role !== 'freelancer') {
      console.warn('Access Denied: User role is not freelancer.', req.user.role);
      return res.status(403).json({ message: 'Access Denied: Only freelancers can view their proposals.' });
    }

    const freelancerId = req.user.id;
    const proposals = await Proposal.find({ freelancerId: freelancerId })
      .populate('projectId', 'title budget status clientId') // Populate project details
      .populate('freelancerId', 'username email'); // Populate freelancer details (optional, but good for consistency)

    console.log(`Found ${proposals.length} proposals for freelancer ${freelancerId}.`);
    res.status(200).json({ proposals });
  } catch (err) {
    console.error('Server error during fetching freelancer proposals:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


module.exports = router;
