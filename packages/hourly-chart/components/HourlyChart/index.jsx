import React from 'react';
import PropTypes from 'prop-types';
import { Text } from '@bufferapp/components';

import {
  geyser,
} from '@bufferapp/components/style/color';

import {
  ChartStateLoading as Loading,
} from '@bufferapp/analyze-shared-components';

import PostCountByHour from '../PostCountByHour';
import HourlyEngagementChart from '../HourlyEngagementChart';
import ChartHeader from '../ChartHeader';
import Legend from '../Legend';

const title = {
  margin: '2rem 0 1rem',
};

const Title = () =>
  <h2 style={title}>
    <Text>Engagements by hour of the day</Text>
  </h2>
;

const gridContainer = {
  minHeight: '12rem',
  position: 'relative',
  margin: '1rem 0 1.5rem',
  border: `1px solid ${geyser}`,
};

class ChartContent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ref: null,
    };
  }
  render() {
    return (
      <div>
        <ChartHeader {...this.props} />
        <HourlyEngagementChart
          posts={this.props.postsCount}
          metric={this.props.selectedMetric}
          secondaryMetric={this.props.secondaryMetric}
          timezone={this.props.timezone}
          chartRef={(node) => {
            this._chart = node;
            if (!this.state.ref) {
              this.setState({
                ref: true,
              });
            }
          }}
        />
        <PostCountByHour
          posts={this.props.postsCount}
          hourlyChart={this._chart}
          timezone={this.props.timezone}
        />
        <Legend metric={this.props.selectedMetric} secondaryMetric={this.props.secondaryMetric} />
      </div>
    );
  }
}

ChartContent.defaultProps = {
  secondaryMetric: null,
  postsCount: [],
  timezone: 'America/Los_Angeles',
};

ChartContent.propTypes = {
  selectedMetric: PropTypes.shape({
    label: PropTypes.string,
    hourlyMetrics: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
  secondaryMetric: PropTypes.shape({
    label: PropTypes.string,
    hourlyMetrics: PropTypes.arrayOf(PropTypes.number),
  }),
  postsCount: PropTypes.arrayOf(PropTypes.number),
  timezone: PropTypes.string,
};

const HourlyChart = props =>
  <div>
    <Title />
    <div id="js-dom-to-png-hourly-engagements" style={gridContainer}>
      {props.loading && <Loading noBorder />}
      {!props.loading && <ChartContent {...props} />}
    </div>
  </div>;

HourlyChart.defaultProps = {
  loading: false,
};

HourlyChart.propTypes = {
  loading: PropTypes.bool,
};

export default HourlyChart;