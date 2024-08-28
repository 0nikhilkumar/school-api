import express from "express";
import { addSchool, listSchool } from "../controllers/school.js";

const router = express.Router();

router.route("/addSchool").post(addSchool);
router.route("/listSchool").get(listSchool);

export default router;
