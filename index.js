var rpio = require("rpio");
var Service, Characteristic;

module.exports = function(homebridge) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-gpio-switch", "Switch", SwitchAccessory);
}

function SwitchAccessory(log, config) {
  this.log = log;
  this.name = config['name'];
  this.pin = config['pin'];
  this.invert = config['invert'] || false;
  this.default = config['default'] === undefined ? true : config['default'];
  this.state = this.default != this.invert ? rpio.HIGH : rpio.LOW;

  this.service = new Service.Switch(this.name);

  this.infoService = new Service.AccessoryInformation();
  this.infoService
    .setCharacteristic(Characteristic.Manufacturer, "Radoslaw Sporny")
    .setCharacteristic(Characteristic.Model, "RaspberryPi GPIO Switch")
    .setCharacteristic(Characteristic.SerialNumber, "Version 1.0.0");

  // use gpio pin numbering
  rpio.init({
    mapping: 'gpio'
  });
  rpio.open(this.pin, rpio.OUTPUT, this.state);

  this.service
    .getCharacteristic(Characteristic.On)
    .on('get', this.getPowerState.bind(this))
    .on('set', this.setPowerState.bind(this));
}

SwitchAccessory.prototype.getPowerState = function(callback) {
  var value = (this.state == rpio.HIGH) != this.invert;
  this.log("Switch at GPIO %d is %s", this.pin, value);
  callback(null, value);
}

SwitchAccessory.prototype.setPowerState = function(value, callback) {
  this.log("Setting switch at GPIO %d to %s", this.pin, value);
  this.state = value != this.invert ? rpio.HIGH : rpio.LOW;
  rpio.write(this.pin, this.state);
  callback(null);
}

SwitchAccessory.prototype.getServices = function() {
  return [this.infoService, this.service];
}
