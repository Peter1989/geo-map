import L from "leaflet"
import * as f from "@flatten-js/core"
import BaseShape from "./LeafBase"

export default class Rect3 extends BaseShape {
  lfs: any

  MAX_CTLS = 3

  public constructor(map: any, lfs: any) {
    super(map)
    this.lfs = lfs
  }

  override initShape() {}

  override finish() {
    console.log("rect3 finsihed.")
    if (this.shape) {
      const lls = this.shape.getLatLngs()
      console.log("init a 3point rect: ", lls)
      this.lfs.addRect3(this.shape, this.getRotate(lls[0]))
      this.shape.remove()
    }
  }

  override refreshShape() {
    switch (this.ctls.length) {
      case 1: {
        break
      }
      case 2: {
        const p1 = this.ctls[0].getLatLng()
        const p2 = this.ctls[1].getLatLng()
        const p3 = this.cursor.getLatLng()
        const p34 = this.get34Point(
          p1.lng,
          p1.lat,
          p2.lng,
          p2.lat,
          p3.lng,
          p3.lat
        )
        const ll = p34.map((p) => {
          return { lng: p.x, lat: p.y }
        })
        if (this.shape) {
          this.shape.setLatLngs(ll)
        } else {
          this.shape = L.polygon(ll, { color: "red" }).addTo(this.map)
        }
        break
      }
      case 3: {
        const p1 = this.ctls[0].getLatLng()
        const p2 = this.ctls[1].getLatLng()
        const p3 = this.ctls[2].getLatLng()
        const p34 = this.get34Point(
          p1.lng,
          p1.lat,
          p2.lng,
          p2.lat,
          p3.lng,
          p3.lat
        )
        const ll = p34.map((p) => {
          return { lng: p.x, lat: p.y }
        })
        this.shape.setLatLngs(ll)
        break
      }
    }
  }

  private getRotate(lls) {
    const p0 = f.point(lls[3].lng, lls[3].lat)
    const p1 = f.point(lls[0].lng, lls[0].lat)
    const v = f.vector(p0, p1)
    const v0 = f.vector(f.point(0, 0), f.point(0, 1))
    const ang = v0.angleTo(v)
    const deg = (180 / 3.1415926) * ang
    console.log("calc rotate: ", lls, ang, deg)
    return deg
  }

  private get34Point(x1, y1, x2, y2, x3, y3) {
    const p1 = f.point(x1, y1)
    const p2 = f.point(x2, y2)
    const p3 = f.point(x3, y3)

    const line1 = f.line(p1, p2)
    const [dis, seg] = line1.distanceTo(p3) //seg是line1到p3的垂线

    const line2 = seg.clone().translate(f.vector(seg.ps, p2)) // seg平移到p2
    const line3 = seg.clone().translate(f.vector(seg.ps, p1)) //seg平移到p1

    return [p2, line2.pe, line3.pe, p1]
  }
}
