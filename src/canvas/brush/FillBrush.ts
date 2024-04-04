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
        return p1[0] === p2[0] && p1[1] === p2[1] && p1[2] === p2[2] && p1[3] === p2[3];
    }

    _compareColor(
        imageData: ImageData,
        x: number,
        y: number,
        selectedColor: number[],
        targetColor: number[]
    ): 0 | 1 | 2 {
        if (x < 0 || x >= this._width || y < 0 || y >= this._height) return 1;

        const color = new Array(3);
        color[0] = imageData.data[(y * this._width + x) * 4];
        color[1] = imageData.data[(y * this._width + x) * 4 + 1];
        color[2] = imageData.data[(y * this._width + x) * 4 + 2];
        color[3] = imageData.data[(y * this._width + x) * 4 + 3];

        if (this._pixelsEqual(targetColor, color)) return 1;
        if (!this._pixelsEqual(selectedColor, color)) return 2;

        return 0;
    }

    _fill(point: { x: number; y: number }): void {
        if (point.x < 0 || point.x >= this._width || point.y < 0 || point.y >= this._height) return;

        const x = Math.floor(point.x),
            y = Math.floor(point.y);
        const imageData = this._context.getImageData(0, 0, this._width, this._height);
        const color = [...rgbaStr2Array(this._color).slice(0, 3), (this._opacity / 100) * 255];

        const selectedColor = new Array(3);
        selectedColor[0] = imageData.data[(y * this._width + x) * 4];
        selectedColor[1] = imageData.data[(y * this._width + x) * 4 + 1];
        selectedColor[2] = imageData.data[(y * this._width + x) * 4 + 2];
        selectedColor[3] = imageData.data[(y * this._width + x) * 4 + 3];

        if (this._pixelsEqual(selectedColor, color)) {
            return;
        }

        const pxlArr: { x: number; y: number }[] = [{ x: x, y: y }];
        const bpxlArr: { x: number; y: number }[] = [];
        let idx, p;

        while (pxlArr.length) {
            p = pxlArr.pop();

            if (p && this._compareColor(imageData, p.x, p.y, selectedColor, color) === 0) {
                idx = (p.y * this._width + p.x) * 4;
                imageData.data[idx] = color[0];
                imageData.data[idx + 1] = color[1];
                imageData.data[idx + 2] = color[2];
                imageData.data[idx + 3] = color[3];

                let r;
                r = this._compareColor(imageData, p.x, p.y - 1, selectedColor, color);
                if (r === 0) {
                    pxlArr.push({ x: p.x, y: p.y - 1 });
                } else if (r === 2) {
                    bpxlArr.push({ x: p.x, y: p.y - 1 });
                }
                r = this._compareColor(imageData, p.x + 1, p.y, selectedColor, color);
                if (r === 0) {
                    pxlArr.push({ x: p.x + 1, y: p.y });
                } else if (r === 2) {
                    bpxlArr.push({ x: p.x + 1, y: p.y });
                }
                r = this._compareColor(imageData, p.x, p.y + 1, selectedColor, color);
                if (r === 0) {
                    pxlArr.push({ x: p.x, y: p.y + 1 });
                } else if (r === 2) {
                    bpxlArr.push({ x: p.x, y: p.y + 1 });
                }
                r = this._compareColor(imageData, p.x - 1, p.y, selectedColor, color);
                if (r === 0) {
                    pxlArr.push({ x: p.x - 1, y: p.y });
                } else if (r === 2) {
                    bpxlArr.push({ x: p.x - 1, y: p.y });
                }
            }
        }

        while (bpxlArr.length) {
            p = bpxlArr.pop();
            if (p) {
                idx = (p.y * this._width + p.x) * 4;
                imageData.data[idx] = color[0];
                imageData.data[idx + 1] = color[1];
                imageData.data[idx + 2] = color[2];
                imageData.data[idx + 3] = color[3];
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
