import { FeatureCollection } from 'geojson';
import { feature } from 'topojson-client';
import { Topology } from 'topojson-specification';
import { Features } from '../types';

/**
 * A fixed version of World Atlas Countries 110m
 *
 * https://github.com/Fil/visionscarto-world-atlas
 */
const countries110m =
  'https://unpkg.com/visionscarto-world-atlas@0.0.6/world/110m.json';

/**
 * Fetches TopoJSON data from CDN and transforms it to Feature Collection using "feature"
 * helper from topojson-client
 */
export async function getFeatures(): Promise<Features> {
  const res = await fetch(countries110m);
  const topology: Topology = await res.json();
  const countries = topology.objects.countries;

  if (countries) {
    const { features } = feature(topology, countries) as FeatureCollection;

    return features;
  } else {
    throw new Error(`There was no "countries" object in "topology.objects"`);
  }
}
