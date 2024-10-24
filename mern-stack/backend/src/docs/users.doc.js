const usersResponse = {
  _id: {
    type: 'string',
    description: 'User ID',
    example: '5f4e3d7b4f3c4a2e1b3d4f5e',
  },
  email: {
    type: 'string',
    description: 'User email',
    example: 'demo@gmail.com',
  },
  password: {
    type: 'string',
    description: 'User password',
    example: '123456',
  },
  phone: {
    type: 'string',
    description: 'User phone number',
    example: '0123456789',
  },
  address: {
    type: 'string',
    description: 'User address',
    example: '123 Street, City, Country',
  },
  fullname: {
    type: 'string',
    description: 'User full name',
    example: 'John Doe',
  },
  role: {
    type: 'string',
    description: 'User role',
    example: 'admin',
  },
  status: {
    type: 'string',
    description: 'User status',
    example: 'active',
  },
  avatar: {
    type: 'string',
    description: 'User avatar',
    example: 'https://example.com/avatar.jpg',
  },
  createdAt: {
    type: 'string',
    description: 'User created date',
    example: '2020-09-01T00:00:00.000Z',
  },
  updatedAt: {
    type: 'string',
    description: 'User updated date',
    example: '2020-09-01T00:00:00.000Z',
  },
};

const security = [
  {
    description: 'Bearer Token for authentication',
    bearerFormat: 'JWT',
    type: 'http',
    scheme: 'bearer',
    brearerAuth: [],
  },
];
