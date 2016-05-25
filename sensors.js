#!/usr/bin/env node

var i2c = require('i2c-bus'),
  i2c1 = i2c.openSync(1);

var PCF8591_ADDR = 0x48;
var PHOTOCELL_BYTE = 0x00,
  TMP36_BYTE = 0x02,
  POT_BYTE = 0x03;

var testByte = TMP36_BYTE;
console.log("Testing %s", testByte);

setTimeout(function() {
    var readByteValue = i2c1.readByteSync(PCF8591_ADDR, testByte);
    console.log("readByteValue: 0x" + readByteValue.toString(16))
    console.log("readByteValue: " + readByteValue)

    setTimeout(function() {
        var receiveByteValue = i2c1.receiveByteSync(PCF8591_ADDR);
        console.log("1: sensor is reading: 0x" + receiveByteValue.toString(16));
        console.log("1: sensor is reading: " + receiveByteValue);

        setTimeout(function() { i2c1.closeSync(); }, 2000);
    }, 5000);
}, 5000);

/*
var val = i2c1.sendByteSync(PCF8591_ADDR, TMP36_BYTE);
console.log("val is: " + val)
receiveByteValue = i2c1.receiveByteSync(PCF8591_ADDR);
console.log("1: sensor is reading: " + receiveByteValue);
receiveByteValue = i2c1.receiveByteSync(PCF8591_ADDR);
console.log("2: sensor is reading: " + receiveByteValue);
*/    

/*
var i2c = require('i2c-bus'),
  i2c1 = i2c.openSync(1);

var PCF8591_ADDR = 0x48;
var PHOTOCELL_BYTE = 0x00,
  TMP36_BYTE = 0x02,
  POT_BYTE = 0x03;

i2c1.readByteSync(PCF8591_ADDR, TMP36_BYTE)
var tempValue = i2c1.receiveByteSync(PCF8591_ADDR);
console.log("thermoresistor is reading: " + tempValue.toString(16));
tempValue = i2c1.receiveByteSync(PCF8591_ADDR);
console.log("thermoresistor is reading: " + tempValue);
var volts = tempValue / 255 * 3.3;
console.log("TMP36 is reading volts: " + volts);

var celcius = (volts - .5) * 100;
console.log("celcius: " + celcius);

var far = celcius * 9 / 5 + 32;
console.log("fahrenheit: " + far);

i2c1.readByteSync(PCF8591_ADDR, PHOTOCELL_BYTE)
var photoValue = i2c1.receiveByteSync(PCF8591_ADDR);
console.log("photoresistor is reading: " + photoValue.toString(16))
photoValue = i2c1.receiveByteSync(PCF8591_ADDR);
console.log("photoresistor is reading: " + photoValue)

i2c1.readByteSync(PCF8591_ADDR, POT_BYTE)
var potValue = i2c1.receiveByteSync(PCF8591_ADDR);
console.log("potentiometer is reading: " + potValue.toString(16))
potValue = i2c1.receiveByteSync(PCF8591_ADDR);
console.log("potentiometer is reading: " + potValue)
i2c1.closeSync();
*/

