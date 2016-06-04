#!/usr/bin/env node

var async = require('async'),
    express = require('express'),
    app = express(),
    logger = require('morgan'),
    i2c = require('i2c-bus');

var i2c1;
var PCF8591_ADDR = 0x48;
var PHOTOCELL_BYTE = 0x00,
    TMP36_BYTE = 0x02,
    POT_BYTE = 0x03;
var TIMEOUT = 2000;

app.use(logger('dev'))
app.get('/test', function (req, res, next) {
    res.send("Test content");
});

function readADC(controlByte, adcCallback) {
    async.waterfall([
        function (cb) {
            i2c1 = i2c.open(1, cb);
        },
        function (cb) {
            console.log("Sending control byte: " + controlByte);
            i2c1.readByte(PCF8591_ADDR, controlByte, cb);
        },
        function(byteRead, cb) {
            console.log("readByte returned: 0x" + byteRead.toString(16));
            setTimeout(function() {
                i2c1.receiveByte(PCF8591_ADDR, cb);
            }, TIMEOUT);
        },
        function(byteReceived, cb) {
            console.log("receiveByte returned: 0x" + byteReceived.toString(16));
            adcCallback(byteReceived);
            i2c1.close(cb);
            console.log("Closed bus...");
        }
        ], function (err) {
            if (err) throw err;
        });
}

app.get('/temp', function (req, res, next) {
    readADC(TMP36_BYTE, function(adcByteReceived) {
        console.log("adcCallback with: " + adcByteReceived.toString(16));
        var tempValue = adcByteReceived;
        var volts = tempValue / 255 * 3.3;
        console.log("TMP36 is reading volts: " + volts);
        var celcius = (volts - .5) * 100;
        console.log("celcius: " + celcius);
        var far = celcius * 9 / 5 + 32;
        console.log("fahrenheit: " + far);
        res.send({ far: Math.round(far), cel: Math.round(celcius) });
    });
});

app.get('/light', function (req, res, next) {
    readADC(PHOTOCELL_BYTE, function(adcByteReceived) {
        console.log("adcCallback with: " + adcByteReceived.toString(16));
        res.send("0x" + adcByteReceived.toString(16));
    });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
