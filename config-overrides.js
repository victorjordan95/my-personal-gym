/* eslint-disable no-param-reassign */
module.exports = {
  webpack(config) {
    config.ignoreWarnings = [/Failed to parse source map/];
    return config;
  },
};
