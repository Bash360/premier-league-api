import {
  createTeam,
  removeTeam,
  getTeam,
  updateTeam,
  getTeamByName,
  getAllTeams,
} from '../src/controllers/team';
import { connectToDB, disconnectFromDB } from '../test-setup/test-connection';
import { createAdmin } from '../src/controllers/user';
let adminId: string;
let teamId: string;
let teamName: string;
describe('test for team controller', () => {
  beforeAll(async () => {
    await connectToDB();
    const adminDetails = await createAdmin(
      'russell',
      'eweke',
      'rus@gmail.com',
      'male',
      'iamrussell',
    );
    adminId = adminDetails.id;
  });
  afterAll(async () => {
    await disconnectFromDB();
  });
  it('should return team details', async () => {
    const teamDetails = await createTeam(
      adminId,
      'arsenal football club',
      'ARS',
      'arsenal.jpg',
      'england',
      'north london',
      '10-07-1886',
      'Unai Emery',
      'Emirates Stadium',
      ' Holloway, London',
      200000,
    );
    teamId = teamDetails.id;
    teamName = teamDetails.name;
    expect(teamDetails).toHaveProperty('name');
  });
  it('should return team details', async () => {
    const team = await getTeam(teamId);
    expect(team).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      headCoach: expect.any(String),
      teamCode: expect.any(String),
      logo: expect.any(String),
      country: expect.any(String),
      founded: expect.any(Date),
      stadiumName: expect.any(String),
      stadiumAddress: expect.any(String),
      city: expect.any(String),
      stadiumCapacity: expect.any(Number),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
    });
  });
  it('should should return updated team', async () => {
    const team = await updateTeam(adminId, teamId, {
      headCoach: 'mark bashir',
    });
    expect(team.headCoach).toMatch('mark bashir');
  });
  it('should return team details', async () => {
    const team = await getTeamByName('name', teamName);
    expect(team[0]).toHaveProperty('stadiumName');
  });
  it('should should return all teams', async () => {
    const team = await getAllTeams();
    expect(team).toHaveLength(1);
  });

  it('should remove team and return team successfully removed ', async () => {
    const team = await removeTeam(adminId, teamId);

    expect(team).toMatch('team successfully deleted');
  });
});
