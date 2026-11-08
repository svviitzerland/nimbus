import type { ApiStyleText } from '../../types';

export const en: ApiStyleText = {
	title: 'gRPC',
	intro: [
		'gRPC lets you call a function (a named bit of code) on another server, as if it lived in your own code, along with the data you pass in.',
		'Say you call getProduct(2). Watch the call shoot over to the server and the answer come back. The data is sent compact in binary, so it is small and fast.',
		'Use gRPC for server to server communication behind the scenes that needs to be fast and lean, not for calling straight from a browser.',
		'[fyi] gRPC was built by Google, the successor to their internal system called Stubby, and it uses the binary Protocol Buffers format. That is why it is small and fast, a good fit for hundreds of services talking to each other.',
		'[ingat] gRPC resembles calling a function on another computer, with an agreed contract.'
	],
	reactions: {},
	style: 'grpc',
	clientLabel: 'Service',
	serverLabel: 'Service',
	replayBtn: 'Replay'
};
