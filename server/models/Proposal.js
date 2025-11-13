// models/Proposal.js
const mongoose = require('mongoose');

const ProposalSchema = new mongoose.Schema(
  {
    projectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project', // Reference to the Project this proposal is for
      required: true,
    },
    freelancerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // Reference to the Freelancer who submitted the proposal
      required: true,
    },
    bidAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    // Changed from coverLetter to resumeFilePath
    resumeFilePath: {
      type: String, // Store the path to the uploaded resume file
      required: true,
    },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected', 'withdrawn'],
      default: 'pending',
    },
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Add a unique compound index to prevent a freelancer from submitting multiple proposals for the same project
ProposalSchema.index({ projectId: 1, freelancerId: 1 }, { unique: true });

module.exports = mongoose.model('Proposal', ProposalSchema);
