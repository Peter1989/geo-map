import { createGlobalState } from "@vueuse/core"
import { ref } from "vue"

export const useMarkList = createGlobalState(() => {
  let originList = [
    {
      id: "170232434123",
      tag: "标签1"
    }
  ]

  //state
  const list = ref(originList)

  //actions
  function setList(idValue) {
    list.value = idValue
  }
  return { list, setList }
})
