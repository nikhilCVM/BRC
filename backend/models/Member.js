const mongoose = require("mongoose");

const familyMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: ""
    },
    contact: {
      type: String,
      trim: true,
      default: ""
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
      required: true,
      default: "",
      trim: true
    },
    address: {
      type: String,
      trim: true,
      default: ""
    },
    phone: {
      type: String,
      trim: true,
      default: ""
    },
    dob: {
      type: Date,
      default: null
    },
    isDeceased: {
      type: Boolean,
      default: false
    },
    deceasedDate: {
      type: Date,
      default: null
    },
    age: {
      type: Number,
      min: 0
    },
    marriageDate: {
      type: Date,
      default: null
    },
    spouseName: {
      type: String,
      trim: true,
      default: ""
    },
    bloodGroup: {
      type: String,
      trim: true,
      default: ""
    },
    joinedBrcYear: {
      type: String,
      trim: true,
      default: ""
    },
    emergencyContactPerson: {
      type: String,
      trim: true,
      default: ""
    },
    emergencyPhone: {
      type: String,
      trim: true,
      default: ""
    },
    occupationDetails: {
      type: String,
      trim: true,
      default: ""
    },
    retiredWhenWhere: {
      type: String,
      trim: true,
      default: ""
    },
    positionsAndAchievements: {
      type: String,
      trim: true,
      default: ""
    },
    countriesVisited: {
      type: String,
      trim: true,
      default: ""
    },
    additionalInformation: {
      type: String,
      trim: true,
      default: ""
    },
    sonsDaughters: {
      type: [familyMemberSchema],
      default: []
    },
    occupation: {
      type: String,
      trim: true,
      default: ""
    },
    retiredDetails: {
      type: String,
      trim: true,
      default: ""
    },
    familyMembers: {
      type: [familyMemberSchema],
      default: []
    },
    editTokenHash: {
      type: String,
      select: false,
      default: ""
    },
    editTokenExpiresAt: {
      type: Date,
      select: false,
      default: null
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Member", memberSchema);
