import { connect } from 'react-redux';
import CompareChart from './components/CompareChart';
import { actions } from './reducer';

function getSelectedProfileTimezone({ profiles, selectedProfileId }) {
  const profile = profiles.find(p => p.id === selectedProfileId);
  return profile.timezone;
}

function mapStateToProps (state) {
  const visualizeTotalPeriodDaily = state.compare.dailyMode === 1;
  return {
    dailyData: visualizeTotalPeriodDaily ?
      state.compare.metrics.totalPeriodDaily :
      state.compare.metrics.daily,
    dailyMode: state.compare.dailyMode,
    isDropdownOpen: state.compare.isDropdownOpen,
    loading: state.compare.loading,
    profileService: state.profiles.selectedProfileService,
    selectedMetricLabel: state.compare.selectedMetricLabel,
    timezone: getSelectedProfileTimezone(state.profiles),
    totals: state.compare.metrics.totals,
    visualizePreviousPeriod: state.compare.visualizePreviousPeriod,
  };
}

const mapDispatchToProps = dispatch => ({
  selectMetric: label => dispatch(actions.selectMetric(label)),
  togglePreviousPeriod: () => dispatch(actions.togglePreviousPeriod()),
  openDropdown: () => dispatch(actions.openDropdown()),
  closeDropdown: () => dispatch(actions.closeDropdown()),
  selectDailyMode: mode => dispatch(actions.selectDailyMode(mode)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CompareChart);

// export reducer, actions and action types
export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
