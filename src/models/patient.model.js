import mongoose from "mongoose";

const medicalHistorySchema = new mongoose.Schema({
    date: { type: Date, default: Date.now },
    is_sick: String,
    medications: String,
    allergies: String,
    vitals: {
        heart_rate: String,
        blood_pressure: String,
        temperature: String,
        weight: String,
        glucose: String
    },
    odontogram: [
        {
            tooth_number: Number,
            status: String, // ej: "caries", "ausente", "resina"
            notes: String
        }
    ],
    diagnosis: String,
    treatment_plan: String
});

const patientSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        trim: true
    },
    age:{
        type: Number,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    phone_number:{
        type: String,
        required: true
    },
    medical_gistories:[medicalHistorySchema]
});

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;