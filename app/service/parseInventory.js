'use strict';

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
            return $5;
        }
        getTableHead(options){
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
        dealRepeatHeadTable(options){
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
        mixinSpec(options,spec=0){
            var i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                let specArr = lines[0][spec].split(' ');
                if(specArr.length > 0);
            }
            i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                let lastSpec = lines[0][spec];
                let specArr = lastSpec.split('*');
                if(specArr[0] > specArr[1]){
                    lastSpec = `${specArr[1]}*${specArr[0]}`
                }
                lines.map((v)=>{
                    if(!v[spec]){
                        v[spec] = lastSpec;
                    }else{
                        lastSpec = v[spec];
                        specArr = lastSpec.split('*');
                        if(specArr[0] > specArr[1]){
                            lastSpec = `${specArr[1]}*${specArr[0]}`
                        }
                        v[spec] = lastSpec;
                    }
                })
                options[i].lines = lines;
            }
            return options;
        }
        mixinLand(options,column=1){
            var i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                let lastColumn = lines[0][column];
                lastColumn = (lastColumn - 0).toFixed(2);
                lines.map((v)=>{
                    if(!v[column]){
                        v[column] = lastColumn;
                    }else{
                        lastColumn = v[column];
                        lastColumn = (lastColumn - 0).toFixed(2);
                        v[column] = lastColumn;
                    }
                })
                options[i].lines = lines;
            }
            return options;
        }
        requireColumn(options,column){
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
                    newLines.push(line);
                })
                options[i].lines = newLines;
            }
            return options;
        }
    }
    return ParseInventory;
}