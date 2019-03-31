const isTrue = require('./utils/isTrue');

module.exports = {
    SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL,
    DRY_RUN: isTrue(process.env.DRY_RUN),
};
