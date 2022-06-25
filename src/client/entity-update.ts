import ShotgunApiClient from '../client';

interface Options {
  entity: string;
  entityId: number;
  data: any;
}

/**
 * Update an entity.
 *
 * @param  {string} entity   - Entity type.
 * @param  {number} entityId - Target entity ID.
 * @param  {Object} data     - Entity data.
 * @return {Object} Updated entity.
 */
export async function entityUpdate(
  this: ShotgunApiClient,
  { entity, entityId, data }: Options,
) {
  let respBody = await this.request({
    method: 'PUT',
    path: `/entity/${entity}/${entityId}`,
    body: data,
  });
  return respBody.data;
}
