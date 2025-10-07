type ajvSchemaElementType =
    | {
          type:
              | 'string'
              | 'integer'
              | 'number'
              | 'boolean'
              | 'array'
              | 'timestamp';
      }
    | {
          type: string;
      };

export type ajvSchemaElement =
    | (ajvSchemaElementType & {
          format?: string;
          pattern?: string;
          items?: ajvSchemaElement;
          example?: string | number | boolean | object;
          default?: unknown;
      })
    | ({
          type: 'object';
      } & ajvSchemaProperties);

export type ajvSchemaProperty = {
    [key: string]: ajvSchemaElement | ajvSchemaProperties;
};

export type ajvSchemaProperties = {
    properties: ajvSchemaProperty;
};

export type ajvSchema = ajvSchemaProperties & {
    required?: string[];
};

export type mooSchemaElement = {
    type: string | string[] | object;
    required?: boolean;
    default?: unknown;
};

export type mooSchema = {
    [key: string]: mooSchemaElement | mooSchema | [key: string];
};
