import ShotgunApiClient from '../client';
import { SchemaFieldDefinition } from '../schema-field-definition';

interface Options {
  entity: string;
  fieldName: string;
  schemaFieldDefinition: SchemaFieldDefinition;
  projectId?: number;
}
/**
 * Update an entity schema field.
 *
 * @param  {string}                entity                - Entity target.
 * @param  {string}                fieldName             - Target field name.
 * @param  {SchemaFieldDefinition} schemaFieldDefinition - Field definition.
 * @param  {number}                [project]             - Associated project.
 * @return {Object} Operation response data.
 */
export async function schemaFieldUpdate(
  this: ShotgunApiClient,
  { entity, fieldName, schemaFieldDefinition, projectId }: Options,
) {
  if (!(schemaFieldDefinition instanceof SchemaFieldDefinition))
    schemaFieldDefinition = new SchemaFieldDefinition(schemaFieldDefinition);

  let body: any = schemaFieldDefinition.toBody();

  if (projectId) body.project_id = projectId;

  let respBody = await this.request({
    method: 'PUT',
    path: `/schema/${entity}/fields/${fieldName}`,
    body,
  });
  return respBody.data;
}
