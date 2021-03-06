import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import Text from '@bufferapp/components/Text';

import {
  GridItem,
  MetricIcon,
} from '@bufferapp/analyze-shared-components';

const Grid = styled.ul`
  display: flex;
  flex-wrap: wrap;
  padding: 0 0 0 0.5rem;
  margin: 0 auto;
`;

const Wrapper = styled.section`
  position: relative;
  padding: 0 1rem 1rem;
`;

const ProfileAvatarWrapper = styled.div`
  display: inline-flex;
  align-items: center;
`;
const ProfileUsernameWrapper = styled.div`
  margin-right: 10px;
`;

const ComparisonFooter = ({ profileTotals }) => (
  <Wrapper>
    <Grid>
      {profileTotals.map(total =>
        <GridItem
          key={total.profileId}
          metric={{
            label: total.metric.label,
            value: total.currentPeriodTotal,
            diff: total.currentPeriodDiff,
          }}
          customLabel={
            <ProfileAvatarWrapper>
              <ProfileUsernameWrapper>
                <Text size="small">
                  {total.username}
                </Text>
              </ProfileUsernameWrapper>
              <MetricIcon key={total.profileId} metric={total.metric} />
            </ProfileAvatarWrapper>
          }
        />)}
    </Grid>
  </Wrapper>
);

ComparisonFooter.defaultProps = {
  loading: false,
};

ComparisonFooter.propTypes = {
  profileTotals: PropTypes.arrayOf(PropTypes.shape({
    metric: PropTypes.shape({
      label: PropTypes.string.isRequired,
      color: PropTypes.string.isRequired,
    }),
    currentPeriodTotal: PropTypes.number.isRequired,
    currentPeriodDiff: PropTypes.number.isRequired,
    profileId: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    service: PropTypes.string,
  })).isRequired,
};

export default ComparisonFooter;

