import { Router } from 'express';
import { loginUser, logoutUser, registerUser } from '../controllers/users.js';

const userRouter = Router();

userRouter.route('/register').post(registerUser);
userRouter.route('/login').post(loginUser);
userRouter.route('/logout').post(logoutUser);

export default userRouter;