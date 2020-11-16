var BB = require('technicalindicators').BollingerBands;



var Indicator = function (settings) {
  this.input = 'candle';
  this.interval = settings.period;
  this.standarddeviation = settings.standarddeviation;
  this.result = [];
  this.age = 0;
  this.historyopen =[];
  this.historyhigh =[];
  this.historyclose =[];
  this.historylow =[];
}

Indicator.prototype.update = function(candle) {
  this.historyopen.push(candle.open);
  this.historyhigh.push(candle.high);
  this.historyclose.push(candle.close);
  this.historylow.push(candle.low);

  if(this.historyopen.length > this.interval){
    this.historyopen.shift();
    this.historyhigh.shift();
    this.historyclose.shift();
    this.historylow.shift();

  }
  if(this.age>30){
    this.calculate(candle);
  }

  this.age++;

  return;
}

Indicator.prototype.calculate = function(candle) {
  var input = {
    period: this.interval,
    values: this.historyclose,
    stdDev: this.standarddeviation
  }
var bb = new BB(input);
  this.result =  bb.getResult()[0];
}

module.exports = Indicator;