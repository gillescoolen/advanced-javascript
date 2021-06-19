import { EnumToArrayPipe } from './enum-to-array.pipe';
import { UserStoryStatus } from '../types/user-story-status.enum';

describe('EnumToArrayPipe', () => {
  let testData: UserStoryStatus[];
  let pipe: EnumToArrayPipe;

  beforeEach(() => {
    testData = [
      UserStoryStatus.NO_STATUS,
      UserStoryStatus.TODO,
      UserStoryStatus.IN_PROGRESS,
      UserStoryStatus.DONE,
    ];

    pipe = new EnumToArrayPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return an array with same length', () => {
    const result = pipe.transform(UserStoryStatus);

    expect(result.length).toBe(testData.length);
  });

  it('should return all enum values', () => {
    const result = pipe.transform(UserStoryStatus);

    result.forEach((r, i) => {
      expect(r).toBe(testData[i]);
    });
  });
});
