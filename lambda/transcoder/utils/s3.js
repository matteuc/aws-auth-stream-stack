/**
 * A simple function to extract S3 object information from a S3NotificationEvent
 * @param {LambdaEvent} event See https://docs.aws.amazon.com/lambda/latest/dg/with-s3.html
 */
export const getEventS3Object = (event) => {
    if(!event.Records[0]) return null;

    if(!event.Records[0].s3) return null;

    return {
        Bucket: event.Records[0].s3.bucket.name,
        Key: decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, " "))
    }

}