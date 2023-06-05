const { merge } = require('webpack-merge')
const commonConfiguration = require('./webpack.common.js')
import('internal-ip').then(internalIp => {
    // Your code that uses internalIp
  }).catch(error => {
    // Handle any errors
  });
const portFinderSync = require('portfinder-sync')

const infoColor = (_message) =>
{
    return `\u001b[1m\u001b[34m${_message}\u001b[39m\u001b[22m`
}

module.exports = merge(
    commonConfiguration,
    {
        mode: 'development',
        devServer:
        {
            host: '0.0.0.0',
            port: portFinderSync.getPort(8080),

            open: true,
            https: false,
    
    
      

    
        }
    }
)
