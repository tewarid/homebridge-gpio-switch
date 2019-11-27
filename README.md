# homebridge-gpio-switch

Homebridge plugin to control relay switch via Raspberry Pi GPIO pins.

To install, run

```bash
npm install -g --unsafe-perms homebridge-gpio-switch
```

See [config-sample.json](config-sample.json) for a sample accessory configuration. The pin numbering uses [GPIO pin numbering](https://www.raspberrypi.org/documentation/usage/gpio/), and not the physical pin numbering used by [rpio](https://github.com/jperkin/node-rpio) by default.
