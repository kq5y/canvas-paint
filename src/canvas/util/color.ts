interface HSVColor {
    h: number;
    s: number;
    v: number;
}

export function hsv2rgba(hsv: HSVColor, opacity: number = 1): number[] {
    function _decimalPart(a: number): number {
        const numStr = a + "";
        const dotIdx = numStr.indexOf(".");
        const result = "0." + (dotIdx > -1 ? numStr.substring(dotIdx + 1) : "0");
        return parseFloat((a > 0 ? "+" : "-") + result);
    }
    hsv.h = Math.max(Math.min(360, hsv.h), 0);
    hsv.s = Math.max(Math.min(100, hsv.s), 0);
    hsv.v = Math.max(Math.min(100, hsv.v), 0);
    let h = hsv.h === 360 ? 0 : hsv.h;
    let hD = _decimalPart(h / 60);
    let sD = hsv.s / 100;
    let vD = hsv.v / 100;
    let a = vD * 255;
    let b = vD * (1 - sD) * 255;
    let c = vD * (1 - sD * hD) * 255;
    let d = vD * (1 - sD * (1 - hD)) * 255;
    let o = opacity;
    if (hsv.s === 0) return [a, a, a, o];
    else if (h >= 0 && h < 60) return [a, d, b, o];
    else if (h >= 60 && h < 120) return [c, a, b, o];
    else if (h >= 120 && h < 180) return [b, a, d, o];
    else if (h >= 180 && h < 240) return [b, c, a, o];
    else if (h >= 240 && h < 300) return [d, b, a, o];
    else if (h >= 300 && h < 360) return [a, b, c, o];
    else return [0, 0, 0, o];
}

export function makeColorStr(color: number[]): string {
    return (
        "rgba(" +
        color[0].toString() +
        "," +
        color[1].toString() +
        "," +
        color[2].toString() +
        "," +
        color[3].toString() +
        ")"
    );
}

export function rgbaStr2Array(color: string): number[] {
    const rgba = color
        .substring(color.indexOf("(") + 1, color.indexOf(")"))
        .split(",")
        .map((v) => parseInt(v));
    return rgba;
}
