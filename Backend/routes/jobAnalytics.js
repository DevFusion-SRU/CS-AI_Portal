import express from 'express';
import { getInDemandSkills, getMostAppliedJobs, getMostAppliedCompanies, getJobsPostedCount } from '../controllers/Jobs/jobAnalytics.js';


const router = express.Router();    
router.get("/topskills", getInDemandSkills);
router.get("/topjobs", getMostAppliedJobs);
router.get("/topcompanies", getMostAppliedCompanies);
router.get("/topcompanies", getJobsPostedCount);

export default router;

  