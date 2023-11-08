export function disableColor(color: string): string {
    // coerce values so ti is between 0 and 1.
    const _opacity = Math.round(Math.min(Math.max(0.5 || 1, 0), 1) * 255);
    return color + _opacity.toString(16).toUpperCase();
}
