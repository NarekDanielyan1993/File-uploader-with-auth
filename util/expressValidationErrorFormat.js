
const errorFormat = ({ location, msg, param, value, nestedErrors }) => {
    const errors = [];
    if(nestedErrors && nestedErrors.length > 0) {
        value = nestedErrors[0].value
    }
    errors.push({message: msg, value})
    
    return errors;
}

module.exports = errorFormat;