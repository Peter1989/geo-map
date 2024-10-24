<script
  setup
  lang="ts"
>
import {ref,onMounted} from 'vue'
import LeafMap from "@/components/map/Leaf.ts"
import FunctionRow from "@/components/sampleMark/FunctionRow.vue"
import MapPane from "./components/sampleMark/MapPane.vue"
import MarkList from "./components/sampleMark/MarkList.vue"

const map=ref()

onMounted(() => {
  // map.value=new LeafMap('map')
  // map.value.loadImage("https://tile.openstreetmap.org/{z}/{x}/{y}.png",'')
})
</script>

<template>
  <FunctionRow></FunctionRow>
  <MarkList :imageId="currentImageId">
  </MarkList>
  <!-- <div
    id="map"
    style="z-index: 0; height: 500px; width: 1000px;"
  ></div> -->
  <!-- <MapPane
    ref="mapPane"
    :groupList="taskDetail.groupList"
    :imageId="currentImageId"
    :deleteAction="taskDetail.task_status!=7"
  >
  </MapPane> -->
  <MapPane ref="mapPane">
  </MapPane>
</template>

<style scoped>
/* .logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}

.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}

.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
} */
</style>