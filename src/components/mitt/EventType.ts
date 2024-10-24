import L from "leaflet"
import MarkObject from "../sample"

export type scrollSelectEvent  = {
    serverId: string
    imageId: string
    coordinates: any
}

export type leafCreateEvent = {
    shape: L.Layer
    shapeType: string
    pos: any
}

type Geometry = {
    type: string
    coordinates: [number, number][][]
}

export type MarkListLoadedEvent = {
    id: string
    geometry: Geometry
    graph: string
    colorId: number
}

export type MarkListCreateEvent = {
    id: string
    shapeType: string
    points: string
    tag: string
    tagPath: string
    isShow: boolean
}