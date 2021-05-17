import { CountriesFeatures, CountriesProperties, Features } from '../types';
import { getFeatures } from './get-features';
import { getProperties, notFoundCountry } from './get-properties';

/**
 * Fetches both countries features and properties and then extends the features
 * by mapping the properties to them.
 */
export async function getCountries(): Promise<CountriesFeatures> {
  const [features, properties] = await Promise.all([
    getFeatures(),
    getProperties(),
  ]);

  return mapPropertiesToFeatures(properties, features);
}

function mapPropertiesToFeatures(
  properties: CountriesProperties,
  features: Features
) {
  return features.map(feature => {
    const countryProperties = properties.find(p => p.id === feature.id);

    return {
      ...feature,
      properties: countryProperties || notFoundCountry,
    };
  });
}
