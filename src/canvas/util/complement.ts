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

/**
 * 特定の距離ごとにBezier曲線上の点を取得する
 * @param p1 Bezier曲線の始点
 * @param p2 Bezier曲線の終点
 * @param cp1 Bezier曲線の制御点1
 * @param cp2 Bezier曲線の制御点2
 * @param distance 距離
 * @param startGap 開始地点からの距離
 * @returns Bezier曲線上の点の配列と残りの距離
 */
export function getBezierCurvePoints(
    p1: Point,
    p2: Point,
    cp1: Point,
    cp2: Point,
    distance: number,
    startGap: number = 0
): { points: Point[]; remaining: number } {
    const points: Point[] = [];
    let currentDistance = startGap;
    let currentPoint = p1;
    for (let t = 0; t < 1; t += 0.01) {
        const nextPoint = {
            x:
                (1 - t) *
                    ((1 - t) * ((1 - t) * p1.x + t * cp1.x) + t * ((1 - t) * cp1.x + t * cp2.x)) +
                t * ((1 - t) * ((1 - t) * cp1.x + t * cp2.x) + t * ((1 - t) * cp2.x + t * p2.x)),
            y:
                (1 - t) *
                    ((1 - t) * ((1 - t) * p1.y + t * cp1.y) + t * ((1 - t) * cp1.y + t * cp2.y)) +
                t * ((1 - t) * ((1 - t) * cp1.y + t * cp2.y) + t * ((1 - t) * cp2.y + t * p2.y))
        };
        const segmentLength = Math.sqrt(
            Math.pow(nextPoint.x - currentPoint.x, 2) + Math.pow(nextPoint.y - currentPoint.y, 2)
        );
        if (currentDistance + segmentLength >= distance) {
            const ratio = (distance - currentDistance) / segmentLength;
            const point = {
                x: currentPoint.x + (nextPoint.x - currentPoint.x) * ratio,
                y: currentPoint.y + (nextPoint.y - currentPoint.y) * ratio
            };
            points.push(point);
            currentPoint = nextPoint;
            currentDistance = currentDistance + segmentLength - distance;
        } else {
            currentPoint = nextPoint;
            currentDistance += segmentLength;
        }
    }
    return { points, remaining: currentDistance };
}
