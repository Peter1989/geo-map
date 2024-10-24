export enum ScrollListEvent {
  select = 'ScrollList.select',
}

export enum FunctionRowEvent {
  changeMode = 'FunctionRowEvent.changeMode',
  finish = 'FunctionRowEvent.finish',
}

export enum MarkListEvent {
  markLoaded = 'MarkListEvent.markLoaded',
  markDel = 'MarkListEvent.markDel',
  updateTag = 'LabelListEvent.updateTag',
  updateTagLatlngs = 'MarkListEvent.updateTagLatlngs',
  show='LabelListEvent.show',
  hide='LabelListEvent.hide',
  // doCreate = 'MarkListEvent.doCreate',
  refresh = 'MarkListEvent.refresh'
}

export enum LabelListEvent {
  updateTag = 'LabelListEvent.updateTag',
  show='LabelListEvent.show',
  hide='LabelListEvent.hide'
}

// export enum TagSelectorEvent {
//   closeFromPane = 'TagSelectorEvent.closeFromPane',
// }

export enum LeafEvent {
  create = 'LeafEvent.create',
  menu = 'leaf/menu',
  update = 'leaf/update',
  select = 'leaf/select',
  unselect = 'leaf/unselect',
  remove = 'leaf/remove',
  keyboard = 'leaf/keyboard'
}

export enum MapEvent {
  create = 'MapEvent.create',
  // markDelete = 'MapEvent.markDelete',
  created = 'map/created',
  select = 'map/select',
  unselect = 'map/unselect',
  remove = 'map/remove',
  updateShape = 'map/updateShape',
  updateTag = 'map/updateTag',
  cancel = 'map/cancel',
  doRemove = 'map/doRemove',

  doMode = 'map/mode',
  doCompare = 'map/doCompare',
  doCancel = 'map/doCancel',
  // doSelect = 'map/doSelect',
  // doUnSelect = 'map/doUnSelect',
  doHide = 'map/doHide',
  doShow = 'map/doShow',
  doSetGrid = 'map/doSetGrid',
  doRemoveSelected = 'map/doRemoveSelected',
  doUpdateTag = 'map/doUpdateTag'
}