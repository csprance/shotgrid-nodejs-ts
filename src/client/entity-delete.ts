import ShotgunApiClient from '../client';

interface Options {
  entity: string;
  entityId: number;
}

/**
 * Delete an entity.
 *
 * @param  {string} entity   - Entity type.
 * @param  {number} entityId - Target entity ID.
 * @return {Object} Request result.
 */
export async function entityDelete(
  this: ShotgunApiClient,
  { entity, entityId }: Options,
) {
  let respBody = await this.request({
    method: 'DELETE',
    path: `/entity/${entity}/${entityId}`,
  });
  return respBody;
}
