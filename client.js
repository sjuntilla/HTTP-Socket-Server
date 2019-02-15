const net = require('net');
let arg = process.argv;
let endpoint = arg[2];
let URI;
let host;
let port = 8080;
let method = 'GET';
let methods = ['GET', 'POST', 'PUT', 'DELETE'];

//IF CLIENT.JS IS RUN WITHOUT AN ENDPOINT...
if (!arg[2]) {
    console.log(`
** ** ** ** ** ** ** ** ** ** ** 
    HELP ME, OBI-WAN KENOBI
** ** ** ** ** ** ** ** ** ** ** 

* use 'node client.js' CLI to print data from a valid website
    ex: node client.js localhost:8080/hydrogen.html

* you can specify which http request method you would like to use by typing its name after the web address.

you're welcome`)
} else if (endpoint.includes('/')) {
    //IF CLIENT.JS IS RUN WITH AN ENDPOINT...
    URI = endpoint.slice(endpoint.indexOf('/', 1));
} else {
    URI = '/';
}

arg.forEach(input => {
    if (input === 'HEADER') {
        justHeaders = true;
    } else if (input.slice(0, 4).toLowerCase() === 'port') {
        port = input.slice(4);
    } else if (methods.includes(input.toUpperCase())) {
        method = input;
    }
})

if (endpoint.slice(0, 9) === 'localhost') {
    port = 8080;
    host = endpoint.slice(0, 9);

    req = `${method} ${URI} HTTP/1.1\r\n`;
    req += `host: ${host}: 8080\r\n`;
    req += `date: ${new Date().toUTCString()} \r\n`;
    req += `\r\n`;
} else {
    if (endpoint.includes('/')) {
        host = endpoint.slice(0, endpoint.indexOf('/'));
    } else {
        host = endpoint;
    }
};

host = endpoint.slice(0, endpoint.indexOf('/'));

req = `${method} ${URI} HTTP/1.1\r\n`;
req += `host: ${host}\r\n`;
req += `date: ${new Date().toUTCString()} \r\n`;
req += `\r\n`;
console.log(req)

//CLIENT STUFF
let rBody;
const rHead = {};

let client = net.createConnection(port, host);

client.on('connect', () => {
    console.log('CONNECTED');
    client.write(req);
});

client.on('error', (e) => {
    switch (e.code) {
        case 'ENOTFOUND':
            process.stdout.write(`${e.code}: ${host} unreachable. Please provide a valid address.`);
            break;
        case 'ETIMEDOUT':
            process.stdout.write(`${e.code}: Timeout error. Please ensure that you are using the correct port.`);
            break;
        default:
            process.stdout.write(`${e.code}: ${e}`);
            break;
    }
});

client.on('data', (data) => {
    let status = data.slice(data.indexOf('.' + 3, data.indexOf('\r\n')));
    let rHead = data.slice(data.indexOf('\r\n\r\n') + 1);

    switch (status[0]) {
        case '4':
            process.stdout.write(`Client Error: ${status}`);
            break;
        case '5':
            process.stdout.write(`Server Error: ${status}`);
            break;
    };

    client.end();
});





client.on('end', () => {
    console.log('CONNECTION CLOSED');
});