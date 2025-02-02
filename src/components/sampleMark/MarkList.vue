<template>
  <div class="mark-list-wrap">
    <div class="title-wrap">
      <span class="title"> 标注列表 </span>
    </div>
    <div class="content-wrap">
      <el-table
        :data="tableData"
        scrollbar-always-on
        ref="TableRef"
        size="small"
        style="
          width: 100%;
          height: 100%;
          border-radius: 0px 0px 6px 6px;
          background-color: rgba(0, 0, 0, 0) !important;
          animation: scrollTop 1s;
        "
        :header-cell-style="{
          'background-color': 'rgba(0, 0, 0, 0) !important',
          'font-size': '15px !important'
        }"
      >
        <el-table-column
          prop="number"
          label="编号"
          width="60px"
          align="center"
        >
          <template #default="scope">
            <span>{{scope?.row.id.substr(-3)||"暂无"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="tag"
          label="标签"
          align="center"
        >
          <template #default="scope">
            <span
              class="tag"
              @click="selectTag(scope?.row)"
            >{{
          scope?.row.tag
        }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operation"
          label="操作"
          width="60px"
          align="center"
        >
          <template #default="scope">
            <el-icon
              class="operation"
              @click="delMark(scope.row)"
            >
              <Delete />
            </el-icon>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <OnClickOutside
    @trigger="closeClickOut"
    v-if="showTagSelector"
  >
    <TagSelector
      ref="tagSelectPane"
      :groupList="props.groupList"
      @close="closeTagSelector"
      @confirm="confirmLabelTag"
    />
  </OnClickOutside>
</template>

<script
  setup
  lang="ts"
>
import {ref,onMounted,reactive,watch} from "vue"
import mitt from "../mitt/mitt"
import {Delete} from "@element-plus/icons-vue"

import {MarkListEvent,MapEvent} from "../mitt/Event"
import TagSelector from "./TagList.vue"
// import mark from "@api/mark"
import {OnClickOutside} from "@vueuse/components"
import {MarkItem} from "../sample"
import {useMarkList} from '@/store/markList'
const useList=useMarkList()

const emit=defineEmits(["confirm"])
const props=defineProps(["groupList","imageId","showTable"])
const tableData=ref<MarkItem[]>([])
const currentId=ref(null)
const tagSelectPane=ref()
const showTagSelector=ref(false)
const TableRef=ref()
let originData: []

const pageInfo=reactive({
  page: 1,
  size: 1000
})

onMounted(() => {
  getImageMarkList(true)
})

watch(
  () => props.imageId,
  () => {
    getImageMarkList(true)
  }
)

mitt.on(MarkListEvent.refresh,() => {
  getImageMarkList(false)
})

const getImageMarkList=(redraw: boolean) => {
  tableData.value=useList.list.value
}

function toggleShow(isShow: boolean,labels: MarkItem[]) {
  labels.map((lb) => (lb.isShow=isShow))
  if(isShow) {
    mitt.emit(MarkListEvent.show,labels)
  } else {
    mitt.emit(MarkListEvent.hide,labels)
  }
}

const closeClickOut=() => {
  showTagSelector.value=false
}

function selectTag(label: any) {
  showTagSelector.value=true
  currentId.value=label.id
}

function confirmLabelTag(data: any) {
  const {labelId,tag}=data

  let selected=originData.filter((data: any) => {
    return data.id===currentId.value
  })[0]

  let coordinates=selected.geometry.coordinates[0][0]
  let type=selected.geometry.type
  let params={
    class_id: labelId,
    geometry: {
      coordinates: [[[coordinates]]],
      type: type
    },
    graph: selected.graph,
    id: selected.id,
    image_id: selected.image_id
  }

  mark.saveImageMark(params).then((data: any) => {
    if(data) {
      getImageMarkList(false)
    }
  })

  showTagSelector.value=false
}

const closeTagSelector=() => {
  showTagSelector.value=false
}

const delMark=(label: any) => {
  //如果标签已经被同步到了服务端，处理markId

  let params={
    ids: [label.id]
  }

  mark.delImageMark(params).then((data: any) => {
    if(data) {
      mitt.emit(MapEvent.doRemove,[label.id])
      getImageMarkList(false)
    }
  })
}

const markDel=(ids: string[]) => {
  mark.delImageMark({ids}).then((data: any) => {
    if(data) {
      getImageMarkList(false)
    }
  })
}

mitt.on(MarkListEvent.markDel,markDel)

const updateTagLatlngs=({id,latlngs}) => {
  let selected=originData.filter((data: any) => {
    return data.id===id
  })[0]

  console.log("updateTagLatlngs",id,latlngs)

  let coordinates=latlngs.map((latlng: any) => {
    return [latlng.lng,latlng.lat]
  })

  coordinates.push(coordinates[0])
  let type=selected.geometry.type
  let params={
    class_id: selected.class_id,
    geometry: {
      coordinates: [[[coordinates]]],
      type: type
    },
    graph: selected.graph,
    id: selected.id,
    image_id: selected.image_id
  }

  mark.saveImageMark(params).then((data: any) => {
    if(data) {
    }
  })
}

mitt.on(MarkListEvent.updateTagLatlngs,updateTagLatlngs)
</script>
<style
  lang="scss"
  scoped
>
.mark-list-wrap {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 320px;
  height: 500px;
  z-index: 10;

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

    .title {
      font-weight: 400;
      font-size: 16px;
      color: #ffffff;
      line-height: 38px;
      vertical-align: middle;
      margin-left: 12px;
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

    .operation {
      cursor: pointer;
    }

    .tag {
      cursor: pointer;
    }

    .show {
      cursor: pointer;
    }
  }
}
</style>
