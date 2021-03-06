import express from 'express';
import { validateUser, validateLogin } from '../middleware/validation/user';
import { createUser, loginUser } from '../controllers/user';

const userRouter = express.Router();

userRouter.post('/user/signup', validateUser, async (req: any, res: any) => {
  try {
    let { firstName, lastName, email, password, gender } = req.body;
    const userDetails = await createUser(
      firstName,
      lastName,
      email,
      gender,
      password,
    );
    if (req.sessionID) {
      req.session.userDetails = userDetails;
      req.session.limit = 0;
    }
    return res
      .header('authorization', userDetails.token)
      .status(200)
      .json({ success: true, data: userDetails });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
});
userRouter.post(
  '/user/login',
  validateLogin,
  async (req: any, res: express.Response) => {
    try {
      const { email, password } = req.body;
      const userEmail = req.session.hasOwnProperty('userDetails')
        ? req.session.userDetails.email
        : null;
      if (req.sessionID && email === userEmail) {
        const userDetails = req.session.userDetails;
        req.session.limit = 0;
        return res
          .header('authorization', userDetails.token)
          .status(200)
          .json({ success: true, data: userDetails });
      }

      const userDetails = await loginUser(email, password);
      if (req.sessionID) {
        req.session.userDetails = userDetails;
        req.session.limit = 0;
      }

      return res
        .header('authorization', userDetails.token)
        .status(200)
        .json({ success: true, data: userDetails });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
);
export default userRouter;
