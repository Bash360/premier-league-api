import { createUser, createAdmin, loginUser } from '../src/controllers/user';
import { connectToDB, disconnectFromDB } from '../test-setup/test-connection';
describe('test for user controller', () => {
  beforeAll(async () => {
    await connectToDB();
  });
  afterAll(async () => {
    await disconnectFromDB();
  });
  it('should create user and return user details', async () => {
    const user = await createUser(
      'mark',
      'bashir',
      'beejayphil@gmail.com',
      'male',
      'bashbash',
    );
    expect(user).toMatchObject({
      isAdmin: expect.any(Boolean),
      id: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      email: expect.any(String),
      gender: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      token: expect.any(String),
    });
  });
  it('should return user details', async () => {
    const user = await loginUser('beejayphil@gmail.com', 'bashbash');
    expect(user).toMatchObject({
      isAdmin: expect.any(Boolean),
      id: expect.any(String),
      firstName: expect.any(String),
      lastName: expect.any(String),
      email: expect.any(String),
      gender: expect.any(String),
      createdAt: expect.any(Date),
      updatedAt: expect.any(Date),
      token: expect.any(String),
    });
  });
  it('should throw', async () => {
    await loginUser('bayphil@gmail.com', 'bashbash')
      .then(data => {
        console.log(data);
      })
      .catch(data => {
        expect(data.message).toMatch(
          'email does not belong to a registered user',
        );
      });
  });
  it('should create Admin and return admin details', async () => {
    const admin = await createAdmin(
      'gamaliel',
      'eweke',
      'gam360@gmail.com',
      'male',
      'iamgam',
    );
    expect(admin.isAdmin).toBeTruthy();
  });
});
