import { D3ZoomEvent, interpolate, zoom } from 'd3';
import { D3DragEvent, drag } from 'd3-drag';
import {
  CountriesPathsSelection,
  GlobeCircleSelection,
  GlobePathGenerator,
  GlobeProjection,
  Rotation,
  SVGDatum,
} from '../types';

interface Helper {
  selection: CountriesPathsSelection;
  projection: GlobeProjection;
  pathGenerator: GlobePathGenerator;
}

interface RotateProjectionToParams extends Helper {
  rotation: Rotation;
  duration?: number;
}

/**
 * A function that makes a transition from current projection.rotation to
 * given rotation
 */
export function rotateProjectionTo({
  selection,
  projection,
  pathGenerator,
  duration = 1000,
  rotation,
}: RotateProjectionToParams) {
  // Store the current rotation value
  const currentRotation = projection.rotate();

  // Update path generator with new projection
  pathGenerator.projection(projection);

  // Set next rotation
  const nextRotation = rotation;

  // Create interpolator function - that will make the transition from
  // current rotation to the next rotation
  const r = interpolate(currentRotation, nextRotation);

  // Update selection
  selection
    .transition()
    .attrTween('d', d => t => {
      projection.rotate(r(Math.pow(t, 0.33)));
      pathGenerator.projection(projection);

      // When interpolator returns null, Chrome throws errors for
      // <path> with attribute d="null"
      const pathD = pathGenerator(d);
      return pathD !== null ? pathD : '';
    })
    .duration(duration);
}

interface DragBehaviourParams extends Helper {
  sensitivity: number;
}

/**
 * Drag behaviour
 */
export function dragBehaviour({
  selection,
  projection,
  pathGenerator,
  sensitivity,
}: DragBehaviourParams) {
  return drag<SVGSVGElement, SVGDatum>().on(
    'drag',
    (event: D3DragEvent<SVGSVGElement, SVGDatum, SVGDatum>) => {
      const [rotationX, rotationY] = projection.rotate();
      const k = sensitivity / projection.scale();

      // Update projection
      projection.rotate([rotationX + event.dx * k, rotationY - event.dy * k]);

      pathGenerator.projection(projection);
      selection.attr('d', pathGenerator);
    }
  );
}

interface ZoomBehaviourParams extends Helper {
  minScroll: number;
  maxScroll: number;
  scale: number;
  circleSelection: GlobeCircleSelection;
}

/**
 * Zoom behaviour
 */
export function zoomBehaviour({
  selection,
  circleSelection,
  pathGenerator,
  projection,
  scale,
  minScroll,
  maxScroll,
}: ZoomBehaviourParams) {
  return zoom<SVGSVGElement, SVGDatum>().on(
    'zoom',
    (event: D3ZoomEvent<SVGSVGElement, SVGDatum>) => {
      let scrollValue = event.transform.k;

      // Reached max/min zoom
      if (scrollValue >= maxScroll) scrollValue = maxScroll;
      if (scrollValue <= minScroll) scrollValue = minScroll;
      else {
        // Update projection
        projection.scale(scale * scrollValue);

        // Update path generator with new projection
        pathGenerator.projection(projection);

        // Update selectors
        circleSelection.attr('r', projection.scale());
        selection.attr('d', pathGenerator);
      }
    }
  );
}
