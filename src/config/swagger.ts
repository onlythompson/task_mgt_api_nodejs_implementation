import swaggerJsdoc from 'swagger-jsdoc';
import { APP_CONFIG } from './app';
import { SwaggerUiOptions } from 'swagger-ui-express';
// Swagger configuration
const options: swaggerJsdoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Task Management API',
        version: '1.0.0',
        description: 'API for Managing Tasks',
      },
      servers: [
        {
          url: `http://localhost:${APP_CONFIG.port}`,
          description: 'Development server',
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
      },
    },
    apis: ['./src/interfaces/http/routes/*.ts'], // path to the API docs
  };
  
  const swaggerSpec = swaggerJsdoc(options);

  export const swaggerUiOptions: SwaggerUiOptions = {
    // customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: "SwoleMate API Documentation",
    customfavIcon: "/public/favicon.ico",
    swaggerOptions: {
      defaultModelsExpandDepth: -1, // Hide schemas section by default
      docExpansion: 'none', // Collapse all endpoints by default
    },
    customCssUrl: 'https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css',
  };

  export default swaggerSpec;