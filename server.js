const net = require('net');
const fourOhFour = require('./html/404.js');
const hydrogen = require('./html/hydrogen.js');
const helium = require('./html/helium.js');
const indexHtml = require('./html/index.js');
const styles = require('./css/styles.js');


const server = net.createServer((socket) => {

    socket.on('data', data => {
        let pData = data.toString().split('\n');
        const req = pData[0].split(' ');
        const method = req[0];
        const reqURI = req[1];

        if (method === 'GET') {
            switch (reqURI) {
                default:
                    socket.write(`HTTP/1.1 200 OK\nserver: whatevs \n Content-Type: text/html; charset = utf-8;\n\n<html>${fourOhFour}</html`);
                    break;
                case '':
                case '/':
                case 'index.html':
                case 'index':
                    socket.write(`HTTP/1.1 200 OK\nserver: whatevs \n Content-Type: text/html; charset = utf-8;\n\n<html>${indexHtml}</html`);
                    break;
                case 'hydrogen':
                case 'hydrogen.html':
                    socket.write(`HTTP/1.1 200 OK\nserver: whatevs \n Content-Type: text/html; charset = utf-8;\n\n<html>${hydrogen}</html`);
                    break;
                case 'helium':
                case 'helium.html':
                    socket.write(`HTTP/1.1 200 OK\nserver: whatevs \n Content-Type: text/html; charset = utf-8;\n\n<html>${helium}</html`);
                    break;
            }
        }

        socket.write(`<html><head> <link href=${styles} rel='stylesheet'></head></html>`);
        socket.end();


    });
    // socket.write('HTTP/1.1 200 OK\nserver: whatevs \n\n\n <body><h1>kill me pls</h1></body>');
});


server.on('error', (err) => {
    throw err;
});
server.listen(8080, () => {
    console.log('is this thing on');
});