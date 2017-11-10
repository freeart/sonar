let ns = {}

const dgram = require('dgram'),
	moment = require('moment');

require("colors");

const server = dgram.createSocket('udp4');

server.on('error', (err) => {
	console.log(`server error:\n${err.stack}`);
	server.close();
});

server.on('message', (msg, rinfo) => {
	const args = msg.toString().split(":")
	ns[args[0]] = ns[args[0]] || {};
	ns[args[0]].total = ns[args[0]].total || 0;
	ns[args[0]].total++;
	ns[args[0]].unique = ns[args[0]].unique || new Set();
	ns[args[0]].unique.add(args[1]);
	//console.log(`${args[1]}`);
});

setInterval(() => {
	Object.keys(ns).forEach((namespace) => {
		console.log(moment().format('DD.MM.YYYY HH:mm:ss').gray, ns[namespace].total.toString().red, ns[namespace].unique.size.toString().green)
	})
	ns = {};
}, 60 * 60 * 1000)

server.on('listening', () => {
	const address = server.address();
	console.log(`server listening ${address.address}:${address.port}`);
});

server.bind(41234);