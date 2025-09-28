export const environment = {
  production: true,
  strapi: {
    url: process.env['STRAPI_URL'] || 'http://localhost:1337',
    apiToken: process.env['STRAPI_API_TOKEN'] || '' // Use environment variable for production
  }
};