import zip from 'bestzip';

zip({
    source: './layer/nodejs',
    destination: './bin/nodejs.zip'
}).then(function () {
    console.log('All done!');
}).catch(function (err) {
    console.error(err.stack);
    process.exit(1);
});