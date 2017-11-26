<template>
    <div class="slide" v-show="items.length > 0">
        <div class="slide-wapper">
            <transition>
                <div class="slide-item" v-for="item,index in items" key="index" v-if="index == active">
                    <span class="message">{{item.message}}</span>
                    <span class="date">{{item.createTime | dateFormate}}</span>
                </div>
            </transition>
        </div>
    </div>
</template>
<style  lang="less" scoped>
    .slide{
        overflow: hidden;
        position: relative;
        display: inline-block;
        line-height: 36px;
        height: 36px;
        padding: 0px 20px;
        background-color: #f7f7f7;
        font-size: 14px;
        font-weight: bold;
        color: #13CE66;
        .slide-wapper{
            width: 100%;
            height: 100%;
            .slide-item{
                .message{
                    margin-right: 20px;
                }
            }
        }
    }
</style>
<script>
    export default {
        data () {
            return {
                active: 0,
                timer: '',
            }
        },
        props: {
            items: Array,
            default: [],
        },
        methods:{
            autoPlay() {
                this.timer = setInterval(()=>{
                    this.active >= this.items.length - 1 ? this.active = 0 : this.active ++ ; 
                },10000)
                
            }
        },
        created() {
            this.autoPlay();
        },
        destroyed() {
            clearInterval(this.timer);
        },
        filters:{
            dateFormate(val) {
                return new Date(val - 0).formatDate('yyyy-MM-dd hh:mm');
            }
        }
    }
</script>