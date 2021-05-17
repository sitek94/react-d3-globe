import * as React from 'react';
import { geoOrthographic, geoPath, select } from 'd3';
import {
  dragBehaviour,
  rotateProjectionTo,
  zoomBehaviour,
} from './transformations';
import {
  CountriesFeatures,
  CountryFeature,
  Rotation,
  SVGDatum,
} from '../types';

export interface ProjectionConfig {
  svgRef: React.RefObject<SVGSVGElement>;
  countries: CountriesFeatures;
  scale: number;
  cx: number;
  cy: number;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  rotation?: Rotation;
  dragSensitivity?: number;
  minScroll?: number;
  maxScroll?: number;
}

export function useProjection(props: ProjectionConfig) {
  const {
    svgRef,
    countries,

    // Size
    scale,
    cx,
    cy,

    // Rotation
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0,
    rotation = [rotateX, rotateY, rotateZ],

    // Interactivity
    dragSensitivity = 75,
    minScroll = 0.3,
    maxScroll = 20,
  } = props;

  // Projection
  const projection = React.useMemo(
    () =>
      geoOrthographic()
        .scale(scale)
        .center([0, 0])
        .rotate(rotation)
        .translate([cx, cy]),
    [scale, rotation, cx, cy]
  );

  // Path generator
  const pathGenerator = React.useMemo(() => geoPath(projection), [projection]);

  // Update `path` when `pathGenerator` changes
  React.useEffect(() => {
    if (!svgRef.current || !countries.length) {
      return;
    }

    const svg = select<SVGSVGElement, SVGDatum>(svgRef.current);
    const countriesPaths = svg.selectAll<SVGPathElement, CountryFeature>(
      'path'
    );
    const globeCircle = svg.select<SVGCircleElement>('circle');

    const countriesDataJoin = countriesPaths.data(countries).join('path');

    // Apply zoom and drag
    svg
      .call(
        dragBehaviour({
          selection: countriesDataJoin,
          pathGenerator,
          projection,
          sensitivity: dragSensitivity,
        })
      )
      .call(
        zoomBehaviour({
          selection: countriesDataJoin,
          circleSelection: globeCircle,
          pathGenerator,
          projection,
          scale,
          minScroll,
          maxScroll,
        })
      );

    globeCircle.attr('r', projection.scale());
    countriesDataJoin.attr('d', pathGenerator);
  }, [
    svgRef,
    scale,
    maxScroll,
    minScroll,
    projection,
    countries,
    pathGenerator,
    dragSensitivity,
  ]);

  function rotateTo(rotation: Rotation) {
    if (!svgRef.current) {
      return;
    }
    const svg = select<SVGSVGElement, SVGDatum>(svgRef.current);
    const countriesPaths = svg.selectAll<SVGPathElement, CountryFeature>(
      'path'
    );

    rotateProjectionTo({
      selection: countriesPaths,
      projection,
      pathGenerator,
      rotation,
    });
  }

  return {
    rotateTo,
  };
}
