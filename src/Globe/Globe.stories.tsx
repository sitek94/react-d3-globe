import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Globe, GlobeProps } from './Globe';

// .storybook/preview.js

export default {
  title: 'Globe',
  component: Globe,
  argTypes: {
    size: {
      control: { type: 'range', min: 50, max: 800 },
    },
  },
} as Meta;

const Template: Story<GlobeProps> = args => <Globe {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  size: 400,
};
