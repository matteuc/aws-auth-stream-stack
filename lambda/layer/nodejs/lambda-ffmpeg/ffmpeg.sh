# Create folder to store extracted binary
mkdir ./bin
mkdir ./bin/tmp

# Download binary
curl https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz --output ./bin/ffmpeg-amd64-static.tar.xz

#  Unzip binary to output folder
tar xvf ./bin/ffmpeg-amd64-static.tar.xz -C ./bin/tmp --strip-components=1

# Move ffmpeg executable to lambda-ffmpeg
mv ./bin/tmp/ffmpeg ./ffmpeg

# Cleanup
rm -rf ./bin