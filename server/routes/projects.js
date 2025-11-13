// routes/projects.js
const express = require('express');
const router = express.Router();
const Project = require('../models/Project'); // Import the Project model
const verifyToken = require('./../middleware/verifyToken'); // Corrected path for verifyToken
const mongoose = require('mongoose'); // Import mongoose to check for valid ObjectId

// POST /api/projects - Create a new project (Protected, Client only)
router.post('/', verifyToken, async (req, res) => {
  console.log('--- Inside projects.js POST route handler ---');
  console.log('Authenticated user:', req.user);
  console.log('Request body:', req.body);

  try {
    // Ensure only clients can post projects
    if (req.user.role !== 'client') {
      console.warn('Access Denied: User role is not client.', req.user.role);
      return res.status(403).json({ message: 'Access Denied: Only clients can post projects.' });
    }

    const { title, description, budget, skillsRequired } = req.body;

    // Basic validation
    if (!title || !description || budget === undefined || budget === null) {
      console.error('Validation Error: Missing title, description, or budget.');
      return res.status(400).json({ message: 'Please provide title, description, and budget.' });
    }
    if (typeof budget !== 'number' || budget < 0) {
        console.error('Validation Error: Budget is not a non-negative number.', budget);
        return res.status(400).json({ message: 'Budget must be a non-negative number.' });
    }
    if (skillsRequired && !Array.isArray(skillsRequired)) {
        console.error('Validation Error: Skills required must be an array of strings.', skillsRequired);
        return res.status(400).json({ message: 'Skills required must be an array of strings.' });
    }

    const newProject = new Project({
      clientId: req.user.id, // Get client ID from the authenticated user token
      title,
      description,
      budget,
      skillsRequired: skillsRequired || [], // Default to empty array if not provided
    });

    console.log('Attempting to save new project:', newProject);
    const savedProject = await newProject.save();
    console.log('Project saved successfully:', savedProject._id);

    res.status(201).json({
      message: 'Project posted successfully!',
      project: savedProject,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      console.error('Mongoose Validation Error:', err.message, err.errors);
      return res.status(400).json({ message: 'Validation failed', errors: err.errors });
    }
    console.error('Server error during project posting:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/projects - Get all projects (Protected, accessible by both client and freelancer)
// Filtered to only return 'open' projects for general browsing
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log('Received GET request to /api/projects (all)');
    const projects = await Project.find({ status: 'open' })
      .populate('clientId', 'username email');

    console.log(`Found ${projects.length} open projects.`);
    res.status(200).json({ projects });
  } catch (err) {
    console.error('Server error during fetching all projects:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/projects/client/:clientId - Get all projects posted by a specific client
router.get('/client/:clientId', verifyToken, async (req, res) => {
  try {
    const clientId = req.params.clientId;
    console.log(`Received GET request for client's projects for ID: ${clientId}`);

    if (req.user.role !== 'client' || req.user.id !== clientId) {
      return res.status(403).json({ message: 'Access Denied: You can only view your own projects.' });
    }

    if (!mongoose.Types.ObjectId.isValid(clientId)) {
      console.warn(`Invalid Client ID format: ${clientId}`);
      return res.status(400).json({ message: 'Invalid client ID format.' });
    }

    const projects = await Project.find({ clientId: clientId })
      .populate('clientId', 'username email');

    console.log(`Found ${projects.length} projects for client ${clientId}.`);
    res.status(200).json({ projects });
  } catch (err) {
    console.error('Server error during fetching client projects:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


// GET /api/projects/:id - Get a single project by ID (Protected)
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const projectId = req.params.id;
    console.log(`Received GET request for project ID: ${projectId}`);

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      console.warn(`Invalid Project ID format: ${projectId}`);
      return res.status(400).json({ message: 'Invalid project ID format.' });
    }

    const project = await Project.findById(projectId)
      .populate('clientId', 'username email')
      .populate('assignedFreelancer', 'username email') // <-- NEW: Populate the assigned freelancer
      .populate({ // Populate proposals and then the freelancerId within each proposal
        path: 'proposals',
        populate: {
          path: 'freelancerId',
          select: 'username email' // Select fields to populate from the User model for freelancer
        }
      });

    if (!project) {
      console.warn(`Project not found for ID: ${projectId}`);
      return res.status(404).json({ message: 'Project not found.' });
    }

    console.log(`Found project: ${project.title}`);
    res.status(200).json({ project });
  } catch (err) {
    console.error('Server error during fetching single project:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// GET /api/projects/me/active - Get projects where the authenticated freelancer is assigned
router.get('/me/active', verifyToken, async (req, res) => {
  console.log('--- Inside projects.js GET /me/active route handler ---');
  console.log('Authenticated user:', req.user);

  try {
    // Ensure only freelancers can access this route
    if (req.user.role !== 'freelancer') {
      console.warn('Access Denied: User role is not freelancer.', req.user.role);
      return res.status(403).json({ message: 'Access Denied: Only freelancers can view their active projects.' });
    }

    const freelancerId = req.user.id;
    // Find projects where the current freelancer is assigned and status is 'in-progress'
    const projects = await Project.find({
      assignedFreelancer: freelancerId,
      status: 'in-progress' // Only show projects they are actively working on
    })
    .populate('clientId', 'username email'); // Populate client details

    console.log(`Found ${projects.length} active projects for freelancer ${freelancerId}.`);
    res.status(200).json({ projects });
  } catch (err) {
    console.error('Server error during fetching freelancer active projects:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// PUT /api/projects/:id/complete - Mark project as complete and add feedback (Client only)
router.put('/:id/complete', verifyToken, async (req, res) => {
  console.log('--- Inside projects.js PUT /:id/complete route handler ---');
  console.log('Authenticated user:', req.user);
  console.log('Request params:', req.params); // Contains project ID
  console.log('Request body:', req.body); // Contains rating and feedback

  try {
    const projectId = req.params.id;
    const { clientRating, clientFeedback } = req.body;

    // Basic validation
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      console.warn(`Invalid Project ID format: ${projectId}`);
      return res.status(400).json({ message: 'Invalid project ID format.' });
    }
    if (typeof clientRating !== 'number' || clientRating < 1 || clientRating > 5) {
      console.error('Validation Error: clientRating must be a number between 1 and 5.');
      return res.status(400).json({ message: 'Rating must be a number between 1 and 5.' });
    }
    if (clientFeedback && typeof clientFeedback !== 'string') {
        console.error('Validation Error: clientFeedback must be a string.');
        return res.status(400).json({ message: 'Feedback must be a string.' });
    }

    const project = await Project.findById(projectId);
    if (!project) {
      console.warn(`Project not found for ID: ${projectId}`);
      return res.status(404).json({ message: 'Project not found.' });
    }

    // Ensure the authenticated user is the client who owns the project
    if (req.user.role !== 'client' || project.clientId.toString() !== req.user.id) {
      console.warn('Access Denied: User is not the project owner.');
      return res.status(403).json({ message: 'Access Denied: You are not authorized to complete this project.' });
    }

    // Ensure project is in 'in-progress' status to be completed
    if (project.status !== 'in-progress') {
      console.warn(`Cannot complete project: Project ${projectId} is not in 'in-progress' status (current status: ${project.status}).`);
      return res.status(400).json({ message: `Project is not in 'in-progress' status. Cannot complete.` });
    }

    // Update project status, completion date, rating, and feedback
    project.status = 'completed';
    project.completionDate = new Date();
    project.clientRating = clientRating;
    project.clientFeedback = clientFeedback || ''; // Set to empty string if no feedback provided

    await project.save();
    console.log(`Project ${projectId} marked as completed.`);

    res.status(200).json({
      message: 'Project marked as completed successfully!',
      project: project
    });

  } catch (err) {
    console.error('Server error during project completion:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});


module.exports = router;
