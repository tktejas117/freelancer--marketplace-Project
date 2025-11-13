// models/Project.js
const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model (the client who posted the project)
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 5,
      maxlength: 100,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 20,
      maxlength: 2000,
    },
    budget: {
      type: Number,
      required: true,
      min: 0,
    },
    skillsRequired: {
      type: [String], // Array of strings (e.g., ['React', 'Node.js'])
      default: [],
    },
    status: {
      type: String,
      enum: ['open', 'in-progress', 'completed', 'cancelled'],
      default: 'open',
    },
    proposals: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Proposal',
      },
    ],
    assignedFreelancer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the User model (the freelancer assigned)
      default: null,
    },
    // NEW FIELDS FOR COMPLETION AND FEEDBACK
    completionDate: {
      type: Date,
      default: null,
    },
    clientRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },
    clientFeedback: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: null,
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

module.exports = mongoose.model('Project', ProjectSchema);
