import http from 'http';
import server from '../main';
import { User } from '../models/UserModel';

let createdUser: User;

beforeAll((done) => {
  server.start(() => {
    done();
  });
});

afterAll(() => {
  return new Promise<void>((resolve) => {
    server.stop(resolve);
  });
});

function request<T = unknown>(
  method: string,
  path: string,
  body?: object,
): Promise<{ status: number; body: T }> {
  return new Promise((resolve, reject) => {
    const data = body ? JSON.stringify(body) : null;

    const options: http.RequestOptions = {
      method,
      hostname: 'localhost',
      port: 3000,
      path,
      headers: {
        'Content-Type': 'application/json',
        ...(data && { 'Content-Length': Buffer.byteLength(data) }),
      },
    };

    const req = http.request(options, (res) => {
      let rawData = '';
      res.on('data', (chunk) => (rawData += chunk));
      res.on('end', () => {
        try {
          const parsed = rawData ? JSON.parse(rawData) : {};
          resolve({ status: res.statusCode || 0, body: parsed });
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

describe('User API', () => {
  test('GET /api/users should return empty array initially', async () => {
    const res = await request<{ users: User[] }>('GET', '/api/users');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.users)).toBe(true);
    expect(res.body.users.length).toBe(0);
  });

  test('POST /api/users should create a new user', async () => {
    const userData = {
      username: 'Alice',
      age: 25,
      hobbies: ['music', 'sports'],
    };
    const res = await request<{ user: User }>('POST', '/api/users', userData);
    expect(res.status).toBe(201);
    expect(res.body?.user).toBeDefined();
    createdUser = res.body.user;
    expect(createdUser).toMatchObject(userData);
    expect(typeof createdUser.id).toBe('string');
  });

  test('GET /api/users/{id} should return created user', async () => {
    const res = await request<{ user: User }>(
      'GET',
      `/api/users/${createdUser.id}`,
    );
    expect(res.status).toBe(200);
    expect(res.body?.user).toBeDefined();
    expect(res.body.user).toEqual(createdUser);
  });

  test('PUT /api/users/{id} should update the user', async () => {
    const updated = { username: 'Alice Updated', age: 26 };
    const res = await request<{ user: User }>(
      'PUT',
      `/api/users/${createdUser.id}`,
      updated,
    );
    expect(res.status).toBe(200);
    expect(res.body.user).toMatchObject({
      username: 'Alice Updated',
      age: 26,
    });
    expect(res.body.user.username).toBe('Alice Updated');
    expect(res.body.user.age).toBe(26);
    expect(res.body.user.id).toBe(createdUser.id);
  });

  test('DELETE /api/users/{id} should delete the user', async () => {
    const res = await request('DELETE', `/api/users/${createdUser.id}`);
    expect(res.status).toBe(204);
  });

  test('GET /api/users/{id} should return 404 after deletion', async () => {
    const res = await request<{ error?: string }>(
      'GET',
      `/api/users/${createdUser.id}`,
    );
    expect(res.status).toBe(404);
    expect(res.body?.error).toBeDefined();
  });
});
