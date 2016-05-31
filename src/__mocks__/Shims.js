if (
    typeof registerDynamicValueClass === 'undefined' ||
    typeof InputField === 'undefined' ||
    typeof DynamicValueInput === 'undefined'
) {
    let mocks = require('./PawMocks.js')
    module.exports = {
        registerDynamicValueClass: mocks.registerImporter,
        InputField: mocks.DynamicValue,
        DynamicValueInput: mocks.DynamicString
    }
}
else {
    /* eslint-disable no-undef */
    module.exports = {
        registerDynamicValueClass: registerDynamicValueClass,
        InputField: InputField,
        DynamicValueInput: DynamicValueInput
    }
    /* eslint-enable no-undef */
}
