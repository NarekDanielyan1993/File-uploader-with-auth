const errorFormat = ({ location, msg, param, value, nestedErrors }) => {
    const errors = []
    if (nestedErrors && nestedErrors.length > 0) {
        let seen = new Set()
        const isHasSameProperty = nestedErrors.some((obj) => {
            return seen.size === seen.add(obj.param).size
        })
        if (isHasSameProperty) {
            value = nestedErrors[0].value
            return { message: msg, value: value }
        }
        if (!isHasSameProperty) {
            for (let obj of nestedErrors) {
                return { message: obj.message, value: obj.value }
            }
        }
    } else {
        return { message: msg, value }
    }

    return errors
}

module.exports = errorFormat
