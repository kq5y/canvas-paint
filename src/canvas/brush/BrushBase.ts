import { calcCatmullRomSpline } from "../util/complement";

export class BrushBase {
    protected _context: CanvasRenderingContext2D;
    protected _points: { x: number; y: number }[];
    protected _controlPoints: {
        cp1: { x: number; y: number };
        cp2: { x: number; y: number };
    }[];

    constructor(context: CanvasRenderingContext2D) {
        this._context = context;
        this._points = [];
        this._controlPoints = [];
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
