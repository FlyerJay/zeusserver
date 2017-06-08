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
        * LC(options,query) {//连创处理程序
            const parseInventory = this.ctx.service.parseInventory;
            var $1 = parseInventory.getTableHead(options,['件数']);
            var $2 = this.lcHeadRevise($1);
            var $3 = parseInventory.dealRepeatHeadTable($2);
            var $4 = this.separateSpecAndPer($3);
            var $5 = parseInventory.mixinSpec($4);
            var $6 = parseInventory.mixinLand($5);
            var $7 = parseInventory.requireColumn($6,['规格','壁厚','长度','件数','支/件']);//从表格中取出需要保留的列，其他列都删除掉
            var $8 = parseInventory.mergeSpecAndLand($7);
            var $9 = parseInventory.mergeData($8);
            var $10 = this.lcRemoveOrder($9);
            return $10;
        }
        * DZ(options,query) {//友发德众处理程序
            const parseInventory = this.ctx.service.parseInventory;
            var $1 = parseInventory.getTableHead(options);
            var $2 = parseInventory.dealRepeatHeadTable($1);
            var $3 = this.separateSpecAndPer($2);
            var $4 = parseInventory.mixinSpec($3);
            var $5 = parseInventory.mixinLand($4);
            var $6 = parseInventory.requireColumn($5,['规格','壁厚','长度','件数','支/件']);//从表格中取出需要保留的列，其他列都删除掉
            var $7 = parseInventory.mergeSpecAndLand($6);
            var $8 = parseInventory.mergeData($7);
            return $8; 
        }
        * ZD(options,query) {
            const parseInventory = this.ctx.service.parseInventory;
            var $1 = parseInventory.getTableHead(options,['规格','件数']);
            var $2 = parseInventory.dealRepeatHeadTable($1);
            var $3 = this.headTrim($2);
            var $4 = this.zdRemoveUnuseLine($3);
            var $5 = this.xqSeparate($4);
            var $6 = this.zdAdditionPer($5);
            var $7 = parseInventory.mixinSpec($6);
            var $8 = parseInventory.mixinLand($7,3);
            var $9 = parseInventory.requireColumn($8,['规格','壁厚','长度','件数','支/件']);//从表格中取出需要保留的列，其他列都删除掉
            var $10 = parseInventory.mergeSpecAndLand($9);
            var $11 = parseInventory.mergeData($10);
            return $11;
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
            return $3;
        }
        xtyPreDeal(options) {//拓源预处理
            var i = 0;
            for(;i<options.length;i++){
                var lines = options[i].lines;
                var newLine = [];
                lines.map((v) => {
                    if(v[0].indexOf('钢') == -1)
                        newLine.push(v);
                })
                newLine.map((v) => {
                    v.splice(0,1);
                    v[0] = v[0].replace(/[\u4e00-\u9fa5]/g,'');
                    v[0] = v[0].replace(/[xX]/g,'*');
                })
                options[i].head.splice(0,1);
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
        zdAdditionPer(options){
            var i = 0;
            for(;i<options.length;i++){
                let lines = options[i].lines;
                lines.map((v)=>{
                    v.push('0');
                })
                options[i].head.push('支/件');
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
                var lines = options[i].lines;
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
    }
    return youfa;
}