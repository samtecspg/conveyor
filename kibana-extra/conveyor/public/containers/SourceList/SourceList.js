import { EuiFlexGrid } from '@elastic/eui/lib/components/flex/flex_grid';
import { EuiFlexGroup } from '@elastic/eui/lib/components/flex/flex_group';
import { EuiFlexItem } from '@elastic/eui/lib/components/flex/flex_item';
import { EuiPagination } from '@elastic/eui/lib/components/pagination/pagination';
import { EuiText } from '@elastic/eui/lib/components/text/text';
import React, {
  Component,
  Fragment
} from 'react';
import { connect, } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { loadAllSources } from '../../actions/global';
import EmptyPage from '../../components/EmptyPage/EmptyPage';
import {
  ContentBody,
  ContentHeader
} from '../../components/Layout';
import SourceCard from '../../components/SourceCard/SourceCard';
import {
  makeSelectLoadingSourcesComplete,
  makeSelectSources
} from '../../selectors/global';

class SourceList extends Component {

  state = {
    page: 0,
    size: 6
  };

  componentDidMount() {
    const { page, size } = this.state;
    this.props.loadAllSources({ page, size });
  }

  goToPage = (page) => {
    const { sources } = this.props;
    const { size } = this.state;
    page = page < Math.ceil(sources.total / size) ? page : 0;
    this.setState({ page });
    this.props.loadAllSources({ page, size });
  };

  render() {
    const { sources, loadingComplete } = this.props;
    const result = sources ? sources.results : [];
    const total = sources ? sources.total : 0;

    const { page, size } = this.state;
    if (loadingComplete && sources.total === 0) {
      return (
        <EmptyPage
          title={<div>No sources found</div>}
          body={
            <Fragment>
              <p>There are no sources available.</p>
              <p>This could be due to an error in the API or you need to run the Channel Sources script.</p>
            </Fragment>
          }
        />
      );
    }
    return (
      <Fragment>
        <ContentHeader
          title={'Create a new Channel'}
          subTitle={'Choose a data source from below to create a new channel.'}
        />
        <ContentBody>
          {loadingComplete ?
            <Fragment>
              <EuiFlexGrid columns={3}>
                {result.map((source) => <SourceCard key={source.id} source={source} />)}
              </EuiFlexGrid>
              <EuiFlexGroup justifyContent="spaceBetween" alignItems="baseline">
                <EuiFlexItem grow={false}>
                  <EuiText>Total: {total}</EuiText>
                </EuiFlexItem>
                <EuiFlexItem grow={false}>
                  <EuiPagination
                    pageCount={total / size}
                    activePage={page}
                    onPageClick={this.goToPage}
                  />
                </EuiFlexItem>
              </EuiFlexGroup>
            </Fragment>
            :
            null
          }
        </ContentBody>
      </Fragment>
    );
  }
}

SourceList.propTypes = {};
SourceList.defaultProps = {};

export function mapDispatchToProps(dispatch) {
  return {
    loadAllSources: ({ page, size }) => {
      dispatch(loadAllSources({ page, size }));
    }
  };
}

const mapStateToProps = createStructuredSelector({
  sources: makeSelectSources(),
  loadingComplete: makeSelectLoadingSourcesComplete(),
});

export default connect(mapStateToProps, mapDispatchToProps)(SourceList);
