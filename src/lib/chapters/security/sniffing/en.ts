import type { SniffingText } from './types';

export const en: SniffingText = {
	title: 'Sniffing and MITM',
	intro: [
		'When data crosses a network, devices along its path can observe traffic. Here we compare what is visible when the browser uses HTTP and HTTPS.',
		'<b>Sniffing</b> captures network packets for inspection. What can be captured depends on the device’s position, network settings, and encryption. Sharing WiFi does not automatically expose every conversation.',
		'If an HTTP request is captured, its contents can be read as plain text. The example carries a username and password from a simulated login form.',
		'<b>HTTPS</b> protects HTTP communication with TLS. A network observer can see some connection metadata, but encryption protects request contents. Learn how verification works in [[TLS|security/tls]].',
		'An attacker controlling the communication path may also try to modify messages or impersonate the server. This is <b>MITM</b>, man in the middle. Explore it further in [[MITM|security/mitm]].',
		'[fyi] Same word, different world. Recording traffic is not only an attacker trick. Network engineers do it on purpose to fix problems, with tools like [[Wireshark|network/wireshark]]. The tool is the same, what matters is whose traffic it is and whether they said yes.',
		'[ingat] <b>Visible packets do not necessarily mean readable contents.</b> Check HTTPS and the site address. Encryption protects transit but does not establish that a site owner is trustworthy.',
		'Everything here happens in a pretend café, nobody real gets hurt. Log in to nimbus.com over HTTP, then over HTTPS, and watch what the snooper at the next table gets.'
	],
	reactions: {
		http: 'The HTTP request was captured in this simulated network. Its username and password are readable because the request contents are not encrypted.',
		https:
			'TLS protects the request contents. Observers can still see metadata such as the destination IP address and traffic size. Domain visibility also depends on DNS and TLS settings.',
		real: 'You selected the network named by the cafe staff. Try the second hotspot to compare its path in the simulation.',
		twin: "You just joined the snooper's own hotspot. It looks like the café WiFi, but now every packet passes through their laptop before reaching the internet. They are not only listening anymore, they are standing in the middle.",
		mitmHttp:
			'Look at your screen. The snooper slipped a fake box into the page asking for your card number. Over plain HTTP your phone has no way to notice the page was changed along the way.',
		mitmHttps:
			'The browser rejects an untrusted certificate and does not forward the application request. Investigate the warning before sending data.'
	},
	acts: ['Sniffing', 'Man in the middle'],
	actLabel: 'Act {n}',
	nextAct: 'On to the next act',
	youLabel: 'You',
	serverLabel: 'nimbus.com',
	routerLabel: 'Café WiFi',
	snooperLabel: 'Snooper at the next table',
	twinLabel: "Snooper's hotspot",
	sendHttp: 'Log in over HTTP',
	sendHttps: 'Log in over HTTPS',
	loginTitle: 'Log in',
	userLabel: 'Username',
	passLabel: 'Password',
	loginBtn: 'Log in',
	loggedIn: 'Welcome back, Sari',
	captureTitle: 'Captured packets',
	captureEmpty: 'Waiting for something to fly past',
	readableTag: 'readable',
	scrambledTag: 'scrambled',
	pickWifi: 'Pick a WiFi network',
	wifiReal: 'Nimbus Cafe',
	wifiTwin: 'Nimbus Cafe Free',
	strongSignal: 'strongest signal',
	openHttp: 'Open nimbus.com over HTTP',
	openHttps: 'Open nimbus.com over HTTPS',
	blankPage: 'Not connected yet',
	pageWelcome: 'Welcome to nimbus.com',
	tamperedTitle: 'Security check',
	tamperedBody: 'Enter your card number to continue',
	tamperedTag: 'added by the snooper',
	warnTitle: 'Your connection is not private',
	warnBody: 'Someone may be pretending to be nimbus.com',
	warnBack: 'Back to safety',
	capture: {
		swapped: 'page changed, card box slipped in',
		refused: 'fake certificate, browser said no'
	},
	notes: {
		idle: 'Compare request contents over HTTP and HTTPS',
		http: 'HTTP login data is unencrypted and readable in this capture',
		https: 'Over HTTPS the login flies past as a sealed envelope',
		pick: 'Two networks with almost the same name. Which one is the café?',
		real: 'The real café WiFi, the one the staff told you about',
		twin: 'Now every packet stops at the snooper first',
		mitmHttp: 'The page arrived, but not the page nimbus.com sent',
		mitmHttps: 'Certificate verification fails, application request blocked'
	}
};
