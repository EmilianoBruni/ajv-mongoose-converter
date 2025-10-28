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
          index?: true;
          unique?: true;
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
    validate?: object;
    min?: number | [number, string];
    max?: number | [number, string];
    enum?: {
        values: (string | number)[];
        message?: string;
    };
    index?: boolean;
    unique?: boolean;
};

export type mooSchema = {
    [key: string]: mooSchemaElement | mooSchema | [key: string];
};
