import { HSVColor } from "./util";

export type Mode =
    | "pen"
    | "pencil"
    | "marker"
    | "eraser"
    | "fill"
    | "line"
    | "rect"
    | "circle";

export class Paint {
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D | null;

    private _mode: Mode = "pen";
    private _brushSize: number = 5;
    private _opacity: number = 100;
    private _color: HSVColor = { h: 0, s: 0, v: 0 };

    constructor(
        canvas: HTMLCanvasElement,
        mode: Mode = "pen",
        brushSize: number = 5,
        opacity: number = 100,
        color: HSVColor = { h: 0, s: 0, v: 0 }
    ) {
        this._canvas = canvas;
        this._context = canvas.getContext("2d");
        if (!this._context) {
            throw new Error("Failed to get 2D context from canvas");
        }

        this.mode = mode;
        this.brushSize = brushSize;
        this.opacity = opacity;
        this.color = color;
    }

    initialize() {
        this._canvas.addEventListener("pointerdown", this._onPointerDown);
        this._canvas.addEventListener("pointermove", this._onPointerMove);
        this._canvas.addEventListener("pointerup", this._onPointerUp);
    }

    destroy() {
        this._canvas.removeEventListener("pointerdown", this._onPointerDown);
        this._canvas.removeEventListener("pointermove", this._onPointerMove);
        this._canvas.removeEventListener("pointerup", this._onPointerUp);
    }

    get mode() {
        return this._mode;
    }

    set mode(mode: Mode) {
        this._mode = mode;
    }

    get brushSize() {
        return this._brushSize;
    }

    set brushSize(size: number) {
        this._brushSize = size;
    }

    get opacity() {
        return this._opacity;
    }

    set opacity(opacity: number) {
        this._opacity = opacity;
    }

    get color() {
        return this._color;
    }

    set color(color: HSVColor) {
        this._color = color;
    }

    private _onPointerDown(event: PointerEvent) {
        //
    }

    private _onPointerMove(event: PointerEvent) {
        //
    }

    private _onPointerUp(event: PointerEvent) {
        //
    }
}
