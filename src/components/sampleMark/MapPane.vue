<template>
  <div
    id="leafMap"
    style="z-index: 0; height: 500px; width: 1000px;"
    class="bg-dark"
  ></div>
  <OnClickOutside
    @trigger="closeSelector"
    v-if="showTagSelector"
  >
    <TagSelector
      ref="tagSelectPane"
      @close="closeSelector"
      @confirm="confirmLabelTag"
    />
  </OnClickOutside>
</template>

<script
  setup
  lang="ts"
>
import {ref,onMounted,watch,onUnmounted} from "vue"
import mitt from "../mitt/mitt"
import LeafMap from "../map/Leaf"
import {MapMode} from "./MapEvent"
import {MapEvent} from "../mitt/Event"
import TagSelector from "./TagList.vue"
import {ElMessageBox} from "element-plus"
import {OnClickOutside} from "@vueuse/components"
import {MarkListEvent,FunctionRowEvent} from "../mitt/Event"
import {MarkItem} from "../sample"
import {useMarkList} from '@/store/markList'
const useList=useMarkList()

const props=defineProps([
  "preTag",
  "preTagPath",
  "groupList",
  "imageId",
  "deleteAction"
])

defineExpose({loadImage})

function loadImage(sampleDataTmp: any,sampleImageTmp: any) {
  map.clean()
  map.loadImage(sampleDataTmp,sampleImageTmp)
}

let map: LeafMap

let tagDataTmp

const onCreated=(params) => {
  const {shape,shapeType,pos}=params
  console.log('onCreated',shape,shapeType,pos)
  const tagData={
    id: shape.options.id,
    shapeType,
    points: JSON.stringify({
      pts: pos,
      rotate: shape.pm.getAngle()
    }),
    tag: shapeType==="Text"? shape.options.text:props.preTag,
    tagPath: props.preTagPath,
    isShow: true
  }
  tagDataTmp=tagData
  showTagSelector.value=true
  mitt.emit(FunctionRowEvent.finish)
}

const keyboardCallback=(code: string) => {
  switch(code) {
    case "Delete":
    case "Backspace": {
      if(props.deleteAction) {
        ElMessageBox.confirm("是否删除当前选中的标注?","提示",{
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deleteLabel()
          })
          .catch(() => {
            // catch error
          })
        break
      }
    }
    case "Escape": {
      cancelDraw()
      map.unselectAll()
      mitt.emit(MapEvent.cancel)
      break
    }
  }
}

const shapeUpdatedCallback=({id,layer}) => {
  let latlngs=layer._latlngs[0]
  console.log("shapeUpdatedCallback",latlngs)
  mitt.emit(MarkListEvent.updateTagLatlngs,{id,latlngs})
}

onMounted(() => {
  let options={
    onCreated: onCreated,
    keyboardCallback: keyboardCallback,
    shapeUpdatedCallback: shapeUpdatedCallback,
    zoom: 4,
    minZoom: 3,
    maxZoom: 25
  }

  map=new LeafMap("leafMap",options)
  map.loadImage("https://tile.openstreetmap.org/{z}/{x}/{y}.png",'')
})

onUnmounted(() => {
  map.disableKeyboardListener()
})

const tagSelectPane=ref()
const showTagSelector=ref(false)

function confirmLabelTag(data: any) {
  showTagSelector.value=false
  const {labelId,tag}=data

  let geometry=geoConvert(tagDataTmp.points)
  console.log('tagDataTmp',geometry)

  const tmpId=Date.now()

  let markList=useList.list.value
  markList.push({id: String(tmpId),tag})
  useList.setList(markList)

  map.deleteByIds([tagDataTmp.id])
  map.addShape(tagDataTmp.shapeType,tmpId,geometry.coordinates[0][0][0])
  mitt.emit(MarkListEvent.refresh)
}

const geoConvert=(points: string) => {
  let {pts}=JSON.parse(points)
  console.log("pts",pts)
  pts.push(pts[0])

  let geometry={
    coordinates: [[[pts]]],
    type: "MultiPolygon"
  }
  return geometry
}

function deleteLabel() {
  const ids=map.deleteSelected()
  mitt.emit(MarkListEvent.markDel,ids)
}

const continueContent=ref()

function cancelDraw() {
  continueContent.value=MapMode.NONE
  map.cancelDraw()
}

const closeSelector=() => {
  showTagSelector.value=false
  let id=tagDataTmp.id
  map.deleteByIds([id])
}

mitt.on(MarkListEvent.markLoaded,(objects) => {
  console.log("map pane handle mode event: ",objects)
  map.clearGroup()
  map.taskDraw(objects)
})

// 顶部工具条修改状态
const changeMode=(mode: string) => {
  continueContent.value=mode
  map.changeMode(mode)
}

mitt.on(FunctionRowEvent.changeMode,changeMode)

mitt.on(MapEvent.doCompare,(mode) => {
  console.log("mapPane handle doCompare event",mode)
  map.compare(mode)
})

mitt.on(MapEvent.doCancel,cancelDraw)

mitt.on(MapEvent.select,(ids) => {
  console.log("mapPane handle doSelect event",ids)
  map.unselectAll()
  map.selectIds(ids)
})

mitt.on(MapEvent.unselect,(ids) => {
  console.log("mapPane handled doUnSelect event",ids)
  map.unselect(ids)
})

// mitt.on(MapEvent.doHide, (ids) => {
//   console.log("mapPane handle doHide event", ids)
//   map.value.hide(ids)
// })

mitt.on(MarkListEvent.hide,(objects: MarkItem[]) => {
  let ids=objects.map((object: MarkItem) => object.id)
  map.hide(ids)
})

// mitt.on(MapEvent.doShow, (ids) => {
//   console.log("mapPane handle doShow event", ids)
//   map.value.show(ids)
// })

mitt.on(MarkListEvent.show,(objects: MarkItem[]) => {
  let ids=objects.map((object: MarkItem) => object.id)
  map.show(ids)
})

mitt.on(MapEvent.doSetGrid,(gridPos: any) => {
  console.log("mapPane handle doSetGrid event",gridPos)
  map.setGrid(gridPos.r,gridPos.c,gridPos.sliceRow,gridPos.sliceCol)
})

mitt.on(MapEvent.doRemove,(ids) => {
  console.log("mapPane handle doRemove event",ids)
  map.deleteByIds(ids)
})

mitt.on(MapEvent.doRemoveSelected,() => {
  map.deleteSelected()
})

// mitt.on(MapEvent.doUpdateTag,confirmLabelTag)
</script>

<style>
.leaflet-control-attribution {
  display: none;
}

.bg-dark {
  outline-style: none !important;
}
</style>
