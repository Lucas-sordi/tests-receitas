// define que todas as requests serão feitas sobre a base_url
import supertest from 'supertest';
const request = supertest(process.env.BASE_URL);

// validação do jsonschema
const fs = require('fs');
const path = require("path");
const validate = require('jsonschema').validate;

function readSchema(schemaName) {
    const rawdata = fs.readFileSync(path.resolve(__dirname, `../fixtures/schemas/${schemaName}.json`));
    return JSON.parse(rawdata);
};

function validateSchema(res, schema) {
    const sch = readSchema(schema);
    const validation = validate(res, sch, {required: true, nestedErrors: true });
    let errors = '';
    
    if (validation.errors.length > 0) {
        errors += validation.errors.map(err => {
            return '\n' + err.message
        });
        throw new Error('SCHEMA VALIDATION ERROR: ' + errors)
    };
};

export { validateSchema, request };
