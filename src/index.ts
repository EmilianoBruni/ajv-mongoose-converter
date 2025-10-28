import type {
    ajvSchemaElement,
    ajvSchemaProperty,
    ajvSchemaProperties,
    ajvSchema,
    mooSchemaElement,
    mooSchema
} from '@/types.js';

const _typeStringConvert = (ajvSchemaItem: ajvSchemaElement): string => {
    if ('format' in ajvSchemaItem) {
        if (ajvSchemaItem.format?.match(/date/i)) return 'Date';
        if (ajvSchemaItem.format?.match(/binary/i)) return 'Buffer';
        if (ajvSchemaItem.format?.match(/byte/i)) return 'Buffer';
    }
    if (
        'pattern' in ajvSchemaItem &&
        ajvSchemaItem.pattern &&
        '0123456789abcdefABCDEF01'.match(new RegExp(ajvSchemaItem.pattern)) // is an ObjectId
    )
        return 'ObjectId';
    return 'String';
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
        case 'buffer':
            return 'Buffer';
        case 'object':
        default:
            return 'Mixed';
    }
};

const convert = (
    ajvSchema: ajvSchema,
    required: string[] = [],
    parent?: string | null
) => {
    let props: ajvSchemaProperty;
    try {
        props = ajvSchema.properties;
        if (!props) throw '';
    } catch {
        throw new Error(
            'Invalid schema: missing or malformed "properties" key. Please provide a schema object with a "properties" field containing property definitions.'
        );
    }
    const req = [...(ajvSchema.required || []), ...required];

    const mooSchema: mooSchema = {};

    // loop through keys
    for (const key in props) {
        const prop = props[key]!;
        // recursive if key has properties
        if ('properties' in prop) {
            mooSchema[key] = convert(prop as ajvSchemaProperties, req, key);
            if (
                'buffer' in mooSchema[key] &&
                'type' in mooSchema[key].buffer &&
                mooSchema[key].buffer.type === 'Buffer'
            ) {
                // Special case for buffer in object
                mooSchema[key] = { type: 'Buffer' };
            }
            continue;
        }
        const keyObj: mooSchemaElement = {
            type: _typeConvert(prop as ajvSchemaElement)
        };
        if (prop.type === 'object' && !('properties' in prop)) {
            keyObj.type = 'Mixed'; // object without properties
        }

        const items = prop.items;
        if (keyObj.type === 'Array' && items && items.type) {
            keyObj.type = Array(_typeConvert(items));
        }
        if (req.includes((parent ? `${parent}.` : '') + key))
            keyObj.required = true;
        if (req.includes(key)) keyObj.required = true;
        ['default', 'index', 'unique'].forEach(field => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (field in prop)
                (keyObj as any)[field] = prop[field as keyof typeof prop];
        });
        // if ('default' in prop) keyObj.default = prop.default;
        // add support for nullable
        if ('nullable' in prop && prop.nullable) {
            keyObj.validate = nullishValidator;
        }
        mooSchema[key] = keyObj;
    }

    return mooSchema;
};

const nullishValidator = {
    validator: (v: unknown) => v || v === null,
    message: 'Value must be null or defined'
};

export default convert;
export type {
    ajvSchema,
    ajvSchemaProperty,
    ajvSchemaProperties,
    mooSchemaElement,
    mooSchema
};
