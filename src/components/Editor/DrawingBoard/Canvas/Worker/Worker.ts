import { TimeTicket } from "yorkie-js-sdk";
import { ToolType } from "../../../../../store/slices/boardSlices";
import { Root, Shape, Rect } from "../../../../../store/slices/docSlices";
import { PanZoom, Point } from "../../../../../types/canvasTypes";

export type Options = { color: string; strokeWidth: number };

export type BoardMetadata = {
  eraserPoints?: Point[];
  penPoints?: { points: Point[]; color: string; strokeWidth: number };
  rectShape?: Rect;
};

export type MouseDownCallback = (boardMetadata: BoardMetadata) => void;

export type MouseMoveCallback = (boardMetadata: BoardMetadata) => void;

export type MouseUpCallback = (BoardMetadata: BoardMetadata) => void;

abstract class Worker {
  constructor(options?: Options) {
    this.options = options;
  }

  options?: Options;

  abstract type: ToolType;

  abstract update: Function;

  abstract updatePresence: Function;

  abstract mousedown(
    point: Point,
    panZoom: PanZoom,
    callback?: MouseDownCallback
  ): void;

  abstract mousemove(
    point: Point,
    panZoom: PanZoom,
    callback?: MouseMoveCallback
  ): void;

  abstract mouseup(callback?: MouseUpCallback): void;

  abstract flushTask(): void;

  getElementByID(root: Root, createID: TimeTicket): Shape | undefined {
    return root.shapes.getElementByID(createID);
  }

  deleteByID(root: Root, createID: TimeTicket): Shape | undefined {
    return root.shapes.deleteByID(createID);
  }

  clearAll() {
    this.update((root: Root) => {
      for (const shape of root.shapes) {
        this.deleteByID(root, shape.getID());
      }
    });
  }

  setOption(options: Options) {
    this.options = {
      ...this.options,
      ...options,
    };
  }
}

export default Worker;
