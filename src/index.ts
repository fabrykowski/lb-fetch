export type Balancer<InputType = string | URL> = (
  inputs: InputType[],
  init: RequestInit | undefined
) => Promise<(string | URL)[]> | (string | URL)[];

export type SuccessPredicate = (response: Response) => boolean;

type LbOptions<InputType = string | URL> = {
  fetch: typeof fetch;
  balancer: Balancer<InputType>;
  success: SuccessPredicate;
};

export const randomBalancer = ((inputs: (string | URL)[]) => {
  // shallow copy
  const result = inputs.slice();

  // Fisher–Yates shuffle
  for (let leftIndex = result.length - 1; leftIndex > 0; leftIndex--) {
    const rightIndex = Math.floor(Math.random() * (leftIndex + 1));
    [result[leftIndex], result[rightIndex]] = [
      result[rightIndex],
      result[leftIndex]
    ];
  }

  return result;
}) satisfies Balancer;

const HTTP_SERVER_ERROR = 500;

export const reject500s = (response: Response) =>
  response.status < HTTP_SERVER_ERROR;

const defaultOptions: LbOptions = {
  fetch,
  balancer: randomBalancer,
  success: reject500s
};

export function lbFetch(
  input: (string | URL)[],
  init?: RequestInit,
  options?: Partial<LbOptions>
): Promise<Response>;
export function lbFetch<InputType = string | URL>(
  input: InputType[],
  init: RequestInit | undefined,
  options: Partial<Omit<LbOptions<InputType>, 'balancer'>> &
    Pick<LbOptions<InputType>, 'balancer'>
): Promise<Response>;
export async function lbFetch<InputType = string | URL>(
  input: InputType[],
  init?: RequestInit,
  options?: Partial<LbOptions<InputType>>
): Promise<Response> {
  const opts = { ...defaultOptions, ...options } as LbOptions<InputType>;
  const urls = await opts.balancer(input, init);

  if (urls.length === 0)
    throw new Error('No URLs to load. Please check your balancer function.');

  let response: Response = Response.error();

  for (const url of urls) {
    try {
      // eslint-disable-next-line no-await-in-loop
      response = await opts.fetch(url, init);
      if (opts.success(response)) {
        return response;
      }
    } catch {
      // ignore error and try next
    }
  }

  return response;
}

export default lbFetch;
