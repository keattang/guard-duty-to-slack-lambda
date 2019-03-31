const logEvent = require('./utils/logEvent');
const constructMessage = require('./utils/constructMessage');
const sendMessage = require('./utils/sendMessage');
const { SLACK_WEBHOOK_URL } = require('./config');

exports.handler = async (event, context) => {
    logEvent(event);

    const slackMessage = constructMessage(event, context);
    const response = await sendMessage(slackMessage, SLACK_WEBHOOK_URL);

    if (response.statusCode < 400) {
        console.info('message posted successfully');
        context.succeed();
    } else if (response.statusCode < 500) {
        console.error(`
            error posting message to slack API: ${response.statusCode} -  ${
            response.statusMessage
        }
        `);
        // Don't retry because the error is due to a problem with the request
        context.succeed();
    } else {
        // Let Lambda retry
        context.fail(
            `server error when processing message: ${response.statusCode} -  ${
                response.statusMessage
            }`
        );
    }
};
