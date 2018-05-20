var base58 = require('base58-native');
var cnUtil = require('@vigcoin/cryptonote-util');
var fs = require('fs');
var path = require('path');
var assert = require("assert");

exports.uid = function () {
    var min = 100000000000000;
    var max = 999999999999999;
    var id = Math.floor(Math.random() * (max - min + 1)) + min;
    return id.toString();
};

exports.ringBuffer = function (maxSize) {
    var data = [];
    var cursor = 0;
    var isFull = false;

    return {
        append: function (x) {
            if (isFull) {
                data[cursor] = x;
                cursor = (cursor + 1) % maxSize;
            }
            else {
                data.push(x);
                cursor++;
                if (data.length === maxSize) {
                    cursor = 0;
                    isFull = true;
                }
            }
        },
        avg: function (plusOne) {
            var sum = data.reduce(function (a, b) { return a + b }, plusOne || 0);
            return sum / ((isFull ? maxSize : cursor) + (plusOne ? 1 : 0));
        },
        size: function () {
            return isFull ? maxSize : cursor;
        },
        clear: function () {
            data = [];
            cursor = 0;
            isFull = false;
        }
    };
};

exports.varIntEncode = function (n) {

};

exports.isBanned = function (address, filename) {
  assert(address);
  filename = filename || path.resolve(__dirname, '../ban.txt');
  var array = fs.readFileSync(filename).toString().split("\n");
  if (array.indexOf(address) !== -1) {
    return true;
  }
  return false;
}


