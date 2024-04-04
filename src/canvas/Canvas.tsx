import { useEffect, useMemo, useRef, useState } from "react";
import { HSVColor, hsvToRgb } from "./util";
import { Mode, Paint } from "./paint";

const LAYER_COUNT = 2;

function Canvas() {
    const paintRef = useRef<Paint | null>(null);
    const previewCanvasRefs = Array.from({ length: LAYER_COUNT }, () =>
        useRef<HTMLCanvasElement>(null)
    );
    const canvasRefs = Array.from({ length: LAYER_COUNT }, () => useRef<HTMLCanvasElement>(null));
    const [mode, setMode] = useState<Mode>("pen");
    const [brushSize, setBrushSize] = useState(5);
    const [opacity, setOpacity] = useState(100);
    const [color, setColor] = useState<HSVColor>({ h: 0, s: 0, v: 0 });
    const [layerIndex, setLayerIndex] = useState(LAYER_COUNT - 1);
    const rgbStr = useMemo(() => {
        const rgb = hsvToRgb({ h: color.h, s: color.s, v: color.v });
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }, [color]);
    const changeModeHandler = (_mode: Mode) => {
        setMode(_mode);
        if (paintRef.current) {
            paintRef.current.mode = _mode;
        }
    };
    const changeBrushSizeHandler = (_size: number) => {
        setBrushSize(_size);
        if (paintRef.current) {
            paintRef.current.brushSize = _size;
        }
    };
    const changeOpacityHandler = (_opacity: number) => {
        setOpacity(_opacity);
        if (paintRef.current) {
            paintRef.current.opacity = _opacity;
        }
    };
    const changeColorHandler = (_color: HSVColor) => {
        setColor(_color);
        if (paintRef.current) {
            paintRef.current.color = _color;
        }
    };
    const undoHandler = () => {
        if (paintRef.current) {
            paintRef.current.undo();
        }
    };
    const clearHandler = () => {
        if (paintRef.current) {
            paintRef.current.clear();
        }
    };
    const changeLayerIndexHandler = (_index: number) => {
        setLayerIndex(_index);
        if (paintRef.current) {
            paintRef.current.layerIndex = _index;
        }
    };
    useEffect(() => {
        paintRef.current = new Paint(
            previewCanvasRefs.map((ref) => ref.current!),
            canvasRefs.map((ref) => ref.current!),
            mode,
            brushSize,
            opacity,
            color,
            layerIndex
        );
        paintRef.current.initialize();
        return () => {
            if (paintRef.current) {
                paintRef.current.destroy();
            }
        };
    }, []);
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "row",
                gap: "1rem",
                userSelect: "none"
            }}
        >
            <div
                className="toolbar"
                style={{
                    display: "flex",
                    gap: "1rem",
                    width: "160px",
                    flexDirection: "column"
                }}
            >
                <div
                    className="tools"
                    style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1rem"
                    }}
                >
                    <button
                        style={{
                            background: mode === "pen" ? "black" : "gray"
                        }}
                        onClick={() => changeModeHandler("pen")}
                    >
                        Pen
                    </button>
                    <button
                        style={{
                            background: mode === "pencil" ? "black" : "gray"
                        }}
                        onClick={() => changeModeHandler("pencil")}
                    >
                        Pencil
                    </button>
                    <button
                        style={{
                            background: mode === "marker" ? "black" : "gray"
                        }}
                        onClick={() => changeModeHandler("marker")}
                    >
                        Marker
                    </button>
                    <button
                        style={{
                            background: mode === "eraser" ? "black" : "gray"
                        }}
                        onClick={() => changeModeHandler("eraser")}
                    >
                        Eraser
                    </button>
                    <button
                        style={{
                            background: mode === "fill" ? "black" : "gray"
                        }}
                        onClick={() => changeModeHandler("fill")}
                    >
                        Fill
                    </button>
                    <button
                        style={{
                            background: mode === "line" ? "black" : "gray"
                        }}
                        onClick={() => changeModeHandler("line")}
                    >
                        Line
                    </button>
                    <button
                        style={{
                            background: mode === "rect" ? "black" : "gray"
                        }}
                        onClick={() => changeModeHandler("rect")}
                    >
                        Rect
                    </button>
                    <button
                        style={{
                            background: mode === "circle" ? "black" : "gray"
                        }}
                        onClick={() => changeModeHandler("circle")}
                    >
                        Circle
                    </button>
                    <button onClick={undoHandler}>Undo</button>
                    <button onClick={clearHandler}>Clear</button>
                </div>
                <div className="settings" style={{ display: "grid", gridTemplateColumns: "1fr" }}>
                    <label htmlFor="brushSize">Brush Size</label>
                    <input
                        type="range"
                        id="brushSize"
                        min={1}
                        max={100}
                        step={1}
                        value={brushSize}
                        onChange={(e) => {
                            changeBrushSizeHandler(parseInt(e.target.value));
                        }}
                    />
                    <label htmlFor="opacity">Opacity</label>
                    <input
                        type="range"
                        id="opacity"
                        min={0}
                        max={100}
                        step={1}
                        value={opacity}
                        onChange={(e) => {
                            changeOpacityHandler(parseInt(e.target.value));
                        }}
                    />
                </div>
                <div className="colors" style={{ display: "grid", gridTemplateColumns: "1fr" }}>
                    <label>Color</label>
                    <div
                        style={{
                            width: "100%",
                            height: "1rem",
                            background: rgbStr
                        }}
                    />
                    <label htmlFor="colorH">H</label>
                    <input
                        type="range"
                        id="colorH"
                        min={0}
                        max={360}
                        step={1}
                        value={color.h}
                        onChange={(e) => {
                            changeColorHandler({
                                ...color,
                                h: parseInt(e.target.value)
                            });
                        }}
                    />
                    <label htmlFor="colorS">S</label>
                    <input
                        type="range"
                        id="colorS"
                        min={0}
                        max={100}
                        step={1}
                        value={color.s}
                        onChange={(e) => {
                            changeColorHandler({
                                ...color,
                                s: parseInt(e.target.value)
                            });
                        }}
                    />
                    <label htmlFor="colorV">V</label>
                    <input
                        type="range"
                        id="colorV"
                        min={0}
                        max={100}
                        step={1}
                        value={color.v}
                        onChange={(e) => {
                            changeColorHandler({
                                ...color,
                                v: parseInt(e.target.value)
                            });
                        }}
                    />
                </div>
                <div className="layers" style={{ display: "grid", gridTemplateColumns: "1fr" }}>
                    <label htmlFor="layerIndex">Layer</label>
                    {Array.from({ length: LAYER_COUNT }).map((_, i) => (
                        <button
                            key={i}
                            style={{
                                background: layerIndex === LAYER_COUNT - 1 - i ? "black" : "gray"
                            }}
                            onClick={() => changeLayerIndexHandler(LAYER_COUNT - 1 - i)}
                        >
                            {LAYER_COUNT - i}
                        </button>
                    ))}
                </div>
            </div>
            <div
                style={{
                    background: "white",
                    width: "800px",
                    height: "600px",
                    position: "relative"
                }}
            >
                {Array.from({ length: LAYER_COUNT }).map((_, i) => (
                    <div key={i} style={{ position: "relative" }}>
                        <canvas
                            width={800}
                            height={600}
                            ref={canvasRefs[i]}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                zIndex: i * 2
                            }}
                        />
                        <canvas
                            width={800}
                            height={600}
                            ref={previewCanvasRefs[i]}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                zIndex: i * 2 + 1
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Canvas;
