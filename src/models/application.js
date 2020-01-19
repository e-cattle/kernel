"use strict";

const mongoose = require("mongoose");

const application = new mongoose.Schema(
  {
    enable: {
      type: Boolean,
      required: true,
      default: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    device: {
      type: String,
      required: true,
      trim: true
    },
    user: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true
    },
    picture: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Application", application);
