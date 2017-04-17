const fs = require('fs');

module.exports = app => {
    class Upload extends app.Service {
        * upload() {
            return {
                status:200,
            }
        }
    }
    return Upload;
}