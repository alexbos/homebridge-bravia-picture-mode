const axios = require('axios');

class BraviaPictureModePlugin {
  constructor(log, config, api) {
    this.log = log;
    this.config = config;
    this.api = api;

    // Configuration
    this.name = config.name || 'TV Picture Mode';
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

    // Create services
    this.gameModeService = this.accessory.getService('Game Mode') ||
      this.accessory.addService(this.Service.Switch, 'Game Mode', 'game_mode');

    this.standardModeService = this.accessory.getService('Standard Mode') ||
      this.accessory.addService(this.Service.Switch, 'Standard Mode', 'standard_mode');

    // Set up handlers for the switches
    this.gameModeService
      .getCharacteristic(this.Characteristic.On)
      .onGet(this.getGameMode.bind(this))
      .onSet(this.setGameMode.bind(this));

    this.standardModeService
      .getCharacteristic(this.Characteristic.On)
      .onGet(this.getStandardMode.bind(this))
      .onSet(this.setStandardMode.bind(this));

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

  async getStandardMode() {
    const currentMode = await this.getPictureMode();
    return currentMode === 'standard';
  }

  async setGameMode(on) {
    if (on) {
      await this.setPictureMode('game');
      // Turn off standard mode switch
      this.standardModeService.updateCharacteristic(this.Characteristic.On, false);
    }
  }

  async setStandardMode(on) {
    if (on) {
      await this.setPictureMode('standard');
      // Turn off game mode switch
      this.gameModeService.updateCharacteristic(this.Characteristic.On, false);
    }
  }
}

module.exports = (api) => {
  api.registerPlatform('homebridge-bravia-picture-mode', 'BraviaPictureMode', BraviaPictureModePlugin);
};