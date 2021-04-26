import React from 'react';
import { Story, Meta } from '@storybook/react';

import { Globe, GlobeProps } from './Globe';

export default {
  title: 'Globe',
  component: Globe,
} as Meta;

const Template: Story<GlobeProps> = args => <Globe {...args} />;

export const Primary = Template.bind({});
Primary.args = {
  oceanColor: '#9fd9fa',
  landColor: '#248415',
};
