import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Globe, GlobeProps } from './Globe';

// .storybook/preview.js

export default {
  title: 'Globe',
  component: Globe,
  argTypes: {
    size: {
      control: { type: 'range', min: 50, max: 1000, step: 1 },
    },
    rotateY: {
      control: { type: 'range', min: -180, max: 180, step: 1 },
    },
    rotateX: {
      control: { type: 'range', min: -180, max: 180, step: 1 },
    },
    rotateZ: {
      control: { type: 'range', min: -180, max: 180, step: 1 },
    },
  },
} as Meta;

const Template: Story<GlobeProps> = args => <Globe {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  oceanColor: '#222425',
  landColor: '#e8fdff',
  rotateX: 0,
  rotateY: 0,
  rotateZ: 0,
};
