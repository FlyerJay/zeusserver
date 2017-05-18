'use strict';

module.exports = app => {
    class ParseInventory extends app.Service {
        * XQ(options,query){
            const parseValue = this.ctx.service.parseValue;
            return parseValue.parseToLine(options);
        }
    }
    return ParseInventory;
}