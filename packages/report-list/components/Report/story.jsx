import React from 'react';
import { storiesOf } from '@storybook/react';
import { checkA11y } from 'storybook-addon-a11y';
import Report from './index';


const report = {
  _id: '1293125asda',
  name: 'Weekly Sync Report',
  updated_at: 1507680000000,
};

storiesOf('Report')
  .addDecorator(checkA11y)
  .add('renders the report', () => (
    <Report
      {...report}
    />
  ));
