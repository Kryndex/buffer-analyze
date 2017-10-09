import { actions } from '@bufferapp/async-data-fetch';
import { actionTypes as profileActionTypes } from '@bufferapp/analyze-profile-selector';
import { actionTypes as dateActionTypes } from '@bufferapp/analyze-date-picker';

export default store => next => (action) => { // eslint-disable-line no-unused-vars
  const { dispatch, getState } = store;
  switch (action.type) {
    case dateActionTypes.SET_DATE_RANGE:
      dispatch(actions.fetch({
        name: 'hourly',
        args: {
          profileId: getState().profiles.selectedProfileId,
          startDate: action.startDate,
          endDate: action.endDate,
        },
      }));
      break;
    case profileActionTypes.SELECT_PROFILE:
      dispatch(actions.fetch({
        name: 'hourly',
        args: {
          profileId: action.id,
          startDate: getState().date.startDate,
          endDate: getState().date.endDate,
        },
      }));
      break;
    default:
      break;
  }
  return next(action);
};