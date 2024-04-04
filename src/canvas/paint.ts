import { BrushBase } from "./brush/BaseBrush";
import { CircleBrush } from "./brush/CircleBrush";
import { EraserBrush } from "./brush/EraserBrush";
import { FillBrush } from "./brush/FillBrush";
import { LineBrush } from "./brush/LineBrush";
import { MarkerBrush } from "./brush/MarkerBrush";
import { PenBrush } from "./brush/PenBrush";
import { PencilBrush } from "./brush/PencilBrush";
import { RectBrush } from "./brush/RectBrush";
import { HSVColor } from "./util";
import { hsv2rgba, makeColorStr } from "./util/color";

export type Mode = "pen" | "pencil" | "marker" | "eraser" | "fill" | "line" | "rect" | "circle";

class Layer {
    previewCanvas: HTMLCanvasElement;
    previewContext: CanvasRenderingContext2D;
    canvas: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    constructor(previewCanvas: HTMLCanvasElement, canvas: HTMLCanvasElement) {
        this.previewCanvas = previewCanvas;
        const previewContext = previewCanvas.getContext("2d", {
            willReadFrequently: true
        });
        if (previewContext === null) {
            throw new Error("Failed to get 2D context from canvas");
        }
        this.previewContext = previewContext;
        this.previewContext.imageSmoothingEnabled = false;

        this.canvas = canvas;
        const context = canvas.getContext("2d", {
            willReadFrequently: true
        });
        if (context === null) {
            throw new Error("Failed to get 2D context from canvas");
        }
        this.context = context;
        this.context.imageSmoothingEnabled = false;
    }
}

export class Paint {
    private _layers: Layer[] = [];
    private _layerIndex: number = -1;

    private _mode: Mode = "pen";
    private _brushSize: number = 5;
    private _opacity: number = 100;
    private _color: HSVColor = { h: 0, s: 0, v: 0 };

    private _brush: BrushBase | null = null;

    private _isDragging: boolean = false;

    private _imageLog: ImageData[][] = [];

    constructor(
        previewCanvases: HTMLCanvasElement[],
        canvases: HTMLCanvasElement[],
        mode: Mode = "pen",
        brushSize: number = 5,
        opacity: number = 100,
        color: HSVColor = { h: 0, s: 0, v: 0 },
        layerIndex: number = 0
    ) {
        this._isDragging = false;

        if (previewCanvases.length !== canvases.length) {
            throw new Error("The number of preview canvases and canvases must be the same.");
        }

        for (let i = 0; i < previewCanvases.length; i++) {
            this._layers.push(new Layer(previewCanvases[i], canvases[i]));
        }
        this._layerIndex = 0;

        this._imageLog = [];
        this._updateImageLog();

        this.mode = mode;
        this.brushSize = brushSize;
        this.opacity = opacity;
        this.color = color;
        this.layerIndex = layerIndex;
    }

    getAllImageData() {
        return this._layers.map((layer) =>
            layer.context.getImageData(0, 0, layer.canvas.width, layer.canvas.height)
        );
    }

    getTopCanvas() {
        return this._layers[this._layers.length - 1].previewCanvas;
    }

    initialize() {
        const topCanvas = this.getTopCanvas();
        topCanvas.addEventListener("pointerdown", (e) => this._onPointerDown.bind(this)(e));
        topCanvas.addEventListener("pointermove", (e) => this._onPointerMove.bind(this)(e));
        topCanvas.addEventListener("pointerup", (e) => this._onPointerUp.bind(this)(e));
        topCanvas.addEventListener("pointercancel", (e) => this._onPointerUp.bind(this)(e));
    }

    destroy() {
        const topCanvas = this.getTopCanvas();
        topCanvas.removeEventListener("pointerdown", this._onPointerDown.bind(this));
        topCanvas.removeEventListener("pointermove", this._onPointerMove.bind(this));
        topCanvas.removeEventListener("pointerup", this._onPointerUp.bind(this));
        topCanvas.removeEventListener("pointercancel", this._onPointerUp.bind(this));
    }

    get _previewContext() {
        return this._layers[this._layerIndex].previewContext;
    }

    get _context() {
        return this._layers[this._layerIndex].context;
    }

    get _canvas() {
        return this._layers[this._layerIndex].canvas;
    }

    get layerIndex() {
        return this._layerIndex;
    }

    set layerIndex(index: number) {
        if (index < 0 || index >= this._layers.length) {
            throw new Error(`Invalid layer index: ${index}`);
        }
        this._layerIndex = index;
        this.mode = this._mode;
    }

    get mode() {
        return this._mode;
    }

    set mode(mode: Mode) {
        if (this._previewContext && this._context) {
            switch (mode) {
                case "pen":
                    this._brush = new PenBrush(
                        this._context,
                        this._previewContext,
                        this._brushSize,
                        this._opacity,
                        this.getColorString()
                    );
                    break;
                case "pencil":
                    this._brush = new PencilBrush(
                        this._context,
                        this._previewContext,
                        this._brushSize,
                        this._opacity,
                        this.getColorString()
                    );
                    break;
                case "marker":
                    this._brush = new MarkerBrush(
                        this._context,
                        this._previewContext,
                        this._brushSize,
                        this._opacity,
                        this.getColorString()
                    );
                    break;
                case "eraser":
                    this._brush = new EraserBrush(
                        this._context,
                        this._previewContext,
                        this._brushSize,
                        this._opacity,
                        this.getColorString()
                    );
                    break;
                case "fill":
                    this._brush = new FillBrush(
                        this._context,
                        this._previewContext,
                        this._brushSize,
                        this._opacity,
                        this.getColorString()
                    );
                    break;
                case "line":
                    this._brush = new LineBrush(
                        this._context,
                        this._previewContext,
                        this._brushSize,
                        this._opacity,
                        this.getColorString()
                    );
                    break;
                case "rect":
                    this._brush = new RectBrush(
                        this._context,
                        this._previewContext,
                        this._brushSize,
                        this._opacity,
                        this.getColorString()
                    );
                    break;
                case "circle":
                    this._brush = new CircleBrush(
                        this._context,
                        this._previewContext,
                        this._brushSize,
                        this._opacity,
                        this.getColorString()
                    );
                    break;
                default:
                    throw new Error(`Invalid mode: ${mode}`);
            }
            this._mode = mode;
        }
    }

    get brushSize() {
        return this._brushSize;
    }

    set brushSize(size: number) {
        if (this._brush) {
            this._brush.setBrushSize(size);
            this._brushSize = size;
        }
    }

    get opacity() {
        return this._opacity;
    }

    set opacity(opacity: number) {
        if (this._brush) {
            this._brush.setOpacity(opacity);
            this._opacity = opacity;
        }
    }

    get color() {
        return this._color;
    }

    set color(color: HSVColor) {
        if (this._brush) {
            this._brush.setColor(makeColorStr(hsv2rgba(color)));
            this._color = color;
        }
    }

    getColorString() {
        return makeColorStr(hsv2rgba(this._color));
    }

    private _onPointerDown(event: PointerEvent) {
        if (!this._brush) {
            return;
        }
        this._isDragging = true;
        this._brush.onPointerDown(event);
    }

    private _onPointerMove(event: PointerEvent) {
        if (!this._isDragging || !this._brush) {
            return;
        }
        this._brush.onPointerMove(event);
    }

    private _onPointerUp(event: PointerEvent) {
        if (!this._isDragging || !this._brush) {
            return;
        }
        this._brush.onPointerUp(event);
        this.modified();
        this._isDragging = false;
    }

    private modified() {
        if (this._brush) {
            this._updateImageLog();
            this._brush.render();
        }
    }

    private _updateImageLog() {
        this._imageLog.push(this.getAllImageData());
        if (this._imageLog.length > 20) {
            this._imageLog.shift();
        }
    }

    undo() {
        if (this._imageLog.length > 0 && this._context) {
            const logs = this._imageLog.pop();
            if (logs) {
                for (let i = 0; i < logs.length; i++) {
                    this._layers[i].context.putImageData(logs[i], 0, 0);
                }
            }
        }
    }

    clear() {
        this._updateImageLog();
        for (const layer of this._layers) {
            layer.context.clearRect(0, 0, layer.canvas.width, layer.canvas.height);
        }
    }
}
