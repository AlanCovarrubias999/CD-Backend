import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';
import { getPatients, 
    createPatient, 
    getPatientById,
    updatePatientById, 
    deletePatientById
 } from '../controllers/patients.controllers.js';

const router = Router();

router.get("/patient", authRequired, getPatients);
router.post("/patient", authRequired, createPatient);
router.get("/patient/:id", authRequired, getPatientById);
router.put("/patient/:id", authRequired, updatePatientById);
router.delete("/patient/:id", authRequired, deletePatientById);

export default router;