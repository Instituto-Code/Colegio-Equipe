import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Colégio Equipe',
      version: '1.0.0',
      description: 'Documentação da API de gerenciamento escolar',
    },
    // Correção: Cada servidor é um objeto separado com sua própria propriedade 'url'
    servers: [
      {
        url: 'http://localhost:8080',
        description: 'Ambiente de Desenvolvimento (Local)',
      },
      {
        url: 'https://colegio-equipe.onrender.com',
        description: 'Servidor de Produção (Render)',
      },
    ],
  },
  apis: ["./src/modules/**/*.docs.ts"], 
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};