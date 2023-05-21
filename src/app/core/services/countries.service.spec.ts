import { CountryJson, extractCountryName } from './countries.service';

describe('CountriesService', () => {
  it('should extract country name', () => {
    const countries = extractCountryName(
      [{ names: { en: 'someName' } as Record<string, string> } as CountryJson],
      'en'
    );
    expect(countries[0].name).toEqual('someName');
  });
});
