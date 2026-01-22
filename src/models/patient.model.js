import mongoose from "mongoose";

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
    }
});

const Patient = mongoose.model("Patient", patientSchema);
export default Patient;