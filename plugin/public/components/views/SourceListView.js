import React from 'react';
import PropTypes from 'prop-types';
import {SourceList} from '../list/SourceList';
import {SourceActions} from '../../actions/source-actions';
import {AppActions} from '../../actions/app-actions';
import {Content, ContentBody, ContentHeader, ContentSubHeader} from '../global';
import {ObjectTypes} from '../../../lib/common/object-types';
import Divider from 'material-ui/Divider';
import {SearchInput} from '../global/form/SearchInput';
import {withStyles} from 'material-ui/styles';
import Grid from 'material-ui/Grid';

const styles = theme => {
    return {
        root: theme.custom.layout.main
    }
};

export class _SourceListView extends React.Component {

    constructor() {
        super();
        this.onSelect = this.onSelect.bind(this);

    }

    onSelect(source) {
        AppActions.changeLocation(`/${ObjectTypes.CHANNEL}/${source.name}/create`);
    }

    componentDidMount() {
        SourceActions.fetchAll();
        AppActions.setTab(ObjectTypes.SOURCE);
    }

    render() {

        const { sources } = this.props;
        return (
            <Content>
                <ContentHeader title="+ Create">We create a new Conveyor channel by selecting a data source and providing information needed to create the channel.</ContentHeader>
                <Divider light/>
                {/*<ContentSubHeader>
                    <Grid container>
                        <Grid item xs={4}>
                            <SearchInput onSearch={() => {
                            }}/>
                        </Grid>
                    </Grid>
                </ContentSubHeader>
                <Divider light/>*/}
                <ContentBody>
                    {
                        sources.length > 0
                            ? <SourceList
                                sources={sources}
                                onClick={this.onSelect}
                            />
                            : <div>Nothing found</div>
                    }
                </ContentBody>
            </Content>
        );
    }
}

_SourceListView.propTypes = {
    sources: PropTypes.array
};

export const SourceListView = withStyles(styles)(_SourceListView);
