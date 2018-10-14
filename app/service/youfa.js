'use strict';

module.exports = app => {
    class youfa extends app.Service {
        * YF(options,query) {//邯郸友发处理程序
            const parseInventory = this.ctx.service.parseInventory;
            var $1 = parseInventory.getTableHead(options,['规格/壁厚']);
            var $2 = parseInventory.dealRepeatHeadTable($1);
            var $3 = this.separateSpecAndPerAndLong($2);
            var $4 = parseInventory.mixinSpec($3);
            var $5 = parseInventory.mixinLand($4);
            var $6 = parseInventory.mergeSpecAndLand($5);
            var $7 = parseInventory.mergeData($6);
            
            return $7;
        }
        * XQ(options,query){//兴强处理程序
            const parseInventory = this.ctx.service.parseInventory;
            var $1 = parseInventory.getTableHead(options,['规格','支/件']);
            var $2 = parseInventory.dealRepeatHeadTable($1);
            var $3 = this.dealMutipleHead($2);
            var $4 = parseInventory.requireColumn($3,['规格','件数','支/件']);//从表格中取出需要保留的列，其他列都删除掉
            var $5 = this.xqSeparate($4);
            var $6 = parseInventory.mixinSpec($5);
            var $7 = parseInventory.mixinLand($6,3);
            var $8 = parseInventory.requireColumn($7,['规格','壁厚','长度','件数','支/件']);//从表格中取出需要保留的列，其他列都删除掉
            var $9 = parseInventory.mergeSpecAndLand($8);
            var $10 = parseInventory.mergeData($9);
            return $10;
        }
        * LC(options,query) {//连创黑管处理程序
            const parseInventory = this.ctx.service.parseInventory;
            // 找到表头
            var $1 = parseInventory.getTableHead(options,['件数']);
            // 表头修正
            var $2 = this.lcHeadRevise($1);
            // 处理重复表头
            var $3 = parseInventory.dealRepeatHeadTable($2);
            // 分离规格
            // var $4 = this.separateSpecAndPer($3);
            // 继承规格
            var $5 = parseInventory.mixinSpec($3);
            // 继承壁厚
            var $6 = parseInventory.mixinLand($5);
            // 选取有用的列
            var $7 = parseInventory.requireColumn($6,['规格','壁厚','件数','支/件']);//从表格中取出需要保留的列，其他列都删除掉
            // 合并规格和壁厚
            var $8 = parseInventory.mergeSpecAndLand($7);
            // 连创黑管单独添加长度
            var $9 = this.lcHGaddLong($8);
            // 合并全部数据
            var $10 = parseInventory.mergeData($9);
            // 找到重复规格并合并件数数据
            var $11 = this.lcRemoveOrder($10);
            return $11;
        }
        * LCRDX(options) { //连创热镀锌特殊处理
            const parseInventory = this.ctx.service.parseInventory;
            // 找到表头
            var $1 = parseInventory.getTableHead(options,['件数']);
            // 表头修正
            var $2 = this.lcHeadRevise($1);
            // 处理重复表头
            var $3 = parseInventory.dealRepeatHeadTable($2);
            // 选取有用的列
            var $4 = parseInventory.requireColumn($3,['规格','件数','支/件']);//从表格中取出需要保留的列，其他列都删除掉
            // 连创黑管单独添加长度
            var $5 = this.lcHGaddLong($4);
            // 分离规格
            var $6 = this.separateSpec($5);
            // 选取有用的列
            var $7 = parseInventory.requireColumn($6,['规格','壁厚','长度','件数','支/件']);
            // 继承规格
            var $8 = parseInventory.mixinSpec($7);
            // 继承壁厚
            var $9 = parseInventory.mixinLand($8);
            // 合并规格和壁厚
            var $10 = parseInventory.mergeSpecAndLand($9);
            // 合并全部数据
            var $11 = parseInventory.mergeData($10);
            // 找到重复规格并合并件数数据
            var $12 = this.lcRemoveOrder($11);
            return $12;
        }
        * DZ(options,query) {//友发德众处理程序
            const parseInventory = this.ctx.service.parseInventory;
            var $1 = parseInventory.getTableHead(options);
            if(!$1){
                $1 = this.dzSpecial(options);
                var $$2 = parseInventory.mixinSpec($1,1);
                var $$3 = parseInventory.mixinLand($$2,3);
                var $$4 = parseInventory.requireColumn($$3,['规格','壁厚','长度','件数','支/件']);
                var $$5 = parseInventory.mergeSpecAndLand($$4);
                var $$6 = parseInventory.mergeData($$5);
                var $$7 = parseInventory.mergeInventory($$6)
                return $$6;
            }
            var $2 = parseInventory.dealRepeatHeadTable($1);
            var $3 = this.separateSpecAndPer($2);
            var $4 = parseInventory.mixinSpec($3);
            var $5 = parseInventory.mixinLand($4);
            var $6 = parseInventory.requireColumn($5,['规格','壁厚','长度','件数','支/件']);//从表格中取出需要保留的列，其他列都删除掉
            var $7 = parseInventory.mergeSpecAndLand($6);
            var $8 = parseInventory.mergeData($7);
            return $8; 
        }
        * ZD(options,query) {//邯郸正大
            const parseInventory = this.ctx.service.parseInventory;
            var $1 = parseInventory.getTableHead(options,['规格','件数']);
            var $2 = parseInventory.dealRepeatHeadTable($1);
            var $3 = this.headTrim($2);
            var $4 = this.zdRemoveUnuseLine($3);
            var $5 = this.zdSperate($4);
            var $6 = parseInventory.mixinSpec($5);
            var $7 = parseInventory.mixinLand($6);
            var $8 = parseInventory.requireColumn($7,['规格','壁厚','长度','件数','支/件']);//从表格中取出需要保留的列，其他列都删除掉
            var $9 = parseInventory.mergeSpecAndLand($8);
            var $10 = parseInventory.mergeData($9);
            return $10;
        }
        * TY(options,query) {//天一
            const parseInventory = this.ctx.service.parseInventory;
            var $1 = parseInventory.getTableHead(options,['壁厚','件数']);
            var $2 = parseInventory.dealRepeatHeadTable($1);
            var $3 = this.separateSpecAndPer($2);
            var $4 = parseInventory.mixinSpec($3);
            var $5 = parseInventory.mixinLand($4);
            var $6 = this.tyHeadDeal($5);
            var $7 = parseInventory.requireColumn($6,['规格','壁厚','长度','件数','支/件']);//从表格中取出需要保留的列，其他列都删除掉
            var $8 = parseInventory.mergeSpecAndLand($7);
            var $9 = parseInventory.mergeData($8);
            return $9;
        }
        * XD(options,query) {
            const parseInventory = this.ctx.service.parseInventory;
            var $1 = parseInventory.getTableHead(options,['壁厚','件数']);
            var $2 = parseInventory.dealRepeatHeadTable($1);
            var $3 = this.xdSeparate($2);
            var $4 = parseInventory.mixinSpec($3);
            var $5 = parseInventory.mixinLand($4);
            var $6 = parseInventory.requireColumn($5,['规格','壁厚','长度','件数','支/件']);//从表格中取出需要保留的列，其他列都删除掉
            var $7 = parseInventory.mergeSpecAndLand($6);
            var $8 = parseInventory.mergeData($7);
            return $8;
        }
        * XTY(options,query) {//拓源
            const parseInventory = this.ctx.service.parseInventory;
            var $1 = parseInventory.getTableHead(options,['包装数量','整件']);
            var $2 = parseInventory.dealRepeatHeadTable($1);
            var $3 = this.xtyPreDeal($2);
            var $4 = this.separateSpecAndPer($3);
            var $5 = parseInventory.mixinSpec($4);
            var $6 = parseInventory.mixinLand($5);
            var $7 = parseInventory.requireColumn($6,['规格','壁厚','长度','整件','包装数量']);//从表格中取出需要保留的列，其他列都删除掉
            var $8 = parseInventory.mergeSpecAndLand($7);
            var $9 = parseInventory.mergeData($8);
            return $9;
        }
        * DT(options,query) {//德天
            const parseInventory = this.ctx.service.parseInventory;
            var $1 = parseInventory.getTableHead(options,['规格','壁厚']);
            var $2 = parseInventory.dealRepeatHeadTable($1);
            var $3 = parseInventory.mixinSpec($2);
            var $4 = parseInventory.mixinLand($3);
            var $5 = parseInventory.requireColumn($4,['规格','壁厚','德天库','支/件']);//从表格中取出需要保留的列，其他列都删除掉
            var $6 = this.dtInsertLong($5);
            var $7 = parseInventory.mergeSpecAndLand($6);
            var $8 = parseInventory.mergeData($7);
            return $8;
        }
        * ZT(options,query) {//中通
            const parseInventory = this.ctx.service.parseInventory;
            var $1 = parseInventory.getTableHead(options,['规格','壁厚']);
            var $2 = parseInventory.dealRepeatHeadTable($1);
            var $3 = parseInventory.mixinSpec($2);
            var $4 = parseInventory.mixinLand($3);
            var $5 = this.ztLongDeal($4);
            var $6 = parseInventory.requireColumn($5,['规格','壁厚','长度','件数','支/件']);//从表格中取出需要保留的列，其他列都删除掉
            var $7 = parseInventory.mergeSpecAndLand($6);
            var $8 = parseInventory.mergeData($7);
            return $8;
        }
        * JY(options,query) {//津瑜
            const parseInventory = this.ctx.service.parseInventory;
            var $1 = parseInventory.getTableHead(options,['规格','壁厚']);
            var $2 = parseInventory.dealRepeatHeadTable($1);
            var $3 = this.jySpec($2);
            var $4 = parseInventory.mixinSpec($3);
            var $5 = parseInventory.mixinLand($4);
            var $6 = parseInventory.requireColumn($5,['规格','壁厚','长度','件数','大小包装']);//从表格中取出需要保留的列，其他列都删除掉
            var $7 = parseInventory.mergeSpecAndLand($6);
            var $8 = parseInventory.mergeData($7);
            return $8;
        }
        * RX(options,query) {//荣祥
            const parseInventory = this.ctx.service.parseInventory;
            var $1 = parseInventory.getTableHead(options,['库存件数']);
            var $2 = parseInventory.dealRepeatHeadTable($1);
            var $3 = this.rxDeal($2);
            var $4 = parseInventory.mixinSpec($3);
            var $5 = parseInventory.mixinLand($4);
            var $6 = parseInventory.requireColumn($5,['规格','壁厚','长度','件数','支/件']);//从表格中取出需要保留的列，其他列都删除掉
            var $7 = parseInventory.mergeSpecAndLand($6);
            var $8 = parseInventory.mergeData($7);
            return $8;
        }
        * TEMP(options,query) {//临时表
            const parseInventory = this.ctx.service.parseInventory;
            var $1 = parseInventory.getTableHead(options,['规格','壁厚']);
            var $2 = parseInventory.dealRepeatHeadTable($1);
            var $3 = parseInventory.mixinSpec($2);
            var $4 = parseInventory.mixinLand($3);
            var $5 = parseInventory.requireColumn($4,['规格','壁厚','长度','件数','支/件']);//从表格中取出需要保留的列，其他列都删除掉
            var $6 = parseInventory.mergeSpecAndLand($5);
            var $7 = parseInventory.mergeData($6);
            return $7;
        }
        dzSpecial(options){//德众黑管的特殊处理逻辑
            var i = 0;
            for(;i < options.length;i++){//把有用的信息的头部拼成'规格,规格,件数,支数'的形式，下面直接在每行中筛选这些信息;
                var lineArr = options[i].lines[1].split(',')
                lineArr.map((v,i) => {
                    lineArr[i] = v = v.replace(/\./,'');
                    lineArr[i] = v = v.replace(/.*规.*/,'规格');
                    lineArr[i] = v = v.replace(/.*件.*/,'件数');
                    lineArr[i] = v = v.replace(/.*支.*/,'支数');
                    lineArr[i] = v = v.replace(/.*备.*/,'备注');
                    lineArr[i] = v = v.replace(/.*壁.*/,'规格');
                    lineArr[i] = v = v.replace(/^$/,'规格');
                })
                options[i].lines[1] = lineArr.join(',');
                options[i].lines = options[i].lines.slice(1);
            }
            i = 0;
            for(;i < options.length;i++){
                options[i].lines.map((v,j) => {//把每行的字符串都切割成数组
                    options[i].lines[j] = v = v.split(',');
                })
                //在表头数组中寻找'规格,规格,件数,支数'并使用mark标记其位置
                var head =  options[i].lines[0];
                var mark = [];
                head.map((v,j) => {
                    if(v == '规格' && head[j+1] == '规格' && head[j+2] == '件数' && head[j+3] == '支数'){
                        mark.push(j);
                    }
                });
                //重新设置表头，支数其实是没用的数据，刚才为了确保匹配不出错，把支数加上排除干扰项了。
                options[i].head = ['支/件','规格','件数','壁厚','长度'];
                options[i].lines = options[i].lines.slice(1);
                var newLine = [];
                var newLine1 = [];
                var newLine2 = [];
                //这里假设了数据最多为3组;
                //按照表头把列表的数据取出，如果mark有多个则拆分该行
                options[i].lines.map( v => {
                    mark.map((m,index) =>{
                        if(index == 0){
                            newLine.push(v.slice(m,m + 3));
                        }else if(index == 1){
                            newLine1.push(v.slice(m,m + 3));
                        }else if(index == 2){
                            newLine2.push(v.slice(m,m + 3));
                        }
                    })
                })
                options[i].lines = newLine.slice().concat(newLine1.slice().concat(newLine2.slice()));//这里使用深拷贝，因为newLine后面还要继续用
                var preAmount = 0;
                newLine = [];
                options[i].lines.map( v => {//从v[0]中取出支/件，其结构为[(（] 16 支[/件] [）)]
                    v[0] ? v[0].replace(/.*[(（]\s*(\d+).*[)）]/,(v1,amount)=>{
                        v[0] = preAmount = amount;
                    }) : v[0] = preAmount;
                    v[1] = v[1].replace(/[xX]/g,'*');
                    /\d+.*\*\d+.*\*\d+.*\*\d+.*/.test(v[1]) ? newLine.push(v) : '';
                })
                newLine.map(v => {//从规格中分离出壁厚和长度，并剔除脏数据
                    const specArr = v[1].split('*');
                    v[1] = `${specArr[0]}*${specArr[1]}`;
                    specArr[2] ? v.push(specArr[2]) : v.push('1.00');
                    specArr[3] ? v.push(specArr[3]) : v.push('6');
                    v[2] = v[2].replace(/\s/g,'');
                    v[0] = isNaN(Number(v[0])) ? 0 : v[0];
                })
                options[i].lines = newLine;
            }
            return options;
        }
        rxDeal(options){
            var i = 0;
            for(;i<options.length;i++){
                var lines = options[i].lines;
                var newLine = [];
                var specLast = '';
                var longLast = '';
                lines.map(v => {
                    if(/\*/.test(v[0])){
                        var specArr = v[0].split('*'); 
                        specLast = `${specArr[0]}*${specArr[1]}`;
                        longLast = `${specArr[3]}`;
                    }else{
                        v.splice(0,0,specLast);
                        v.splice(2,0,longLast);
                        newLine.push(v);
                    }
                });
                options[i].head.splice(0,0,'规格');
                options[i].head.splice(2,0,'长度');
                options[i].head[1] = '壁厚';
                options[i].head[3] = '件数';
                options[i].head[4] = '支/件';
                newLine.map(v => {
                    if(/\//.test(v[3])){
                        v[3].replace(/(\d*)\/(\d*)/,(v1,v2,v3) => {
                            v[3] = v2;
                            v[4] = v3;
                        })
                    }
                })
                options[i].lines = newLine;
            }
            return options;
        }
        jySpec(options) {
            var i = 0;
            for(;i<options.length;i++){
                var lines = options[i].lines;
                lines.map(v => {
                    v[0] = v[0].replace(/[xX]/g,'*');
                    const landArr = v[1].split('*');
                    v[1] = landArr[0];
                    landArr[1] ? v.push(landArr[1]) : v.push('6');
                })
                options[i].head.push('长度');
            }
            return options;
        }
        ztLongDeal(options) {//中通处理长度
            var i = 0;
            for(;i<options.length;i++){
                var lines = options[i].lines;
                lines.map(v => {
                    v[3] = v[3].replace(/\s.*/g,'');//先处理掉某些特殊字符
                })
                lines.map(v => {
                    if(/\d*m{0,1}\/\d*m{0,1}/.test(v[3])){
                        v[3].replace(/(\d*)m{0,1}\/(\d*)m{0,1}/g,(v1,v2,v3) => {
                            v[3] = v3;
                            v[4] = v2;
                        })
                    }else{
                        v[4] = '6';
                    }
                })
                options[i].head[4] = '长度';
            }
            return options;
        }
        dtInsertLong(options){//德天插入长度
            var i = 0;
            for(;i<options.length;i++){
                var lines = options[i].lines;
                lines.map((v) => {
                    v.splice(2,0,'6');
                })
                options[i].head.splice(2,0,'长度');
            }
            return options;
        }
        xtyPreDeal(options) {//拓源预处理
            var i = 0;
            for(;i<options.length;i++){
                var lines = options[i].lines;
                var newLine = [];
                lines.map((v) => {
                    if(v[0].indexOf('钢') == -1 && v[0].indexOf('焊管') == -1 && v[0])
                        newLine.push(v);
                })
                newLine.map((v) => {
                    v.splice(0,1);
                    v[0] = v[0].replace(/[\u4e00-\u9fa5]/g,'');
                    v[0] = v[0].replace(/[xX]/g,'*');
                })
                newLine.map((v) => {
                    const specArr = v[0].split('*');
                    v[0] = `${specArr[0]}*${specArr[1]}`;
                    v.splice(1,0,specArr[2]);
                })
                options[i].head.splice(0,1);
                options[i].head[0] = '规格';
                options[i].head.splice(1,0,'壁厚');
                options[i].lines = newLine;
            }
            return options;
        }
        xdSeparate(options) {
            var i = 0;
            for(;i<options.length;i++){
                var lines = options[i].lines;
                let per = '';
                lines.map((v)=>{
                    if(v[0]){
                        per = '';
                    }
                    if(/[(（]*\d*支[)）]*/.test(v[0])){
                        v[0] = v[0].replace(/[(（]*\d*支[)）]*/g,(w)=>{
                            per = w.replace(/[^0-9]/ig,'');
                            v.push(per);
                            return ''
                        })
                    }else{
                        v.push(per?per:'0');//没有件数数据的默认给100
                    }
                    var landArr = v[1].split('*');
                    landArr.length > 1 ? v[1]=landArr[0] : '';
                    landArr[1] ? v.push(landArr[1].replace('米','')):v.push('6');
                })
                options[i].head.push('支/件','长度');
            }
            return options;
        }
        tyHeadDeal(options) {
            var i = 0;
            for(;i<options.length;i++){
                let head = options[i].head;
                head[0] = '规格';
            }
            return options;
        }
        zdSperate(options){
            var i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                let newLine = [];
                var spec = '';
                var per = 0;
                lines.map( v=> {
                    if(v[0].indexOf('*') > -1){
                        v[0].replace(/(\d*\*\d*)[(（](\d*).*[)）]/g,(v1,v2,v3)=>{
                            spec = v2;
                            per = v3;
                        })
                    }else{
                        v.splice(0,0,spec);
                        v.splice(3,0,per,'6');
                        newLine.push(v);
                    }
                })
                options[i].lines = newLine;
                options[i].head = ['规格','壁厚','件数','支/件','长度'];
            }
            return options;
        }
        zdRemoveUnuseLine(options){
            var i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                let newLine = [];
                lines.map((v)=>{
                    if(v[0]){
                        v[0] = v[0].replace(/[JF]/g,'');
                        newLine.push(v);
                    }
                })
                options[i].lines = newLine;
            }
            return options;
        }
        headTrim(options){
            var i = 0;
            for(;i<options.length;i++){
                let head = options[i].head;
                let newHead = [];
                head.map((v)=>{
                    v = v.trim();
                    newHead.push(v);
                })
                options[i].head = newHead;
            }
            return options;
        }
        xqSeparate(options){
            var i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                lines.map((v)=>{
                    let specArr = v[0].split('*');
                    specArr.length>2?v.push(specArr[2]):v.push('1.2');
                    specArr.length>3?v.push(specArr[3]):v.push('6');
                    v[0] = `${specArr[0]}*${specArr[1]}`;
                })
                options[i].head.push('壁厚','长度');
            }
            return options;
        }
        dealMutipleHead(options){
            var i = 0;
            for(;i<options.length;i++){
                let head = options[i].head;
                let firstLine = options[i].lines[0];
                let isMutiple = false;
                head.map((v)=>{
                    if(!v) isMutiple = true;
                })
                if(isMutiple){
                    firstLine.map((v,index)=>{
                        if(v){
                            head[index] = v;
                        }
                    })
                    options[i].lines = options[i].lines.slice(1);
                }
            }
            return options;
        }
        lcHeadRevise(options){
            var i = 0;
            for(;i<options.length;i++){
                let head = options[i].lines[0];
                let headArr = head.split(',');
                let newHeadArr = [];
                headArr.map((v)=>{
                    if(/\./.test(v)){
                        v = '规格'
                    }
                    if(!v){
                        v = '壁厚'
                    }
                    v = v.replace(/[(（].*[)）]/g,'');
                    newHeadArr.push(v);
                })
                options[i].lines[0] = newHeadArr.join(',');
            }
            return options;
        }
        lcRemoveOrder(options){//清楚规格中含有米的数据
            var i = 0;
            var line = options.line;
            var newLine = [];
            line.map((v)=>{
                if(v[0].indexOf('米') < 0){
                    newLine.push(v);
                }
            })
            options.line = newLine;
            return options;
        }
        separateSpecAndPer(options){/**分离规格和单件支数 */
            var i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                let per = '';
                lines.map((v)=>{
                    if(v[0]){
                        per = '';
                    }
                    v[1] = v[1].replace(/\/.*/,(w)=>{
                        console.log(w);
                        return '';
                    });
                    if(/[(（]*\d*[支]*\/件[)）]*/.test(v[0])){
                        v[0] = v[0].replace(/[(（]*\d*[支]*\/件[)）]*/g,(w)=>{
                            per = w.replace(/[^0-9]/ig,'');
                            v.push(per);
                            return ''
                        })
                    }else{
                        v.push(per?per:'0');//没有件数数据的默认给100
                    }
                    var landArr = v[1].split('*');
                    landArr.length > 1 ? v[1]=landArr[0] : '';
                    landArr[1] ? v.push(landArr[1]):v.push('6');
                })
                options[i].head.push('支/件','长度');
            }
            return options;
        }
        separateSpec(options) { // 分离规格壁厚
            var i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                let per = '';
                lines.map((v)=>{
                    let specArr = v[0].split('*');
                    if (specArr[2]) {
                        v.push(specArr[2])
                    } else {
                        v.push('');
                    }
                    v[0] = `${specArr[0]}*${specArr[1]}`;
                    return v;
                })
                options[i].head.push('壁厚');
            }
            return options;
        }
        separateSpecAndPerAndLong(options){/**分离规格和单支件数和长度 */
            var i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                let specAndper = lines[0][0];
                lines.map((v)=>{//把规格加到每一行的末尾，把奇葩的X|x替换成*,把前面加的F|J干掉
                    if(v[0].indexOf('X') > -1){
                        v[0] = v[0].replace(/X|x/g,'*');
                        v[0] = v[0].replace(/J|F/g,'');
                        specAndper = v[0]
                    }else{
                        v.push(specAndper);
                    }
                })
                let newLine = [];
                lines.map((v)=>{
                    if(v[0].indexOf('*') > -1 || !v[0] || !v[1]){

                    }else{
                        newLine.push(v);
                    }
                })
                options[i].lines = newLine;
                //先匹配最后一项有米的数据吧
                options[i].lines.map((v)=>{
                    if(/\*\d*米/.test(v[3])){
                        v[3] = v[3].replace(/\*\d*米/g,(w)=>{
                            let long = w.replace(/[^0-9]/ig,'');
                            v.push(long);
                            return ''
                        })
                    }else{
                        v.push('6');
                    }
                })
                //再匹配件/支
                options[i].lines.map((v)=>{
                    if(/[(（].*[)）]*/.test(v[3])){//后面的*号表示还有可能忘了加反括号，全角半角括号就算了，你他妈忘了加算怎么回事啊！
                        v[3] = v[3].replace(/[(（].*[)）]*/g,(w)=>{
                            let per = w.replace(/[^0-9]/ig,'');
                            v.push(per);
                            return ''
                        })
                    }else{
                        v.push('0');
                    }
                })
                options[i].lines.map((v)=>{//去掉第3列
                    v.splice(2,1);
                })
                options[i].lines.map((v)=>{//规格中还有坑，有可能有50*60*6这种情况
                    var specArr = v[2].split('*');
                    specArr.length > 2 ? v[3]=specArr[2] : '';
                    v[2] = `${specArr[0]}*${specArr[1]}`;
                })
                newLine = [];
                options[i].lines.map((v)=>{//交换元素位置
                    v = [v[2],v[0],v[3],v[1],v[4]];
                    newLine.push(v);
                })
                options[i].head = ['规格','壁厚','长度','件数','支/件'];
                options[i].lines = newLine;
            }
            return options;
        }
        lcHGaddLong(options) { // 连创黑管单独添加长度
            let i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                let head = options[i].head;
                head.splice(1, 0, '长度');
                let newLines = [];
                lines.map(v => {
                    if(v[0]) {
                        newLines.push(v);
                    }
                })
                newLines.map(v => {
                    return v.splice(1, 0, '6');
                });
                options[i].lines = newLines;
            }
            return options;
        }
    }
    return youfa;
}