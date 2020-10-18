const path = require("path")

const ffmpegPath = path.resolve(__dirname.substr(0, __dirname.indexOf('node_modules')), 'node_modules', 'lambda-ffmpeg', 'ffmpeg');

module.exports = {
    path: ffmpegPath
};