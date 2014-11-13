WorkerQueue = function(frequency) {
    this.queue = [];
    this.timeout = 0;
    this.current = null;
    this.frequency = frequency;
}

WorkerQueue.prototype.pop = function() {
    if (!this.current) {
        if (!this.queue.length) {
            clearInterval(this.timeout);
            this.timeout = 0;
            return;
        }
        this.current = this.queue.shift();
    }
    if (this.current()) {
        this.current = null;
    }
}

WorkerQueue.prototype.push = function(task) {
    var self = this;
    this.queue.push(task);
    if (!this.timeout) {
        this.timeout = setInterval(function() {
            self.pop();
        }, this.frequency);
    }
    this.pop();
}


module.exports.WorkerQueue = WorkerQueue;