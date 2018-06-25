import React from 'react';
import { MessageTypes } from '../../../server/constants/';
import Info from './Info';
import ResponseError from './ResponseError';

const defaultMessage = {
  title: '',
  color: 'primary',
  iconType: null,
  text: null
};

const generate = ({ type = MessageTypes.INFO, message }) => {
  const id = _.uniqueId('message-');
  switch (type) {
    case MessageTypes.RESPONSE_ERROR:
      return {
        ...defaultMessage,
        id,
        iconType: 'alert',
        color: 'danger',
        title: 'Oops, there was an error',
        text: <ResponseError message={message} />
      };
    default:
      return {
        ...defaultMessage,
        id,
        text: <Info message={message} />
      };
  }
};
export default generate;