const constructMessage = event => {
    const subject = 'Security Alert';
    const {
        id,
        region,
        accountId,
        type,
        severity,
        title,
        description,
        createdAt,
    } = event.detail;
    const timestamp = new Date(createdAt).getTime() / 1000;

    let color = '#1166bb'; // blue
    if (severity >= 7 && severity <= 8.9) {
        color = 'danger';
    } else if (severity >= 4 && severity <= 6.9) {
        color = 'warning';
    }

    const slackMessage = {
        text: `*${subject}*`,
        attachments: [
            {
                color,
                fields: [
                    { title: 'Title', value: title, short: false },
                    { title: 'Description', value: description, short: false },
                    { title: 'Finding Type', value: type, short: true },
                    { title: 'Severity', value: severity, short: true },
                    { title: 'Region', value: region, short: true },
                    { title: 'Account', value: accountId, short: true },
                    {
                        title: 'Link to Finding',
                        value: `https://console.aws.amazon.com/guardduty/home?region=${region}#/findings?macros=current&fId=${id}`,
                        short: false,
                    },
                ],
                ts: timestamp,
            },
        ],
    };
    return slackMessage;
};

module.exports = constructMessage;
