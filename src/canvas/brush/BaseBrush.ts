import { calcCatmullRomSpline } from "../util/complement";

export class BrushBase {
    protected _context: CanvasRenderingContext2D;
    protected _previewContext: CanvasRenderingContext2D;
    protected _points: { x: number; y: number }[];
    protected _controlPoints: {
        cp1: { x: number; y: number };
        cp2: { x: number; y: number };
    }[];

    protected _brushSize: number;
    protected _opacity: number;
    protected _color: string;

    constructor(context: CanvasRenderingContext2D, previewContext: CanvasRenderingContext2D) {
        this._brushSize = 5;
        this._opacity = 100;
        this._color = "#000000";

        this._context = context;
        this._previewContext = previewContext;
        this._points = [];
        this._controlPoints = [];

        this._context.globalCompositeOperation = "source-over";
        this._previewContext.globalCompositeOperation = "source-over";
    }

    _clear(): void {
        this._previewContext.clearRect(
            0,
            0,
            this._previewContext.canvas.width,
            this._previewContext.canvas.height
        );
    }

    setBrushSize(size: number): void {
        this._previewContext.lineWidth = size;
        this._brushSize = size;
    }

    setOpacity(opacity: number): void {
        this._previewContext.globalAlpha = opacity / 100;
        this._opacity = opacity;
    }

    setColor(color: string): void {
        this._previewContext.strokeStyle = color;
        this._color = color;
    }

    render(): void {
        this._context.drawImage(this._previewContext.canvas, 0, 0);
        this._clear();
    }

    onPointerDown(event: PointerEvent): void {
        this._points = [];
        this._controlPoints = [];
        this._points.push({ x: event.offsetX, y: event.offsetY });
    }

    onPointerMove(event: PointerEvent): void {
        this._points.push({ x: event.offsetX, y: event.offsetY });
    }

    onPointerUp(event: PointerEvent): void {
        this._points.push({ x: event.offsetX, y: event.offsetY });
        if (this._points.length >= 2) {
            for (let i = 0; i < this._points.length - 1; i++) {
                const p0 = i === 0 ? undefined : this._points[i - 1];
                const p1 = this._points[i];
                const p2 = this._points[i + 1];
                const p3 = i === this._points.length - 2 ? undefined : this._points[i + 2];
                const { cp1, cp2 } = calcCatmullRomSpline(p0, p1, p2, p3);
                this._controlPoints.push({ cp1, cp2 });
            }
        }
    }
}
