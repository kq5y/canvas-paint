import { useMemo, useRef, useState } from "react";
import { hsvToRgb } from "./util";

type Mode =
    | "pen"
    | "pencil"
    | "marker"
    | "eraser"
    | "fill"
    | "line"
    | "rect"
    | "circle";

function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mode, setMode] = useState<Mode>("pen");
    const [color, setColor] = useState({ h: 0, s: 0, v: 0 });
    const rgbStr = useMemo(() => {
        const rgb = hsvToRgb({ h: color.h, s: color.s, v: color.v });
        return `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
    }, [color]);
    const changeModeHandler = (mode: Mode) => {
        setMode(mode);
    };
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
                    <button>Back</button>
                    <button>Clear</button>
                </div>
                <div
                    className="colors"
                    style={{ display: "grid", gridTemplateColumns: "1fr" }}
                >
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
                            setColor({ ...color, h: parseInt(e.target.value) });
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
                            setColor({ ...color, s: parseInt(e.target.value) });
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
                            setColor({ ...color, v: parseInt(e.target.value) });
                        }}
                    />
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
                <canvas width={800} height={600} ref={canvasRef} />
            </div>
        </div>
    );
}

export default Canvas;
