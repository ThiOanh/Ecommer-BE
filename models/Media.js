const mongoose = require("mongoose");
const { Schema, model } = mongoose;

// Mongoose Datatypes:
// https://mongoosejs.com/docs/schematypes.html

// Validator
// https://mongoosejs.com/docs/validation.html#built-in-validators

const mediaSchema = new Schema(
  {
    name: { type: String, required: true },
    size: { type: Number, required: true },
    location: { type: String, required: true },
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);
mediaSchema.virtual("employee", {
  ref: "employees",
  localField: "employeeId",
  foreignField: "_id",
  justOne: true,
});

// Virtuals in console.log()
mediaSchema.set("toObject", { virtuals: true });
// Virtuals in JSON
mediaSchema.set("toJSON", { virtuals: true });

const Media = model("Media", mediaSchema);
module.exports = Media;
