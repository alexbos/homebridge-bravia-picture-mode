# homebridge-bravia-picture-mode

A Homebridge plugin that allows you to control your Sony Bravia TV's picture mode through HomeKit. This plugin creates a simple switch that toggles between any two picture modes of your choice, making it easy to optimize your TV's picture settings for different activities.

## Features

- Creates a switch accessory in HomeKit that toggles between two configurable picture modes
- Supports all Sony Bravia picture modes (Game, Standard, Cinema, Vivid, etc.)
- Simple integration with existing Homebridge setup
- Configurable through Homebridge UI

## Requirements

- Homebridge v1.3.0 or later
- Node.js v14 or later
- Sony Bravia TV with network connectivity
- TV's IP address
- Pre-shared key (PSK) configured on your TV

## Installation

Install this plugin using npm:

```bash
npm install github:alexbos/homebridge-bravia-picture-mode
```

## Configuration

You can configure this plugin through the Homebridge UI or by manually editing your Homebridge `config.json` file:

```json
{
    "platforms": [
        {
            "platform": "BraviaPictureMode",
            "name": "Picture Mode Toggle",
            "ip": "YOUR_TV_IP_ADDRESS",
            "psk": "YOUR_PRE_SHARED_KEY",
            "onMode": "game",
            "offMode": "standard"
        }
    ]
}
```

### Configuration Parameters

- `platform` (required): Must be "BraviaPictureMode"
- `name` (optional): The name of the switch in HomeKit (defaults to "Picture Mode Toggle")
- `ip` (required): The IP address of your Sony Bravia TV
- `psk` (required): The Pre-Shared Key configured on your TV
- `onMode` (optional): Picture mode when switch is ON (defaults to "game")
- `offMode` (optional): Picture mode when switch is OFF (defaults to "standard")

### Available Picture Modes

The following picture modes are supported:
- vivid
- standard
- custom
- cinemaPro
- cinemaHome
- sports
- animation
- photoVivid
- photoStandard
- photoCustom
- game
- graphics

## Setting Up Your TV

1. Enable remote start on your TV
2. Go to: Settings → Network → Home Network Setup → IP Control
3. Set Authentication to "Normal and Pre-Shared Key"
4. Set Pre-Shared Key to a password of your choice
5. Enable "Simple IP Control"

## Usage

Once configured, you'll see a new switch accessory in your HomeKit setup. The switch behaves as follows:

- ON position: TV picture mode will be set to your configured "onMode"
- OFF position: TV picture mode will be set to your configured "offMode"

You can control this through the Home app, Siri, or automation shortcuts.

Common usage examples:
- Toggle between Game Mode and Cinema Mode for gaming vs movies
- Switch between Sports Mode and Standard Mode for different viewing experiences
- Use Custom Mode and Standard Mode for day/night viewing

## Troubleshooting

If you encounter issues:

1. Verify your TV's IP address is correct and hasn't changed
2. Ensure your Pre-Shared Key matches the one configured on the TV
3. Check that your TV is powered on and connected to the network
4. Verify that IP Control is properly configured on your TV
5. Confirm that the picture modes you've selected are supported by your TV model

## Development

To contribute to this plugin:

1. Fork the repository
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please:

1. Check the [issues section](https://github.com/alexbos/homebridge-bravia-picture-mode/issues) of the repository
2. Create a new issue if your problem hasn't been reported
3. Include your Homebridge logs and configuration (without sensitive information)

## Credits

Created by alexbos

## Changelog

### 0.2.0
- Added support for configurable picture modes
- Added Config UI support
- Improved configuration flexibility

### 0.1.1
- Initial release
- Basic Game Mode switching functionality
- Support for Sony Bravia TV integration