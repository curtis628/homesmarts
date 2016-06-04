#!/usr/bin/env node

var async = require('async')
  , express = require('express')
  , logger = require('morgan')
  , app = express()
  , i2c = require('i2c-bus'),
  i2c1;

var PCF8591_ADDR = 0x48;
var TMP36_BYTE = 0x02;
var TIMEOUT = 2000;

app.use(logger('dev'))

i2c1 = i2c.openSync(1);

app.get('/test', function (req, res, next) {
    res.send("Test content");
});

app.get('/temp', function (req, res, next) {
  try {
    var temp;
    async.series([
            function (cb) {
                console.log("open bus");
                i2c1 = i2c.open(1, cb);
            },
            function (cb) {
                console.log("read byte");
                i2c1.readByte(PCF8591_ADDR, TMP36_BYTE, cb)
            },
            function (cb) {
                console.log("receive byte");
                i2c1.receiveByte(PCF8591_ADDR, function(err, byteReceived) {
                    var tempValue = byteReceived;
                    console.log("thermoresistor is reading: 0x" + tempValue.toString(16));
                    console.log("thermoresistor is reading: " + tempValue);

                    var volts = tempValue / 255 * 3.3;
                    console.log("TMP36 is reading volts: " + volts);

                    var celcius = (volts - .5) * 100;
                    console.log("celcius: " + celcius);

                    var far = celcius * 9 / 5 + 32;
                    console.log("fahrenheit: " + far);
                    temp = far.toFixed(2)
                    //res.send(temp.toString());
                })
            },
            function (cb) {
                console.log("close bus");
                i2c1.close(cb);
            },
            function (cb) {
                console.log("current temp: " + temp);
                res.send(temp.toString());
            }
            ], function (err) {
                console.log("CB");
                if (err) throw err;
            });
  } catch (e) {
    next(e)
  }
})

app.listen(process.env.PORT || 3000, function () {
  console.log('Listening on http://localhost:' + (process.env.PORT || 3000))
})
