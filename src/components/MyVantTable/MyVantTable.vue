<template>
  <div id="pages-tables" class="pages-tables" :class="{'table-border':border}">
    <div id="watermark" class="waterMask"></div>
    <div ref="tableBox" class="rolling-table meal-table" :style="{height:$_height}">
      <table id="table" ref="rollingTable" class="table" cellpadding="0" cellspacing="0">
        <tr>
          <th
            v-for="(x,i) in $_columnsList"
            :key="i"
            class="rows "
            :class="{'cross': x.fixed,'th-border':border}"
            colspan="1"
            rowspan="1"
          >
            <div :style="{width:x._width?x._width:'auto','text-align':x.titleAlign?x.titleAlign:'left'}" @click="sortChange(x)">
              <div v-if="x.orderBy" class="th-icon">
                <van-icon name="arrow-up" size="3vw" :color="x.orderBy==='asc'?'#409eff':'#c0c4cc'" />
                <van-icon name="arrow-down" size="3vw" :color="x.orderBy==='desc'?'#409eff':'#c0c4cc'" />
              </div>
              {{ x.title }}
            </div>
          </th>
        </tr>
        <template v-for="(l,i) in $_tableData">
          <tr :key="i+'a'" @click="handleLoadChidren(l)">
            <template v-for="(ll,yKey) in l">
              <td
                v-if="fliterKey(yKey)&&(_spanMethod(i,yKey).rowspan!==0)"
                :key="yKey"
                :colspan="_spanMethod(i,yKey).colspan"
                :rowspan="_spanMethod(i,yKey).rowspan"
                :class="{'cols': fixedCol.find(item=>item.field===yKey),'td-border':border}"
              >
                <div class="td-cell" :style="yKey|filterTdStyle(columnsList)">
                  <template v-if="l.hasChildren&&i===0&&yKey===xField[0]">
                    <template v-if="!l.showChildren">
                      <van-icon v-if="!l.isLoading" name="arrow" size="4vw" class="td-cell__icon" />
                      <van-loading v-else type="spinner" size="4vw" class="td-cell__icon" style="top: 0;"></van-loading>
                    </template>
                    <van-icon v-else name="arrow-down" size="4vw" class="td-cell__icon" />
                  </template>
                  {{ tableData[i][yKey] }}</div>
              </td>
            </template>
          </tr>
          <template v-if="l.hasChildren&&l.showChildren">
            <tr v-for="(chil,childIndex) in l.children" :key="childIndex+'b'" class="tr-children">
              <template v-for="(ll,yKey) in l">
                <td v-if="fliterKey(yKey)" :key="yKey" :class="{'cols': fixedCol.find(item=>item.field===yKey),'td-border':border}">
                  <div class="td-cell" :style="yKey|filterTdStyle(columnsList)">
                    <template v-if="l.children.hasChildren&&i===0&&yKey===xField[0]">
                      <van-icon v-if="!l.children.showChildren" name="arrow" size="4vw" class="td-cell__icon" />
                      <van-icon v-else name="arrow-down" size="4vw" class="td-cell__icon" />
                    </template>
                    {{ l.children[childIndex][yKey] }}
                  </div>
                </td>
              </template>
            </tr>
          </template>
        </template>
      </table>
    </div>
  </div>
</template>
<script>
import { createIScroller } from './src/iscrollTable.js';
export default {
  filters: {
    filterTdStyle(yKey, columnsList) {
      const col = columnsList.find(item => item.field === yKey);
      return { 'text-align': col.columnAlign ? col.columnAlign : 'left' };
    }
  },
  props: {
    columnsList: {
      type: Array,
      required: true
    },
    tableData: {
      type: Array,
      required: true
    },
    border: {
      type: Boolean,
      required: false,
      default: false
    },
    height: {
      type: [Number, String],
      required: false,
      default: 'auto'
    },
    spanMethod: {
      type: Function,
      required: false,
      default: null
    },
    load: Function
  },
  data() {
    return {
      scroll: {
        scroller: null
      }
    };
  },
  computed: {
    xField() {
      return this.columnsList.map(item => item.field);
    },
    fixedCol() {
      return this.columnsList.filter(item => item.fixed);
    },
    $_tableData() {
      return this.tableData.map(item => {
        if (item.hasChildren) {
          this.$set(item, 'showChildren', false);
          this.$set(item, 'isLoading', false);
        }
        return item;
      });
    },
    $_height() {
      if (typeof this.height === 'number') {
        return 100 * this.height / 750 + 'vw';
      }
      if (this.height.includes('px')) {
        return 100 * parseInt(this.height) / 750 + 'vw';
      }
      return 'auto';
    },
    $_columnsList() {
      return this.columnsList.map(item => {
        if (item.width) {
          item._width = 100 * item.width / 750 + 'vw';
        }
        return item;
      });
    }
  },
  beforeMount() {
  },
  mounted() {
    this.scroll.scroller = createIScroller('.meal-table');
  },
  methods: {
    fliterKey(yKey) {
      return this.xField.find(item => item === yKey);
    },
    handleLoadChidren(l) {
      if (!l.children) {
        l.isLoading = true;
        this.load((children) => {
          l.isLoading = false;
          l.showChildren = !l.showChildren;
          l.children = children;
          setTimeout(() => {
            this.updatePosition();
          }, 0);
        });
      } else {
        l.showChildren = !l.showChildren;
      }
    },
    sortChange(params) {
      if (!params.orderBy) return;
      this.$emit('sortChange', params);
    },
    updatePosition() {
      const frozenCols = document.querySelectorAll(' table tr.tr-children td.cols');
      for (let i = 0; i < frozenCols.length; i++) {
        frozenCols[i].style.transform = 'translate(' + -1 * this.scroll.scroller.x + 'px, 0px) translateZ(0px)';
      }
    },
    handleTableData(key) {
      const tableData = JSON.parse(JSON.stringify(this.tableData));
      const length = tableData.length - 1;
      let j = 1;
      for (let i = length; i >= 0; i--) {
        if (i > 0 && tableData[i][key] === tableData[i - 1][key]) {
          j++;
          delete tableData[i].rowspan;
          // 每次不同需要就可以赋值给rowspan字段了
        } else {
          tableData[i].rowspan = j;
          j = 1;
        }
      }
      return tableData;
    },
    defaultSpanMethod(rowIndex, key) {
      const col = this.columnsList.find(item => item.field === key);
      if (col.cellMerge) {
        const tableData = this.handleTableData(key);
        return {
          rowspan: tableData[rowIndex].rowspan ? tableData[rowIndex].rowspan : 0,
          colspan: 1
        };
      } else {
        return {
          rowspan: 1,
          colspan: 1

        };
      }
    },
    _spanMethod(rowIndex, key) {
      if (this.spanMethod) {
        return this.spanMethod(rowIndex, key);
      }
      return this.defaultSpanMethod(rowIndex, key);
    }
  }
};

</script>
<style lang="scss" scoped>
.pages-tables {
  margin: 0 30px;
  overflow-x: scroll;
}

.rolling-table {
  position: relative;
  top: 0;
  width: 99.8%;
  // height: 600px;
  overflow: hidden;
  font-size: 28px;
  color: #86939a;
  background-color: #fff;
  -webkit-overflow-scrolling: touch;
}

.rows {
  position: relative;
  z-index: 3;
}

.cross {
  position: relative;
  z-index: 5;
}

::-webkit-scrollbar {
  display: none;
}

.table {
  width: 100%;
  height: 600px;
  font-size: 32px;
  color: #86939e;
  text-align: center;

  &-border {
    border: 1px solid #ebeef5;
  }

  tr {
    position: relative;
    background-color: #fff;

    td {
      height: 86px;
      font-size: 32px;
      line-height: 86px;
      white-space: nowrap;
      background: #fff;
      border-bottom: 2px solid #ebeef5;

      .td-cell {
        position: relative;
        padding: 0 20px;
        background: #fff;

        &__icon {
          position: absolute;
          top: 25px;
          left: 10px;
        }
      }

      &.td-border {
        border-right: 1px solid #ebeef5;

        &:last-child {
          border-right: 0;
        }
      }
    }

    th {
      position: relative;
      height: 74px;
      padding: 0 30px;
      padding-top: 0;
      padding-bottom: 0;
      font-weight: normal;
      line-height: 74px;
      color: #43484d;
      white-space: nowrap;
      background-color: #f5f7fa;

      &.th-border {
        border-right: 1px solid #ebeef5;

        &:last-child {
          border-right: 0;
        }
      }

      .th-icon {
        position: absolute;
        top: 10px;
        left: 20px;
        display: flex;
        flex-direction: column;
      }
    }

    .cols {
      position: relative;
      z-index: 2;
    }
  }

  .tr-children {
    td {
      &:first-child {
        .td-cell {
          padding-left: 70px;
        }
      }
    }
  }
}
</style>
