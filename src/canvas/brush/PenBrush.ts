import { BrushBase } from "./BrushBase";

export class PenBrush extends BrushBase {
    constructor(context: CanvasRenderingContext2D) {
        super(context);

        this._context.lineCap = "round";
        this._context.lineJoin = "round";
    }

    onPointerDown(event: PointerEvent): void {
        super.onPointerDown(event);
        this._context.beginPath();
        this._context.moveTo(event.offsetX, event.offsetY);
    }

    onPointerMove(event: PointerEvent): void {
        super.onPointerMove(event);
        this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);
        this._context.lineTo(event.offsetX, event.offsetY);
        this._context.stroke();
    }

    onPointerUp(event: PointerEvent): void {
        super.onPointerUp(event);
        this._context.closePath();
        this._context.clearRect(0, 0, this._context.canvas.width, this._context.canvas.height);
        this._context.beginPath();
        this._context.moveTo(this._points[0].x, this._points[0].y);
        for (let i = 0; i < this._points.length - 1; i++) {
            const cp1 = this._controlPoints[i].cp1;
            const cp2 = this._controlPoints[i].cp2;
            this._context.bezierCurveTo(
                cp1.x,
                cp1.y,
                cp2.x,
                cp2.y,
                this._points[i + 1].x,
                this._points[i + 1].y
            );
        }
        this._context.stroke();
    }
}
