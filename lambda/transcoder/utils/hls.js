const childProcess = require("child_process")
const fs = require("fs")
const ffmpegBinary = require("lambda-ffmpeg")
const { printDirFiles } = require("./file");

const spawn = childProcess.spawn;

const ffmpegPath = ffmpegBinary.path

/**
 * A function to transcode a MP4 file into HLS
 * @param {string} source The path to the .mp4 file
 * @param {string} outDir The output directory path (should not already exist)
 * @param {string} manifestName The name to assign to generated HLS files
 */
exports.convertMP4ToHLS = async function (source, outDir, manifestName = "generated_") {
    return new Promise((resolve, reject) => {

        if (!source || !outDir) {
            reject("No source or output directory provided.")
            return;
        }

        if (fs.existsSync(outDir)) {
            reject("Output directory already exists.")
            return;
        } else {
            fs.mkdirSync(outDir)
        }

        const manifestPath = `${outDir}/${manifestName}.m3u8`

        const ffmpegPathContext = '/tmp/ffmpeg'

        if (!fs.existsSync(ffmpegPathContext)) {
            fs.copyFileSync(ffmpegPath, ffmpegPathContext);

            fs.chmodSync(ffmpegPathContext, "755")
        }

        const ffmpeg = spawn(ffmpegPathContext, `-i ${source} -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ${manifestPath}`.split(" "), { shell: true });

        ffmpeg.stderr.on('data', function (data) {
            console.log(data.toString());
        });

        ffmpeg.on('close', async (code, signal) => {
            if (code === 0) {
                resolve(
                    [
                        manifestPath,
                        ...(await printDirFiles(outDir, "ts"))
                    ]
                )
            } else {
                reject("An error occurred when transcoding your file.")
            }
        });
    })
}