import React from 'react';
import PropTypes from 'prop-types';

import {
  Text,
} from '@bufferapp/components';

import {
  MetricIcon,
} from '@bufferapp/analyze-shared-components';

const Metric = ({ metric }) => (
  <li
    style={{
      margin: '0 0.5rem',
    }}
  >
    <MetricIcon metric={metric} />
    <Text weight="bold" size="small">{metric.label}</Text>
  </li>
);

Metric.propTypes = {
  metric: PropTypes.shape({
    label: PropTypes.string,
  }).isRequired,
};


const Footer = ({
  selectedMetrics,
  mode,
  presets,
  selectedPreset,
}) => (
  <ul
    style={{
      alignItems: 'center',
      boxSizing: 'border-box',
      display: 'flex',
      position: 'relative',
      padding: '5px 10px',
      listStyle: 'none',
      justifyContent: 'center',
    }}
  >
    {mode === 0 && presets[selectedPreset].yAxis.metrics.map(metric => <Metric key={`contextual-footer-${metric.label}`} metric={metric} />)}
    {mode === 1 && selectedMetrics.map(metric => <Metric key={`contextual-footer-${metric.label}`} metric={metric} />)}
  </ul>
);

Footer.defaultProps = {
  loading: false,
};

Footer.propTypes = {
  mode: PropTypes.number.isRequired,
  selectedMetrics: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.string,
  })).isRequired,
  selectedPreset: PropTypes.number.isRequired,
  presets: PropTypes.arrayOf(PropTypes.shape({
    yAxis: PropTypes.shape({
      metrics: PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string,
      })).isRequired,
    }).isRequired,
  })).isRequired,
};

export default Footer;
