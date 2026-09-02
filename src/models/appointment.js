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
  // Solo se guardan los dientes modificados durante esta cita.
  odontogram_changes: [
    {
      tooth_number: Number,
      status: String,
      notes: String,
    },
  ],
  status: {
    type: String,
    required: true,
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

appointmentSchema.index({ date: 1, time: 1 });

const Appointment = mongoose.model("Appointment", appointmentSchema);
export default Appointment;
