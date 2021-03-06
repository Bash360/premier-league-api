import app from '../src/app';
import request from 'supertest';
import { closeInstance } from '../src/app';
import { connectToDB, disconnectFromDB } from '../test-setup/test-connection';
describe('test for user route', () => {
  beforeAll(async () => {
    await connectToDB();
  });
  afterAll(async () => {
    await disconnectFromDB();
    closeInstance();
  });
  it('should return a status code of 200 and user details', async () => {
    const { body, status } = await request(app)
      .post('/api/v1/user/signup')
      .send({
        firstName: 'chidera',
        lastName: 'stephen',
        gender: 'female',
        email: 'stephenchidera@gmail.com',
        password: 'bashbash',
      });
    expect(status).toBe(200);
    expect(body.data).toHaveProperty('token');
  });
  it('should log in user and return user details', async () => {
    const { body, status, header } = await request(app)
      .post('/api/v1/user/login')
      .send({ email: 'stephenchidera@gmail.com', password: 'bashbash' });
    expect(status).toBe(200);

    expect(body.data).toHaveProperty('firstName');
    expect(header['authorization']).not.toBeNull();
  });
});
