import { Router } from "express";
import { createAppointment, getAppointments, getAppointmentById, updateAppointment, deleteAppointment } from "../controllers/appointment.controllers.js";

const router = Router();

router.post('/appointments', createAppointment);
router.get('/appointments', getAppointments);
router.get('/appointments/:id', getAppointmentById);
router.put('/appointments/:id', updateAppointment);
router.delete('/appointments/:id', deleteAppointment);

export default router;