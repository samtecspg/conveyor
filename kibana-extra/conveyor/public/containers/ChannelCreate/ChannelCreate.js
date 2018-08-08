import { EuiButton } from '@elastic/eui/lib/components/button/button';
import { EuiForm } from '@elastic/eui/lib/components/form/form';
import { EuiHorizontalRule } from '@elastic/eui/lib/components/horizontal_rule/horizontal_rule';
import { EuiPanel } from '@elastic/eui/lib/components/panel/panel';
import { EuiSpacer } from '@elastic/eui/lib/components/spacer/spacer';
import { EuiTitle } from '@elastic/eui/lib/components/title/title';
import _ from 'lodash';
import React, {
  Component,
  Fragment
} from 'react';
import { connect, } from 'react-redux';
import { push } from 'react-router-redux';
import { createStructuredSelector } from 'reselect';
import { Status } from '../../../server/constants';
import {
  clearSelectedSource,
  createChannel,
  loadSourceByName
} from '../../actions/global';
import { FormGroup } from '../../components/FormGroup';
import FormParameter from '../../components/FormParameter/FormParameter';
import {
  ContentBody,
  ContentHeader
} from '../../components/Layout';
import ProgressIndicator from '../../components/ProgressIndicator';
import { makeSelectSource } from '../../selectors/global';

class ChannelCreate extends Component {

  state = {
    defaultParameters: [
      {
        'name': 'name',
        'description': '',
        'type': 'text',
        'label': 'Name',
        'placeholder': '',
        'required': true,
      }, {
        'name': 'description',
        'description': '',
        'type': 'text',
        'label': 'Description',
        'placeholder': '',
        'required': true,
      }, {
        'name': 'index',
        'description': 'Elasticsearch index name',
        'type': 'text',
        'label': 'Index',
        'placeholder': '',
        'required': true,
      },
    ],
    processSave: {
      title: 'Save',
      completed: false,
      enabled: true,
    },
    processUpload: {
      title: 'Upload',
      completed: false,
      enabled: false,
    },
    processIndicatorVisible: false,
    processIndicatorPercent: null,
    groupsAndParameters: null,
    form: {},
    group: {}
  };

  componentDidMount() {
    const { loadSourceByName, match } = this.props;
    return loadSourceByName(match.params.name);
  }

  componentWillReceiveProps(nextProps) {
    const { source } = nextProps;
    if (source) {
      this.setDefaultValues({ source });

    }
  }

  componentWillUnmount() {
    const { clearSelectedSource } = this.props;
    return clearSelectedSource();
  }

  updateFormState = ({ name, value, errors = [] }) => {
    const finalValue = _.isNaN(value) ? undefined : value;
    this.setState((prevState) => {
      const newValue = { ...prevState.form[name], ...{ value: finalValue, errors } };
      const newForm = { ...prevState.form, ...{ [name]: newValue } };
      return { form: newForm };
    });
  };

  updateGroupState = ({ name, hasAdvanceParameters = false, isAdvanceVisible = false }) => {
    this.setState((prevState) => {
      const newValue = { ...prevState.group[name], ...{ hasAdvanceParameters, isAdvanceVisible } };
      const newGroup = { ...prevState.group, ...{ [name]: newValue } };
      return { group: newGroup };
    });
  };

  setGroupsParameters = ({ groups, parameters, }) => {
    const groupedParameters = _.groupBy(parameters, 'group');
    const mergedGroup = {};
    _.forEach(groups, (group) => {
      _.set(mergedGroup, group.key, {
        '_key': group.key,
        '_title': group.title,
        '_description': group.description,
        '_parameters': groupedParameters[group.key]
      });
    });

    const normalizedSubGroups = {};
    _.forEach(mergedGroup, (group) => {
      const subGroups = [];
      _.forIn(group, (subGroup, key) => {
        if (key.indexOf('_') !== 0) {
          subGroups.push(subGroup);
        }
        _.set(normalizedSubGroups, group._key, {
          '_key': group._key,
          '_title': group._title,
          '_description': group._description,
          '_parameters': groupedParameters[group._key],
          '_groups': subGroups
        });
      });

    });
    return normalizedSubGroups;
  };
  setDefaultGroupValues = (group) => {
    const hasAdvanceParameters = _.findIndex(group._parameters, { isAdvance: true }) >= 0;
    this.updateGroupState({ name: group._key, hasAdvanceParameters });
    if (group._groups) {
      _.forEach(group._groups, this.setDefaultGroupValues);
    }
  };

  setDefaultValues = ({ source }) => {
    const groups = this.setGroupsParameters({
      groups: source.groups,
      parameters: source.parameters
    });
    this.setState({ groupsAndParameters: groups });
    source.parameters.concat(this.state.defaultParameters).map((parameter) => {
      const { name, value, type } = parameter;
      let parsedValue = undefined;
      if (value) {
        parsedValue = value;
        if (type === 'boolean') parsedValue = parsedValue === 'true';
        if (type === 'list-single' || type === 'list-multiple') {
          parsedValue = parameter.options.filter(option => _.includes(value, option.value));
        }
      }

      if (name === 'index') {
        parsedValue = source ? _.kebabCase(source.name) : parsedValue;
      }
      return this.updateFormState({ name, value: parsedValue });
    });
    _.forEach(groups, this.setDefaultGroupValues);
  };

  handleOnInputChange = ({ name, value }) => this.updateFormState({ name, value });

  handleAdvanceToggle = ({ name, isAdvanceVisible }) => {
    this.updateGroupState({ name, isAdvanceVisible });
  };

  renderGroups({ group }) {
    return (
      <Fragment key={group._key}>
        <FormGroup
          group={group}
          onInputChange={this.handleOnInputChange}
          formState={this.state.form}
          onAdvanceToggle={this.handleAdvanceToggle}
          isAdvanceVisible={this.state.group[group._key].isAdvanceVisible}
        />
        <EuiSpacer size="m" />
      </Fragment>
    );
  }

  renderDefaultParameters = ({ parameter }) => {
    return (
      <FormParameter
        key={parameter.name}
        parameter={parameter}
        onInputChange={this.handleOnInputChange}
        formState={this.state.form}
      />
    );
  };

  onValidate = () => {
    const { form } = this.state;
    const { source } = this.props;
    let isValid = true;
    const allParameters = source.parameters.concat(this.state.defaultParameters);
    _.forEach(form, ({ value }, name) => {
      const parameter = allParameters.find(parameter => parameter.name === name);
      const groupState = this.state.group[parameter.group];

      if (parameter.isAdvance && groupState && !groupState.isAdvanceVisible) {
        return this.updateFormState({ name, value: null });
      }
      const { type, required, validation } = parameter;
      const errors = [];
      if (required) {
        if (_.includes(['text', 'number', 'code', 'file', 'password'], type) && !value) {
          errors.push(`Parameter [${name}] is required`);
        }
        if (_.includes(['list-single', 'list-multiple'], type) && value && value.length === 0) {
          errors.push(`At least one option is required for parameter [${name}]`);
        }
      }
      if (validation && validation.rule) {
        const regexp = new RegExp(validation.rule);
        const match = regexp.exec(value);
        if (!match) {
          errors.push(validation.message);
        }
      }
      if (errors.length > 0) isValid = false;
      this.updateFormState({ name, value, errors });
    });
    return isValid;
  };

  updateProgress = ({ name, percentage, status }) => {
    let completed = false;
    if (status === Status.COMPLETE || status === Status.FAIL) {
      completed = true;
    }
    this.setState((prevState) => {
      const newValue = { ...prevState[name], ...{ completed, status } };
      return {
        [name]: newValue,
        processIndicatorPercent: percentage,
      };
    });
  };

  handleSaveProgress = ({ percentCompleted, status }) => {
    this.updateProgress({ name: 'processSave', percentage: percentCompleted, status });
  };

  handleFileUploadProgress = ({ percentCompleted, status }) => {
    this.updateProgress({ name: 'processUpload', percentage: percentCompleted, status });
  };

  handleProgressIndicatorClose = (event) => {
    event.preventDefault();
    this.props.push({ url: '/channel' });
  };

  onSubmit = (event) => {
    event.preventDefault();
    const isValid = this.onValidate();
    if (!isValid) return;
    this.setState({
      processIndicatorVisible: true,
      processIndicatorPercent: null,
    });
    const { createChannel, source } = this.props;
    const { form } = this.state;
    const parseForm = (parameter) => {
      const parameterValue = form[parameter.name];
      const key = parameter.name;
      let value = null;
      if (parameterValue) {
        if (_.isArray(parameterValue.value)) {
          value = parameterValue.value.map((item) => item.value);
        } else {
          value = parameterValue.value;
        }
      }
      return { key, value };
    };

    const parameters = _(source.parameters).reject({ 'type': 'file' }).map(parseForm).value();
    const files = _(source.parameters).filter({ 'type': 'file' }).map(parseForm).value();
    if (files && files.length > 0 && files[0].value) {
      this.setState({
        processUpload: { ...this.state.processUpload, ...{ enabled: true } }
      });
    } else {
      this.setState({
        processUpload: { ...this.state.processUpload, ...{ enabled: false, completed: true } }
      });
    }
    createChannel({
      body: {
        template: source.name,
        name: form.name && form.name.value.trim(),
        description: form.description && form.description.value,
        index: form.index && form.index.value,
        parameters,
      },
      files,
      saveUploadProgress: this.handleSaveProgress,
      fileUploadProgress: this.handleFileUploadProgress
    });
  };

  render() {
    const { source } = this.props;
    if (!source) {
      return null;
    }
    const {
      processSave,
      processUpload,
      processIndicatorVisible,
      processIndicatorPercent,
      groupsAndParameters,
      defaultParameters
    } = this.state;
    const spacer = 'm';
    return (
      <Fragment>
        <ContentHeader
          title={`+ Create Channel: ${source.name}`}
          subTitle={source.description}
        />
        <ProgressIndicator
          visible={processIndicatorVisible}
          percentCompleted={processIndicatorPercent}
          processes={[processSave, processUpload]}
          onClose={this.handleProgressIndicatorClose}
        />
        <EuiHorizontalRule />
        <ContentBody>
          <form autoComplete="on">
            <EuiForm>
              <EuiTitle size="s">
                <h2>Basic information</h2>
              </EuiTitle>

              <EuiSpacer size={spacer} />
              <EuiPanel paddingSize="m">
                {defaultParameters.map((parameter) => this.renderDefaultParameters({ parameter }))}
              </EuiPanel>
              <EuiSpacer size={spacer} />
              {_.map(groupsAndParameters, group => this.renderGroups({ group }))}
              <EuiSpacer size={spacer} />
              <EuiButton
                type="submit"
                fill
                onClick={this.onSubmit}
              >
                Save form
              </EuiButton>
            </EuiForm>
          </form>
        </ContentBody>
      </Fragment>
    );
  }
}

ChannelCreate.propTypes = {};
ChannelCreate.defaultProps = {};

export function mapDispatchToProps(dispatch) {
  return {
    loadSourceByName: name => dispatch(loadSourceByName(name)),
    createChannel: ({ ...args }) => dispatch(createChannel({ ...args })),
    uploadToChannel: ({ ...args }) => dispatch(createChannel(...args)),
    clearSelectedSource: () => dispatch(clearSelectedSource()),
    push: ({ url }) => dispatch(push(url)),

  };
}

const mapStateToProps = createStructuredSelector({
  source: makeSelectSource(),
});

export default connect(mapStateToProps, mapDispatchToProps)(ChannelCreate);