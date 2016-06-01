if (
    typeof registerDynamicValueClass === 'undefined' ||
    typeof InputField === 'undefined'
) {
    let mocks = require('./PawMocks.js')
    module.exports = {
        registerDynamicValueClass: mocks.registerDynamicValueClass,
        InputField: mocks.InputField
    }
}
else {
    /* eslint-disable no-undef */
    module.exports = {
        registerDynamicValueClass: registerDynamicValueClass,
        InputField: InputField
    }
    /* eslint-enable no-undef */
}
