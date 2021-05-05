import * as React from 'react';
import { geoOrthographic, geoPath, select } from 'd3';

import { Features, getFeatures } from './getFeatures';

export interface GlobeProps {
  oceanColor?: string;
  landColor?: string;

  /**
   * A shorthand for height and width of the SVG element
   */
  size?: number;

  /**
   * Height of the SVG
   */
  height?: number;

  /**
   * Width of the SVG
   */
  width?: number;

  /**
   *  Scale factor to be used for the projection
   */
  scale?: number;

  /**
   * A point specified as a two-dimensional array [longitude, latitude] in degrees.
   * This will be the projection’s center.
   */
  center?: [number, number];

  /**
   * The x-axis rotation angle in degrees
   */
  rotateX?: number;

  /**
   * The y-axis rotation angle in degrees
   */
  rotateY?: number;

  /**
   * The z-axis rotation angle in degrees
   */
  rotateZ?: number;
}

export function Globe({ size = 400, ...rest }: GlobeProps) {
  const {
    oceanColor = '#eaedee',
    landColor = '#17181d',
    height = size,
    width = size,
    scale = size / 2,
    center = [0, 0],
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0,
  } = rest;

  // Variables

  const centerX = width / 2;
  const centerY = height / 2;
  const circleR = scale;
  const rotation: [number, number, number] = [rotateX, rotateY, rotateZ];

  // State

  const divRef = React.useRef<HTMLDivElement>(null);
  const [features, setFeatures] = React.useState<Features>([]);

  React.useEffect(() => {
    getFeatures().then(setFeatures).catch(console.error);
  }, []);

  // Projection
  const projection = React.useMemo(
    () =>
      geoOrthographic()
        .scale(scale)
        .center(center)
        .rotate(rotation)
        .translate([centerX, centerY]),
    [scale, center, rotation, centerX, centerY]
  );

  // Path generator
  const pathGenerator = geoPath().projection(projection);

  // Update `path` when `pathGenerator` changes
  React.useEffect(() => {
    if (divRef.current && features.length) {
      select(divRef.current)
        .select('path')
        .data(features)
        .join('path')
        .attr('d', pathGenerator);
    }
  }, [features, pathGenerator]);

  return (
    <div ref={divRef} data-testid="globe">
      <svg width={width} height={height} fill={landColor}>
        <circle cx={centerX} cy={centerY} r={circleR} fill={oceanColor} />
        <path />
      </svg>
    </div>
  );
}
