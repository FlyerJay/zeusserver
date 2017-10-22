<template lang="html">
  <bottom-wrap>
  </bottom-wrap>
</template>

<script>
  import bottomWrap from '../common/bottomwrap'
  import {
    updateForm
  } from '../../vuex/action'
  
  export default {
    components: {
      bottomWrap
    },
    vuex: {
      actions: {
        updateForm
      },
      getters: {
        userInfo: ({
            common
        }) => common.userInfo
      }
    },
    data() {
      return {
        topMenuData: [{
            url: '/manager/review',
            icon: 'icon-review',
            name: '下单审核'
          },
          {
            url: '/manager/member',
            icon: 'icon-member',
            name: '成员列表'
          },
          {
            url: '/manager/operate',
            icon: 'icon-history',
            name: '操作记录'
          }
        ]
      }
    },
    mounted: function() {
      if (this.userInfo.userRole) {
        this.topMenuData = [];
        if(parseInt(this.userInfo.userRole.charAt(7))) {
          const itemArr = [
            {
              url: '/manager/review',
              icon: 'icon-review',
              name: '下单审核'
            },
            {
              url: '/manager/operate',
              icon: 'icon-history',
              name: '操作记录'
            }
          ];
          this.topMenuData = this.topMenuData.concat(itemArr)
        }else{
          const itemArr = [
            {
              url: '/manager/review',
              icon: 'icon-review',
              name: '下单审核'
            },
            {
              url: '/manager/member',
              icon: 'icon-member',
              name: '成员列表'
            },
            {
              url: '/manager/operate',
              icon: 'icon-history',
              name: '操作记录'
            }
          ];
          this.topMenuData = this.topMenuData.concat(itemArr)
        }
      }
      this.updateForm('topMenuData', this.topMenuData);
    },
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.updateForm('mainRoute', to.path.split('/')[1])
      })
    }
  }
</script>

<style lang="less">
  
</style>
