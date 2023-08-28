const isPlainObj = value => !!value &&
    Object.getPrototypeOf(value) === Object.prototype;

module.exports = {
    isPlainObj
};
