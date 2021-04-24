import * as React from 'react';
import './example.scss';

interface ExampleProps {
  name?: string;
}

export function Example({ name = 'test' }: ExampleProps) {
  return (
    <div className="Example">
      <h1>Example</h1>
      <p>{name}</p>
    </div>
  );
}
