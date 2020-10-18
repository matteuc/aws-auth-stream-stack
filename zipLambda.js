import zip from 'bestzip';

const main = async () => {
    try {
        await Promise.all([
            zip({
                source: 'nodejs/*',
                destination: '../../bin/nodejs.zip',
                cwd: "./lambda/layer"
            }),
            zip({
                source: '*',
                destination: '../../bin/transcoder.zip',
                cwd: "./lambda/transcoder"
            })
        ])

        console.log("All done!")
    } catch (error) {
        console.error(error.stack);
        process.exit(1);
    }
}

main()