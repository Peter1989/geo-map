import { ShapeType } from "./IMap"
// import { Vector2d } from "konva/lib/types"
// import { SampleData, SampleImage, SampleImageTag } from "@/api/sample/types"

declare type CreateHandler = ((a: AnnoPts) => void) | null
declare type DeleteHandler = ((id: string) => void) | null
declare type ModifyHandler = ((a: AnnoPts) => void) | null
declare type SelectHandler = ((id: string) => void) | null

declare type ImagePos = {
  x: number
  y: number
  width: number
  height: number
  id: string
}

declare type AnnoPts = {
  id: string
  shape: ShapeType
  // points: Array<Vector2d>
  points: Array<any>
}

declare interface IMap {}
