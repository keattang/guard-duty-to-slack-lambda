const logEvent = event => {
    const { id, title } = event.detail;
    console.log(`Received event ${id}: ${title}`);
};

module.exports = logEvent;
