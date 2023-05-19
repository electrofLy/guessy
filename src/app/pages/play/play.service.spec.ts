import { deletePreviousSavedGuesses } from './play.service';

describe('PlayService', () => {
  it('should delete all previous dates', () => {
    deletePreviousSavedGuesses('someSeed');
  });
});
