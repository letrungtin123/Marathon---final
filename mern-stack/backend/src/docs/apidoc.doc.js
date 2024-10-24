const apiDocumention = {
  openapi: '3.0.0',
  info: {
    title: 'API Documentation for MySite',
    version: '1.0.0',
    description: 'API Documentation for the API',
    contact: {
      name: 'API Support',
      email: 'dangtienhung.dev@gmail.com',
    },
    license: {
      name: 'MIT',
      url: 'https://opensource.org/licenses/MIT',
    },
  },

  servers: [
    {
      url: 'http://localhost:8080/',
      description: 'Local Server',
    },
    {
      url: 'https://api.mysite.com',
      description: 'Production Server',
    },
  ],

  tags: [
    {
      name: 'Users',
    },
    {
      name: 'Products',
    },
  ],

  paths: {
    '/change-password': {
      patch: {
        tags: ['Users'],
        summary: 'Change password of user',
        description: 'Change password of user',
        security: [
          {
            BearerAuth: [],
          },
        ],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  oldPassword: {
                    type: 'string',
                    required: true,
                    example: 'oldPassword123',
                  },
                  newPassword: {
                    type: 'string',
                    required: true,
                    example: 'newPassword123',
                  },
                  confirmPassword: {
                    type: 'string',
                    required: true,
                    example: 'newPassword123',
                  },
                },
              },
            },
          },
        },
        responses: {
          200: {
            description: 'Change password successfully',
          },
          400: {
            description: 'Bad request',
          },
          401: {
            description: 'Unauthorized',
          },
          500: {
            description: 'Internal server error',
          },
        },
      },
    },
  },
};

export default apiDocumention;
