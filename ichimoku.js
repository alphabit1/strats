'use strict';
var _ = require('lodash');

var
    tenkanSen   = null,
    kijunSen    = null,
    senkouSpanB = null,
    current     = null,
    data = []
    ;

function getCurrent(candle) {

    return {
        candle: candle,
        tenkanSen: null,
        kijunSen: null,
        senkouSpanA: null,
        senkouSpanB: null
    };
}


function average(v1, v2) {
    return (v1+v2)/2;
}

//@var current.candle {id: int, start: {}, open: float, high: float, low: float, close: float, vwp: float, volume: float, trades: int }
function calculate(current) {

    var
        min = current.candle.low,
        max = current.candle.high,
        current_position,
        _counter  = 1,
        _current_data
        ;

    // Iterate through the data from last to first
    for(var i = data.length - 1; i >= 0; i--) { //data.length is SenkouSpanB (52)

        //previous candle
        _current_data = data[i];
        current_position = i+1;

        console.log('current:', _current_data, i);

        min = Math.min(min, _current_data.candle.low);
        max = Math.max(max, _current_data.candle.high);


        //we got min, max for tenkanSen steps
        if (current_position === tenkanSen) {

            current.tenkanSen = average(min, max);
        }


        //we got min, max for kijunSen steps
        if (current_position === kijunSen ) {

            current.kijunSen = average(min, max);
            current.senkouSpanA  = average(min, max);
        }


        //we got min, max for kijunSen steps
        if (current_position === senkouSpanB ) {

            current.senkouSpanB = average(min, max);
        }

        _counter++;
    }


    return current;
}


var Indicator = function(config) {

    tenkanSen   = config.tenkanSen || 9;
    kijunSen    = config.kijunSen || 26;
    senkouSpanB = config.senkouSpanB || 52;

}

Indicator.prototype.update = function(candle) {

    current = getCurrent(candle);

    if (data.length < senkouSpanB ) {

        data.push(current);

        return null;
    }

    if (data.length > senkouSpanB ) {

        _.drop(data); //drop first element
    }

    current = calculate(current);
    data.push(current);

    this.result = {
            tenkanSen: current.tenkanSen,
            kijunSen: current.kijunSen,
            senkouSpanA: data[data.length - 1 -  kijunSen], //get value stored {kijunSen} steps ago. last element's index is data.length - 1
            senkouSpanB: data[data.length - 1 -  kijunSen], //get value stored {kijunSen} steps ago
        };


    return this.result;

}

module.exports = Indicator;
