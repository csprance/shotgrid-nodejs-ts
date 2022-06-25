import ShotgunApiClient from '../client';
import { PaginatedRecordResponse } from '../paginated-record-response';

interface Options {
  entity: string;
  filter?: Record<string, any>;
  fields?: string | string[];
  sort?: string | string[];
  pageSize?: number;
  pageNumber?: number;
  options?: any;
}

/**
 * Read multiple entities.
 *
 * @param  {string}       entity       - Entity type.
 * @param  {Object}       [filter]     - List of filters.
 * @param  {Array|String} [fields]     - List of fields to show.
 * @param  {Array|String} [sort]       - List of ordering fields.
 * @param  {number}       [pageSize]   - Upper limit of items shown on response page.
 * @param  {number}       [pageNumber] - Position in list of items to start querying from.
 * @param  {Object}       [options]    - Request option settings.
 * @return {PaginatedRecordResponse} Targered partial response.
 */
export async function entityReadAll(
  this: ShotgunApiClient,
  { entity, filter, fields, sort, pageSize, pageNumber, options }: Options,
) {
  let query: Record<string, any> = {
    page: {
      size: pageSize || 500,
      number: pageNumber || 1,
    },
  };

  if (filter) {
    for (let k in filter) {
      query[`filter[${k}]`] = filter[k];
    }
  }

  if (Array.isArray(fields)) fields = fields.join(',');
  if (fields) query.fields = fields;

  if (Array.isArray(sort)) sort = sort.join(',');
  if (sort) query.sort = sort;

  if (options) {
    query.options = options;
  }

  let respBody = await this.request({
    method: 'GET',
    path: `/entity/${entity}`,
    query,
  });
  respBody._pageSize = pageSize;
  return new PaginatedRecordResponse(respBody);
}
