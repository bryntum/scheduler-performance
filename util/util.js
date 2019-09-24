/**
 * Utility class that measures FPS.
 */
export class FPS {
    /**
     * Start measuring
     */
    static start() {
        this.start = null;
        this.frameCount = 0;
        this.running = true;
        this.frames = [];
        this.prevFrameTime = null;

        console.log('Starting frame counter');

        requestAnimationFrame(this.frameCounter);
    }

    /**
     * Stop measuring and print the result to console
     */
    static stop() {
        this.running = false;

        const
            elapsed = performance.now() - this.start,
            sum     = this.frames.reduce((sum, time) => sum += time),
            average = this.frames.length / (sum / 1000),
            fps     = this.frameCount / (elapsed / 1000);

        console.table({
            'Elapsed time'  : elapsed,
            'Frames'        : this.frameCount,
            'Frame sum'     : sum,
            'Average FPS 1' : fps,
            'Average FPS 2' : average
        });

        //console.log(this.frames);
    }

    // Internal function that counts animation frames
    static frameCounter() {
        const time = performance.now();

        if (FPS.start === null) {
            FPS.start = time;
            FPS.prevFrameTime = time;
        } else {
            FPS.frameCount++;
            FPS.frames.push(time - FPS.prevFrameTime);
        }

        FPS.prevFrameTime = time;

        if (FPS.running) {
            requestAnimationFrame(FPS.frameCounter)
        }
    }
}

/**
 * Utility class that measures initial rendering time (actually it times whatever).
 */
export class RenderTimer {
    /**
     * Start measuring. In `sync` mode it will call the callback and then stop the timer.
     * When not in `sync` mode you should manually call `stop()
     * @param {Boolean} sync
     * @param {Function} callback
     */
    static start({ sync = true, callback }) {
        this.start = performance.now();
        this.running = true;

        const promise = new Promise(resolve => {
            this.resolve = resolve;
        });

        console.log('Starting initial rendering measurement');

        callback && callback();

        if (sync) {
            this.stop();
        }

        return promise;
    }

    /**
     * Stop measuring
     */
    static stop() {
        if (this.running) {
            const elapsed = performance.now() - this.start;

            console.table({
                'Initial rendering (ms)' : elapsed
            });

            this.running = false;

            this.resolve();
        }
    }
}

/**
 * Utility class that scrolls an element a predetermined distance by updating its `scrollTop` on a timer
 */
export class Scroller {
    /**
     * Start scrolling, will stop automatically when `distance` is reached
     * @param {HTMLElement} element Element to scroll
     * @param {Number} distance Target distance to scroll
     * @param {Number} speed Initial scroll speed (px per update)
     * @param {Number} maxSpeed Max scroll speed (px per update)
     * @param {Number} acceleration Added to `speed` on each scroll, up to `maxSpeed`
     * @param {Function} callback Callback to call when done scrolling
     * @param {Function} scrollFn Function to call instead of setting `scrollTop` on the element
     */
    static scroll({ element, distance = 75000, speed = 5, maxSpeed = 1500, acceleration = 1.5, callback, scrollFn }) {
        let scrollTop = 0;

        console.log('Starting to scroll', element);

        const intervalId = setInterval(() => {
            if (scrollFn) {
                scrollFn(scrollTop)
            } else {
                element.scrollTop = scrollTop;
            }

            scrollTop += speed;

            if (speed < maxSpeed) {
                speed += acceleration;
            }

            if (scrollTop > distance) {
                clearInterval(intervalId);

                console.log('Finished scrolling');

                callback && callback();
            }
        }, 1);
    }
}

export class TreeGenerator {
    static generate({ nodeCount, depth, childrenProperty }) {
        const allNodes = [];

        let count = 0;

        function generateChildren(curDepth, parentId) {
            const
                children = [],
                leafs    = curDepth === depth;

            for (let i = 0; i < 5; i++) {
                count++;

                if (count > nodeCount) {
                    return children;
                }

                const node = {
                    id                                  : count,
                    name                                : (leafs ? 'File ' : 'Folder ') + count,
                    parentId,
                    expanded                            : true,
                    number1                             : count % 2,
                    number2                             : count % 3,
                    number3                             : count % 4,
                    number4                             : count % 5,
                    number5                             : count % 6,
                    number6                             : count % 7,
                    number7                             : count % 8,
                    number8                             : count % 9,
                    number9                             : count % 10,
                    number10                            : count % 11,
                    number11                            : count % 12,
                    number12                            : count % 13,
                    number13                            : count % 14,
                    number14                            : count % 15,
                    number15                            : count % 16,
                    number16                            : count % 17,
                    number17                            : count % 18,
                    number18                            : count % 19,
                    number19                            : count % 20,
                    number20                            : count % 21,
                    [leafs ? 'leaf' : childrenProperty] : leafs ? true : generateChildren(curDepth + 1, count)
                };

                children.push(node);

                allNodes.push(node);
            }

            return children;
        }

        return { tree : generateChildren(0), allNodes };
    }
}

export class EventGenerator {
    static generate(resourceCount = 2500, eventPerResourceCount = 20) {
        const events = [];

        for (let i = 1; i < resourceCount + 1; i++) {
            for (let j = 1; j < eventPerResourceCount + 1; j++) {
                const event = {
                    id         : events.length + 1,
                    resourceId : i,
                    name       : `Event R${i}E${j}`,
                    startDate  : new Date(2019, 8, 20, 8 + Math.floor(Math.random() * Math.floor(150))),
                    duration   : Math.floor(Math.random() * Math.floor(5)) + 1
                };

                event.endDate = new Date(event.startDate.getTime() + event.duration * 60 * 60 * 1000);

                events.push(event);
            }
        }

        return events;
    }
}

export const count = 50;
