import React from 'react';
import {FlowActions} from '../../actions/flow-actions';
import PropTypes from 'prop-types';
import {Content, ContentBody, ContentHeader, ContentFooter} from '../global';
import {DynamicForm} from '../dynamic';
import {Text} from '../dynamic/type';
import {SourceActions} from '../../actions/source-actions';
import {AppActions} from '../../actions/app-actions';
import {ObjectTypes} from '../../../lib/common/object-types';
import Divider from 'material-ui/Divider';
import {ContentSubHeader} from '../global/content/ContentSubHeader';
import {withStyles} from 'material-ui/styles';
import Typography from 'material-ui/Typography';
import Grid from 'material-ui/Grid';
import Button from 'material-ui/Button';
import dashify from 'dashify';
import {DescriptionHelper} from '../dynamic/helpers/DescriptionHelper';
import Async from 'async';

const styles = theme => ({
    primaryButton: theme.custom.form.button.primary,
    secondaryButton: theme.custom.form.button.secondary,
    box: theme.custom.form.box
});

class _FlowCreateView extends React.Component {
    constructor() {
        super();
        this.state = {
            isFormValid: true,
            errorMessage: undefined,
            form: {
                name: {},
                description: {}
            },
            currentDescriptionHelper: undefined
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.saveFlow = this.saveFlow.bind(this);
        this.handleOnSubmit = this.handleOnSubmit.bind(this);
        this.handleValidateInput = this.handleValidateInput.bind(this);
        this.validate = this.validate.bind(this);
        this.handleDescriptionHelperUpdate = this.handleDescriptionHelperUpdate.bind(this);
    }

    componentDidMount() {
        SourceActions.fetchByName(this.props.sourceName);
    }

    validate(cb) {
        const results = _(this.state.form)
            .map((parameterValidator) => {
                if (_.isFunction(parameterValidator.validator)) {
                    return parameterValidator.validator();
                }
                console.error('Invalid validation function');
                return false;
            });
        const isValid = results.indexOf(false) < 0;
        this.setState({ isFormValid: isValid });
        if (isValid) {
            return cb()
        }
    }

    saveFlow() {
        const { source } = this.props;
        const { form } = this.state;
        const parseForm = (parameter) => {
            const parameterValue = form[parameter.name];
            return {
                key: parameter.name,
                value: parameterValue ? parameterValue.value : null
            }
        };
        const parameters = _(source.parameters).reject({ 'type': 'file' }).map(parseForm).value();
        const filesParameters = _(source.parameters).filter({ 'type': 'file' }).map(parseForm).value();
        const saveFormData = (form, parameters, cb) => {
            FlowActions
                .completeCreateFlow({
                        template: this.props.source.name,
                        name: form.name.value,
                        description: form.description.value,
                        index: form.index.value,
                        parameters
                    }
                )
                .then(() => cb())
                .catch(cb);
        };

        const uploadFiles = (form, files, cb) => {
            if (files && files.length > 0) {
                files.map((file) => {
                    let data = new FormData();
                    data.append(file.key, file.value);
                    FlowActions
                        .postData(form.name.value, data)
                        .then(() => cb())
                        .catch(cb);
                });
            }
            else {
                cb();
            }

        };

        const handleResponse = (err) => {
            if (err) {
                this.setState({ errorMessage: err });
            }
            else {
                AppActions.changeLocation(`/${ObjectTypes.CHANNEL}`);
            }
        };

        Async.series([
            saveFormData.bind(this, form, parameters),
            uploadFiles.bind(this, form, filesParameters)
        ], handleResponse);

    }

    handleOnSubmit(e) {
        e.preventDefault();
        this.validate(this.saveFlow);
    }

    handleValidateInput(name, validator) {
        this.setState((prevState) => {
            const newValue = { ...prevState.form[name], ...{ validator } };
            const newForm = { ...prevState.form, ...{ [name]: newValue } };
            return { form: newForm };
        });
    }

    handleInputChange(name, value) {
        this.setState((prevState) => {
            const newValue = { ...prevState.form[name], ...{ value } };
            const newForm = { ...prevState.form, ...{ [name]: newValue } };
            return { form: newForm };
        });
    }

    handleDescriptionHelperUpdate(name) {
        this.setState({
            currentDescriptionHelper: name
        })
    }

    render() {
        const { source, classes } = this.props;
        if (!source) {
            return (<div>Source not found [{this.props.sourceName}]</div>)
        }
        return (
            <Content>
                <ContentHeader title={<div>+ Create Channel: <strong>{source.name}</strong>
                </div>}>{source.description}</ContentHeader>
                <Divider light/>
                <ContentSubHeader>
                    <Typography type="title" gutterBottom>Basic information</Typography>
                    {/*
                    <Typography type="body1" gutterBottom>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Facere voluptatibus accusantium magni expedita et dicta.</Typography>
*/}
                    <div className={classes.box}>

                        <Grid container>
                            <Grid item xs={7}>
                                <Text
                                    name={'name'}
                                    label={'Name'}
                                    placeholder={''}
                                    description={''}
                                    isRequired={true}
                                    handleInputChange={this.handleInputChange}
                                    handleValidateInput={this.handleValidateInput}
                                />

                            </Grid>
                            {/* <Grid item xs hidden={!parameter.description}>
                            <DescriptionHelper

                                name={parameter.name}
                                label={parameter.label}
                                description={parameter.description}
                                currentDescriptionHelper={this.props.currentDescriptionHelper}
                            />
                        </Grid>*/}

                        </Grid>
                        <Grid container>
                            <Grid item xs={7}>
                                <Text
                                    name={'description'}
                                    label={'Description'}
                                    placeholder={''}
                                    description={''}
                                    isRequired={true}
                                    handleInputChange={this.handleInputChange}
                                    handleValidateInput={this.handleValidateInput}
                                />

                            </Grid>
                            {/* <Grid item xs hidden={!parameter.description}>
                            <DescriptionHelper

                                name={parameter.name}
                                label={parameter.label}
                                description={parameter.description}
                                currentDescriptionHelper={this.props.currentDescriptionHelper}
                            />
                        </Grid>*/}

                        </Grid>
                        <Grid container>
                            <Grid item xs={7}>
                                <Text
                                    name={'index'}
                                    label={'Index'}
                                    placeholder={''}
                                    description="Elasticsearch index name"
                                    isRequired={true}
                                    handleInputChange={this.handleInputChange}
                                    handleValidateInput={this.handleValidateInput}
                                    handleDescriptionHelper={this.handleDescriptionHelperUpdate}
                                    value={dashify(source.name)}
                                />

                            </Grid>
                            <Grid item xs>
                                <DescriptionHelper

                                    name="index"
                                    label="Index"
                                    description="Elasticsearch index name"
                                    currentDescriptionHelper={this.state.currentDescriptionHelper}
                                />
                            </Grid>

                        </Grid>
                    </div>
                </ContentSubHeader>
                <Divider light/>
                <ContentBody>
                    <DynamicForm
                        handleInputChange={this.handleInputChange}
                        parameters={source.parameters}
                        groups={source.groups}
                        handleValidateInput={this.handleValidateInput}
                        handleDescriptionHelperUpdate={this.handleDescriptionHelperUpdate}
                        currentDescriptionHelper={this.state.currentDescriptionHelper}
                    />
                </ContentBody>
                <Divider light/>
                <ContentFooter>
                    <Grid
                        container
                        justify={'flex-end'}
                        spacing={24}
                    >
                        <Grid item>
                            <Button color="accent"
                                    className={classes.secondaryButton}
                                    onClick={() => AppActions.changeLocation(`/${ObjectTypes.SOURCE}`)}

                                    classes={{
                                        label: 'button-label'
                                    }}
                            >
                                <Typography type="button">Cancel</Typography>

                            </Button>
                        </Grid>

                        <Grid item>
                            <Button color="primary"
                                    className={classes.primaryButton}
                                    onClick={this.handleOnSubmit}
                                    classes={{
                                        label: 'button-label'
                                    }}
                            >
                                <Typography type="button">Finish</Typography>

                            </Button>
                        </Grid>

                    </Grid>
                </ContentFooter>
            </Content>
        );
    }
}

_FlowCreateView.propTypes = {
    source: PropTypes.object,
    sourceName: PropTypes.string
};

export const FlowCreateView = withStyles(styles)(_FlowCreateView);
