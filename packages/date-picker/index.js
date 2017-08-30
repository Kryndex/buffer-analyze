import { connect } from 'react-redux';
import moment from 'moment';
import DatePicker from './components/DatePicker';
import { actions } from './reducer';

// default export = container
export default connect(
  state => ({
    loading: state.date.loading,
    startDate: state.date.startDate,
    endDate: state.date.endDate,
    isOpen: state.date.open,
    calendarOpen: state.date.calendarOpen,
    minDate: state.date.minDate,
    maxDate: state.date.maxDate,
    // add state here
  }),
  dispatch => ({
    open: () => dispatch(actions.open()),
    close: () => dispatch(actions.close()),
    setStartDate: date => dispatch(actions.setStartDate(date)),
    setEndDate: date => dispatch(actions.setEndDate(date)),
    setDateRange: (start, end) => dispatch(actions.setDateRange(start, end)),
    selectPreset: (range) => {
      if (range !== Infinity) {
        dispatch(actions.setDateRange(
          moment().subtract(range, 'days').unix(),
          moment().subtract(1, 'days').unix(),
        ));
        dispatch(actions.close());
      } else {
        dispatch(actions.openCalendar());
      }
    },
  }),
)(DatePicker);

// export reducer, actions and action types
export reducer, { actions, actionTypes } from './reducer';
export middleware from './middleware';
