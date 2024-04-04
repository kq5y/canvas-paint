import { base64ToBitmap } from "../util/base64";
import { getBezierCurvePoints } from "../util/complement";
import { BrushBase } from "./BaseBrush";

const BRUSH_ASSET =
    "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";
let BRUSH_ASSET_BITMAP: ImageBitmap;
(async () => {
    BRUSH_ASSET_BITMAP = await base64ToBitmap(BRUSH_ASSET, "image/png");
})();

export class PencilBrush extends BrushBase {
    _lastPoint: { x: number; y: number } | null;
    _brushOverlap: number;
    _remainingDistance: number;
    _brush_asset_bitmap: ImageBitmap | null;

    constructor(
        context: CanvasRenderingContext2D,
        previewContext: CanvasRenderingContext2D,
        brushSize: number,
        opacity: number,
        color: string
    ) {
        super(context, previewContext);

        this._lastPoint = null;
        this._brushOverlap = 0;
        this._remainingDistance = 0;
        this._brush_asset_bitmap = null;

        this.setBrushSize(brushSize);
        this.setOpacity(opacity, false);
        this.setColor(color, false);
        this._generateBrushAsset();

        this._previewContext.globalCompositeOperation = "source-over";
    }

    _draw(x: number, y: number): void {
        const angle = Math.random() * Math.PI * 2;
        const opacity = Math.random() * 0.4 + 0.1;
        this._previewContext.globalAlpha = opacity;
        this._previewContext.translate(x, y);
        this._previewContext.rotate(angle);
        this._previewContext.globalCompositeOperation = "source-over";
        this._previewContext.drawImage(
            this._brush_asset_bitmap!,
            -this._brushSize / 2,
            -this._brushSize / 2,
            this._brushSize,
            this._brushSize
        );
        this._previewContext.rotate(-angle);
        this._previewContext.translate(-x, -y);
    }

    _generateBrushAsset(): void {
        this._previewContext.globalCompositeOperation = "source-over";
        this._previewContext.drawImage(BRUSH_ASSET_BITMAP, 0, 0);
        this._previewContext.globalCompositeOperation = "source-in";
        this._previewContext.globalAlpha = this._opacity / 100;
        this._previewContext.fillStyle = this._color;
        this._previewContext.fillRect(0, 0, BRUSH_ASSET_BITMAP.width, BRUSH_ASSET_BITMAP.height);
        const imageData = this._previewContext.getImageData(
            0,
            0,
            BRUSH_ASSET_BITMAP.width,
            BRUSH_ASSET_BITMAP.height
        );
        this._clear();
        createImageBitmap(imageData).then((bitmap) => {
            this._brush_asset_bitmap = bitmap;
        });
    }

    setBrushSize(size: number): void {
        this._brushSize = size;
        this._brushOverlap = Math.max(size / 20, 0.5);
        this._previewContext.lineWidth = this._brushSize;
    }

    setColor(color: string, regenerate: boolean = true): void {
        this._previewContext.strokeStyle = color;
        this._previewContext.fillStyle = color;
        this._color = color;
        if (regenerate) this._generateBrushAsset();
    }

    setOpacity(opacity: number, regenerate: boolean = true): void {
        this._previewContext.globalAlpha = opacity / 100;
        this._opacity = opacity;
        if (regenerate) this._generateBrushAsset();
    }

    onPointerDown(event: PointerEvent): void {
        super.onPointerDown(event);
        this._lastPoint = { x: event.offsetX, y: event.offsetY };
    }

    onPointerMove(event: PointerEvent): void {
        super.onPointerMove(event);
        if (!this._lastPoint) {
            return;
        }
        const distance =
            Math.sqrt(
                Math.pow(event.offsetX - this._lastPoint.x, 2) +
                    Math.pow(event.offsetY - this._lastPoint.y, 2)
            ) + this._remainingDistance;
        const step = Math.floor(distance / this._brushOverlap);
        const processDistance = step * this._brushOverlap;
        this._remainingDistance = distance - processDistance;
        const t_x = (((event.offsetX - this._lastPoint.x) / distance) * processDistance) / step;
        const t_y = (((event.offsetY - this._lastPoint.y) / distance) * processDistance) / step;
        for (let i = 0; i < step; i++) {
            const x: number = this._lastPoint.x + t_x;
            const y: number = this._lastPoint.y + t_y;
            this._draw(x, y);
            this._lastPoint = { x, y };
        }
    }

    onPointerUp(event: PointerEvent): void {
        super.onPointerUp(event);
        this._clear();
        this._lastPoint = null;
        this._remainingDistance = 0;
        for (let i = 0; i < this._points.length - 1; i++) {
            const { points, remaining } = getBezierCurvePoints(
                this._points[i],
                this._points[i + 1],
                this._controlPoints[i].cp1,
                this._controlPoints[i].cp2,
                this._brushOverlap,
                this._remainingDistance
            );
            console.log(this._brushOverlap);
            console.log(points, remaining);
            this._remainingDistance = remaining;
            for (const point of points) {
                this._draw(point.x, point.y);
            }
        }
    }
}
