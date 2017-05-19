'use strict';
const utils = require('../utils');

module.exports = app => {
    class ParseInventory extends app.Service {
        * XQ(options,query){
            const parseValue = this.ctx.service.parseValue;
            var $1 = parseValue.parseToLine(options);
            var $2 = this.getTableHead($1);//找到表格的开头部分，根据表头含有的关键字查找
            var $3 = this.dealRepeatHeadTable($2);//处理表头中含有重复表头的情况也就是一行中有多条有用的数据
            var $4 = this.mixinSpec($3);//拆分多个规格，并让规格为空的行继承上一行的规格
            var $5 = this.mixinLand($4);//拆分壁厚，并让空壁厚继承上一行的壁厚(壁厚这里会多一个区间处理)
            var $6 = this.requireColumn($5,['规格','壁厚','长度','件数','支/件']);//从表格中取出需要保留的列，其他列都删除掉
            var $7 = this.mergeSpecAndLand($6);
            var $8 = this.mergeData($7);
            return $8;
        }
        getTableHead(options){/*此方法主要是用来获取表格的头部信息，并初步判断表格头中是否有多列信息 */
            var i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                for(var j=0;j<lines.length;j++){
                    let elements = lines[j].split(',');
                    if(elements.indexOf('规格') > -1 && elements.indexOf('壁厚') > -1)
                        break;
                }
                lines = lines.slice(j);
                let head = lines[0];
                let headArr = head.split(',');
                j=0;
                let repeat = {};
                let isRepeat = false;
                for(;j<headArr.length;j++){
                    if(!repeat[headArr[j]]){
                        repeat[headArr[j]] = 1;
                    }else{
                        repeat[headArr[j]] ++;
                    }
                }
                let unRepeat = 0;
                for(var arr in repeat){
                    if(repeat[arr] > 1)
                        unRepeat --;
                    else
                        unRepeat ++;
                }
                if(unRepeat < 0){
                    isRepeat = true;
                }
                options[i].lines = lines;
                options[i].isRepeat = isRepeat;//判断是否有重复表头
            }
            return options;
        }
        dealRepeatHeadTable(options){/**此方法用来处理表格含有多列信息的情况，会把表头和表内容拆分成单列信息，如果不是多列信息就不做处理 */
            var i = 0;
            for(;i<options.length;i++){//寻找重复表头的长度
                let elements = options[i].lines[0].split(',');
                let head = elements[0];
                let isFirst = true;
                let $1BeatStart = 0;
                let $1BeatEnd = 0;//默认长度为0
                let $2BeatStart = 0;
                let $3BeatStart = 0;//假设表头最多重复3次
                let beat = 2;//假设最小重复长度为2
                if(!options[i].isRepeat){
                    continue;
                }
                for(;beat<elements.length;beat++){
                    if(isFirst && elements[beat] === head){
                        $2BeatStart = beat;
                        var unBeat = beat;
                        while(unBeat>0){
                            unBeat --;
                            if(elements[unBeat]) break;
                        }
                        $1BeatEnd = unBeat;
                        beat++;
                        isFirst = false;
                        continue;
                    }
                    if(!isFirst && elements[beat] === head){
                        $3BeatStart = beat;
                        break;
                    }
                }
                options[i].$1BeatStart = $1BeatStart;
                options[i].$2BeatStart = $2BeatStart;
                options[i].$3BeatStart = $3BeatStart;
                options[i].beat = $1BeatEnd+1;
            }
            i=0;
            for(;i<options.length;i++){
                let head =options[i].lines[0].split(',');
                let title = head.slice(0,options[i].beat);
                let elements = options[i].lines;
                let line = [];
                for(var j=1;j<elements.length;j++){
                    line.push(elements[j].split(',').slice(0,options[i].beat));
                }
                if(options[i].$2BeatStart){
                    for(var j=1;j<elements.length;j++){
                        line.push(elements[j].split(',').slice(options[i].$2BeatStart,options[i].beat+options[i].$2BeatStart));
                    }
                }
                if(options[i].$3BeatStart){
                    for(var j=1;j<elements.length;j++){
                        line.push(elements[j].split(',').slice(options[i].$3BeatStart,options[i].beat+options[i].$3BeatStart));
                    }
                }
                options[i].lines = line;
                options[i].head = title;
            }
            i=0;
            var result = [];
            for(;i<options.length;i++){
                let res = {};
                options[i].lines.map((v)=>{
                    v.length = options[i].head.length;
                })
                res.lines = options[i].lines;
                res.head = options[i].head;
                result.push(res);
            }
            return result;
        }
        mixinSpec(options,spec=0){/**处理一行中有多个规格的情况以及一行中没有规格的情况，并最终输出每行都有一个规格的数据*/
            var i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                let lastSpec = lines[0][spec];
                lines.map((v)=>{
                    if(!v[spec]){
                        v[spec] = lastSpec;
                    }else{
                        lastSpec = v[spec];
                    }
                })
                options[i].lines = lines;
            }
            i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                let newLines = [];
                lines.map((v)=>{
                    let lineSpec = v[spec];
                    let specArr = lineSpec.split(' ');
                    if(specArr.length > 1){
                        specArr.map((vi)=>{
                            newLines.push([vi].concat(v.slice(1)));
                        })
                    }else{
                        newLines.push(v);
                    }
                })
                options[i].lines = newLines;
            }
            i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                let newLine = [];
                lines.map((v)=>{
                    let specArr = v[spec].split('*');
                    let specLine = '';
                    if(Number(specArr[0]) > Number(specArr[1])){
                        specLine = `${specArr[1]}*${specArr[0]}`;
                        v[spec] = specLine;
                    }
                    if(v[spec].indexOf('*') > -1){
                        newLine.push(v);
                    }
                })
                options[i].lines = newLine;
            }
            return options;
        }
        mixinLand(options,column=1){/**处理一行中含有多个壁厚（一般是一个区间2.25-2.75）以及没有壁厚的情况，根据索引查到对应的几种壁厚，再拆分成多行 */
            var i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                lines.map((v)=>{
                    v[column] = v[column].replace(/(~)|(~~)|(--)/g,'-');
                    if(v[column].indexOf('-') > -1){
                        v[column] = utils.land[v[column]];
                    }
                })
                let lastLand = lines[0][column];
                lines.map((v)=>{
                    if(!v[column]){
                        v[column] = lastLand;
                    }else{
                        lastLand = v[column];
                    }
                })
                let newLines = [];
                lines.map((v)=>{
                    var lanArr = v[column].split(' ');
                    if(lanArr.length > 1){
                        lanArr.map((vi)=>{
                            let arr = v.slice(0,column)
                            newLines.push(arr.concat([vi].concat(v.slice(column+1))));
                        })
                    }else{
                        newLines.push(v);
                    }
                })
                options[i].lines = newLines;
                options[i].lines.map((v)=>{
                    v[column] = (v[column]-0).toFixed(2);
                })
            }
            return options;
        }
        requireColumn(options,column){/**从整理好的数据中取几列数据，并且这几列数据每行中不能有为空的情况，也就是说指定的列必须是有值得行才会被取出来 */
            var i = 0;
            for(;i<options.length;i++){
                let head = options[i].head;
                let freshIndex = [];
                options[i].ownColum = true;
                column.map((v)=>{
                    let index = head.indexOf(v);
                    if(index > -1){
                        freshIndex.push(index);
                    }else{
                        options[i].ownColum = false;
                    }
                })
                options[i].index = freshIndex;
            }
            i = 0;
            for(;i<options.length;i++){
                if(!options[i].ownColum) continue;
                let newLines = [];
                let lines = options[i].lines;
                let index = options[i].index;
                lines.map((v)=>{
                    let line = [];
                    index.map((vi)=>{
                        line.push(v[vi]);
                    })
                    let breakFlag = false;
                    v.map((vi)=>{
                        if(!vi){
                            breakFlag = true;
                        }
                    })
                    if(!breakFlag){
                        newLines.push(line);
                    }
                })
                options[i].lines = newLines;
                options[i].head = column;
            }
            return options;
        }
        mergeSpecAndLand(options){/**合并数据中的壁厚和规格，为导入数据做准备工作 */
            var i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                let head = options[i].head;
                let specIndex = head.indexOf('规格');
                let landIndex = head.indexOf('壁厚');
                if(specIndex > -1 && landIndex > -1){
                    lines.map((v)=>{
                        v[specIndex] = `${v[specIndex]}*${v[landIndex]}`;
                        v.splice(landIndex,1);
                    })
                }else{
                    continue;
                }
            }
            i = 0;
            for(;i<options.length;i++){
                let head = options[i].head;
                let landIndex = head.indexOf('壁厚');
                if(landIndex > -1){
                    options[i].head.splice(landIndex,1);
                }
            }
            return options;
        }
        separateSpecAndLong(options){/**拆分规格和长度，长度不作为关联项，只是作展示使用 */

        }
        mergeData(options){/**合并全部的数据 */
            var i = 0;
            var result = {};
            result.head = options[0].head;
            result.line = [];
            for(;i<options.length;i++){
                var lines = options[i].lines;
                lines.map((v)=>{
                    result.line.push(v);
                })
            }
            return result;
        }
    }
    return ParseInventory;
}