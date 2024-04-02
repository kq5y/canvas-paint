import { BrushBase } from "./BrushBase";

export class EraserBrush extends BrushBase {
    constructor(context: CanvasRenderingContext2D, previewContext: CanvasRenderingContext2D) {
        super(context, previewContext);

        this._previewContext.lineCap = "round";
        this._previewContext.lineJoin = "round";
        this._context.globalCompositeOperation = "destination-out";
        this._initialize();
    }

    _initialize(): void {
        this._previewContext.strokeStyle = "white";
        this._previewContext.globalAlpha = 1;
    }

    render(): void {
        this._context.drawImage(this._previewContext.canvas, 0, 0);
        this._clear();
    }

    onPointerDown(event: PointerEvent): void {
        super.onPointerDown(event);
        this._previewContext.beginPath();
        this._previewContext.moveTo(event.offsetX, event.offsetY);
    }

    onPointerMove(event: PointerEvent): void {
        super.onPointerMove(event);
        this._initialize();
        this._clear();
        this._previewContext.lineTo(event.offsetX, event.offsetY);
        this._previewContext.stroke();
    }

    onPointerUp(event: PointerEvent): void {
        super.onPointerUp(event);
        this._initialize();
        this._previewContext.closePath();
        this._clear();
        this._previewContext.beginPath();
        this._previewContext.moveTo(this._points[0].x, this._points[0].y);
        for (let i = 0; i < this._points.length - 1; i++) {
            const cp1 = this._controlPoints[i].cp1;
            const cp2 = this._controlPoints[i].cp2;
            this._previewContext.bezierCurveTo(
                cp1.x,
                cp1.y,
                cp2.x,
                cp2.y,
                this._points[i + 1].x,
                this._points[i + 1].y
            );
        }
        this._previewContext.stroke();
    }
}
