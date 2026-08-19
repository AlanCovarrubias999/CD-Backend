import Patient from '../models/patient.model.js';

export const getPatients = async(req, res) => {
    const patients = await Patient.find();
    if (!patients) return res.status(404).json({ message: 'No se encontraron pacientes' });
    res.json(patients);
};

export const createPatient = async(req, res) => {
    try {
        const { name, age, gender, phone_number, medical_histories, odontogram = [] } = req.body;

        const legacyOdontogram = medical_histories?.[0]?.odontogram || [];
        const currentOdontogram = odontogram.length ? odontogram : legacyOdontogram;
        const newPatient = new Patient({
            name,
            age,
            gender,
            phone_number,
            medical_histories,
            odontogram: currentOdontogram,
            odontogram_base: currentOdontogram,
        });

        const savedPatient = await newPatient.save();

    res.status(201).json({ message: 'Paciente creado exitosamente', savedPatient });
    } catch (error) {
        console.error('Error al crear el paciente:', error);
        res.status(500).json({ message: 'Error al crear el paciente' });
        
    }
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
    try {
        const update = { ...req.body };
        if (Array.isArray(update.odontogram)) {
            update.odontogram_base = update.odontogram;
        }
        const updatedPatient = await Patient.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!updatedPatient) return res.status(404).json({ message: 'Paciente no encontrado' });
        res.json({ message: 'Paciente actualizado exitosamente', updatedPatient });
    } catch (error) {
        console.error('Error al actualizar el paciente:', error);
        res.status(500).json({ message: 'Error al actualizar el paciente' });
    }
}
