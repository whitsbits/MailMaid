import EmailReplyParser from 'erp';

export function read(text) {
	return EmailReplyParser.read;
  };
  
  export function parse_reply(text, include_signatures) {
	  return EmailReplyParser.parse_reply;
  }