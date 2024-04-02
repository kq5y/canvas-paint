import { BrushBase } from "./brush/BrushBase";
import { PenBrush } from "./brush/PenBrush";
import { HSVColor } from "./util";
import { hsv2rgba, makeColorStr } from "./util/color";

export type Mode = "pen" | "pencil" | "marker" | "eraser" | "fill" | "line" | "rect" | "circle";

export class Paint {
    private _previewCanvas: HTMLCanvasElement;
    private _previewContext: CanvasRenderingContext2D | null;
    private _canvas: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D | null;

    private _mode: Mode = "pen";
    private _brushSize: number = 5;
    private _opacity: number = 100;
    private _color: HSVColor = { h: 0, s: 0, v: 0 };

    private _brush: BrushBase | null = null;

    private _isDragging: boolean = false;
    //private _isFilling: boolean = false;

    private _imageLog: ImageData[] = [];

    constructor(
        previewCanvas: HTMLCanvasElement,
        canvas: HTMLCanvasElement,
        mode: Mode = "pen",
        brushSize: number = 5,
        opacity: number = 100,
        color: HSVColor = { h: 0, s: 0, v: 0 }
    ) {
        this._isDragging = false;
        //this._isFilling = false;

        this._previewCanvas = previewCanvas;
        this._previewContext = previewCanvas.getContext("2d");
        if (!this._previewContext) {
            throw new Error("Failed to get 2D context from canvas");
        }

        this._canvas = canvas;
        this._context = canvas.getContext("2d");
        if (!this._context) {
            throw new Error("Failed to get 2D context from canvas");
        }

        this._imageLog = [];
        this._imageLog.push(
            this._context.getImageData(0, 0, this._canvas.width, this._canvas.height)
        );

        this.mode = mode;
        this.brushSize = brushSize;
        this.opacity = opacity;
        this.color = color;
    }

    initialize() {
        this._previewCanvas.addEventListener("pointerdown", (e) =>
            this._onPointerDown.bind(this)(e)
        );
        this._previewCanvas.addEventListener("pointermove", (e) =>
            this._onPointerMove.bind(this)(e)
        );
        this._previewCanvas.addEventListener("pointerup", (e) => this._onPointerUp.bind(this)(e));
        this._previewCanvas.addEventListener("pointercancel", (e) =>
            this._onPointerUp.bind(this)(e)
        );
    }

    destroy() {
        this._previewCanvas.removeEventListener("pointerdown", this._onPointerDown.bind(this));
        window.removeEventListener("pointermove", this._onPointerMove.bind(this));
        window.removeEventListener("pointerup", this._onPointerUp.bind(this));
        window.removeEventListener("pointercancel", this._onPointerUp.bind(this));
    }

    get mode() {
        return this._mode;
    }

    set mode(mode: Mode) {
        switch (mode) {
            case "pen":
                this._brush = new PenBrush(this._previewContext!);
                break;
            case "pencil":
                break;
            case "marker":
                break;
            case "eraser":
                break;
            case "fill":
                break;
            case "line":
                break;
            case "rect":
                break;
            case "circle":
                break;
            default:
                throw new Error(`Invalid mode: ${mode}`);
        }
        this._mode = mode;
    }

    get brushSize() {
        return this._brushSize;
    }

    set brushSize(size: number) {
        this._previewContext!.lineWidth = size;
        this._brushSize = size;
    }

    get opacity() {
        return this._opacity;
    }

    set opacity(opacity: number) {
        this._previewContext!.globalAlpha = opacity / 100;
        this._opacity = opacity;
    }

    get color() {
        return this._color;
    }

    set color(color: HSVColor) {
        this._previewContext!.strokeStyle = makeColorStr(hsv2rgba(color));
        this._color = color;
    }

    private _onPointerDown(event: PointerEvent) {
        this._isDragging = true;
        this._brush?.onPointerDown(event);
    }

    private _onPointerMove(event: PointerEvent | MouseEvent | TouchEvent) {
        if (!this._isDragging) {
            return;
        }
        this._brush?.onPointerMove(event as PointerEvent);
    }

    private _onPointerUp(event: PointerEvent) {
        if (!this._isDragging) {
            return;
        }
        this._brush?.onPointerUp(event);
        this.modified();
        this._isDragging = false;
    }

    private modified() {
        if (this._context && this._previewContext) {
            const imageData = this._context.getImageData(
                0,
                0,
                this._canvas.width,
                this._canvas.height
            );
            this._imageLog.push(imageData);
            if (this._imageLog.length > 20) {
                this._imageLog.shift();
            }
            this._context.drawImage(this._previewCanvas, 0, 0);
            this._previewContext.clearRect(
                0,
                0,
                this._previewCanvas.width,
                this._previewCanvas.height
            );
        }
    }

    undo() {
        if (this._imageLog.length > 0) {
            this._context?.putImageData(this._imageLog.pop()!, 0, 0);
        }
    }

    clear() {
        if (this._context) {
            const imageData = this._context.getImageData(
                0,
                0,
                this._canvas.width,
                this._canvas.height
            );
            this._imageLog.push(imageData);
            if (this._imageLog.length > 20) {
                this._imageLog.shift();
            }
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }
    }
}
