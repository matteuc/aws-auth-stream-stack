import { createServer } from "http";
import { readFileSync, writeFileSync } from "fs";
import Handlebars from "handlebars";
import ngrok from 'ngrok';
import nodeStatic from 'node-static';

const PORT = 8080;

const fileServer = new nodeStatic.Server('./public');

const onRequest = (req, res) => {
    fileServer.serve(req, res);
}

if (process.argv.length <= 2) {
    console.error("Please provide the link to the generated CloudFront domain!")
    console.error("USAGE: yarn start [CDN_BASE_URL]")
    process.exit(1)
}

const link = process.argv[2]

ngrok.connect(PORT).then((url) => {
    const template = readFileSync("./index.handlebars", "utf8");

    const pageBuilder = Handlebars.compile(template);

    const pageText = pageBuilder({ link });

    writeFileSync("./public/index.html", pageText)

    createServer(onRequest).listen(PORT, () => {

        console.log(`Stream your video at ${url}/index.html !.`);
    });

})
