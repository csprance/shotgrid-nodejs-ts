import ShotgunApiClient from '../client';

interface Options {
  entity: string;
  entityId: number;
  fields?: string | string[];
  options?: any;
}
/**
 * Read a specific entity.
 *
 * @param  {string}       entity    - Entity type.
 * @param  {number}       entityId  - Target entity ID.
 * @param  {Array|String} [fields]  - List of fields to show.
 * @param  {Object}       [options] - Request option settings.
 * @return {Object} Entity information.
 */
export async function entityRead(
  this: ShotgunApiClient,
  { entity, entityId, fields, options }: Options,
) {
  let query: any = {};

  if (Array.isArray(fields)) fields = fields.join(',');
  if (fields) query.fields = fields;

  if (options) {
    query.options = options;
  }

  let respBody = await this.request({
    method: 'GET',
    path: `/entity/${entity}/${entityId}`,
    query,
  });
  return respBody.data;
}
