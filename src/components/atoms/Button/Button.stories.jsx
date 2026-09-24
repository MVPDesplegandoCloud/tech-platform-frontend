/**
 * Button Component Stories
 * 
 * Para usar Storybook:
 * 1. npm install -D storybook @storybook/react
 * 2. npx storybook init
 * 3. npm run storybook
 */

import Button from './Button';

export default {
  title: 'Atoms/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    disabled: {
      control: 'boolean',
    },
    isLoading: {
      control: 'boolean',
    },
  },
};

export const Primary = {
  args: {
    children: 'Click me',
    variant: 'primary',
    size: 'md',
  },
};

export const Secondary = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
    size: 'md',
  },
};

export const Large = {
  args: {
    children: 'Large Button',
    variant: 'primary',
    size: 'lg',
  },
};

export const Loading = {
  args: {
    children: 'Loading...',
    variant: 'primary',
    size: 'md',
    isLoading: true,
  },
};

export const Disabled = {
  args: {
    children: 'Disabled',
    variant: 'primary',
    size: 'md',
    disabled: true,
  },
};
