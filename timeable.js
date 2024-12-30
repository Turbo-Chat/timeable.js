/**
 * Timeable API
 * Version: 1.0.0
 * Author: TurboChat
 * Description: A customizable timer API for TurboChat applications.
 */

class Timeable {
    /**
     * Creates a new Timeable instance.
     * @param {string} elementId - The ID of the HTML element where the timer will be displayed.
     * @param {number} duration - The duration of the timer in seconds.
     * @param {object} options - Additional options for the timer.
     */
    constructor(elementId, duration, options = {}) {
        this.element = document.getElementById(elementId);
        if (!this.element) {
            console.error(`Timeable Error: Element with ID '${elementId}' not found.`);
            return;
        }

        this.duration = duration;
        this.remainingTime = duration;
        this.interval = null;
        this.options = options;
        this.format = options.format || 'mm:ss';
        this.onComplete = typeof options.onComplete === 'function' ? options.onComplete : null;
        this.onTick = typeof options.onTick === 'function' ? options.onTick : null;

        this.render();
    }

    /**
     * Renders the initial timer display.
     */
    render() {
        this.element.classList.add('timeable-timer');
        this.element.innerText = this.formatTime(this.remainingTime);
    }

    /**
     * Starts the timer countdown.
     */
    start() {
        if (this.interval) {
            console.warn('Timeable Warning: Timer is already running.');
            return;
        }

        this.interval = setInterval(() => {
            if (this.remainingTime > 0) {
                this.remainingTime--;
                this.updateDisplay();

                if (this.onTick) {
                    this.onTick(this.remainingTime);
                }
            } else {
                this.complete();
            }
        }, 1000);
    }

    /**
     * Pauses the timer countdown.
     */
    pause() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        } else {
            console.warn('Timeable Warning: Timer is not running.');
        }
    }

    /**
     * Resets the timer to the initial duration.
     */
    reset() {
        this.pause();
        this.remainingTime = this.duration;
        this.updateDisplay();
        this.element.classList.remove('complete');
    }

    /**
     * Completes the timer, stopping the countdown and triggering the onComplete callback.
     */
    complete() {
        this.pause();
        this.element.innerText = this.formatTime(0);
        this.element.classList.add('complete');

        if (this.onComplete) {
            this.onComplete();
        }
    }

    /**
     * Updates the timer display based on the remaining time and format.
     */
    updateDisplay() {
        this.element.innerText = this.formatTime(this.remainingTime);
    }

    /**
     * Formats the time based on the specified format.
     * @param {number} seconds - The time in seconds.
     * @returns {string} - The formatted time string.
     */
    formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        let formattedTime = '';

        if (this.format.includes('hh')) {
            formattedTime += `${this.padZero(hrs)}:`;
        }
        if (this.format.includes('mm')) {
            formattedTime += `${this.padZero(mins)}:`;
        }
        if (this.format.includes('ss')) {
            formattedTime += `${this.padZero(secs)}`;
        }

        return formattedTime;
    }

    /**
     * Pads a number with a leading zero if it's less than 10.
     * @param {number} num - The number to pad.
     * @returns {string} - The padded number as a string.
     */
    padZero(num) {
        return num < 10 ? `0${num}` : `${num}`;
    }
}

/**
 * Initializes a timer on the specified element.
 * @param {string} elementId - The ID of the HTML element where the timer will be displayed.
 * @param {number} duration - The duration of the timer in seconds.
 * @param {object} options - Additional options for the timer.
 * @returns {Timeable|null} - The Timeable instance or null if initialization fails.
 */
function initializeTimer(elementId, duration, options = {}) {
    const timer = new Timeable(elementId, duration, options);
    if (timer.element) {
        timer.start();
        return timer;
    }
    return null;
}

// Exporting Timeable and initializeTimer for usage in modules (if applicable)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
    module.exports = { Timeable, initializeTimer };
}
