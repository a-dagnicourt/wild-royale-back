const options = {
  openapi: '3.0.0',
  info: {
    version: '1.0.0',
    title: 'FTM Express API documentation',
    description:
      'How to use and test CRUD routes for Users, Companies, Roles, Notifications and Products datas. You must get a token using the Auth POST route and then use it with the Authorize button.',
    license: {
      name: 'MIT',
    },
  },
  basePath: '/',
  schemes: ['http', 'https'],
  security: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      in: 'header',
      bearerFormat: 'JWT',
    },
  },

  filesPattern: './**/*.js', // Glob pattern to find your jsdoc files (it supports arrays too ['./**/*.controller.js', './**/*.route.js'])
  swaggerUIPath: '/api-docs', // SwaggerUI will be render in this url. Default: '/api-docs'
  baseDir: __dirname,
  exposeSwaggerUI: true, // Expose OpenAPI UI. Default true
  exposeApiDocs: false, // Expose Open API JSON Docs documentation in `apiDocsPath` path. Default false.
  apiDocsPath: '/v3/api-docs', // Open API JSON Docs endpoint. Default value '/v3/api-docs'.
};

module.exports = options;
