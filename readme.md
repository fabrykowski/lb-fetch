# lb-fetch

[![NPM Version](https://img.shields.io/npm/v/lb-fetch)](https://www.npmjs.com/package/lb-fetch)

A load balanced `fetch`.

## Installation

```bash
npm i lb-fetch
```

## Usage

```javascript
import lbFetch from 'lb-fetch';

const response = await lbFetch(
  [
    "https://server1.example.com/api/endpoint",
    new URL("https://server2.example.com/api/endpoint")
  ],
  {
    method: 'POST',
    body: new URLSearchParams({
      foo: 'bar',
      baz: '42'
    })
  }
);
```

## API

### lbFetch(input, init?, options?)

Tries to `fetch` one of the `input`s in some order until successful.

Returns a `Promise` of a [
`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response).

#### input

Type: `(string | URL)[]` _or_ generic `InputType[]`

The URLs to try. The `input` may also be an array of anything else, then
`options.balancer` **must** be defined.

#### init

Type: `RequestInit | undefined`

Default: `undefined`

Same as [
`fetch` options](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request#options).

#### options.fetch

Type: `typeof fetch`

Default: the global `fetch` method

Any method that conforms to
the [Fetch API](https://fetch.spec.whatwg.org/#fetch-method).

#### options.balancer

Type: `Balancer<InputType = string | URL>`

```typescript
type Balancer<InputType = string | URL> = (
  inputs: InputType[],
  init: RequestInit | undefined
) => Promise<(string | URL)[]> | (string | URL)[];
```

Default: `randomBalancer`

This method decides the order in which the entries of `input` are tried.

**Note**: the default value only works for `input`s consisting of `string`s and
`URL`s.

#### options.success

Type: `SuccessPredicate`

```typescript
type SuccessPredicate = (response: Response) => boolean;
```

Default: `reject500s`

This method decides whether an attempt was successful.

If a request to an input throws an exception, it is also considered unsuccessful.

### randomBalancer(input)

The default balancer returns a shuffled shallow copy of its input.

#### input

Type: `(string | URL)[]`

### reject500s(response)

The default `SuccessPredicate` accepts a response, if its status is less than
`500` – i.e. if the response was not a server error.
