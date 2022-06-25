import ShotgunApiClient from '../client';

interface Options {
  entity: string;
  data: any;
}

/**
 * Create an entity.
 *
 * @param  {string} entity - Entity type.
 * @param  {Object} data   - Entity data.
 * @return {Object} Created entity.
 */
export async function entityCreate(
  this: ShotgunApiClient,
  { entity, data }: Options,
) {
  let respBody = await this.request({
    method: 'POST',
    path: `/entity/${entity}`,
    body: data,
  });
  return respBody.data;
}
