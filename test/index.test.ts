import conv from '@/index.js';
import t from 'tap';

const ajvSchema = {
    properties: {
        _id: {
            type: 'string',
            pattern: '^[0-9a-fA-F]{24}$',
            example: '54d9f4fd1671547cb016a205'
        },
        name: { type: 'string', example: 'Emiliano' },
        age: { type: 'integer', example: 55 },
        weight: { type: 'number', example: 65.5 },
        accepted: { type: 'boolean', example: true },
        car: {
            properties: {
                id: { type: 'integer', example: 1 },
                model: { type: 'string', example: 'Ford' }
            }
        },
        birthday: {
            type: 'string',
            format: 'date-time',
            example: '2023-03-06T10:30:00.000+0000Z'
        },
        ts: { type: 'timestamp' },
        pets: { type: 'array', items: { type: 'string' } },
        custom_type: { type: 'custom_type' },
        file_content: { type: 'object', format: 'binary' }
    },
    required: ['name', 'car.id']
};

type MongooseSchema = {
    _id?: { type: string; required?: boolean };
    name?: { type: string; required?: boolean };
    age?: { type: string; required?: boolean };
    weight?: { type: string; required?: boolean };
    accepted?: { type: string; required?: boolean };
    car?: {
        id?: { type: string; required?: boolean };
        model?: { type: string; required?: boolean };
    };
    birthday?: { type: string; required?: boolean };
    ts?: { type: string; required?: boolean };
    pets?: { type: string[]; required?: boolean };
    custom_type?: { type: string; required?: boolean };
    file_content?: { type: string; required?: boolean };
};

const mooSchema: MongooseSchema = conv(ajvSchema);

t.test('Invalid parameters', async t => {
    // @ts-expect-error Invalid parameters
    t.throws(() => conv());
    // @ts-expect-error Invalid parameters
    t.throws(() => conv({ wrong_properties: {} }));
});

t.test('Standard type conversion', async t => {
    t.match(mooSchema.name, { type: 'String' }, 'string conversion');
    t.match(mooSchema.age, { type: 'Number' }, 'integer conversion');
    t.match(mooSchema.weight, { type: 'Number' }, 'number conversion');
    t.match(mooSchema.accepted, { type: 'Boolean' }, 'boolean conversion');
    t.match(mooSchema._id, { type: 'ObjectId' }, 'ObjectId conversion');
    t.match(mooSchema.ts, { type: 'Date' }, 'timestamp conversion');
    t.match(mooSchema.birthday, { type: 'Date' }, 'date conversion via format');
    t.match(mooSchema.pets, { type: ['String'] }, 'array conversion');
    t.match(mooSchema.custom_type, { type: 'Mixed' }, 'Custom type');
    t.match(
        mooSchema.file_content,
        { type: 'Buffer' },
        'Binary format conversion'
    );
});

t.test('Subdocuments', async t => {
    t.match(mooSchema.car?.id, { type: 'Number' }, 'Check subdocument');
    t.match(mooSchema.car?.model, { type: 'String' }, 'Check subdocument');
});

t.test('Required', async t => {
    t.same(
        mooSchema.name,
        { type: 'String', required: true },
        'required if required'
    );
    t.notHas(mooSchema.age, 'required', 'required not present if not required');
    t.same(
        mooSchema.car?.id,
        { type: 'Number', required: true },
        'required if required in subdocument'
    );
    t.notHas(
        mooSchema.car?.model,
        'required',
        'required not present if not required in subdocument'
    );
});

t.end();
