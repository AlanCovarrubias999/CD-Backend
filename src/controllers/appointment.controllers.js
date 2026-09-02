import Appointment from "../models/appointment.js";
import Patient from "../models/patient.model.js";

const normalizeOdontogramChanges = (changes) =>
  (Array.isArray(changes) ? changes : [])
    .map((change) => ({
      tooth_number: Number(change.tooth_number),
      status: String(change.status || "").trim(),
      notes: String(change.notes || "").trim(),
    }))
    .filter(({ tooth_number, status }) =>
      Number.isInteger(tooth_number) && tooth_number >= 1 && tooth_number <= 32 && status,
    );

const mergeOdontogramChanges = (odontogram = [], changes = []) => {
  const teeth = new Map(
    odontogram.map((tooth) => [
      Number(tooth.tooth_number),
      {
        tooth_number: Number(tooth.tooth_number),
        status: tooth.status || "",
        notes: tooth.notes || "",
      },
    ]),
  );

  changes.forEach((change) => teeth.set(change.tooth_number, change));
  return [...teeth.values()].sort((first, second) => first.tooth_number - second.tooth_number);
};

const refreshPatientOdontogram = async (patientName) => {
  if (!patientName) return;

  const patient = await Patient.findOne({ name: patientName });
  if (!patient) return;

  const legacyOdontogram = patient.medical_histories?.[0]?.odontogram || [];
  const baseOdontogram = patient.odontogram_base?.length
    ? patient.odontogram_base
    : patient.odontogram?.length
      ? patient.odontogram
      : legacyOdontogram;
  const appointments = await Appointment.find({ patient: patientName, status: "Completada" })
    .sort({ date: 1, time: 1, createdAt: 1 });
  const currentOdontogram = appointments.reduce(
    (odontogram, appointment) => mergeOdontogramChanges(odontogram, appointment.odontogram_changes || []),
    baseOdontogram,
  );

  patient.odontogram_base = baseOdontogram;
  patient.odontogram = currentOdontogram;
  await patient.save();
};

export const createAppointment = async (req, res) => {
  const { patient, date, time, notes, status, odontogram_changes } = req.body;
  try {
    const newAppointment = new Appointment({
      patient,
      date,
      time,
      notes,
      status,
      odontogram_changes: normalizeOdontogramChanges(odontogram_changes),
    });
    const savedAppointment = await newAppointment.save();
    await refreshPatientOdontogram(patient);
    res.status(201).json({ message: "Cita creada exitosamente", savedAppointment });
  } catch (error) {
    console.error("Error al crear la cita:", error);
    res.status(500).json({ message: "Error al crear la cita" });
  }
};

export const getAppointments = async (req, res) => {
  try {
    const { from, to } = req.query;
    const filter = {};

    if (from || to) {
      filter.date = {};

      if (from) {
        const start = new Date(`${from}T00:00:00.000Z`);
        if (Number.isNaN(start.getTime())) {
          return res.status(400).json({ message: "La fecha inicial no es válida" });
        }
        filter.date.$gte = start;
      }

      if (to) {
        const end = new Date(`${to}T23:59:59.999Z`);
        if (Number.isNaN(end.getTime())) {
          return res.status(400).json({ message: "La fecha final no es válida" });
        }
        filter.date.$lte = end;
      }
    }

    const appointments = await Appointment.find(filter).sort({ date: 1, time: 1 });
    res.json(appointments);
  } catch (error) {
    console.error("Error al obtener las citas:", error);
    res.status(500).json({ message: "Error al obtener las citas" });
  }
};

export const getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Cita no encontrada" });
    res.json(appointment);
  } catch (error) {
    console.error("Error al obtener la cita:", error);
    res.status(500).json({ message: "Error al obtener la cita" });
  }
};

export const updateAppointment = async (req, res) => {
  const { patient, date, time, notes, status, odontogram_changes } = req.body;
  try {
    const previousAppointment = await Appointment.findById(req.params.id);
    if (!previousAppointment) return res.status(404).json({ message: "Cita no encontrada" });

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      {
        patient,
        date,
        time,
        notes,
        status,
        odontogram_changes: normalizeOdontogramChanges(odontogram_changes),
        updatedAt: new Date(),
      },
      { new: true },
    );
    await Promise.all([
      refreshPatientOdontogram(previousAppointment.patient),
      previousAppointment.patient === patient ? Promise.resolve() : refreshPatientOdontogram(patient),
    ]);
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
    await refreshPatientOdontogram(deletedAppointment.patient);
    res.json({ message: "Cita eliminada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar la cita:", error);
    res.status(500).json({ message: "Error al eliminar la cita" });
  }
};
