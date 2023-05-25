import { countryExists, createGuesses, filterCountries, getCountryName } from './country-form.component';
import { Country } from '../../../core/services/countries.service';

describe('CountryForm', () => {
  it('should get country name', () => {
    expect(getCountryName({ name: 'someName' } as Country)).toEqual('someName');
    expect(getCountryName('someName')).toEqual('someName');
  });

  it('should check if countryExists', () => {
    expect(countryExists('someCountry', ['someCountry', 'someOtherCountry'])).toEqual({});
    expect(countryExists('someCountry', ['someOtherOtherCountry', 'someOtherCountry'])).toEqual({
      invalidCountry: 'someCountry'
    });
  });

  it('should filter countries', () => {
    expect(filterCountries([{ name: 'someCountry' } as Country, { name: 'otherCountry' } as Country], 'som')).toEqual([
      { name: 'someCountry' }
    ]);
    expect(filterCountries([{ name: 'someCountry' } as Country, { name: 'otherCountry' } as Country], '')).toEqual([
      { name: 'someCountry' },
      { name: 'otherCountry' }
    ]);
    expect(filterCountries([{ name: 'someCountry' } as Country, { name: 'otherCountry' } as Country], 'none')).toEqual(
      []
    );
  });

  it('should create guesses', () => {
    const guesses = createGuesses(
      [
        {
          name: 'Afghanistan',
          coordinates: {
            lat: 33.9391,
            lng: 67.71
          }
        } as Pick<Country, 'name' | 'coordinates'>,
        {
          name: 'Albania',
          coordinates: {
            lat: 41.1533,
            lng: 20.1683
          }
        } as Pick<Country, 'name' | 'coordinates'>
      ] as Country[],
      {
        name: 'Algeria',
        coordinates: {
          lat: 28.0339,
          lng: 1.6596
        }
      } as Pick<Country, 'name' | 'coordinates'> as Country
    );

    expect(guesses.length).toEqual(2);
    expect(guesses[0].name).toEqual('Afghanistan');
    expect(guesses[1].name).toEqual('Albania');
    expect(guesses[0].distance).toEqual(6230);
    expect(guesses[1].distance).toEqual(2229);
    expect(guesses[0].icon).toEqual('west');
    expect(guesses[1].icon).toEqual('south_west');
  });
});
