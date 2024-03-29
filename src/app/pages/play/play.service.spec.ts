import {
  deletePreviousSavedGuesses,
  GAME_GUESSES_STORAGE_KEY,
  getSavedGuesses,
  getStatisticsCount,
  KEY_INTERPOLATION,
  saveStatistics
} from './play.service';
import { Country } from '../../core/services/countries.service';

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
      saveStatistics('someKey', 'today1');
      saveStatistics('someKey', 'today1');
      saveStatistics('someKey', 'today2');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(JSON.parse(localStorage.getItem(`someKey`)!).length).toEqual(2);
    });
    it('should be able to get statistics', () => {
      expect(getStatisticsCount(`someKey`)).toEqual(0);
      saveStatistics('someKey', 'today1');
      saveStatistics('someKey', 'today1');
      saveStatistics('someKey', 'today2');
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      expect(getStatisticsCount(`someKey`)).toEqual(2);
    });
  });
});
