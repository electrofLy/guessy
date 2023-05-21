import { deletePreviousSavedGuesses, GAME_GUESSES_STORAGE_KEY, KEY_INTERPOLATION } from './play.service';

describe('PlayService', () => {
  it('should delete all non including seed items', () => {
    const keyBefore = GAME_GUESSES_STORAGE_KEY.toString().replaceAll(KEY_INTERPOLATION, 'someVar');
    const keyToday = GAME_GUESSES_STORAGE_KEY.toString().replaceAll(KEY_INTERPOLATION, 'someOtherVar');
    localStorage.setItem(keyBefore, '');
    localStorage.setItem(keyToday, '');
    expect(localStorage.length).toEqual(2);
    deletePreviousSavedGuesses('someVar');
    expect(localStorage.length).toEqual(1);
  });
  it('should not fail to delete if local storage is empty', () => {
    localStorage.clear();
    deletePreviousSavedGuesses('someVar');
    expect(localStorage.length).toEqual(0);
  });
  it('should not delete non game storage keys', () => {
    const gameKey = GAME_GUESSES_STORAGE_KEY.toString().replaceAll(KEY_INTERPOLATION, 'someVar');
    const nonGameKey = `NonGame::someVar`;
    localStorage.setItem(gameKey, '');
    localStorage.setItem(nonGameKey, '');
    expect(localStorage.length).toEqual(2);
    deletePreviousSavedGuesses('someVar');
    expect(localStorage.length).toEqual(2);
  });
});
