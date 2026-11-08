import type { LayersText } from '../types';

export const en: LayersText = {
	title: 'Layers and packets',
	intro: [
		'You want to see the products page on nimbus.com. But that page lives on a computer far away, called the server. So your phone writes a little note asking for the page, and that note is what we carry to the server.',
		'Before it leaves, the note gets [[locked|networking/encryption]]. The words you could read turn into scrambled code, so nobody on the same WiFi can peek, or [[sniffing|security/sniffing]] as it is called. This is what the padlock on a safe site means.',
		'Now your phone reaches that server first and sets up a connection, and it keeps that connection alive the whole time you are on the page.',
		'The note is cut into a few small packets, each given a number so they can be put back in order. Each one also gets a door number for where it is headed, one door per service, and secure web uses door 443. You will play with this layer yourself at the end.',
		'Each packet is labeled with the server address, for example 76.76.21.21, like a house address. Then it is sent toward that address, passed from one point to the next across the internet.',
		'The packet does not leap straight to the server. It is passed along in short hops, from your phone to your home router, the router to the next box, one step at a time. The long journey is really lots of these little handoffs.',
		'At the very bottom, the packet is just a signal, light in a cable or waves in the air. This is the moment it really leaves your phone and shoots off to the server.',
		'The server catches it and opens all those wrappers back up in reverse, until it can read your original note. Then it sends the products page back to you the same way.',
		'So here is the pattern. Each layer just adds one wrapper and passes it down. On the way out you wrap from the top down, on the way in you unwrap from the bottom up, and that order never changes. Some steps can be quick or skipped, like no lock on a plain site, but the stack stays the same.',
		'That packet can travel two ways, the careful way or the fast way. Send it over TCP and over UDP and see the difference for yourself.',
		'[ingat] Data is wrapped on the way out and unwrapped on arrival. Each layer has a job.'
	],
	reactions: {
		tcp: 'TCP shook hands first, then sent each parcel and waited for every one. All four arrived in order, nothing missing. That care costs a little time.',
		udp: 'UDP just fired them all off, no handshake, no checking. Most arrived in a blink, but packet number two got lost on the way and nobody ever asked for it again.',
		both: 'Now you feel the trade. TCP is reliable, the right pick for pages, files, and chat where every byte must arrive. UDP is fast and loose, the right pick for calls, live video, and games where a missing scrap beats waiting.'
	},
	scenarioNote:
		'You open nimbus.com, and the page lives on a nimbus server far away. Follow your message as it gets wrapped on the way out, then unwrapped when it reaches the server.',
	startTag: 'your message',
	layers: [
		{
			name: 'Application',
			chip: 'GET /products',
			job: 'Your real message, the words you actually send.',
			where: 'In your phone browser, before anything else.'
		},
		{
			name: 'Presentation',
			chip: 'sealed for HTTPS',
			job: 'Locks the note into secret code for the trip.',
			where: 'The padlock you see on a safe site.'
		},
		{
			name: 'Session',
			chip: 'line open',
			job: 'Reaches the server and keeps the connection alive.',
			where: 'Staying logged in, a call that holds, a long download.'
		},
		{
			name: 'Transport',
			chip: 'TCP port 443',
			job: 'Cuts it into numbered packets and adds the door number.',
			where: 'Where TCP, UDP, and ports live. You play with this below.'
		},
		{
			name: 'Network',
			chip: 'to 76.76.21.21',
			job: 'Writes the server address and finds the way there.',
			where: 'Every router on the internet reads this part.'
		},
		{
			name: 'Data Link',
			chip: 'hop to router',
			job: 'Hands the parcel across one link to the very next device.',
			where: 'Your phone to your WiFi router, then box to box.'
		},
		{
			name: 'Physical',
			chip: 'signal on the wire',
			job: 'Turns it all into a signal, light, electricity, or radio.',
			where: 'The actual cable, fiber, or WiFi waves.'
		}
	],
	arriveNote:
		'The server has opened all the wrappers and read your message. Now it sends the page back to you the same way.',
	recapTitle: 'How it all fits',
	wrapLabel: 'wrap, going out',
	unwrapLabel: 'unwrap, coming in',
	orderNote:
		'The layer numbers (1 at the bottom up to 7 at the top) are just names for these jobs. That is why people say a layer 7 tool reads the web request, while a layer 4 one only sees the address and the port.',
	playPrompt: 'Send four packets from you to the server',
	tcpBtn: 'Send with TCP',
	udpBtn: 'Send with UDP',
	senderLabel: 'You',
	receiverLabel: 'Server',
	connectingLabel: 'connecting',
	connectedLabel: 'connected',
	lostLabel: 'lost',
	receivedLabel: 'got',
	tcpUse:
		'Reliable. This is what web pages, downloads, and chat use, where every byte has to arrive.',
	udpUse:
		'Fast and lossy. This is what calls, live video, and games use, where speed beats a perfect copy.',
	tryBothHint: 'Try both and feel the difference'
};
