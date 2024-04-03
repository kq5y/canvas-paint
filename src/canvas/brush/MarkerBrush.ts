import { BrushBase } from "./BaseBrush";

export class MarkerBrush extends BrushBase {
    _brushCount: number;
    _brushOverlap: number;

    constructor(
        context: CanvasRenderingContext2D,
        previewContext: CanvasRenderingContext2D,
        brushSize: number,
        opacity: number,
        color: string
    ) {
        super(context, previewContext);

        this._brushCount = 0;
        this._brushOverlap = 0;

        this.setBrushSize(brushSize);
        this.setOpacity(opacity);
        this.setColor(color);

        this._previewContext.lineCap = "round";
        this._previewContext.lineJoin = "round";
    }

    setBrushSize(size: number): void {
        this._brushSize = Math.min(size / 4, 3);
        this._brushOverlap = Math.min((size / 4 / 3) * 2.0, 2.0);
        this._brushCount = Math.ceil(size / this._brushOverlap);
        this._previewContext.lineWidth = this._brushSize;
    }

    onPointerDown(event: PointerEvent): void {
        super.onPointerDown(event);
    }

    onPointerMove(event: PointerEvent): void {
        super.onPointerMove(event);
        this._clear();
        this._previewContext.beginPath();
        for (let i = 0; i < this._brushCount; i++) {
            const lineDiff = this._brushOverlap * (i - Math.floor(this._brushCount / 2));
            for (let j = 0; j < this._points.length - 1; j++) {
                this._previewContext.moveTo(
                    this._points[j].x + lineDiff * 0.75,
                    this._points[j].y + lineDiff
                );
                this._previewContext.lineTo(
                    this._points[j + 1].x + lineDiff * 0.75,
                    this._points[j + 1].y + lineDiff
                );
            }
        }
        this._previewContext.stroke();
    }

    onPointerUp(event: PointerEvent): void {
        super.onPointerUp(event);
        this._clear();
        this._previewContext.beginPath();
        for (let i = 0; i < this._brushCount; i++) {
            const lineDiff = this._brushOverlap * (i - Math.floor(this._brushCount / 2));
            for (let j = 0; j < this._points.length - 1; j++) {
                this._previewContext.moveTo(
                    this._points[j].x + lineDiff * 0.75,
                    this._points[j].y + lineDiff
                );
                this._previewContext.bezierCurveTo(
                    this._controlPoints[j].cp1.x + lineDiff * 0.75,
                    this._controlPoints[j].cp1.y + lineDiff,
                    this._controlPoints[j].cp2.x + lineDiff * 0.75,
                    this._controlPoints[j].cp2.y + lineDiff,
                    this._points[j + 1].x + lineDiff * 0.75,
                    this._points[j + 1].y + lineDiff
                );
            }
        }
        this._previewContext.stroke();
    }
}
