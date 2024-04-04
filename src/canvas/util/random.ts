export class Random {
    private defaultSeed: number;
    private seed: number;

    constructor(seed: number) {
        this.defaultSeed = seed;
        this.seed = seed;
    }

    _next(): number {
        let x = this.seed;
        x ^= x << 7;
        x ^= x >>> 9;
        this.seed = x;
        return x;
    }

    /**
     * 乱数を生成する (0 <= n < 1)
     */
    random(): number {
        return Math.abs(this._next()) / 0x80000000;
    }

    reset(): void {
        this.seed = this.defaultSeed;
    }
}
