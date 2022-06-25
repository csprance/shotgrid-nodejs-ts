import ShotgunApiClient from '../client';

interface Options {
  entity?: string;
  isFieldsWanted?: boolean;
  projectId?: number;
}

/**
 * Get entity schema or entity fields schema.
 *
 * @param  {string}  [entity]         - Entity wanted. If left blank returns all entity schemas.
 * @param  {boolean} [isFieldsWanted] - Flag indicating if entity fields schema is wanted instead of entity schema.
 * @param  {number}  [projectId]      - Project associated with entity.
 * @return {Object} Schema (fields) definition.
 */
export async function schemaGet(
  this: ShotgunApiClient,
  { entity, isFieldsWanted, projectId }: Options,
) {
  let path = '/schema';
  if (entity) {
    path += `/${entity}`;
    if (isFieldsWanted) {
      path += '/fields';
    }
  }

  let query: any = {};
  if (projectId) query.project_id = projectId;

  let respBody = await this.request({
    method: 'GET',
    path,
    query,
  });
  return respBody.data;
}
