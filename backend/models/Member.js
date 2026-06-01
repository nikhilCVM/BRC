const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true
    },
    relation: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    }
  },
  {
    _id: false
  }
);

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    flatNo: {
      type: String,
      trim: true
    },
    address: {
      type: String,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    dob: {
      type: Date
    },
    age: {
      type: Number,
      min: 0
    },
    marriageDate: {
      type: Date
    },
    spouseName: {
      type: String,
      trim: true,
      default: ""
    },
    bloodGroup: {
      type: String,
      trim: true
    },
    emergencyContactPerson: {
      type: String,
      trim: true
    },
    emergencyPhone: {
      type: String,
      trim: true
    },
    occupation: {
      type: String,
      trim: true
    },
    retiredDetails: {
      type: String,
      trim: true
    },
    familyMembers: {
      type: [familyMemberSchema],
      default: []
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Member", memberSchema);
