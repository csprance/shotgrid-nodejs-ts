import ShotgunApiClient from '../client';

interface Options {
  requests: any;
}

/**
 * Batch entity CRUD requests
 *
 * @param  {Object} requests - List of requests to batch.
 * @return {Object[]} Mapped request results.
 */
export async function entityBatch(
  this: ShotgunApiClient,
  { requests }: Options,
) {
  let body = {
    requests,
  };

  let respBody = await this.request({
    method: 'POST',
    path: '/entity/_batch/',
    body,
  });
  return respBody.data;
}
