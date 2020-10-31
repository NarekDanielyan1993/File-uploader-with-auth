const isMobilePhoneNumber = (phoneNumber) => {
    const allowedNumberFormat = /^(0)(99|91|41|43|77|93|55|95|96)([0-9]){6}$/;
    if(phoneNumber.match(allowedNumberFormat)) {
        return true;
    }
    return false;
}

module.exports = isMobilePhoneNumber;