'use strict';
const xlsx = require('node-xlsx');

module.exports = app => {
    class Export extends app.Service {
        * order(options) {
            const data = [[1, 2, 3], [true, false, null, 'sheetjs'], ['foo', 'bar', new Date('2014-02-19T14:30Z'), '0.3'], ['baz', null, 'qux']];
            var buffer = xlsx.build([{name: "订单列表", data: data}])
            return buffer;
        }
    }
    return Export;
}