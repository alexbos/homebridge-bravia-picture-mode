const axios = require('axios');

class BraviaPictureModePlugin {
  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;

    // Configuration
    this.name = config.name || 'Game Mode';
    this.ip = config.ip;
    this.psk = config.psk;

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

    // Create single switch service for Game Mode
    this.gameModeService = this.accessory.getService(this.Service.Switch) ||
      this.accessory.addService(this.Service.Switch, this.name, 'game_mode');

    // Set up handlers for the switch
    this.gameModeService
      .getCharacteristic(this.Characteristic.On)
      .onGet(this.getGameMode.bind(this))
      .onSet(this.setGameMode.bind(this));

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

  async getGameMode() {
    const currentMode = await this.getPictureMode();
    return currentMode === 'game';
  }

  async setGameMode(on) {
    if (on) {
      await this.setPictureMode('game');
    } else {
      await this.setPictureMode('standard');
    }
  }
}

module.exports = (api) => {
  api.registerPlatform('homebridge-bravia-picture-mode', 'BraviaPictureMode', BraviaPictureModePlugin);
};