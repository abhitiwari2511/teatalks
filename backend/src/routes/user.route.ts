import { Router } from 'express';

const userRouter = Router();

userRouter.route('/signin').post(userSignin);
userRouter.route('/login').post(userLogin);

export default userRouter;