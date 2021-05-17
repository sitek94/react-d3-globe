import { csv } from 'd3';
import { CountriesProperties, CountryProperties, Rotation } from '../types';

/**
 * Countries Properties CSV
 *
 * For each country in this dataset there is
 * - id - ISO code of the country (the same code that is used for ID by World Atlas)
 * - name
 * - latitude
 * - longitude
 */
const countriesPropertiesUrl =
  'https://gist.githubusercontent.com/sitek94/d1c99f4b1936ad047602cc569d30db6b/raw/1d11b02a553634ea708e36bc31557482a28cfac1/countries.csv';

type Columns = 'id' | 'name' | 'latitude' | 'longitude';

const bermudaTrianglePosition: Rotation = [
  25.027684437991375,
  -70.99627570018042,
];

/**
 * This object is used in unlikely event when some field is missing from fetched CSV file.
 */
export const notFoundCountry: CountryProperties = {
  id: 'unknown',
  name: 'unknown',
  position: bermudaTrianglePosition,
};

/**
 * Fetches the CSV file and transforms it
 */
export async function getProperties(): Promise<CountriesProperties> {
  return csv<Columns>(countriesPropertiesUrl).then(data => {
    return data.map(row => {
      const { id, name, latitude, longitude } = row;

      // There are no missing fields in the dataset but just in case set
      // default values
      if (!id || !name || !latitude || !longitude) {
        return notFoundCountry;
      }

      return {
        id,
        name,
        position: [Number(latitude), Number(longitude)],
      };
    });
  });
}
