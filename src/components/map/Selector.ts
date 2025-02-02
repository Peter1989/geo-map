import L from "leaflet"
import * as f from "@flatten-js/core"
import BaseShape from "./LeafBase"
import mitt from "../mitt/mitt"
import { MapEvent } from "../sampleMark/MapEvent"
import { FunctionRowEvent } from "../mitt/Event"

export default class Selector extends BaseShape {
  lfs: any

  MAX_CTLS = 2

  public constructor(map: any, lfs: any) {
    super(map)
    this.lfs = lfs
  }

  override initShape() {}

  override finish() {
    console.log("selector finsihed.")
    if (this.shape) {
      const lls = this.shape.getLatLngs()
      console.log("init a selector rect: ", lls)
      this.lfs.selectByShape(this.shape)
      this.shape.remove()
      mitt.emit(FunctionRowEvent.finish)
    }
  }

  private getPts(pt1, pt2) {
    const p1 = pt1
    const p2 = L.latLng(pt1.lat, pt2.lng)
    const p3 = pt2
    const p4 = L.latLng(pt2.lat, pt1.lng)
    return [p1, p2, p3, p4]
  }

  override refreshShape() {
    switch (this.ctls.length) {
      case 1: {
        const p1 = this.ctls[0].getLatLng()
        const p2 = this.cursor.getLatLng()
        const ll = this.getPts(p1, p2)
        if (this.shape) {
          this.shape.setLatLngs(ll)
        } else {
          console.log("create rectangle: ", ll)
          this.shape = L.rectangle(ll, { color: "green" }).addTo(this.map)
        }
        break
      }
      case 2: {
        const p1 = this.ctls[0].getLatLng()
        const p2 = this.ctls[1].getLatLng()
        const ll = this.getPts(p1, p2)
        if (this.shape) {
          this.shape.setLatLngs(ll)
        } else {
          this.shape = L.rectangle(ll, { color: "red" }).addTo(this.map)
        }
        break
      }
    }
  }
}
