const { method } = require('@bufferapp/micro-rpc');
const rp = require('request-promise');
const moment = require('moment');
const DateRange = require('../utils/DateRange');

const mergeStatsWithUpdates = (stats, updates) => {
  const updateList = [];
  const updateIds = Object.keys(stats);

  for (let i = 0; i < updateIds.length; i += 1) {
    const updateId = updateIds[i];
    const update = updates[updateId];
    if (update) {
      updateList.push({
        id: updateId,
        type: update.type,
        text: update.text_formatted,
        date: update.sent_at * 1000,
        serviceLink: update.service_link,
        statistics: stats[updateId],
        media: update.media,
      });
    }
  }
  return updateList;
};

const fetchTopPosts = (profileId, dateRange, accessToken) =>
  rp({
    uri: `${process.env.API_ADDR}/1/profiles/${profileId}/analytics/top_posts.json`,
    method: 'GET',
    strictSSL: !(process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'test'),
    qs: {
      access_token: accessToken,
      start_date: dateRange.start,
      end_date: dateRange.end,
    },
    json: true,
  });

module.exports = method(
  'top_posts',
  'fetch analytics top posts for profiles and pages',
  ({ profileId, startDate, endDate }, { session }) => {
    const end = moment.unix(endDate).format('MM/DD/YYYY');
    const start = moment.unix(startDate).format('MM/DD/YYYY');
    const dateRange = new DateRange(start, end);

    const topPosts = fetchTopPosts(profileId, dateRange, session.accessToken);

    return Promise
      .all([topPosts])
      .then((response) => {
        const { updates, stats } = response[0];
        return mergeStatsWithUpdates(stats, updates);
      })
      .catch(() => []);
  },
);