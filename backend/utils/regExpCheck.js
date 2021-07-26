const regExpCheck = (str) => {
    const format = new RegExp(/[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g);
    return format.test(str);
}

module.exports = regExpCheck