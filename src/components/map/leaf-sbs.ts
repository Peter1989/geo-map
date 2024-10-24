export default class LeafSbs {
  map
  la: any = undefined
  lb: any = undefined
  width =  999999
  height = 999999

  constructor(map) {
    this.map = map
  }

  public setLayers(la: any, lb: any) {
    this.setA(la)
    this.setB(lb)
  }

  public setA(la: any) {
    this.la = la
    this.la!.getContainer().style.clip = 'auto'
  }

  public setB(lb: any) {
    this.lb = lb
    this.lb!.getContainer().style.clip = 'auto'
  }

  public drawLayers() {
    this.la!.getContainer().style.clip = 'rect( px)'
  }

  public splitX(pos: number) {
    //console.log('split: ', pos, this.la.options.tileSize)
    if (this.la != undefined && this.lb != undefined) {
      this.la!.getContainer().style.clip = `rect(0px, ${pos.x}px,    ${this.height}px, 0px)`
      this.lb!.getContainer().style.clip = `rect(0px, ${this.width}px, ${this.height}px, ${pos.x}px)`
    }
  }

  public splitY(pos: number) {
    if (this.la && this.lb) {
      this.la!.getContainer().style.clip = `rect(${pos.y}px, ${this.width}px, ${this.height}px, 0px)`
      this.lb!.getContainer().style.clip = `rect(0px, ${this.width}px, ${pos.y}px, 0px)`
    }
  }

  public disable() {
    if (this.la != undefined && this.lb != undefined) {
      this.la!.getContainer().style.clip = 'auto'
      this.lb!.getContainer().style.clip = 'auto'
    }
  }
}
