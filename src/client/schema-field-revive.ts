import ShotgunApiClient from '../client';

interface Options {
  entity: string;
  fieldName: string;
}
/**
 *
 * Revive an entity schema field.
 *
 * @param  {string} entity    - Entity target.
 * @param  {string} fieldName - Target field name.
 * @return {Object} Operation response data.
 */
export async function schemaFieldRevive(
  this: ShotgunApiClient,
  { entity, fieldName }: Options,
) {
  let respBody = await this.request({
    method: 'POST',
    path: `/schema/${entity}/fields/${fieldName}?revive=true`,
  });
  return respBody;
}
