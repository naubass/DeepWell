import { Router } from "express";
// import users from "./userRoutes.js";
import authentication from "./authRoutes.js";
import profiles from "./userProfileRoutes.js";
import assessment from "./assessmentRoutes.js";
import { authToken } from "../middleware/auth.js";

const router = Router();

router.get('/', (req, res) => {
    res.send({
        message: 'Hello wok!',
        version: '1.0.0',
        status: 200
    })
})

// router.use('/', users)
router.use('/auth', authentication)
router.use('/profiles', authToken, profiles)
router.use('/checkin', authToken, assessment)


export default router;

