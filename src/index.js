'use strict';

const _typeStringConvert = ajvSchemaItem => {
    if ('format' in ajvSchemaItem && ajvSchemaItem.format.match(/date/i))
        return 'Date';
    if (
        'pattern' in ajvSchemaItem &&
        ajvSchemaItem.pattern.match(/^\^\[0-9(a-f){1,2}\]\{24\}\$$/i)
    )
        return 'ObjectId';
    return 'String';
};

const _typeConvert = ajvSchemaItem => {
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
        default:
            return 'Mixed';
    }
};

const convert = (ajvSchema, required = [], parent = null) => {
    let props;
    try {
        props = ajvSchema.properties;
        if (!props) throw '';
    } catch (error) {
        throw new Error(
            'Please initialize module with a valid schema = {properties: {...} }'
        );
    }
    const req = [...(ajvSchema.required || []), ...required];

    const mooSchema = {};

    Object.keys(props).forEach(key => {
        const prop = props[key];
        // recursive if key has properties
        if ('properties' in prop) {
            mooSchema[key] = convert(prop, req, key);
            return;
        }
        const keyObj = {};
        keyObj.type = _typeConvert(prop);
        if (keyObj.type === 'Array' && prop.items && prop.items.type) {
            keyObj.type = Array(_typeConvert(prop.items));
        }
        if (req.includes((parent ? `${parent}.` : '') + key))
            keyObj.required = true;

        mooSchema[key] = keyObj;
    });

    return mooSchema;
};

module.exports = convert;
