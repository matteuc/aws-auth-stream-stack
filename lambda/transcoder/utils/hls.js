import childProcess from "child_process"
import fs from "fs"
import ffmpegBinary from "@ffmpeg-installer/ffmpeg"
import { printDirFiles } from "./file";

const ffmpegPath = ffmpegBinary.path;

const spawn = childProcess.spawn;

/**
 * A function to transcode a MP4 file into HLS
 * @param {string} source The path to the .mp4 file
 * @param {string} outDir The output directory path (should not already exist)
 * @param {string} manifestName The name to assign to generated HLS files
 */
export async function convertMP4ToHLS(source, outDir, manifestName = "generated_") {
    return new Promise((resolve, reject) => {

        if(!source || !outDir) {
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

        const ffmpeg = spawn(ffmpegPath, `-i ${source} -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls ${manifestPath}`.split(" "));

        ffmpeg.on('close', async (code) => {
            if (code === 0) {
                resolve(
                    [
                        manifestPath,
                        ...(await printDirFiles(outDir, "ts"))
                    ]
                )
            } else {
                reject("An error occurred when transcoding your file. Error code:")
            }
        });
    })
}