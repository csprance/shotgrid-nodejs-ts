import ShotgunApiClient from '../client';

interface Options {
  entity: string;
  entityId: number;
}

/**
 * Revive an entity.
 *
 * @param  {string} entity - Entity type.
 * @param  {number} entityId  - Target entity ID.
 * @return {Object} Revived entity.
 */
export async function entityRevive(
  this: ShotgunApiClient,
  { entity, entityId }: Options,
) {
  let respBody = await this.request({
    method: 'POST',
    path: `/entity/${entity}/${entityId}`,
    query: {
      revive: true,
    },
  });
  return respBody.data;
}
