const crypto = require('crypto');

console.log('🔐 Generating secure keys for Strapi production deployment...\n');

const generateKey = () => crypto.randomBytes(64).toString('base64');

console.log('Copy these values to your Render environment variables:\n');
console.log('APP_KEYS=' + Array.from({length: 4}, generateKey).join(','));
console.log('API_TOKEN_SALT=' + generateKey());
console.log('ADMIN_JWT_SECRET=' + generateKey());
console.log('TRANSFER_TOKEN_SALT=' + generateKey());
console.log('JWT_SECRET=' + generateKey());
console.log('STRAPI_ADMIN_CLIENT_PREVIEW_SECRET=' + generateKey());

console.log('\n✅ Keys generated successfully!');
console.log('⚠️  Keep these keys secure and never commit them to your repository.');