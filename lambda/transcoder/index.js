// dependencies
const AWS = require('aws-sdk');
const fs = require('fs');
const util = require('util');
const { getFileName } = require('./utils/file');
const { convertMP4ToHLS } = require('./utils/hls');
const { getEventS3Object } = require('./utils/s3')

// get reference to S3 client
const s3 = new AWS.S3();

exports.handler = async (event) => {

    // Read options from the event parameter.
    console.log("Reading options from event:\n", util.inspect(event, { depth: 5 }));

    const s3Object = getEventS3Object(event);

    const outDir = `/tmp/${Date.now()}`

    const filesToUpload = []

    // Create tmp directory in Lambda execution context
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir);
    } else {
        console.error("Output directory already exists")
        return
    }

    if (!s3Object) {
        console.log("No S3 Object found.");
        return;
    }

    const { Bucket, Key } = s3Object

    // Infer the video type from the file suffix.
    const typeMatch = Key.match(/\.([^.]*)$/);
    if (!typeMatch) {
        console.log("Could not determine the video type.");
        return;
    }

    // Check that the video type is supported  
    const videoType = typeMatch[1].toLowerCase();
    if (videoType != "mp4") {
        console.log(`Unsupported video type: ${videoType}`);
        return;
    }

    // Download the video from the S3 source bucket. 
    const origVideoPath = `${outDir}/original.mp4`

    try {

        const params = {
            Bucket,
            Key
        };

        // Save the original uploaded video in the Lambda's execution context
        const out = fs.createWriteStream(origVideoPath);

        const origVideo = await s3.getObject(params).promise();

        origVideo.createReadStream().pipe(out)

    } catch (error) {
        console.log(error);
        return;
    }

    // Use the ffmpeg module to transcode the uploaded video into HLS format
    try {
        const generatedFiles = await convertMP4ToHLS(origVideoPath, `${outDir}/bin`)

        filesToUpload.push(...generatedFiles)

    } catch (error) {
        console.log(error);
        return;
    }

    // Upload the generated HLS files and manifest to the destination bucket
    try {

        await Promise.all(filesToUpload.map(path => {
            const { original } = getFileName(path)

            const destparams = {
                Bucket,
                Key: `${Key}/dist/${original}`,
                Body: fs.readFileSync(path)
            };

            return s3.putObject(destparams).promise()
        }));

    } catch (error) {
        console.log(error);
        return;
    }

};