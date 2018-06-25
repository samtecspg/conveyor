import { EuiGlobalToastList } from '@elastic/eui/lib/components/toast/global_toast_list';
import PropTypes from 'prop-types';
import React from 'react';

const GlobalToast = ({ messages, onRemoveMessage }) => {
  return (
    <EuiGlobalToastList
      toasts={messages}
      dismissToast={onRemoveMessage}
      toastLifeTimeMs={6000}
    />
  );
};

GlobalToast.propTypes = {
  messages: PropTypes.array,
  onRemoveMessage: PropTypes.func.isRequired,
};

export default GlobalToast;


