
module.exports = function (currentPackage, services) {
    const log = services.getService("Log");
    log.write("hello!");
};
