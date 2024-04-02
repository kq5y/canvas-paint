type Point = { x: number; y: number };

/**
 * Catmull-Rom Spline補完を用いて、点1-点2間のBezier曲線を生成する
 * @param p0 点0
 * @param p1 点1
 * @param p2 点2
 * @param p3 点3
 * @returns
 */
export function calcCatmullRomSpline(
    p0: Point | undefined,
    p1: Point,
    p2: Point,
    p3: Point | undefined
): { cp1: Point; cp2: Point } {
    let B: Point = { x: 0, y: 0 };
    let C: Point = { x: 0, y: 0 };
    if (p0 === undefined && p3 === undefined) {
        B.x = (p2.x - p1.x) / 2;
        B.y = (p2.y - p1.y) / 2;
        C.x = (p2.x - p1.x) / 2;
        C.y = (p2.y - p1.y) / 2;
    } else if (p0 === undefined && p3 !== undefined) {
        B.x = (p2.x - p1.x) / 2;
        B.y = (p2.y - p1.y) / 2;
        C.x = (p2.x - p1.x) / 2;
        C.y = (p2.y - p1.y) / 2;
    } else if (p0 !== undefined && p3 === undefined) {
        B.x = (1 / 2) * p0.x - p1.x + (1 / 2) * p2.x;
        B.y = (1 / 2) * p0.y - p1.y + (1 / 2) * p2.y;
        C.x = (-1 / 2) * p0.x + (1 / 2) * p2.x;
        C.y = (-1 / 2) * p0.y + (1 / 2) * p2.y;
    } else if (p0 !== undefined && p3 !== undefined) {
        B.x = p0.x - (5 / 2) * p1.x + 2 * p2.x - (1 / 2) * p3.x;
        B.y = p0.y - (5 / 2) * p1.y + 2 * p2.y - (1 / 2) * p3.y;
        C.x = (-1 / 2) * p0.x + (1 / 2) * p2.x;
        C.y = (-1 / 2) * p0.y + (1 / 2) * p2.y;
    }
    let cp1: Point = { x: (C.x + 3 * p1.x) / 3, y: (C.y + 3 * p1.y) / 3 };
    let cp2: Point = { x: (B.x - 3 * p1.x + 6 * cp1.x) / 3, y: (B.y - 3 * p1.y + 6 * cp1.y) / 3 };
    return { cp1, cp2 };
}
