

export default abstract class BaseShape {
  map: any

  shape: any
  ctls = []
  hidedCtls = []
  cursor: any

  MAX_CTLS = 0

  ctlStyle0 = {
    color: '#3388ff',
    fillColor: '#3388ff',
    snappable: false,
    weight: 3,
    bubblingMouseEvents: false
  }

  ctlStyle1 = {
    color: '#00ffff',
    fillColor: '#00ffff',
    snappable: false,
    weight: 5,
    bubblingMouseEvents: false
  }

  constructor(map: any) {
    this.map = map
    this.initMouseEvent()
    this.initShape()
    this.createCursor()
  }

  /* === cursor, ctls */

  private createCursor() {
    this.cursor = L.circleMarker([0, 0], { radius: 6 }).addTo(this.map)
  }
  private removeCursor() {
    if (this.cursor) this.cursor.remove()
  }

  private createCtl(latlng): void {
    const ctl = L.circleMarker(latlng, { radius: 6 }).addTo(this.map)
    this.ctls.push(ctl)
  }

  private hideCtls() {
    this.ctls.map(ctl => {
      ctl.remove()
    })
  }
  private delCtl(ctl) {
    ctl.remove()
  }

  private showCtls() {
    this.ctls.map(ctl => {
      this.map.addLayer(ctl)
    })
    this.ctls.map((ctl) => {
      ctl.addTo(this.map)
      ctl.on('mouseover', (e) => {
        ctl.setRadius(15)
        ctl.setStyle(this.ctlStyle1)
      })
      ctl.on('mouseout', (e) => {
        ctl.setRadius(10)
        ctl.setStyle(this.ctlStyle0)
      })
      ctl.on('click', (e) => {
        this.cursor = ctl
        ctl.on('click', (e) => {
          this.cursor = undefined
        })
      })
    })
    this.map.on('mousemove', (e) => {
      if (this.cursor) {
        this.cursor.setLatLng(e.latlng)
        this.refreshShape(e.latlng)
      }
    })
    this.map.on('contextmenu', (e) => {
      console.log('right click', e)
      this.finishShape()
    })
  }

  private initMouseEvent() {
    this.map.on('click', (e) => {
      this.createCtl(e.latlng)
      this.refreshShape(e)
      if (this.ctls.length == this.MAX_CTLS) {
        this.finishShape()
      }
    })
    this.map.on('mousemove', (e) => {
      if (this.cursor) {
        this.cursor.setLatLng(e.latlng)
      }
      this.refreshShape(e)
    })
    this.map.on('contextmenu', (e) => {
      this.finishShape()
    })
  }

  private removeMouseEvent() {
    this.map.off('click')
    this.map.off('mousemove')
    this.map.off('contextmenu')
  }


  private finishShape() {
    this.removeCursor()
    this.removeMouseEvent()
    if (this.ctls.length < this.MAX_CTLS) {
      if (this.shape) this.shape.remove()
    }else {
      this.finish()
    }
    this.hideCtls()
  }

  public cancel() {
    this.removeCursor()
    this.removeMouseEvent()
    this.hideCtls()
    if (this.shape) this.shape.remove()
  }

  /** 开始绘图时，初始化时执行*/
  abstract initShape(): void;

  /**正常绘图结束时调用 */
  abstract finish(): void;

  /** 因cursor或者ctl变化，更新图形 */
  abstract refreshShape(e): void;
}
