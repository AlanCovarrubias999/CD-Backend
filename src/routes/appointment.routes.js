import { Router } from "express";
import { createAppointment, getAppointments, getAppointmentById, updateAppointment, deleteAppointment } from "../controllers/appointment.controllers.js";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.post('/appointments', authRequired, createAppointment);
router.get('/appointments', authRequired, getAppointments);
router.get('/appointments/:id', authRequired, getAppointmentById);
router.put('/appointments/:id', authRequired, updateAppointment);
router.delete('/appointments/:id', authRequired, deleteAppointment);

export default router;
