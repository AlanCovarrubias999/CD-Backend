import { Router } from 'express';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

router.get("/patient", authRequired, );
router.post("/patient", authRequired, );
router.get("/patient/:id", authRequired, );
router.put("/patient/:id", authRequired, );
router.delete("/patient/:id", authRequired, );

export default router;