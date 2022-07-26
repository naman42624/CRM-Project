const mongoose = require("mongoose");

const leadsSchema = new mongoose.Schema({
      name:{
        type: String,
        required: true
      },
      interestedCountry: String,
      college: String,
      leadFrom: {
        type: String,
        default: "Excel"
      },
      status: {
          type: String,
      },
      email: {
          type: String
      },
      phone: {
          type: String,
          required: true,
          maxlength: 10,
          minlength: 10
      },
      altPhone: {
        type: String,
        maxlength: 10,
        minlength: 10
    },
      course: {
          type: String
      },
      comments: {
          type: String
      },
      call: {
        type: String
      },
      telleFollowUps: {
        type: Number,
        default: 0
      },
      tellecaller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      telleFollowUpDate: {
        type: String
      },
      walksIn: Boolean,
      scheduledWalksInDate: String,
      walksInDate: String,
      walksInTime: String,
      walksInBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      counsellor:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      counsellorFollowUps: {
        type: Number,
        default: 0
      },
      counsellorFollowUpDate: {
        type: String
      },
      washot:{
        type: Boolean,
        default: false
      },
      city: String,
      visaType: String, 
      latestQualification: String,
      english: {
        IELTS: String,
        PTE: String,
        Other: String
      },
      prefIntake: String,
      remarksByCounsellor: String,
});
  
  const Lead = mongoose.model("Lead", leadsSchema);
    module.exports = Lead;