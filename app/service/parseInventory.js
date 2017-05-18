'use strict';

module.exports = app => {
    class ParseInventory extends app.Service {
        parseToLine(options){//把csv转换成行数据，并且去掉全部为空的行
            var i = 0;
            var result = [];
            var lines = [];
            var removeArr = [];
            for(;i < options.length;i++){
                var res = {};
                res.name = options[i].name;
                options[i].content = options[i].content.replace(/[0-9]\n/g,function(w){
                    return w.substring(0,1) + ' ';
                });//匹配数字后的换行
                options[i].content = options[i].content.replace(/( \n)|(\s\n)|(\n )|(\n\s)|(\n{2,}|(\r\n))/g,' ');//匹配所有换行的其他情况
                // options[i].content = options[i].content.replace(/\s\n/g,' ');//匹配空格后的换行
                // options[i].content = options[i].content.replace(/\n /g,' ');//匹配换行后空格
                // options[i].content = options[i].content.replace(/\n\s/g,' ');//匹配换行后空格
                // options[i].content = options[i].content.replace(/\n{2,}/g,' ');//匹配连续换行多次
                options[i].content = options[i].content.replace(/\"/g,' ');
                res.lines = options[i].content.split('\n');
                res.lineLength = (res.lines[0]+'').split(',').length;
                res.lineAmount = res.lines.length
                for(var j = res.lineAmount-1;j>0;j--){//去掉空行干扰项
                    if(res.lines[j].length <= res.lineLength){
                        res.lines.splice(j,1);
                    }
                }
                result.push(res)
            }
            return result;
        }
    }
    return ParseInventory;
}