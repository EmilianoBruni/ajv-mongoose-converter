export type ajvSchemaElement = {
    type: "string" | "integer" | "number" | "boolean" | "array" | "object" | "timestamp";
    format?: string;
    pattern?: string;
    items?: ajvSchemaElement;
    example?: string | number | boolean | Object;
};

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
    type: string | string[] | Object;
    required?: boolean;
};

export type mooSchema = {
    [key: string]: mooSchemaElement | mooSchema;
};

const _typeStringConvert = (ajvSchemaItem: ajvSchemaElement): string => {
    if ('format' in ajvSchemaItem && ajvSchemaItem.format.match(/date/i))
        return 'Date';
    if (
        'pattern' in ajvSchemaItem &&
        ajvSchemaItem.pattern.match(/^\^\[0-9(a-f){1,2}\]\{24\}\$$/i)
    )
        return 'ObjectId';
    return 'String';
};

const _typeObjectConvert = (ajvSchemaItem: ajvSchemaElement): string => {
    if ('format' in ajvSchemaItem && ajvSchemaItem.format.match(/binary/i))
        return 'Buffer';
    return "Mixed";
};

const _typeConvert = (ajvSchemaItem: ajvSchemaElement): string => {
    switch (ajvSchemaItem.type.toLowerCase()) {
        case 'string':
            return _typeStringConvert(ajvSchemaItem);
        case 'integer':
        case 'number':
        case 'int8':
        case 'uint8':
        case 'int16':
        case 'int32':
        case 'uint32':
        case 'float32':
        case 'float64':
            return 'Number';
        case 'array':
            return 'Array';
        case 'boolean':
            return 'Boolean';
        case 'timestamp':
            return 'Date';
        case 'object':
            return _typeObjectConvert(ajvSchemaItem);
        default:
            return 'Mixed';
    }
};

const convert = (ajvSchema: ajvSchema, required: string[] = [], parent: string | null) => {
    let props: ajvSchemaProperty;
    try {
        props = ajvSchema.properties;
        if (!props) throw '';
    } catch (error) {
        throw new Error(
            'Please initialize module with a valid schema = {properties: {...} }'
        );
    }
    const req = [...(ajvSchema.required || []), ...required];

    const mooSchema: mooSchema = {};

    // loop through keys
    for (const key in props) {
        const prop = props[key]!;
        // recursive if key has properties
        if (prop.hasOwnProperty('properties')) {
            mooSchema[key] = convert(prop as ajvSchemaProperties, req, key);
            continue;
        }
        const keyObj: mooSchemaElement = { type: _typeConvert(prop as ajvSchemaElement) };
        const items: ajvSchemaElement | undefined = (prop as ajvSchemaElement).items;
        if (keyObj.type === 'Array' && items && items.type) {
            keyObj.type = Array(_typeConvert(items));
        }
        if (req.includes((parent ? `${parent}.` : '') + key))
            keyObj.required = true;
        mooSchema[key] = keyObj;
    }

    return mooSchema;
};

export default convert;
