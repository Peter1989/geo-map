import mitt from "mitt"
import { ScrollListEvent, FunctionRowEvent, LeafEvent, MarkListEvent, MapEvent } from "./Event"
import { scrollSelectEvent, leafCreateEvent, MarkListLoadedEvent, MarkListCreateEvent } from "./EventType"
import { MarkItem } from "../sample"

type Events = {
    [ScrollListEvent.select]: scrollSelectEvent;
    [FunctionRowEvent.changeMode]: string;
    [FunctionRowEvent.finish]:undefined;
    [LeafEvent.create]:leafCreateEvent;
    [MarkListEvent.markLoaded]:MarkListLoadedEvent[];
    [MarkListEvent.show]: MarkItem[];
    [MarkListEvent.hide]: MarkItem[];
    // [MarkListEvent.doCreate]: MarkListCreateEvent;
    [MarkListEvent.refresh]: undefined;
    // [MapEvent.markDelete]: string[];
    [MapEvent.doRemove]: string[];
}

export default mitt<Events>()
