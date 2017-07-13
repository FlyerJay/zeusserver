<template>
    <div class="line-chart">

    </div>
</template>
<style lang="less">
    .line-chart{
        height:600px;
        width:800px;
    }
</style>
<script>
    import echarts from 'echarts';

    export default {
        data () {
            return {
                option:{
                    tooltip: {
                        trigger: 'axis'
                    },
                    legend: {
                        data:[]
                    },
                    toolbox: {
                        show: true,
                        feature: {
                            dataZoom: {
                                yAxisIndex: 'none'
                            },
                            dataView: {readOnly: false},
                            magicType: {type: ['line', 'bar']},
                            restore: {},
                            saveAsImage: {}
                        }
                    },
                    xAxis:  {
                        type: 'category',
                        boundaryGap: false,
                    },
                    yAxis: {
                        type: 'value',
                        min: 'dataMin',
                        max: 'dataMax',
                    },
                    series: [
                        {
                            name:'',
                            type:'line',
                            data:[],
                        }
                    ]
                },
                myChart:null,
            }
        },
        mounted(){
            this.myChart = echarts.init(this.$el);
            this.myChart.setOption(this.option);
        },
        methods:{
            setOption(option){
                this.option = option;
                console.log(this.option);
                this.myChart.setOption(this.option);
            }
        }
    }
</script>