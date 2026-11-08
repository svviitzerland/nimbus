import type { ReverseProxyText } from '../types';

export const en: ReverseProxyText = {
	title: 'Reverse proxy',
	intro: [
		'A site is rarely just one server. Usually one server holds the pages, another holds the data, and another holds the images. Three different servers, and it gets messy if every visitor has to remember all of them.',
		'So we put one receiver out front, called a <b>reverse proxy</b>. Every request comes in through it, then it forwards each one to the right server behind.',
		'Think of it as a receptionist. Every guest is greeted at the front desk, then walked to the correct room. Guests never see the back offices, and they only know one address, <b>nimbus.com</b>.',
		'The receptionist is already seated behind <b>nimbus.com</b>. Ask for a page, some data, or an image, and watch each request get walked to the right server while the real addresses stay hidden.',
		'[ingat] A reverse proxy receives visitors and forwards requests to servers behind it.'
	],
	reactions: {
		web: 'The request to <b>/</b> goes to the page server, and you get the web page back. One address out front, the proxy handles the rest. Try another path.',
		api: 'The request to <b>/api</b> is forwarded to the data server, and what comes back is data (JSON). Different server, same front address.',
		static:
			'The request to <b>/images</b> goes to the image server, and what comes back is an image. Three different destinations, one shared address.'
	},
	promptLabel: 'Tap to request something from nimbus.com',
	youLabel: 'You',
	proxyLabel: 'Reverse proxy',
	proxySub: 'takes every request',
	publicAddr: 'nimbus.com',
	idleHint: 'Tap one of the buttons above',
	hiddenLabel: 'hidden',
	routes: [
		{ path: '/', label: 'Page server', backend: 'web', btn: 'Page', kind: 'page' },
		{ path: '/api', label: 'Data server', backend: 'api', btn: 'Data', kind: 'json' },
		{ path: '/images', label: 'Image server', backend: 'static', btn: 'Image', kind: 'image' }
	],
	routedNote: 'Routed to {n} different servers'
};
