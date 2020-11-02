const isMobilePhoneNumber = (phoneNumber) => {
    const allowedNumberFormat = /^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/
    if (phoneNumber.match(allowedNumberFormat)) {
        return true
    }
    return false
}

module.exports = isMobilePhoneNumber
