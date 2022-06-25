import ShotgunApiClient from '../client';

interface Options {
  entity: string;
  fieldName: string;
}

/**
 * Delete an entity schema field.
 *
 * @param  {string} entity    - Entity target.
 * @param  {string} fieldName - Target field name.
 * @return {Object} Operation response data.
 */
export async function schemaFieldDelete(
  this: ShotgunApiClient,
  { entity, fieldName }: Options,
) {
  let respBody = await this.request({
    method: 'DELETE',
    path: `/schema/${entity}/fields/${fieldName}`,
  });
  return respBody;
}
