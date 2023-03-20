/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import type { SanitizeOptions } from 'src/types/types';
import { sanitize } from '../../src/utils/sanitize.util';

describe('sanitize', () => {
  it('should return empty data as is', () => {
    expect(sanitize(null)).toBeNull();
    expect(sanitize(undefined)).toBeUndefined();
    expect(sanitize('')).toBe('');
    expect(sanitize({})).toEqual({});
    expect(sanitize([])).toEqual([]);
  });

  it('should sanitize strings', () => {
    const input = '<script>alert("hello world")</script>';
    const expected = '';
    expect(sanitize(input)).toBe(expected);
  });

  it('should sanitize objects', () => {
    const input = {
      name: '<script>alert("hello world!");</script>',
      age: 20,
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip: '<script>alert("hello world!");</script>'
      },
      friends: [
        { name: '<script>alert("hello world!");</script>', age: 22 },
        { name: 'Alice', age: '<script>alert("hello world!");</script>' }
      ]
    };

    const expected = {
      name: '',
      age: 20,
      address: {
        street: '123 Main St',
        city: 'Springfield',
        state: 'IL',
        zip: ''
      },
      friends: [
        {
          name: '',
          age: 22
        },
        {
          name: 'Alice',
          age: ''
        }
      ]
    };

    expect(sanitize(input)).toEqual(expected);
  });

  it('should sanitize arrays', () => {
    const input = [
      '<script>alert("hello world")</script>',
      20,
      ['<div>test</div>']
    ];
    const expected = ['', 20, ['']];
    expect(sanitize(input)).toEqual(expected);
  });

  it('should sanitize an array of objects', () => {
    const input = [
      { name: '<script>alert("hello world!");</script>', age: 20 },
      { name: 'Alice', age: '<script>alert("hello world!");</script>' }
    ];

    const expected = [
      { name: '', age: 20 },
      {
        name: 'Alice',
        age: ''
      }
    ];
    expect(sanitize(input)).toEqual(expected);
  });

  it('should return frozen objects as is', () => {
    const input = Object.freeze({
      name: '<script>alert("hello world")</script>',
      age: 20,
      contact: {
        email: 'test@example.com',
        phone: '+1234567890'
      }
    });
    expect(sanitize(input)).toBe(input);
  });

  it('should return sealed objects as is', () => {
    const input = Object.seal({
      name: '<script>alert("hello world")</script>',
      age: 20,
      contact: {
        email: 'test@example.com',
        phone: '+1234567890'
      }
    });
    expect(sanitize(input)).toBe(input);
  });

  it('should allow custom XSS whiteList', () => {
    const input = '<div><a href="http://example.com">Example</a></div>';
    const expected = '<div><a href="http://example.com">Example</a></div>';
    const options: SanitizeOptions = {
      whiteList: {
        div: ['*'],
        a: ['href', 'target']
      }
    };
    expect(sanitize(input, options)).toBe(expected);
  });
});
