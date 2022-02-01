import * as replyParser from 'node-email-reply-parser';

function removeReply () {
    return replyParser()
};

export { removeReply };