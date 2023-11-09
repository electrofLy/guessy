import {
  deletePreviousSavedGuesses,
  GAME_GUESSES_STORAGE_KEY,
  getSavedGuesses,
  getStatisticsCount,
  KEY_INTERPOLATION,
  PlayService,
  saveStatistics
} from './play.service';
import { CountriesService, Country } from '../../core/services/countries.service';
import { TestBed } from '@angular/core/testing';
import { DatePipe } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { combineLatest, of } from 'rxjs';
import { createTranslocoTestingModule } from '../../transloco-testing.module';

describe('PlayService', () => {
  describe('utils', () => {
    beforeEach(() => {
      localStorage.clear();
    });
    it('should delete all non including seed items', () => {
      const keyBefore = GAME_GUESSES_STORAGE_KEY.toString().replace(KEY_INTERPOLATION, 'someVar');
      const keyToday = GAME_GUESSES_STORAGE_KEY.toString().replace(KEY_INTERPOLATION, 'someOtherVar');
      localStorage.setItem(keyBefore, '');
      localStorage.setItem(keyToday, '');
      expect(localStorage.length).toEqual(2);
      deletePreviousSavedGuesses('someVar');
      expect(localStorage.length).toEqual(1);
    });
    it('should not fail to delete if local storage is empty', () => {
      deletePreviousSavedGuesses('someVar');
      expect(localStorage.length).toEqual(0);
    });
    it('should not delete non game storage keys', () => {
      const gameKey = GAME_GUESSES_STORAGE_KEY.toString().replace(KEY_INTERPOLATION, 'someVar');
      const nonGameKey = `NonGame::someVar`;
      localStorage.setItem(gameKey, '');
      localStorage.setItem(nonGameKey, '');
      expect(localStorage.length).toEqual(2);
      deletePreviousSavedGuesses('someVar');
      expect(localStorage.length).toEqual(2);
    });

    it('should be able to get saved guesses', () => {
      localStorage.setItem('someKey', JSON.stringify(['boo', 'boo2']));
      const savedGuesses = getSavedGuesses('someKey', [
        { isoCode: 'boo', name: 'bobo' } as Country,
        { isoCode: 'boo3', name: 'bobo3' } as Country
      ]);
      expect(savedGuesses[0].name).toEqual('bobo');
      expect(savedGuesses.length).toEqual(1);
    });

    it('should be able to get zero saved guesses', () => {
      const savedGuesses = getSavedGuesses('someKey', [{ isoCode: 'boo', name: 'bobo' } as Country]);
      expect(savedGuesses.length).toEqual(0);
    });
    it('should be able to save statistics', () => {
      saveStatistics(true, 'SHAPE', 'someKey', 'today1');
      saveStatistics(true, 'SHAPE', 'someKey', 'today1');
      saveStatistics(true, 'SHAPE', 'someKey', 'today2');
      saveStatistics(false, 'SHAPE', 'someKey', 'today3');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(JSON.parse(localStorage.getItem(`someKey`)!).length).toEqual(2);
    });
    it('should be able to get statistics', () => {
      expect(getStatisticsCount(`someKey`)).toEqual(0);
      saveStatistics(true, 'SHAPE', 'someKey', 'today1');
      saveStatistics(true, 'SHAPE', 'someKey', 'today1');
      saveStatistics(true, 'SHAPE', 'someKey', 'today2');
      saveStatistics(false, 'SHAPE', 'someKey', 'today3');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(getStatisticsCount(`someKey`)).toEqual(2);
    });
  });

  describe('service ', () => {
    let playService: PlayService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [
          createTranslocoTestingModule(),
          PlayService,
          DatePipe,
          {
            provide: CountriesService,
            useValue: {
              countryNames$: of(['Afghanistan', 'Albania']),
              countries$: of([
                {
                  name: 'Afghanistan',
                  isoCode: 'af',
                  flagUrl: 'assets/flags/af.svg',
                  shapeUrl: 'assets/shapes/af.svg',
                  coordinates: {
                    lat: 33.9391,
                    lng: 67.71
                  }
                },
                {
                  name: 'Albania',
                  isoCode: 'al',
                  flagUrl: 'assets/flags/al.svg',
                  shapeUrl: 'assets/shapes/al.svg',
                  coordinates: {
                    lat: 41.1533,
                    lng: 20.1683
                  }
                }
              ]),
              activeLang$: of('en')
            } as Pick<CountriesService, 'countries$' | 'activeLang$' | 'countryNames$'>
          }
        ]
      });

      playService = TestBed.inject(PlayService);
      playService.type$.next('FLAG');
    });

    it('should be able to create an initial state', (done) => {
      combineLatest([
        playService.country$,
        playService.guesses$,
        playService.isGuessed$,
        playService.isEnded$
      ]).subscribe(([country, guesses, isGuessed, isEnded]) => {
        expect(country).toBeDefined();
        expect(guesses.length).toEqual(0);
        expect(isGuessed).toEqual(false);
        expect(isEnded).toEqual(false);
        done();
      });
    });
  });
});
