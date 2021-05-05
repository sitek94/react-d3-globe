import { FeatureCollection } from 'geojson';
import { feature } from 'topojson-client';
import { Topology } from 'topojson-specification';
import { Feature, GeoJsonProperties, Geometry } from 'geojson';

/**
 * World Atlas TopoJSON
 *
 * https://github.com/topojson/world-atlas#readme
 */
const worldAtlasUrl = 'https://cdn.jsdelivr.net/npm/world-atlas@2';

/**
 * land-110m.json
 *
 * A TopoJSON file containing the geometry collection land. The geometry is quantized,
 * but not projected; it is in spherical coordinates, decimal degrees. This topology is
 * derived from the Natural Earth’s land boundaries, 1:110m small scale.
 */
const land110m = 'land-110m.json';

export type Features = Feature<Geometry, GeoJsonProperties>[];

/**
 * Gets TopoJSON data from CDN and transforms it to features that can be used to generate
 * the globe path.
 */
export async function getFeatures(): Promise<Features> {
  const res = await fetch(`${worldAtlasUrl}/${land110m}`);
  const topology: Topology = await res.json();
  const land = topology.objects.land;

  if (land) {
    const { features } = feature(topology, land) as FeatureCollection;
    return features;
  } else {
    throw new Error(`There was no "land" object in "topology.objects"`);
  }
}
