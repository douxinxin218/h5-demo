<template>
  <div>
    <MyVantTable
      ref="table"
      :columns-list="columnsList"
      :table-data="tableData"
      border
      :height="600"
      :load="load"
      @sortChange="sortChange"
    ></MyVantTable>
  </div>
</template>

<script>
import MyVantTable from './MyVantTable.vue';
export default {
  components: { MyVantTable },
  data() {
    return {
      tableData: [
        { 'name': '赵伟', 'tel': '156*****1987', 'hobby': '钢琴、书法、唱歌', 'address': '上海市黄浦区金陵东路569号17楼', hasChildren: true
        },
        { 'name': '李伟11', 'tel': '182*****1538', 'hobby': '钢琴、书法、唱歌', 'address': '上海市奉贤区南桥镇立新路12号2楼' },
        { 'name': '李伟11', 'tel': '161*****0097', 'hobby': '钢琴、书法、唱歌', 'address': '上海市崇明县城桥镇八一路739号' },
        { 'name': '周伟', 'tel': '197*****1123', 'hobby': '钢琴、书法、唱歌', 'address': '上海市青浦区青浦镇章浜路24号' },
        { 'name': '吴伟', 'tel': '183*****6678', 'hobby': '钢琴、书法、唱歌', 'address': '上海市松江区乐都西路867-871号' },
        { 'name': '李伟', 'tel': '182*****1538', 'hobby': '钢琴、书法、唱歌', 'address': '上海市奉贤区南桥镇立新路12号2楼' },
        { 'name': '孙伟', 'tel': '161*****0097', 'hobby': '钢琴、书法、唱歌', 'address': '上海市崇明县城桥镇八一路739号' },
        { 'name': '周伟', 'tel': '197*****1123', 'hobby': '钢琴、书法、唱歌', 'address': '上海市青浦区青浦镇章浜路24号' },
        { 'name': '吴伟', 'tel': '183*****6678', 'hobby': '钢琴、书法、唱歌', 'address': '上海市松江区乐都西路867-871号' }
      ],
      columnsList:
          [
            { field: 'name', title: '姓名', width: 100, titleAlign: 'center', columnAlign: 'center', orderBy: 'default', fixed: true, cellMerge: true },
            { field: 'tel', title: '手机号码', titleAlign: 'center', columnAlign: 'center', orderBy: 'default' },
            { field: 'hobby', title: '爱好', titleAlign: 'center', columnAlign: 'center' },
            { field: 'address', title: '地址', titleAlign: 'center' }
          ]

    };
  },
  beforeMount() {
  },
  methods: {
    load(resolve) {
      setTimeout(() => {
        resolve(
          [
            { 'name': '李伟2', 'tel': '182*****1538', 'hobby': '钢琴、书法、唱歌', 'address': '上海市奉贤区南桥镇立新路12号2楼' },
            { 'name': '11111', 'tel': '182*****1538', 'hobby': '钢琴、书法、唱歌', 'address': '上海市奉贤区南桥镇立新路12号2楼' }
          ]
        );
        // this.$refs.table.handleLoadChidren(item);
      }, 1000);
    },
    sortChange(params) {
      this.columnsList.forEach(colItem => {
        if (colItem.field !== params.field) {
          colItem.orderBy = 'default';
        }
      });
      if (params.orderBy === 'default') {
        params.orderBy = 'asc';
        return;
      }
      if (params.orderBy === 'asc') {
        params.orderBy = 'desc';
        return;
      }
      if (params.orderBy === 'desc') {
        params.orderBy = 'default';
        return;
      }
    }
  }
};
</script>

<style lang="scss" scoped >

</style>
