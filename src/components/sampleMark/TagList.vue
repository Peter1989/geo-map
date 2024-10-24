<template>
  <div class="tag-list-wrap">
    <div class="title-wrap">
      <span class="title"> 标签列表 </span>
      <el-icon
        class="icon"
        :size="15"
        @click="() => emit('close')"
        color="#fff"
      >
        <Close />
      </el-icon>
    </div>
    <div class="content-wrap">
      <el-table
        :data="labelList"
        size="small"
        style="
          width: 100%;
          height: 100%;
          border-radius: 0px 0px 6px 6px;
          background-color: rgba(0, 0, 0, 0) !important;
        "
        :header-cell-style="{
          'background-color': 'rgba(0, 0, 0, 0) !important',
          'font-size': '15px'
        }"
        @row-click="selectChange"
      >
        <el-table-column
          prop="id"
          label="编号"
          width="50px"
          align="center"
        />
        <el-table-column
          prop="name"
          label="标签名称"
          align="center"
        />
      </el-table>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import {ref,onMounted} from "vue"
import {Close} from "@element-plus/icons-vue"
// import mark from "@api/mark.ts"
// import {getColorList} from "@/store/getConfig/sample"
import mitt from "../mitt/mitt"
import {ElMessage} from "element-plus"
import {LabelListEvent} from "../mitt/Event"

const emit=defineEmits(["confirm","close"])
const props=defineProps(["groupList"])

// const tagPane = ref(false)
const labelId=ref<string>()
const confirmFunc=ref()
const labelList=ref()
const colorList=ref()

onMounted(async () => {
  getLabelList()
})

const getLabelList=() => {
  labelList.value=[{
    id: 1,
    name: "标签1",
  },{
    id: 2,
    name: "标签2"
  }]
}

async function show(lid: string,confirm: any) {
  console.log("show tag selector: ",lid)
  console.log("groupList: ",props.groupList)
  labelId.value=lid
  confirmFunc.value=confirm
  // tagPane.value = true
  getLabelList()
  // 获取全局配置
  colorList.value=await getColorList(false)
}

function selectChange(data: object) {
  emit("confirm",{labelId: data.id,tag: data.name})
}

defineExpose({
  show
})
</script>
<style
  lang="scss"
  scoped
>
.tag-list-wrap {
  position: absolute;
  top: 20px;
  left: 20px;
  width: 320px;
  height: 500px;

  background: rgba(47, 62, 77, 0.8);
  border-radius: 6px;
  border: 1px solid #1e398e;

  .title-wrap {
    position: absolute;
    width: 320px;
    height: 38px;
    background: #409eff;
    opacity: 1;
    border-radius: 6px 6px 0px 0px;
    border: 1px solid #409eff;
    transform: translate(-1px, -1px);
    text-align: left;

    display: flex;
    align-items: center;
    justify-content: space-between;

    .title {
      font-weight: 400;
      font-size: 16px;
      color: #ffffff;
      line-height: 38px;
      vertical-align: middle;
      margin-left: 12px;
    }

    .icon {
      margin-right: 10px;
      cursor: pointer;
    }
  }

  .content-wrap {
    margin-top: 38px;
    height: calc(100% - 38px);

    .el-table {
      --el-table-tr-bg-color: none;
      --el-table-border: 1px solid rgba(47, 62, 77, 0);
      --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.16);
      --el-table-border-color: rgba(47, 62, 77, 0.4);
      --el-table-text-color: #c3d8fb;
      --el-table-header-text-color: #fff;
    }

    .color-block {
      display: inline-block;
      width: 32px;
      height: 16px;
    }

    .operation-edit {
      cursor: pointer;
      margin-right: 4px;
    }

    .operation-delete {
      cursor: pointer;
    }
  }
}
</style>
