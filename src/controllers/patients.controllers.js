import Patient from '../models/patient.model.js';

export const getPatients = async(req, res) => {
    const patients = await Patient.find();
    if (!patients) return res.status(404).json({ message: 'No se encontraron pacientes' });
    res.json(patients);
};

export const createPatient = async(req, res) => {
    const { name, age, gender, phone_number } = req.body;
    const newPatient = new Patient({ name, age, gender, phone_number });
    const savedPatient = await newPatient.save();
    res.json({ message: 'Paciente creado exitosamente', savedPatient });
};

export const getPatientById = async(req, res) => {
    const patient = await Patient.findById(req.params.id);
    if (!patient) return res.status(404).json({ message: 'Paciente no encontrado' });
    res.json(patient);
}

export const deletePatientById = async(req, res) => {
    const deletedPatient = await Patient.findByIdAndDelete(req.params.id);
    if (!deletedPatient) return res.status(404).json({ message: 'Paciente no encontrado' });
    res.json({ message: 'Paciente eliminado exitosamente' });
}

export const updatePatientById = async(req, res) => {
    const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPatient) return res.status(404).json({ message: 'Paciente no encontrado' });
    res.json({ message: 'Paciente actualizado exitosamente', updatedPatient });
}
