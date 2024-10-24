<template>
  <q-card>
    <q-card-section>
      <div class="col-4 text-center">1级标注: {{levelData[0]}}</div>
      <div class="col-4 text-center">2级标注: {{levelData[1]}}</div>
      <div class="col-4 text-center">3级标注: {{levelData[2]}}</div>
    </q-card-section>
  </q-card>
</template>

<script
  setup
  lang="ts"
>
import {onMounted,ref} from 'vue'
import mitt from '../mitt'

const props=defineProps({
  sampleImageTag: Array<any>
})

const levelData=ref([0,0,0])

mitt.on('TagStat',calcTagStat)

function calcTagStat() {
  console.log('refresh tag level stat: ')
  const ld=props.sampleImageTag?.map(tg => tg.tagPath? tg.tagPath.split('/').length-1:0)
  levelData.value[0]=ld.filter(x => x==1).length
  levelData.value[1]=ld.filter(x => x==2).length
  levelData.value[2]=ld.filter(x => x==3).length
}

onMounted(() => {
  calcTagStat()
})

</script>
