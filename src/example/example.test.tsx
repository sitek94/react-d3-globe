import * as React from 'react';
import renderer from 'react-test-renderer';
import { render, screen } from '@testing-library/react';

import { Example } from './example';

describe('Example', () => {
  it('should match the snapshot', () => {
    const tree = renderer.create(<Example />).toJSON();

    expect(tree).toMatchSnapshot();
  });

  it('renders correctly', () => {
    render(<Example />);

    expect(screen.getByText('Example')).toBeTruthy();
  });

  it(`renders correctly when passed "name" prop`, () => {
    render(<Example name="Maciek" />);

    expect(screen.getByText('Maciek')).toBeTruthy();
  });
});
