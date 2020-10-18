import zip from 'bestzip';

const main = async () => {
    try {
        await Promise.all([
            zip({
                source: './nodejs',
                destination: '../bin/nodejs.zip',
                cwd: "./layer"
            }),
            zip({
                source: './transcoder',
                destination: '../bin/transcoder.zip',
                cwd: "./lambda"
            })
        ])

        console.log("All done!")
    } catch (error) {
        console.error(error.stack);
        process.exit(1);
    }
}

main()