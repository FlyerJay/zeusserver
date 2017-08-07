'use strict';

exports.sequelize = {
  enable: true,
  package: 'egg-sequelize'
}
exports.proxyworker = {
  enable: true,
  package: 'egg-development-proxyworker',
}
exports.io = {
  enable: true,
  package: 'egg-socket.io',
}
exports.static = true;