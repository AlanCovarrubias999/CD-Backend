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
    medical_histories:[medicalHistorySchema],
    // Estado vigente mostrado en el expediente del paciente.
    odontogram: [
        {
            tooth_number: Number,
            status: String,
            notes: String
        }
    ],
    // Punto de partida para reconstruir el estado al editar o eliminar una cita.
    odontogram_base: [
        {
            tooth_number: Number,
            status: String,
            notes: String
        }
    ]
});

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;
