const DEFAULT_INTERVAL = 1000 / 60;

export const requestAnimationFrame = (() => window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        // if all else fails, use setTimeout
        function frame(callback) {
            // make interval as precise as possible.
            return window.setTimeout(callback,
                (callback.interval || DEFAULT_INTERVAL) / 2);
        })();

export const cancelAnimationFrame = (() => window.cancelAnimationFrame ||
        window.webkitCancelAnimationFrame ||
        window.mozCancelAnimationFrame ||
        window.oCancelAnimationFrame ||
        function frame(id) {
            window.clearTimeout(id);
        })();