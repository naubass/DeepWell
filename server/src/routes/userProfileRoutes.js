import { Router } from "express";
import validate from "../middleware/validate.js";
import { createProfileSchema, updateProfileSchema, updateUserDetailsSchema } from "../validator/schema.js";
import { createProfile, getProfile, updateProfile, updateUserDetails, deleteProfile } from "../controller/userProfileController.js";

const router = Router();


// Get user profile
router.get('/me', getProfile);

// Create profile (Onboarding assessment)
router.post('/me', validate(createProfileSchema), createProfile);

// Update user profile (height, weight, fitness_goal, etc)
router.patch('/me', validate(updateProfileSchema), updateProfile);

// Update user details (name, email, password)
// router.put('/me', validate(updateUserDetailsSchema), updateUserDetails);

// Delete profile
router.delete('', deleteProfile);

export default router;
