import healthcheck from "../controllers/healthcheck_controller.js";

import { Router } from "express";
const router = Router();

router.route('/').get(healthcheck);
export default router;