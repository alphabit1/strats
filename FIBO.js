class MinMaxQueue {
    constructor(len) {
        this.max_queue = [];
        this.min_queue = [];
        this.length = len;
        this.i=0;
    }

    enqueue(element) {

        //max
        while(this.max_queue.length!==0 && this.max_queue[0][1] < this.i - this.length + 1) {
            this.max_queue.shift();
        }
        while(this.max_queue.length!==0 && this.max_queue[this.max_queue.length-1][0] < element) {
            this.max_queue.pop();
        }
        this.max_queue.push([element, this.i]);

        //min
        while(this.min_queue.length!==0 && this.min_queue[0][1] < this.i - this.length + 1) {
            this.min_queue.shift();
        }
        while(this.min_queue.length!==0 && this.min_queue[this.min_queue.length-1][0] >= element) {
            this.min_queue.pop();
        }
        this.min_queue.push([element, this.i]);

        this.i++;
    }

    get_max() {
        return this.max_queue[0][0];
    }

    get_min() {
        return this.min_queue[0][0];
    }
}

var Indicator = function(config) {
    this.windowMin = Number.MAX_VALUE;
    this.windowMax = Number.MIN_VALUE;
    
    this.queue = new MinMaxQueue(config.histSize);    

    this.thresholds = [0, 0.236, 0.382, 0.5, 0.618, 1];
    this.thres_vals = [];
    this.line0 = 0;
    this.line23_6 = 0;
    this.line38_2 = 0;
    this.line50_0 = 0;
    this.line61_8 = 0;
    this.line100 = 0;
    
    this.numCandle = 0;

    this.histSize = config.histSize;

    /* How close is close to line, this.eps needs to be between 0 - 100*/
    this.eps_config = config.eps/100.0;
    
    this.eps = 0;
    
};

Indicator.prototype.update = function(candle) {
    
    this.queue.enqueue(candle.close);
    this.windowMin = this.queue.get_min();
    this.windowMax = this.queue.get_max();
    
    let diff = this.windowMax - this.windowMin;
    this.eps = diff*this.eps_config;
    
    this.thres_vals = [];
    for(let ind in this.thresholds) {
        this.thres_vals.push(this.thresholds[ind]*diff + this.windowMin);
    }
}


Indicator.prototype.calculate = function(candle) {
    
}

module.exports = Indicator;