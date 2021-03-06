import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureMockStore from 'redux-mock-store';
import ContextualCompareContainer, {
  reducer,
  actions,
  actionTypes,
  middleware,
} from './index';
import ContextualCompare from './components/ContextualCompare';
import mockProfiles from './mocks/profiles';

configure({ adapter: new Adapter() });
describe('ContextualCompareContainer', () => {
  let state = {};
  beforeEach(() => {
    state = {
      contextual: {
        loading: true,
        metrics: { totals: [], daily: [], totalPeriodDaily: [] },
        selectedMetricLabel: '',
        visualizePreviousPeriod: false,
        dailyMode: 0,
      },
      profiles: {
        profiles: mockProfiles,
        selectedProfileId: mockProfiles[0].id,
        selectedProfileService: 'twitter',
      },
    };
  });
  it('should render', () => {
    const mockStore = configureMockStore();
    const store = mockStore(state);

    const component = shallow(<ContextualCompareContainer
      store={store}
    />);
    expect(component.find(ContextualCompare).length)
      .toBe(1);
  });

  it('should dispatch', () => {
    const mockStore = configureMockStore();
    const store = mockStore(state);

    const component = shallow(<ContextualCompareContainer
      store={store}
    />);

    expect(component.props().selectMode(1)).toEqual({
      mode: 1,
      type: `contextual_${actionTypes.SELECT_CHART_MODE}`,
    });
    expect(component.props().openPrimaryMetricDropdown()).toEqual({
      type: `contextual_${actionTypes.OPEN_PRIMARY_DROPDOWN}`,
    });
    expect(component.props().closePrimaryMetricDropdown()).toEqual({
      type: `contextual_${actionTypes.CLOSE_PRIMARY_DROPDOWN}`,
    });
    expect(component.props().openSecondaryMetricDropdown()).toEqual({
      type: `contextual_${actionTypes.OPEN_SECONDARY_DROPDOWN}`,
    });
    expect(component.props().closeSecondaryMetricDropdown()).toEqual({
      type: `contextual_${actionTypes.CLOSE_SECONDARY_DROPDOWN}`,
    });
    expect(component.props().selectPrimaryMetric('foo')).toEqual({
      metricIndex: 0,
      selectedMetricLabel: 'foo',
      type: `contextual_${actionTypes.SELECT_CUSTOM_METRIC}`,
    });
    expect(component.props().selectSecondaryMetric('foo')).toEqual({
      metricIndex: 1,
      selectedMetricLabel: 'foo',
      type: `contextual_${actionTypes.SELECT_CUSTOM_METRIC}`,
    });

    expect(component.props().selectPreset(1)).toEqual({
      preset: 1,
      type: `contextual_${actionTypes.SELECT_PRESET}`,
    });
    expect(component.props().togglePresetDropdown()).toEqual({
      type: `contextual_${actionTypes.TOGGLE_PRESETS_DROPDOWN}`,
    });
  });


  it('should export reducer', () => {
    expect(reducer)
      .toBeDefined();
  });

  it('should export actions', () => {
    expect(actions)
      .toBeDefined();
  });

  it('should export actionTypes', () => {
    expect(actionTypes)
      .toBeDefined();
  });

  it('should export middleware', () => {
    expect(middleware)
      .toBeDefined();
  });
});
