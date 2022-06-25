import ShotgunApiClient from '../client';
import { SchemaFieldDefinition } from '../schema-field-definition';

interface Options {
  entity: string;
  schemaFieldDefinition: SchemaFieldDefinition;
}

/**
 * Create an entity schema field.
 *
 * @param  {string}                entity                - Entity target.
 * @param  {SchemaFieldDefinition} schemaFieldDefinition - Field definition.
 * @return {Object} Schema (fields) definition.
 */
export async function schemaFieldCreate(
  this: ShotgunApiClient,
  { entity, schemaFieldDefinition }: Options,
) {
  if (!(schemaFieldDefinition instanceof SchemaFieldDefinition))
    schemaFieldDefinition = new SchemaFieldDefinition(schemaFieldDefinition);

  let body = schemaFieldDefinition.toBody();

  let respBody = await this.request({
    method: 'POST',
    path: `/schema/${entity}/fields`,
    body,
  });
  return respBody.data;
}
