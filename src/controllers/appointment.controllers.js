import Appointment from "../models/appointment.js";

export const createAppointment = async (req, res) => {
    const { patient, date, time, notes } = req.body;
    try {
        const newAppointment = new Appointment({ patient, date, time, notes });
        const savedAppointment = await newAppointment.save();
        res.status(201).json({ message: "Cita creada exitosamente", savedAppointment });
    } catch (error) {
        console.error("Error al crear la cita:", error);
        res.status(500).json({ message: "Error al crear la cita" });
    }
};

export const getAppointments = async (req, res) => {
    try {
        const appointments = await Appointment.find();
        if (!appointments) return res.status(404).json({ message: "No se encontraron citas" });
        res.json(appointments);
    } catch (error) {
        console.error("Error al obtener las citas:", error);
        res.status(500).json({ message: "Error al obtener las citas" });
    };
};

export const getAppointmentById = async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id);
        if (!appointment) return res.status(404).json({ message: "Cita no encontrada" });
        res.json(appointment);
    } catch (error) {
        console.error("Error al obtener la cita:", error);
        res.status(500).json({ message: "Error al obtener la cita" });
    };
};

export const updateAppointment = async (req, res) => {
    const { patient, date, time, notes, status } = req.body;
    try {
        const updatedAppointment = await Appointment.findByIdAndUpdate(req.params.id, { patient, date, time, notes, status }, { new: true });
        if (!updatedAppointment) return res.status(404).json({ message: "Cita no encontrada" });
        res.json({ message: "Cita actualizada exitosamente", updatedAppointment });
    } catch (error) {
        console.error("Error al actualizar la cita:", error);
        res.status(500).json({ message: "Error al actualizar la cita" });
    }
};

export const deleteAppointment = async (req, res) => {
    try {
        const deletedAppointment = await Appointment.findByIdAndDelete(req.params.id);
        if (!deletedAppointment) return res.status(404).json({ message: "Cita no encontrada" });
        res.json({ message: "Cita eliminada exitosamente" });
    } catch (error) {
        console.error("Error al eliminar la cita:", error);
        res.status(500).json({ message: "Error al eliminar la cita" });
    }
};