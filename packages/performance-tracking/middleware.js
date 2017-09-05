import { chronos } from '@bufferapp/chronos';
import { actions as fetchActions } from '@bufferapp/async-data-fetch';
import { actionTypes } from './reducer';

export const storeMeasure = dispatch => (data) => {
  dispatch(fetchActions.fetch({
    name: 'performance',
    args: { data },
  }));
};

export default ({ dispatch }) => next => (action) => {
  const thisChronos = chronos({
    store: storeMeasure(dispatch),
  });

  switch (action.type) {
    case actionTypes.PERFORMANCE_START_MEASURE:
      thisChronos.startMeasure(action.measureName, action.measureData);
      break;
    case actionTypes.PERFORMANCE_STOP_MEASURE:
      thisChronos.stopMeasure(action.measureName);
      break;
    case actionTypes.PERFORMANCE_MEASURE_FROM_EVENT:
      thisChronos.measureFromSpecialEvent(action.measureName, action.measureData);
      break;
    case actionTypes.PERFORMANCE_MEASURE_FROM_NAVIGATION_START:
      thisChronos.measureFromNavigationStart(action.measureName, action.measureData);
      break;
    default:
      break;
  }
  next(action);
};
