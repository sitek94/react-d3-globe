import * as React from 'react';
import {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from 'geojson';
import { feature } from 'topojson-client';
import { Topology } from 'topojson-specification';
import { geoOrthographic, geoPath, select } from 'd3';

const size = 400;
const width = size;
const height = size;
const scale = size / 2;

const url = 'https://unpkg.com/world-atlas@2.0.2/land-110m.json';

type Features = Feature<Geometry, GeoJsonProperties>[];

export interface GlobeProps {
  oceanColor?: string;
  landColor?: string;
}

const blue = '#9fd9fa';
const green = '#248415';

export function Globe({ oceanColor = blue, landColor = green }: GlobeProps) {
  const divRef = React.useRef<HTMLDivElement>(null);
  const [features, setFeatures] = React.useState<Features>([]);

  React.useEffect(() => {
    async function fetchTopoJSONData() {
      const res = await fetch(url);
      const topology: Topology = await res.json();
      const land = topology.objects.land;

      if (land) {
        const collection = feature(topology, land) as FeatureCollection;
        setFeatures(collection.features);
      }
    }
    fetchTopoJSONData();
  }, []);

  // Projection
  const projection = React.useMemo(
    () =>
      geoOrthographic()
        .scale(scale)
        .center([0, 0])
        .rotate([0, -30])
        .translate([width / 2, height / 2]),
    [width, height, scale]
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
        <circle cx={width / 2} cy={height / 2} r={scale} fill={oceanColor} />
        <path />
      </svg>
    </div>
  );
}
