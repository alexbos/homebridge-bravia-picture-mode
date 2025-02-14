const axios = require('axios');

class BraviaPictureModePlugin {
  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;

    // Configuration
    this.name = config.name || 'Picture Mode Toggle';
    this.ip = config.ip;
    this.psk = config.psk;
    this.onMode = config.onMode || 'game';    // Default to game mode if not specified
    this.offMode = config.offMode || 'standard';  // Default to standard if not specified

    // Required for the plugin to work
    this.Service = this.api.hap.Service;
    this.Characteristic = this.api.hap.Characteristic;

    // Wait until we're ready to start
    this.api.on('didFinishLaunching', () => {
      this.addAccessory();
    });
  }

  addAccessory() {
    const uuid = this.api.hap.uuid.generate('homebridge-bravia-picture-mode' + this.name);
    this.accessory = new this.api.platformAccessory(this.name, uuid);

    // Create switch service for Picture Mode Toggle
    this.switchService = this.accessory.getService(this.Service.Switch) ||
      this.accessory.addService(this.Service.Switch, this.name, 'picture_mode');

    // Set up handlers for the switch
    this.switchService
      .getCharacteristic(this.Characteristic.On)
      .onGet(this.getPictureState.bind(this))
      .onSet(this.setPictureState.bind(this));

    this.api.publishExternalAccessories('homebridge-bravia-picture-mode', [this.accessory]);
  }

  async getPictureMode() {
    try {
      const response = await axios.post(`http://${this.ip}/sony/video`, {
        method: 'getPictureQualitySettings',
        id: 1,
        params: [{
          target: 'pictureMode'
        }],
        version: '1.0'
      }, {
        headers: {
          'X-Auth-PSK': this.psk
        }
      });

      const settings = response.data.result[0][0];
      return settings.currentValue;
    } catch (error) {
      this.log.error('Error getting picture mode:', error);
      throw error;
    }
  }

  async setPictureMode(mode) {
    try {
      await axios.post(`http://${this.ip}/sony/video`, {
        method: 'setPictureQualitySettings',
        id: 1,
        params: [{
          settings: [{
            target: 'pictureMode',
            value: mode
          }]
        }],
        version: '1.0'
      }, {
        headers: {
          'X-Auth-PSK': this.psk
        }
      });
    } catch (error) {
      this.log.error('Error setting picture mode:', error);
      throw error;
    }
  }

  async getPictureState() {
    const currentMode = await this.getPictureMode();
    return currentMode === this.onMode;
  }

  async setPictureState(on) {
    if (on) {
      await this.setPictureMode(this.onMode);
    } else {
      await this.setPictureMode(this.offMode);
    }
  }
}

module.exports = (api) => {
  api.registerPlatform('homebridge-bravia-picture-mode', 'BraviaPictureMode', BraviaPictureModePlugin);
};