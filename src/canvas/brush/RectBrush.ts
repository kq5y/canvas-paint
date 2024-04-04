import { BrushBase } from "./BaseBrush";

export class RectBrush extends BrushBase {
    _startPoint: { x: number; y: number } | null;

    constructor(
        context: CanvasRenderingContext2D,
        previewContext: CanvasRenderingContext2D,
        brushSize: number,
        opacity: number,
        color: string
    ) {
        super(context, previewContext, false);

        this._startPoint = null;

        this.setBrushSize(brushSize);
        this.setOpacity(opacity);
        this.setColor(color);

        this._previewContext.lineCap = "round";
        this._previewContext.lineJoin = "round";
    }

    onPointerDown(event: PointerEvent): void {
        this._startPoint = { x: event.offsetX, y: event.offsetY };
    }

    onPointerMove(event: PointerEvent): void {
        if (!this._startPoint) {
            return;
        }
        this._clear();
        this._previewContext.beginPath();
        this._previewContext.rect(
            this._startPoint.x,
            this._startPoint.y,
            event.offsetX - this._startPoint.x,
            event.offsetY - this._startPoint.y
        );
        this._previewContext.stroke();
    }

    onPointerUp(event: PointerEvent): void {
        if (!this._startPoint) {
            return;
        }
        this._clear();
        this._previewContext.beginPath();
        this._previewContext.rect(
            this._startPoint.x,
            this._startPoint.y,
            event.offsetX - this._startPoint.x,
            event.offsetY - this._startPoint.y
        );
        this._previewContext.stroke();
        this._startPoint = null;
    }
}
