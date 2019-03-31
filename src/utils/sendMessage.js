const URL = require('url');
const https = require('https');
const { DRY_RUN } = require('../config');

const sendMessage = (message, url) => {
    const reqBody = JSON.stringify(message);
    const options = URL.parse(url);
    options.method = 'POST';
    options.headers = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(reqBody),
    };

    if (DRY_RUN) return Promise.resolve({ statusCode: 200 });

    return new Promise((resolve, reject) => {
        const postReq = https.request(options, res => {
            const chunks = [];
            res.setEncoding('utf8');

            res.on('data', chunk => chunks.push(chunk));

            res.on('end', () => {
                const respBody = chunks.join('');
                resolve({
                    body: respBody,
                    statusCode: res.statusCode,
                    statusMessage: res.statusMessage,
                });
            });

            res.on('error', error => {
                reject(error);
            });

            return res;
        });

        postReq.write(reqBody);
        postReq.end();
    });
};

module.exports = sendMessage;
