import { beforeEach, describe, expect, it } from '@jest/globals';
import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { ParseDatePipe } from './parse-date.pipe';

describe('ParseDatePipe', () => {
  let pipe: ParseDatePipe;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ParseDatePipe],
    }).compile();
    pipe = module.get<ParseDatePipe>(ParseDatePipe);
  });

  it('should be defined', () => {
    expect.assertions(1);
    expect(pipe).toBeDefined();
  });

  describe('transform', () => {
    it('should pass validation', () => {
      expect.assertions(1);

      const value = '2020-10-25T10:18:10.502Z';

      expect(pipe.transform(value)).toStrictEqual(new Date(value));
    });

    it('should throw exception', () => {
      expect.assertions(1);

      const value = 'abcd';

      expect(() => pipe.transform(value)).toThrow(BadRequestException);
    });
  });
});
