import { Application } from 'express';
import swaggerUI from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'Express API for JSONPlaceholder',
    version: '1.0.0',
  },
};

const options = {
  swaggerDefinition,
  // Paths to files containing OpenAPI definitions
  apis: ['src/api/v1/**/*.controller.ts'],
};

const swaggerSpec = swaggerJSDoc(options);

export const initSwagger = async (app: Application): Promise<any> => {
  app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec));
};
