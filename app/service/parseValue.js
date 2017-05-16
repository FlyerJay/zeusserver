'use strict';
const utils = require('../utils');

module.exports = app => {
    class ParseValue extends app.Service {
        parseLine(options){
            var i = 0;
            for(;i<options.length;i++){
                let line = options[i].line;
                let head = options[i].head;
                let index = [];
                let spec = false;
                let priceIndex = 0;
                for(var j=0;j<head.length;j++){
                    if(head[j].indexOf('价') >= 0) {
                        index[j] = 'price';
                        priceIndex = j;
                    }
                    if(head[j].indexOf('厚') >= 0) index[j] = 'land';
                    if(head[j].indexOf('方管') >= 0) index[j] = 'typeOne';
                    if(head[j].indexOf('矩管') >= 0) index[j] = 'typeTwo';
                    if(head[j].indexOf('规格') >= 0 && spec) {
                        index[j] = 'typeTwo'; 
                        //spec = false;
                    }
                    if(head[j].indexOf('规格') >= 0 && !spec) {
                        index[j] = 'typeOne'; 
                        spec = true;
                    }
                }
                options[i].lines = index;
                for(var j=line.length - 1;j >= 0;j--){//去除没有价格或者价格不是数字的无意义项
                    if(!line[j][priceIndex] || isNaN(line[j][priceIndex] - 0)){
                        options[i].line.splice(j,1);
                    }
                }
            }
        }
        findRealHead(options){
            var i = 0;
            var loop = true;
            for(;i<options.length;i++){
                var lines = options[i].lines;
                for(var j=0;j<lines.length;j++){
                    var elements = (lines[j]+'').split(',');
                    var first = utils.trim(elements[0]);
                    for(var k=1;k<elements.length;k++){
                        if(utils.trim(elements[k]) === first && utils.trim(elements[k])){
                            loop = false
                            break;
                        }
                        first = first ? first : utils.trim(elements[k]) ? utils.trim(elements[k]) : '';
                    }
                    if(!loop) {
                        options[i].lines.splice(0,j);
                        loop = true;
                        break;
                    };
                }
            }
            return options;
        }
        resetLine(options){
            var i = 0;
            var loop = true;
            for(;i<options.length;i++){//调整首行的数据;
                let elements = options[i].lines[0].split(',');
                for(var j=0;j<elements.length;j++){
                    elements[j] = elements[j].replace(/\s/g,'');//去掉其中的空格
                }
                options[i].lines[0] = elements.join(',');
            }
            i=0;
            for(;i<options.length;i++){//寻找表头中最长的重复节拍，以便重置表格
                let elements = options[i].lines[0].split(',');
                let head = elements[0];
                let isFirst = true;
                let $1BeatStart = 0;
                let $1BeatEnd = 0;//这就是节拍大小
                let $2BeatStart = 0;
                let $3BeatStart = 0;//假设最多3个节拍
                let beat = 2;//假设最小节拍大小为2;
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
                //判断多重表头的情况
                let isMultiple = false;
                for(var k=0;k<$1BeatEnd+1;k++){
                    if(!elements[k]){
                        isMultiple = true;
                    }
                }
                if(isMultiple){
                    //console.log(options[i].name,options[i].lines[1]);
                    for(var k=0;k<$1BeatEnd+1;k++){
                        let subLine = options[i].lines[1].split(',');
                        elements[k] = subLine[k] ? subLine[k] : elements[k];
                        //console.log(elements[k]);
                    }
                    options[i].lines.splice(1,1);
                    options[i].lines[0] = elements.join(',');
                }
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
                options[i].line = line;
                options[i].head = title;
            }
            return options;

        }
        removeEmptyLine(options){
            var i = 0;
            var result = [];
            var lines = [];
            var removeArr = [];
            for(;i < options.length;i++){
                var res = {};
                res.name = options[i].name;
                options[i].content = options[i].content.replace(/\r\n/g,' ');
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
        findFixedLine(options){
            var i = options.length - 1;
            for(;i >= 0;i--){
                let head = options[i].lines[0];
                let headArr = head.split(',');
                for(var j=0;j<headArr.length;j++){
                    headArr[j] = headArr[j].replace(/\s/g,'');
                }
                let typeIndex = headArr.indexOf('方管');
                let specIndex = headArr.indexOf('规格');
                if(typeIndex >-1 && specIndex > -1){
                    options[i].typeIndex = typeIndex;
                    options[i].specIndex = specIndex;
                }else{
                    options.splice(i,1);
                }
            }
            i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                for(var j=lines.length-1;j>=0;j--){
                    lines[j] = lines[j].replace(/\\/,' ');
                    lines[j] = lines[j].replace(/\r/g,' ');
                    lines[j] = lines[j].replace(/\n/g,' ');
                    lines[j] = lines[j].replace(/\"/g,' ');
                    lines[j] = lines[j].replace(/"/,' ');
                    let elements = lines[j].split(',');
                    elements = elements.splice(options[i].typeIndex,3);
                    options[i].lines[j] = elements;
                    lines[j] = elements;
                    if(lines[j].length < 3 || !lines[j][2]){
                        lines.splice(j,1);
                    }
                }
                options[i].lines = lines;
            }
            return options;
        }
        removeUnuseTable(options){
            var i = options.length - 1;
            for(;i>=0;i--){
                if(options[i].name.indexOf('到位价') > -1){
                    options.splice(i,1);
                }
            }
            i = 0;
            for(;i<options.length;i++){
                var lines = options[i].lines;
                for(var j=0;j<lines.length;j++){
                    let elements = lines[j].split(',');
                    if(elements.indexOf('方管') > -1 && elements.indexOf('矩管') > -1){
                        lines.splice(0,j);
                        break;
                    }
                }
                for(var j=lines.length-1;j>=0;j--){
                    if(lines[j].indexOf('较昨日涨跌幅') > -1 || lines[j].indexOf('价格政策') > -1){
                        lines.splice(j,1);
                    }
                }
                options[i].lines = lines;
                options[i].head = options[i].lines[0];
                options[i].lines.splice(0,1);
                options[i].lineAmount = options[i].lines.length;
                let headArr = options[i].head.split(',');
                j = headArr.length - 1;
                for(;j>=0;j--){
                    if(!headArr[j])
                        headArr.splice(j,1);
                }
                options[i].lineLength = headArr.length;
                j=0;
                for(;j<options[i].lineAmount;j++){
                    options[i].lines[j] = options[i].lines[j].split(',');
                    options[i].lines[j].length = options[i].lineLength;
                }
                options[i].head = headArr;
            }
            return options;
        }
    }
    return ParseValue;
}