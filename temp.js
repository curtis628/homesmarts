var i2c = require('i2c-bus'),
  i2c1;

var PCF8591_ADDR = 0x48;
var PHOTOCELL_BYTE = 0x00,
  TMP36_BYTE = 0x02,
  POT_BYTE = 0x03;
var TIMEOUT = 2000;

function readThermometer() {
    i2c1.readByte(PCF8591_ADDR, TMP36_BYTE, function(err, read_byte) {
        console.log("thermometer read_byte: 0x" + read_byte.toString(16));
        setTimeout(function() {
            var tempValue = i2c1.receiveByteSync(PCF8591_ADDR);
            console.log("thermoresistor is reading: 0x" + tempValue.toString(16));
            console.log("thermoresistor is reading: " + tempValue);
            
            var volts = tempValue / 255 * 3.3;
            console.log("TMP36 is reading volts: " + volts);

            var celcius = (volts - .5) * 100;
            console.log("celcius: " + celcius);

            var far = celcius * 9 / 5 + 32;
            console.log("fahrenheit: " + far)
        },
        TIMEOUT);
    });
}

function readPhotoresistor() {
    i2c1.readByte(PCF8591_ADDR, PHOTOCELL_BYTE, function(err, read_byte) {
        console.log("photoresistor read_byte: 0x" + read_byte.toString(16));
        setTimeout(function() {
            var photoValue = i2c1.receiveByteSync(PCF8591_ADDR);
            console.log("photoresistor is reading: 0x" + photoValue.toString(16))
            console.log("photoresistor is reading: " + photoValue)
        },
        TIMEOUT);
    });
}

function readPotentiometer() {
    i2c1.readByte(PCF8591_ADDR, POT_BYTE, function(err, read_byte) {
        console.log("potentiometer read_byte: 0x" + read_byte.toString(16));
        setTimeout(function() {
            var potValue = i2c1.receiveByteSync(PCF8591_ADDR);
            console.log("potentiometer is reading: 0x" + potValue.toString(16))
            console.log("potentiometer is reading: " + potValue)
        },
        TIMEOUT);
    });
}

/** Gracefully exit; shutdown interval and free up i2c resources. */
function exit() {
    console.log("Quitting... ");
    i2c1.closeSync();
    process.exit();
}

function main() {
    i2c1 = i2c.openSync(1)
    readThermometer();
    process.on('SIGINT', exit);
    console.log("Finished main() logic");
}    

if (require.main === module) {
    main();
}


