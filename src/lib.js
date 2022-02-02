const replyParser = require ('node-email-reply-parser');

function removeReply () {
    return replyParser();
};

export { removeReply };