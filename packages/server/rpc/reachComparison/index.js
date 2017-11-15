
const { method } = require('@bufferapp/micro-rpc');
const rp = require('request-promise');
const moment = require('moment');
const DateRange = require('../utils/DateRange');

const METRICS_CONFIG = {
  facebook: {
    label: 'Impressions',
    color: '#ced7df',
  },
  instagram: {
    label: 'Impressions',
    color: '#FEC78B',
  },
  twitter: {
    label: 'Impressions',
    color: '#3A92D3',
  },
};

const formatDailyData = (day, value, profileService) => {
  const label = METRICS_CONFIG[profileService].label;
  const color = METRICS_CONFIG[profileService].color;
  return {
    day,
    metric: {
      label,
      value,
      color,
    },
  };
};

function formatData(result) {
  const profileIds = Object.keys(result);
  const profilesMetricData = Array.from(profileIds, (id) => {
    const data = result[id];
    return data.profilesMetricData;
  });

  const profileTotals = Array.from(profileIds, (id) => {
    const data = result[id];
    return data.profileTotals;
  });

  const formattedProfilesMetricData = Array.from(profilesMetricData, (data) => {
    const timezone = data.timezone;
    return {
      dailyData: data.dailyData.map(d =>
        formatDailyData(
          d.day,
          d.value,
          data.service,
        ),
      ),
      service: data.service,
      timezone,
    };
  });

  const formattedProfileTotals = Array.from(profileTotals, (data) => {
    const label = METRICS_CONFIG[data.service].label;
    const color = METRICS_CONFIG[data.service].color;
    return {
      metric: {
        label,
        color,
      },
      currentPeriodTotal: data.currentPeriodTotal,
      currentPeriodDiff: data.currentPeriodDiff,
      profileId: data.profileId,
      username: data.username,
    };
  });

  return {
    profilesMetricData: formattedProfilesMetricData,
    profileTotals: formattedProfileTotals,
  };
}

module.exports = method(
  'reach_comparison',
  'get daily reach data for profile',
  ({ profileIds, startDate, endDate }) => {
    const start = moment.unix(startDate).format('MM/DD/YYYY');
    const end = moment.unix(endDate).format('MM/DD/YYYY');
    const dateRange = new DateRange(start, end);
    return rp({
      uri: `${process.env.ANALYZE_API_ADDR}/reach_comparison`,
      method: 'POST',
      strictSSL: !(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'),
      body: {
        profiles: profileIds,
        start_date: dateRange.start,
        end_date: dateRange.end,
      },
      json: true,
    }).then(({ response }) => (
      formatData(response)
    )).catch(() => ({
      profilesMetricData: [],
      profileTotals: [],
    }));
  },
);
