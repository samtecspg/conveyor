import { EuiButton } from '@elastic/eui/lib/components/button/button';
import { EuiButtonEmpty } from '@elastic/eui/lib/components/button/button_empty/button_empty';
import { EuiFieldText } from '@elastic/eui/lib/components/form/field_text/field_text';
import { EuiForm } from '@elastic/eui/lib/components/form/form';
import { EuiFormRow } from '@elastic/eui/lib/components/form/form_row/form_row';
import { EuiIcon } from '@elastic/eui/lib/components/icon/icon';
import { EuiModal } from '@elastic/eui/lib/components/modal/modal';
import { EuiModalBody } from '@elastic/eui/lib/components/modal/modal_body';
import { EuiModalFooter } from '@elastic/eui/lib/components/modal/modal_footer';
import { EuiModalHeader } from '@elastic/eui/lib/components/modal/modal_header';
import { EuiModalHeaderTitle } from '@elastic/eui/lib/components/modal/modal_header_title';
import { EuiOverlayMask } from '@elastic/eui/lib/components/overlay_mask/overlay_mask';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import {
  loadAllSettings,
  updateSettings
} from '../../actions/global';
import * as selectors from './../../selectors/global';

//import PropTypes from 'prop-types';

class SettingsModal extends Component {
  state = {
    isModalVisible: false,
    isInvalid: false,
    apiURL: '',
    error: null,
  };

  componentDidMount() {
    const { loadAllSettings } = this.props;
    loadAllSettings();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.settings && nextProps.settings.length > 0) {
      const apiURL = nextProps.settings.find((setting => setting.name === 'api.url'));
      this.setState({ apiURL: apiURL && apiURL.value });
    }

    if (nextProps.updateSettingsComplete) {
      if (nextProps.updateSettingsError) {
        this.setState({ isInvalid: true, error: nextProps.updateSettingsError });
      } else {
        this.setState({ isInvalid: false, isModalVisible: false });
      }
    }
  }

  openModal = (event) => {
    event.preventDefault();
    this.setState({
      isModalVisible: true,
      isInvalid: false,
      error: null,
    });
  };
  closeModal = (event) => {
    event.preventDefault();
    this.setState({ isModalVisible: false });
  };

  onApiURLChange = (event) => {
    event.preventDefault();
    const value = event.target.value;
    this.setState({ apiURL: value });
  };

  onUpdateSettings = () => {
    this.props.updateSettings({
      name: 'api.url',
      value: this.state.apiURL
    });
  };

  render() {
    let modal;
    const form = (
      <EuiForm>
        <EuiFormRow
          label="API URL"
          isInvalid={this.state.isInvalid}
          error={this.state.error}
        >
          <EuiFieldText
            value={this.state.apiURL}
            onChange={this.onApiURLChange}
          />
        </EuiFormRow>
      </EuiForm>
    );
    if (this.state.isModalVisible) {
      modal = (
        <EuiOverlayMask>
          <EuiModal
            onClose={this.closeModal}
            style={{ width: '800px' }}
          >
            <EuiModalHeader>
              <EuiModalHeaderTitle>
                Settings
              </EuiModalHeaderTitle>
            </EuiModalHeader>

            <EuiModalBody>
              {form}
            </EuiModalBody>

            <EuiModalFooter>
              <EuiButtonEmpty
                onClick={this.closeModal}
              >Cancel
              </EuiButtonEmpty>

              <EuiButton
                onClick={this.onUpdateSettings}
                fill
              >Save
              </EuiButton>
            </EuiModalFooter>
          </EuiModal>
        </EuiOverlayMask>
      );
    }
    return (
      <div className={'pull-right '}>
        <EuiIcon
          className={'cursor-pointer'}
          onClick={this.openModal}
          type={'gear'}
        />
        {modal}
      </div>
    );
  }
}

export function mapDispatchToProps(dispatch) {
  return {
    loadAllSettings: () => dispatch(loadAllSettings()),
    updateSettings: ({ name, value }) => dispatch(updateSettings({ name, value }))
  };
}

const mapStateToProps = createStructuredSelector({
  settings: selectors.makeSelectSettings(),
  updateSettingsComplete: selectors.makeSelectUpdateSettingsComplete(),
  updateSettingsError: selectors.makeSelectUpdateSettingsError(),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsModal);