import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patient: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  notes: String,
  status: {
    type: String,
    default: "Pendiente",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
