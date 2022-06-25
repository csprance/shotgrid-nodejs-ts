export class SchemaFieldDefinition {
  private properties: any;
  private dataType!: string;
  static DATA_TYPES: string[];

  constructor(body: any) {
    if (!body) return;

    let { data_type, properties } = body;

    this.properties = {};
    this.dataType = '';
    this.setDataType(data_type);
    this.setProperties(properties);
  }

  setDataType(dataType: string) {
    if (!SchemaFieldDefinition.DATA_TYPES.includes(dataType))
      throw new Error(`Invalid data type '${dataType}'`);
    this.dataType = dataType;
  }

  setProperties(properties: any[] | any) {
    if (Array.isArray(properties)) {
      for (let p of properties) {
        this.properties[p.property_name] = p.value;
      }
      return;
    }

    if (properties && properties.constructor.name === 'Object') {
      this.properties = properties;
      return;
    }

    throw new Error('Invalid property input');
  }

  toBody() {
    let data_type = this.dataType;
    let properties = [];
    for (let k in this.properties) {
      properties.push({
        property_name: k,
        value: this.properties[k],
      });
    }

    return {
      data_type,
      properties,
    };
  }
}

SchemaFieldDefinition.DATA_TYPES = [
  'calculated',
  'checkbox',
  'currency',
  'date',
  'date_time',
  'duration',
  'entity',
  'float',
  'footage',
  'list',
  'multi_entity',
  'number',
  'percent',
  'status_list',
  'text',
  'timecode',
  'url',
  'uuid',
];

export default SchemaFieldDefinition;
