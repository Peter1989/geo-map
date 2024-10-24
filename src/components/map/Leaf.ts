import { IMap, ImagePos } from "./IMap"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import Rect3 from "./Rect3"
import LeafSbs from "./leaf-sbs.ts"
import "@geoman-io/leaflet-geoman-free"
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css"
import { MarkListLoadedEvent } from "../mitt/EventType"

import { MapMode } from "../sampleMark/MapEvent"

export default class LeafMap implements IMap {
  mapTileSize: number = 1024

  map: any
  bgGroup: any // 管理背景图
  group: any //当前显示的图形
  hideGroup: any //隐藏的图形
  tagGroup: any //所有tag

  keyShift: boolean = false
  keyAlt: boolean = false
  keyCtrl: boolean = false

  m1: any
  m2: any

  sbs: LeafSbs | undefined = undefined

  opt = {
    color: "#0000ff",
    fillColor: "#0000ff",
    weight: 1,
    bubblingMouseEvents: false
  }

  selectStyle = {
    color: "#00ff00",
    fillColor: "#0000ff",
    weight: 3
  }

  selected: Array<any> = []

  onCreated: Function
  keyboardCallback: Function
  shapeUpdatedCallback: Function

  zoom: number
  minZoom: number
  maxZoom: number

  constructor(nodeId: string, options: any) {
    this.onCreated = options.onCreated
    this.keyboardCallback = options.keyboardCallback
    this.shapeUpdatedCallback = options.shapeUpdatedCallback
    this.zoom = options.zoom
    this.minZoom = options.minZoom
    this.maxZoom = options.maxZoom

    this.map = this.useGridMap(nodeId)
    this.initMapEvent()
  }

  private useGridMap(nodeId: string) {
    const map = L.map(nodeId, {})
    map.zoomControl.remove()
    this.group = L.layerGroup().addTo(map)
    this.hideGroup = L.layerGroup()
    this.bgGroup = L.layerGroup().addTo(map)
    this.tagGroup = L.layerGroup().addTo(map)
    map.pm.setGlobalOptions({ layerGroup: this.group })
    map.pm.setPathOptions(this.opt)
    this.sbs = new LeafSbs(map)
    return map
  }

  public clean() {
    console.log("clean map")
    this.bgGroup.clearLayers()
    this.group.clearLayers()
    this.hideGroup.clearLayers()
    this.tagGroup.clearLayers()
  }

  // private isShowTileInfo = true
  // private createMapImg(img: any, width: number, height: number) {
  //   const layer = new L.GridLayer({
  //     zoom: -5,
  //     minZoom: -5,
  //     maxZoom: 8,
  //     tileSize: L.point(width, height),
  //     bounds: [
  //       [0, 0],
  //       [height, width]
  //     ], // tile 显示范围，
  //     maxNativeZoom: 0, //底图最大zoom, 当实际zoom超过时，则leaflet会放大上层图片
  //     minNativeZoom: 0,
  //     updateWhenZooming: true
  //   })

  //   layer.createTile = function (coords) {
  //     // coords为切片坐标
  //     const tile = L.DomUtil.create("canvas", "leaflet-tile")
  //     const size = this.getTileSize()
  //     tile.width = size.x
  //     tile.height = size.y
  //     const ctx = tile.getContext("2d")
  //     if (coords.x == 0 && coords.y == -1) {
  //       const imgnode = new Image()
  //       imgnode.src = img
  //       imgnode.onload = function () {
  //         ctx.drawImage(this, 0, 0, tile.width, tile.height)
  //         if (this.isShowTileInfo) {
  //           console.log("load image to canvas")
  //           ctx.fillStyle = "black"
  //           ctx.fillText(
  //             "x: " +
  //               coords.x +
  //               ", y: " +
  //               coords.y +
  //               ", zoom: " +
  //               coords.z +
  //               ", width: " +
  //               tile.width +
  //               ", height: " +
  //               tile.height,
  //             20,
  //             20
  //           )
  //         }
  //       }
  //     } else {
  //       if (this.isShowTileInfo) {
  //         console.log("create tile info ")
  //         ctx.fillStyle = "green"
  //         ctx.fillRect(0, 0, size.x, size.y)
  //         ctx.fillStyle = "red"
  //         ctx.fillText(
  //           "x: " +
  //             coords.x +
  //             ", y: " +
  //             coords.y +
  //             ", zoom: " +
  //             coords.z +
  //             ", width: " +
  //             tile.width +
  //             ", height: " +
  //             tile.height,
  //           20,
  //           20
  //         )
  //       }
  //     }
  //     return tile
  //   }
  //   layer.addTo(this.map)
  //   return layer
  // }

  sampleImage = undefined
  public loadImage(url: string): void {
    console.log("load image`: ", url)
    // this.sampleImage = sampleImage
    this.m1 = L.tileLayer(url, {}).addTo(this.bgGroup)
    this.map.setView([51.505, -0.09], 13)
    // this.sbs?.setA(this.m1)
    return this.m1
  }

  // public loadCompareImage(url: string, pos: ImagePos): void {
  //   console.log("load compare image: ", url)
  //   this.m2 = L.tileLayer(url + "/{z}/_r{y}_c{x}.jpeg", {
  //     // ry: (a) => {
  //     //   return Math.pow(2, a.z) + a.y //这里相当于将y轴向上移动一幅图的距离，保证使用的坐标中，y为正值
  //     // },
  //     minZoom: -1,
  //     maxZoom: 4,
  //     minNativeZoom: 0,
  //     maxNativeZoom: 4, //底图最大zoom, 当实际zoom超过时，则leaflet会放大上层图片
  //     noWrap: false,
  //     tms: false,
  //     bounds: [
  //       [0, 0],
  //       [this.mapTileSize, this.mapTileSize]
  //     ],
  //     tileSize: this.mapTileSize // 256是默认值，应该由后台切分时根据图形大小确定tileSize
  //   }).addTo(this.bgGroup)
  //   this.sbs?.setB(this.m2)
  //   return this.m2
  // }

  public showOld(isShowOld: boolean): void {
    if (this.m2) {
      if (isShowOld) {
        this.m1.setZIndex(1)
        this.m2.setZIndex(2)
      } else {
        this.m1.setZIndex(2)
        this.m2.setZIndex(1)
      }
    }
  }

  public startCompare(isY: boolean): void {
    if (this.m2) {
      console.log("start compare")
      this.map.on("mousemove", (e: any) => {
        if (isY) {
          this.sbs?.splitY(e.layerPoint)
        } else {
          this.sbs?.splitX(e.layerPoint)
        }
      })
    } else {
      console.log("no old image")
    }
  }

  public exitCompare(): void {
    if (this.m2) {
      this.sbs?.disable()
    }
    this.map.off("mousemove")
    console.log("exit compare mode")
  }

  public addRect3(shp: any, angle: any) {
    const shape = L.rectangle(shp.getLatLngs(), this.opt)
    const shapeType = "Rect3"
    this.initShape(shape)
    shape.pm.rotateLayerToAngle(angle)
    shape.setLatLngs(shp.getLatLngs())
    shape.options.id = shp._leaflet_id
    console.log("create a rect3 : ", shape)
    var pos = shape
      .getLatLngs()[0]
      .map((pt: any) => this.convertAxisToXY(pt.lat, pt.lng))
    this.onCreated({ shape, shapeType, pos })
  }

  //初始化的时候添加图形
  public addShape(shapeType: any, id: number, tagPts: any, tag: any) {
    console.log("add shape: " + shapeType + ", id=" + id, tagPts, tag)
    let s
    switch (shapeType) {
      case "Polygon": {
        s = L.polygon(
          tagPts.map((pt: any) => this.convertAxisToLatLng(pt[0], pt[1])),
          this.opt
        )
        s.options.id = id
        this.initShape(s)
        if (tag) {
          this.setTag(tag, s)
        }
        console.log("load Polygon: ", s)
        break
      }
      case "Rectangle": {
        s = L.rectangle(
          tagPts.map((pt: any) => this.convertAxisToLatLng(pt[0], pt[1])),
          this.opt
        )
        s.options.id = id
        this.initShape(s)
        if (tag) {
          this.setTag(tag, s)
        }
        console.log("load a rectangle : ", s)
        break
      }
      case "Rect3": {
        const ptt = tagPts.map((pt: any) =>
          this.convertAxisToLatLng(pt[0], pt[1])
        )
        s = L.rectangle(ptt, this.opt)
        s.setLatLngs(ptt)
        s.options.id = id
        this.initShape(s)
        // s.pm.setInitAngle(points.rotate)
        if (tag) {
          this.setTag(tag, s)
        }
        console.log("load a rectangle : ", s)
        break
      }
      // case "Text": {
      //   const pos =
      //     typeof points.pts[0] === "number"
      //       ? this.convertAxisToLatLng(points.pts[0], points.pts[1])
      //       : this.convertAxisToLatLng(points.pts[0][0], points.pts[0][1])
      //   s = L.marker(pos, { textMarker: true, text: tag }).addTo(this.group)
      //   s.options.id = id
      //   this.initShapeEvent(s)
      //   console.log("load a text: ", pos, s)
      // }
    }
    console.log("add shape: ", s)
  }

  public taskDraw(objects: MarkListLoadedEvent[]) {
    if (!objects || objects.length === 0) return
    objects.forEach((object: MarkListLoadedEvent) => {
      console.log("object.graph", object.graph)
      if (object.graph === "Rectangle") {
        this.drawRectangle(object)
      } else if (object.graph === "Rect3") {
        this.drawRect3(object)
      } else if (object.graph === "Polygon") {
        this.drawPolygon(object)
      }
    })
  }

  private drawRectangle(object: MarkListLoadedEvent) {
    console.log("object", object)
    let coordinates = object.geometry.coordinates[0][0]
    coordinates.pop()
    console.log("coordinates", coordinates)

    let bounds = [
      [coordinates[0][1], coordinates[0][0]],
      [coordinates[2][1], coordinates[2][0]]
    ]

    let s = L.rectangle(bounds, this.opt)

    console.log("s", s)
    s.options.id = object.id
    this.initShape(s)
  }

  private drawRect3(object: MarkListLoadedEvent) {
    let coordinates = object.geometry.coordinates[0][0]
    const ptt = coordinates.map((pt) => this.convertAxisToLatLng(pt[0], pt[1]))
    let s = L.rectangle(ptt, this.opt)
    s.setLatLngs(ptt)
    s.options.id = object.id
    this.initShape(s)
    console.log("load a rectangle : ", s)
  }

  private drawPolygon(object: MarkListLoadedEvent) {
    let coordinates = object.geometry.coordinates[0][0]
    let s = L.polygon(
      coordinates.map((pt) => this.convertAxisToLatLng(pt[0], pt[1])),
      this.opt
    )
    s.options.id = object.id
    this.initShape(s)
    console.log("load Polygon: ", s)
  }

  public convertAxisToXY(lat: any, lng: any) {
    // const x = (lng * this.sampleImage?.width) / this.mapTileSize
    // const y=(lat*this.sampleImage?.height)/this.mapTileSize
    const x = lng
    const y = lat
    return [x, y]
  }

  public convertAxisToLatLng(x: number, y: number) {
    // const lng = (x * this.mapTileSize) / this.sampleImage?.width
    // const lat = (y * this.mapTileSize) / this.sampleImage?.height
    const lng = x
    const lat = y
    return { lng, lat }
  }

  private initShape(s: any) {
    L.PM.reInitLayer(s)
    //s.pm.enableLayerDrag()
    this.initShapeEvent(s)
    s.addTo(this.group)
  }

  private initShapeEvent(s: any) {
    s.on("mouseover", (e: any) => {
      if (e.target.setStyle) {
        e.target.setStyle({ fillOpacity: 0.8 })
      }
    })

    s.on("mouseout", (e: any) => {
      if (e.target.setStyle) {
        e.target.setStyle({ fillOpacity: 0.2 })
      }
    })

    // s.on("contextmenu", (e: any) => {
    //   console.log("get contextmenu ", e.latlng, e.layerPoint, e.target)
    //   mitt.emit(LeafEvent.menu, e.target.options.id)
    // })

    s.on("click", (e: any) => {
      console.log("click a shape", e)
      const s = e.target
      if (!e.originalEvent.shiftKey) {
        this.unselectAll()
      }
      this.select(s, true)
    })
    s.on("pm:update", (e: any) => {
      // mitt.emit(LeafEvent.update, { id: e.layer.options.id, shape: e.layer })
    })
    s.on("pm:drag", (e: any) => this.updateTag(e.target))
    s.on("pm:rotate", (e: any) => this.updateTag(e.target))
    s.on("pm:scale", (e: any) => this.updateTag(e.target))
    s.on("pm:markerdrag", (e: any) => this.updateTag(e.target))
  }

  public hideAll(): void {
    this.group.getLayers().map((shape: any) => {
      if (shape) {
        this.group.removeLayer(shape)
        shape.addTo(this.hideGroup)
        if (shape.options.tag) {
          this.tagGroup.removeLayer(shape.options.tag)
        }
      }
    })
  }

  public showAll(): void {
    this.hideGroup.getLayers().map((shape: any) => {
      if (shape) {
        this.hideGroup.removeLayer(shape)
        shape.addTo(this.group)
        if (shape.options.tag) {
          shape.options.tag.addTo(this.tagGroup)
        }
      }
    })
  }

  public hide(ids: Array<string>): void {
    ids.map((id) => {
      const shape = this.group.getLayers().find((l: any) => l.options.id === id)
      console.log("hide a shape: " + id, shape)
      if (shape) {
        this.group.removeLayer(shape)
        shape.addTo(this.hideGroup)
        if (shape.options.tag) {
          this.tagGroup.removeLayer(shape.options.tag)
        }
      }
    })
  }

  public show(ids: Array<string>): void {
    ids.map((id) => {
      const shape = this.hideGroup.getLayers().find((l) => l.options.id === id)
      console.log("show a shape: " + id, shape)
      if (shape) {
        this.hideGroup.removeLayer(shape)
        shape.addTo(this.group)
        if (shape.options.tag) {
          shape.options.tag.addTo(this.tagGroup)
        }
      }
    })
  }

  public initMapEvent(): void {
    this.map.on("click", (e: any) => {
      console.log("click map", e)
      this.unselectAll()
    })

    this.map.on("contextmenu", (e: any) => {
      console.log("get contextmenu ", e.latlng, e.layerPoint, e)
    })

    this.map.on("pm:create", (e: any) => {
      console.log("shape created: ", e, e.layer)
      console.log("shape created GEOJson: ", e.layer.toGeoJSON())
      const shape = e.layer
      const shapeType = e.shape
      shape.options.id = shape._leaflet_id

      this.initShape(shape)
      var pos =
        shapeType === "Text"
          ? this.convertAxisToXY(shape.getLatLng().lat, shape.getLatLng().lng)
          : shape
              .getLatLngs()[0]
              .map((pt: any) => this.convertAxisToXY(pt.lat, pt.lng))
      // mitt.emit(LeafEvent.create,{shape,shapeType,pos})
      this.onCreated({ shape, shapeType, pos })
    })
    this.enableKeyboardListener()
  }

  public disableKeyboardListener() {
    this.map.off("pm:keyevent")
  }

  public enableKeyboardListener() {
    this.map.on("pm:keyevent", (e: any) => {
      console.log("get pm key evnet: ", e)
      switch (e.event.key) {
        case "Shift":
          this.keyShift = e.eventType === "keydown" ? true : false
          break
        default:
          if (e.event.type === "keydown") {
            // mitt.emit(LeafEvent.keyboard, e.event.code)
          }
      }
    })
  }

  private updateTag(shape: any) {
    const tag = shape.options.tag
    if (tag) {
      tag.setLatLng(shape.getCenter())
    }
  }

  private findShapeById(id: string) {
    const it = this.group.getLayers().find((l) => l.options.id === id)
    if (!it) {
      return this.hideGroup.getLayers().find((l) => l.options.id === id)
    }
    {
      return it
    }
  }

  public setTagById(tag: string, id: string) {
    console.log(`set tag ${tag} to shape with id ${id} `)
    const it = this.findShapeById(id)
    if (it.options.tag) {
      it.options.tag.remove()
    }
    this.setTag(tag, it)
  }

  private setTag(text: string, shape: any) {
    var icon = L.divIcon({ html: text, className: "my-div-icon", iconSize: 40 })
    var tag = L.marker(shape.getCenter(), { icon }).addTo(this.tagGroup)
    shape.options.tag = tag
    tag.options.shape = shape
    tag.on("click", (e) => {
      tag.options.shape.fire("click", e)
    })
    tag.on("contextmenu", (e) => {
      tag.options.shape.fire("contextmenu", e)
    })
    tag.on("mouseover", (e) => {
      tag.options.shape.fire("mouseover", e)
    })
  }

  public compare(compareType: MapMode) {
    console.log("leaf compare: " + compareType)
    switch (compareType) {
      case MapMode.CompareNew: {
        this.exitCompare()
        this.showOld(false)
        break
      }
      case MapMode.CompareX: {
        this.startCompare(false)
        break
      }
      case MapMode.CompareY: {
        this.startCompare(true)
        break
      }
      case MapMode.CompareOld: {
        this.exitCompare()
        this.showOld(true)
        break
      }
    }
  }

  mapMode = MapMode.NONE
  rect3: any
  public changeMode(mode: MapMode, params: any) {
    console.log("to mode: " + mode, params)
    this.cancelDraw()
    this.mapMode = mode
    switch (mode) {
      case MapMode.DrawRectangle:
        this.map.pm.enableDraw("Rectangle", this.opt)
        break
      case MapMode.DrawPolygon:
        this.map.pm.enableDraw("Polygon", this.opt)
        break
      case MapMode.DrawRect3:
        this.rect3 = new Rect3(this.map, this)
        break
      case MapMode.DrawText:
        this.map.pm.enableDraw("Text", {
          textOptions: {
            text: params
          }
        })
        break

      case MapMode.Edit:
        this.mapMode = MapMode.Edit
        break
      case MapMode.Drag:
        this.mapMode = MapMode.Drag
        break
      case MapMode.Rotate:
        this.mapMode = MapMode.Rotate
        break

      case MapMode.SelectRectangle:
        this.rect3 = new Selector(this.map, this)
        break

      default:
        console.log("invalid map mode: " + mode)
    }
  }

  cancelDraw() {
    console.log("cancel current draw mode")
    this.map.pm.disableDraw()
    if (this.rect3) this.rect3.cancel()
  }

  public changeSelect(id: string): void {
    console.log("change select: ", this.selected, id)
    const it = this.findShapeById(id)
    if (it) {
      this.select(it, false)
    }
  }

  public selectByShape(shape) {
    const tfp = this.leafToTurf(shape)
    this.group.getLayers().map((l) => {
      const po2: turf.helpers.Feature = this.leafToTurf(l)
      if (this.isInterpret(tfp, po2)) {
        this.select(l, true)
      } else {
        if (!this.keyShift) {
          this.unSelectShape(l)
          // mitt.emit(LeafEvent.unselect, [l.options.id])
        }
      }
    })
  }

  private leafToTurf(shape): turf.helpers.Feature {
    const pp1 = shape.getLatLngs()[0].map((ll) => [ll.lat, ll.lng])
    const tfp: turf.helpers.Feature = turf.polygon([[...pp1, pp1[0]]])
    return tfp
  }

  private isInterpret(
    ts1: turf.helpers.Feature,
    s2: turf.helpers.Feature
  ): boolean {
    const inter = turf.intersect(ts1, s2)
    console.log("check intersect ", inter)
    return inter !== null
  }

  public selectIds(ids: Array<string>) {
    ids?.map((id) => {
      const it = this.findShapeById(id)
      if (it) {
        this.select(it, false)
      } else {
        console.log("fail to get shape by id: " + id)
      }
    })
  }

  //选择图形
  private select(shape: any, isClickShape = true) {
    this.selected.push(shape)
    shape.options.isSelected = true
    console.log("select a shape: ", shape)
    if (shape.setStyle) {
      shape.setStyle(this.selectStyle)
    }
    if (isClickShape) {
      // mitt.emit(LeafEvent.select, [shape.options.id])
    }
    switch (this.mapMode) {
      case MapMode.Drag: {
        shape.pm.disable()
        shape.pm.disableRotate()
        shape.pm.enableLayerDrag()
        break
      }
      case MapMode.Edit: {
        shape.pm.enable()
        shape.pm.disableRotate()
        shape.pm.disableLayerDrag()
        break
      }
      case MapMode.Rotate: {
        shape.pm.disable()
        if (shape.pm.getShape() === "Text") {
          console.log("text node can not rotate")
        } else {
          shape.pm.enableRotate()
          shape.pm.disableLayerDrag()
        }
        break
      }
      default: {
        shape.pm.disable()
        shape.pm.disableRotate()
        shape.pm.disableLayerDrag()
        break
      }
    }
    console.log("change shape mode: ", shape, this.mapMode)
  }

  public unselectAll() {
    const ids = this.group
      .getLayers()
      .map((it) => {
        if (it.options.isSelected) {
          this.unSelectShape(it)
          return it.options.id
        }
      })
      .filter((id) => id)
    console.log("get unselectAll ids: ", ids)
    // mitt.emit(LeafEvent.unselect, ids)
  }

  public unselect(ids: Array<string>) {
    console.log("leaflet handle unselect: ", ids)
    ids?.map((id) => {
      const it = this.findShapeById(id)
      this.unSelectShape(it)
    })
    // mitt.emit(LeafEvent.unselect, ids)
  }

  private unSelectShape(layer: any) {
    const i = this.selected.findIndex((s) => s.options.id === layer.options.id)
    this.selected.splice(i, 1)
    if (layer && layer.options.isSelected) {
      if (layer.setStyle) {
        layer.options.isSelected = false
        layer.setStyle(this.opt)
        layer.pm.disable()
        layer.pm.disableRotate()
        layer.pm.disableLayerDrag()
      } else {
        console.log("invalid select ", layer)
      }
    }
  }

  public deleteByIds(ids: Array<String>) {
    ids?.map((id) => {
      const it = this.findShapeById(id)
      if (it) {
        this.deleteShape(it)
      } else {
        console.log("fail to get shape by id: " + id)
      }
    })
  }

  public deleteSelected(): Array<string> {
    const ids = this.selected
      .map((it) => {
        return this.deleteShape(it)
      })
      .filter((id) => id !== undefined)
    return ids
  }

  private deleteShape(shape: any): string | undefined {
    if (shape) {
      if (shape.options.tag) {
        shape.options.tag.remove()
      }
      const id = shape.options.id
      shape.remove()
      return id
    } else {
      return undefined
    }
  }

  zoomIn(): void {
    this.map.zoomIn(1)
  }

  zoomOut(): void {
    this.map.zoomOut(1)
  }

  setZoom(scale: number): void {
    this.map.setZoom(scale)
  }

  setGrid(row: number, col: number, sliceRow: number, sliceCol: number): void {
    console.log(`set grid to [${row},${col}]  of [${sliceRow}, ${sliceCol}]`)
    /* 后端slice的坐标原点在左上角，并且方向向右下，所以这里需要将row换算到左下原点坐标系 */
    const y1 =
      (this.mapTileSize / sliceRow) * (sliceRow - row) +
      this.mapTileSize / sliceCol / 2
    const x1 =
      (this.mapTileSize / sliceCol) * col - this.mapTileSize / sliceCol / 2
    this.map.setView(L.latLng(y1, x1))
  }
}
