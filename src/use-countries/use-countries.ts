import * as React from 'react';

import { CountriesFeatures } from '../types';
import { getCountries } from './get-countries';

type Status = 'idle' | 'pending' | 'resolved' | 'rejected';

export function useCountries() {
  const [countries, setCountries] = React.useState<CountriesFeatures>([]);
  const [status, setStatus] = React.useState<Status>('idle');
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    let current = true;

    setStatus('pending');

    getCountries()
      .then(countries => {
        if (current) {
          setStatus('resolved');
          setCountries(countries);
        }
      })
      .catch(error => {
        if (current) {
          setStatus('rejected');
          setError(error);
        }
      });

    return () => {
      current = false;
    };
  }, []);

  return { countries, status, error };
}
