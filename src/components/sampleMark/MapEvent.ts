export enum MapEvent {
  create = "map/create",
  created = "map/created",
  select = "map/select",
  unselect = "map/unselect",
  remove = "map/remove",
  updateShape = "map/updateShape",
  updateTag = "map/updateTag",
  cancel = "map/cancel",

  doMode = "map/mode",
  doCompare = "map/doCompare",
  doCancel = "map/doCancel",
  doSelect = "map/doSelect",
  doUnSelect = "map/doUnSelect",
  doHide = "map/doHide",
  doShow = "map/doShow",
  doSetGrid = "map/doSetGrid",
  doRemove = "map/doRemove",
  doRemoveSelected = "map/doRemoveSelected",
  doUpdateTag = "map/doUpdateTag"
}

export enum MapMode {
  NONE = "m/none",
  DrawRectangle = "d/rectangle",
  DrawRect3 = "d/rect3",
  DrawPolygon = "d/polygon",
  DrawText = "d/text",
  Edit = "edit",
  Drag = "drag",
  Rotate = "rotate",
  Delete = "delete",
  SelectRectangle = "s/rectangle",

  CompareX = "c/x",
  CompareY = "c/y",
  CompareNew = "c/new",
  CompareOld = "c/old"
}
