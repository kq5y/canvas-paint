import { rgbaStr2Array } from "../util/color";
import { BrushBase } from "./BaseBrush";

export class FillBrush extends BrushBase {
    _fillable: boolean;
    _width: number;
    _height: number;
    _imageData: ImageData | null;

    constructor(
        context: CanvasRenderingContext2D,
        previewContext: CanvasRenderingContext2D,
        brushSize: number,
        opacity: number,
        color: string
    ) {
        super(context, previewContext, false);

        this._fillable = true;
        this._width = this._previewContext.canvas.width;
        this._height = this._previewContext.canvas.height;
        this._imageData = null;

        this.setBrushSize(brushSize);
        this.setOpacity(opacity);
        this.setColor(color);
    }

    _pixelsEqual(p1: number[], p2: number[]): boolean {
        return p1[0] === p2[0] && p1[1] === p2[1] && p1[2] === p2[2];
    }

    _compareColor(
        imageData: ImageData,
        x: number,
        y: number,
        selectedColor: number[],
        isAlpha: boolean
    ): boolean {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) return false;

        const color = new Array(3);
        color[0] = imageData.data[(y * this._width + x) * 4];
        color[1] = imageData.data[(y * this._width + x) * 4 + 1];
        color[2] = imageData.data[(y * this._width + x) * 4 + 2];

        const alpha = imageData.data[(y * this._width + x) * 4 + 3];

        if (alpha !== 0) {
            if (!this._pixelsEqual(selectedColor, color)) return false;
            if (isAlpha) return false;
        } else if (alpha === 0 && !isAlpha) return false;

        return true;
    }

    _fill(point: { x: number; y: number }): void {
        if (point.x < 0 || point.x >= this._width || point.y < 0 || point.y >= this._height) return;

        const x = Math.floor(point.x),
            y = Math.floor(point.y);
        const imageData = this._context.getImageData(0, 0, this._width, this._height);
        const color = [...rgbaStr2Array(this._color), this._opacity / 100];

        const selectedColor = new Array(3);
        selectedColor[0] = imageData.data[(y * this._width + x) * 4];
        selectedColor[1] = imageData.data[(y * this._width + x) * 4 + 1];
        selectedColor[2] = imageData.data[(y * this._width + x) * 4 + 2];

        const alpha = imageData.data[(y * this._width + x) * 4 + 3];
        const isAlpha = !Boolean(alpha);

        if (alpha !== 0) {
            if (this._pixelsEqual(selectedColor, color)) return;
        }

        const pxlArr: { x: number; y: number }[] = [{ x: x, y: y }];
        let idx, p;

        while (pxlArr.length) {
            p = pxlArr.pop();

            if (p && this._compareColor(imageData, p.x, p.y, selectedColor, isAlpha)) {
                idx = (p.y * this._width + p.x) * 4;
                imageData.data[idx] = color[0];
                imageData.data[idx + 1] = color[1];
                imageData.data[idx + 2] = color[2];
                imageData.data[idx + 3] = 255 * color[3];

                if (this._compareColor(imageData, p.x, p.y - 1, selectedColor, isAlpha)) {
                    pxlArr.push({ x: p.x, y: p.y - 1 });
                }
                if (this._compareColor(imageData, p.x + 1, p.y, selectedColor, isAlpha)) {
                    pxlArr.push({ x: p.x + 1, y: p.y });
                }
                if (this._compareColor(imageData, p.x, p.y + 1, selectedColor, isAlpha)) {
                    pxlArr.push({ x: p.x, y: p.y + 1 });
                }
                if (this._compareColor(imageData, p.x - 1, p.y, selectedColor, isAlpha)) {
                    pxlArr.push({ x: p.x - 1, y: p.y });
                }
            }
        }

        this._imageData = imageData;
    }

    onPointerDown(event: PointerEvent): void {
        if (!this._fillable) return;
        this._fillable = false;
        this._fill({ x: event.offsetX, y: event.offsetY });
        this._fillable = true;
    }

    onPointerMove(): void {}

    onPointerUp(): void {}

    render(): void {
        if (this._context && this._imageData) {
            this._context.clearRect(0, 0, this._width, this._height);
            this._context.putImageData(this._imageData, 0, 0);
            this._imageData = null;
        }
    }
}
