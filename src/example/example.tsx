import * as React from 'react';

interface ExampleProps {
  /**
   * Just some example name
   */
  name?: string;
}

export function Example({ name = 'test' }: ExampleProps) {
  return (
    <div>
      <h1>Example</h1>
      <p>{name}</p>
    </div>
  );
}
