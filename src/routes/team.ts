import express from 'express';
import adminAuth from '../middleware/auth/admin-auth';
import {
  validateTeam,
  validateUpdate,
  validateSearch,
} from '../middleware/validation/team';
import {
  createTeam,
  getTeam,
  updateTeam,
  removeTeam,
  getTeamByName,
  getAllTeams,
} from '../controllers/team';
import { userAuth, limitAPI } from '../middleware/auth/user-auth';
const teamRouter = express.Router();

teamRouter.post(
  '/team/add',
  [adminAuth, validateTeam],
  async (req: express.Request, res: express.Response) => {
    try {
      const {
        name,
        teamCode,
        logo,
        country,
        city,
        headCoach,
        founded,
        stadiumName,
        stadiumAddress,
        stadiumCapacity,
      } = req.body;
      const teamDetails = await createTeam(
        res.locals.admin.id,
        name,
        teamCode,
        logo,
        country,
        city,
        founded,
        headCoach,
        stadiumName,
        stadiumAddress,
        stadiumCapacity,
      );
      return res.status(200).json({ success: true, data: teamDetails });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
);
teamRouter.get(
  '/team/search?',
  validateSearch,
  async (req: express.Request, res: express.Response) => {
    try {
      const searchKey = Object.keys(req.query)[0];
      const searchValue = Object.values(req.query)[0];
      const teamDetails = await getTeamByName(searchKey, searchValue);
      return res.status(200).json({ success: true, data: teamDetails });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
);
teamRouter.get(
  '/team/all',
  [userAuth, limitAPI],
  async (req: any, res: any) => {
    const teamDetails = await getAllTeams();
    !req.session.limit ? 0 : (req.session.limit += 1);
    return res.status(200).json({ success: true, data: teamDetails });
  },
);
teamRouter.get(
  '/team/:id',
  [userAuth, limitAPI],
  async (req: any, res: express.Response) => {
    try {
      let teamId = req.params.id;
      const teamDetails = await getTeam(teamId);
      !req.session.limit ? 0 : (req.session.limit += 1);

      return res.status(200).json({ success: true, data: teamDetails });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
);
teamRouter.put(
  '/team/update/:id',
  [adminAuth, validateUpdate],
  async (req: express.Request, res: express.Response) => {
    try {
      const teamId = req.params.id;
      const teamDetails = await updateTeam(res.locals.admin.id, teamId, {
        ...req.body,
      });
      return res.status(200).json({ success: true, data: teamDetails });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
);
teamRouter.delete(
  '/team/delete/:id',
  adminAuth,
  async (req: express.Request, res: express.Response) => {
    try {
      const teamId = req.params.id;
      const message = await removeTeam(res.locals.admin.id, teamId);
      return res.status(200).json({ success: true, data: message });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
);

export default teamRouter;
