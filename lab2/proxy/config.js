const convict = require('convict');
const convict_format_with_validator = require('convict-format-with-validator');

require('dotenv').config();

convict.addFormats(convict_format_with_validator);

const config = convict({
    url: {
        doc: 'The IP address to bind.',
        format: 'url',
        default: "http://localhost:3000",
        env: 'API_URL',
    },
    port: {
        doc: 'The port to bind.',
        format: 'port',
        default: 3001,
        env: 'PROXY_PORT',
        arg: 'port'
    }
});

module.exports = config;
