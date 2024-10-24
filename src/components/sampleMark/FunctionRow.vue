<template>
  <div class="mark-list-wrap">
    <el-tooltip
      content="框选模式"
      placement="top"
      effect="light"
    >
      <div
        class="button select-rectangle border-left"
        :class="mapMode===MapMode.SelectRectangle? 'selected':''"
        @click="mode(MapMode.SelectRectangle)"
      ></div>
    </el-tooltip>
    <el-tooltip
      content="拖动模式"
      placement="top"
      effect="light"
    >
      <div
        class="button drag"
        :class="mapMode===MapMode.Drag? 'selected':''"
        @click="mode(MapMode.Drag)"
      ></div>
    </el-tooltip>
    <el-tooltip
      content="编辑模式"
      placement="top"
      effect="light"
    >
      <div
        class="button edit"
        :class="mapMode===MapMode.Edit? 'selected':''"
        @click="mode(MapMode.Edit)"
      ></div>
    </el-tooltip>
    <el-tooltip
      content="旋转模式"
      placement="top"
      effect="light"
    >
      <div
        class="button rotate"
        :class="mapMode===MapMode.Rotate? 'selected':''"
        @click="mode(MapMode.Rotate)"
      ></div>
    </el-tooltip>
    <el-tooltip
      content="删除"
      placement="top"
      effect="light"
    >
      <div
        class="button delete"
        :class="mapMode===MapMode.Delete? 'selected':''"
        @click="mode(MapMode.Delete)"
      ></div>
    </el-tooltip>
    <div class="devide-line"></div>
    <el-tooltip
      content="绘制矩形"
      placement="top"
      effect="light"
    >
      <div
        class="button draw-rectangle"
        :class="mapMode===MapMode.DrawRectangle? 'selected':''"
        @click="mode(MapMode.DrawRectangle)"
      ></div>
    </el-tooltip>
    <el-tooltip
      content="绘制3点矩形"
      placement="top"
      effect="light"
    >
      <div
        class="button draw-rect3"
        :class="mapMode===MapMode.DrawRect3? 'selected':''"
        @click="mode(MapMode.DrawRect3)"
      ></div>
    </el-tooltip>
    <el-tooltip
      content="绘制多边形"
      placement="top"
      effect="light"
    >
      <div
        class="button draw-polygon border-right"
        :class="mapMode===MapMode.DrawPolygon? 'selected':''"
        @click="mode(MapMode.DrawPolygon)"
      ></div>
    </el-tooltip>
  </div>
</template>

<script
  setup
  lang="ts"
>
import {ref,watch} from "vue"
import {
  CirclePlus,
  Delete,
  Search,
  Edit,
  FolderAdd
} from "@element-plus/icons-vue"
import {MapMode} from "./MapEvent"
import {ToolBoxEvent} from "./ToolBoxEvent"
import {FunctionRowEvent} from "../mitt/Event"

import mitt from "../mitt/mitt"
const mapMode=ref<MapMode>(MapMode.NONE)
const compare=ref<MapMode>(MapMode.CompareNew)
const deleteLabelDialog=ref(false)
const emit=defineEmits(["confirm"])

function init() {
  compare.value=MapMode.CompareNew
  mapMode.value=MapMode.NONE
}

mitt.on(ToolBoxEvent.doInit,init)
mitt.on(ToolBoxEvent.doCancel,init)

mitt.on(FunctionRowEvent.finish,() => {
  mapMode.value=MapMode.NONE
})

watch(compare,(val) => {
  mitt.emit(ToolBoxEvent.compare,val)
})

function mode(mode: MapMode) {
  mapMode.value=mapMode.value===mode? MapMode.NONE:mode
  console.log(`toolbox emit draw ${mapMode.value} event`)
  // mitt.emit(ToolBoxEvent.mode, mapMode.value)
  mitt.emit(FunctionRowEvent.changeMode,mapMode.value)
}

function deleteLabel() {
  console.log("toolbox emit delete select label event")
  mitt.emit(ToolBoxEvent.deleteConfirm)
}
</script>

<style
  lang="scss"
  scoped
>
.mark-list-wrap {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translate(-50%, 0);
  display: flex;
  flex-direction: row;

  background: rgba(47, 62, 77, 0.8);
  border-radius: 6px;

  .button {
    width: 40px;
    height: 40px;
    color: #fff;
    text-align: center;
    cursor: pointer;

    background-image: url("@/assets/sample/upload.jpg");
    background-size: 20px 20px;
    background-position: center center;
    background-repeat: no-repeat;
  }

  .select-rectangle {
    background-image: url("@/assets/sample/mark/select-rectangle.png");
  }

  .drag {
    background-image: url("@/assets/sample/mark/drag.png");
  }

  .edit {
    background-image: url("@/assets/sample/mark/edit.png");
  }

  .rotate {
    background-image: url("@/assets/sample/mark/rotate.png");
  }

  .delete {
    background-image: url("@/assets/sample/mark/delete.png");
  }

  .draw-rectangle {
    background-image: url("@/assets/sample/mark/draw-rectangle.png");
  }

  .draw-rect3 {
    background-image: url("@/assets/sample/mark/draw-rect3.png");
  }

  .draw-polygon {
    background-image: url("@/assets/sample/mark/draw-polygon.png");
  }

  .button:hover {
    background-color: #40a0ff42;
  }

  .selected {
    background-color: #409eff;
  }

  .border-left {
    border-radius: 6px 0 0 6px;
  }

  .border-right {
    border-radius: 0 6px 6px 0;
  }

  .devide-line {
    width: 1px;
    height: 40px;

    background: linear-gradient(0deg,
        rgba(255, 255, 255, 0) 0%,
        #ffffff 50%,
        rgba(255, 255, 255, 0) 100%);

    opacity: 0.4;
  }
}
</style>
