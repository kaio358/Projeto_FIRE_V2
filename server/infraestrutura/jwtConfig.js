
const { TextEncoder } = require('util');

const jwtSecretString = process.env.JWT_SECRET;
if (!jwtSecretString) {
    console.error("FATAL ERROR: JWT_SECRET não está definido nas variáveis de ambiente.");
    process.exit(1);
}

const JWT_SECRET_KEY = new TextEncoder().encode(jwtSecretString);
const JWT_ALGORITHM = 'HS256';

module.exports = {
    JWT_SECRET_KEY,
    JWT_ALGORITHM,
};