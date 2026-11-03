import type { MobileAppsText } from './types';

export const en: MobileAppsText = {
	title: 'Native and cross platform',
	intro: [
		'nimbus.com is getting popular, and people keep asking the same thing. Is there an app? An <b>app</b> is a program you install on your phone from the Play Store or the App Store, with its own icon on the home screen.',
		'Here is the catch. Phones speak different languages. Android apps are mostly written in <b>Kotlin</b>, and iPhone apps in <b>Swift</b>. An app written in the phone’s own language is called <b>native</b>, like a native speaker who was born there.',
		'Native apps are the fastest and can use everything on the phone, the camera, the sensors, the notifications. But you write the app twice, one for Android and one for iPhone, often with two different teams.',
		'At the other end is the plain website in a browser, the kind you built with [[HTML|web/html]]. One code runs on every phone and laptop with nothing to install, but it feels a little less smooth and cannot reach every part of the phone.',
		'In between sits <b>cross platform</b>. You write once with <b>Flutter</b> (from Google, in a language called Dart) or <b>React Native</b> (from Meta, in JavaScript), and out come both an Android app and an iPhone app. Nearly native speed, one team.',
		'[fyi] Parts of Instagram are built with React Native, and the My BMW app is built with Flutter. Big companies mix and match too, picking the way that fits each screen.',
		'Let us build the nimbus app all three ways and compare them. Then three clients need your advice.'
	],
	reactions: {
		native:
			'Two apps, two languages. Kotlin for Android, Swift for iPhone. The fastest result, but every feature gets built twice.',
		cross:
			'One codebase, two apps. Flutter or React Native turns the same code into an Android app and an iPhone app. A little slower than native, a lot less work.',
		web: 'One codebase that runs everywhere, phones and laptops alike, with nothing to install. It reaches the most people, but it lives inside the browser, so it is not as quick or as deep into the phone.',
		game: 'Right. A fast 3D game squeezes every drop out of the phone, so native is worth the double work. Most top mobile games go native or use a game engine built for speed.',
		startup:
			'Right. Two people cannot afford to write everything twice. Cross platform gives them both stores from one codebase, which is why so many startups pick Flutter or React Native.',
		menu: 'Right. Nobody installs an app to read a menu once. A website opens straight from the QR code, on any phone, in a second.',
		miss: 'Hmm, think about what matters most to this client. Speed, reach, or how much work their team can handle?'
	},
	acts: ['Build it', 'Choose'],
	actLabel: 'Step {n}',
	nextAct: 'Help the clients',
	buildPrompt: 'Build the nimbus app one way',
	ways: {
		native: {
			name: 'Native',
			sub: 'Kotlin and Swift',
			note: 'The fastest, but built twice'
		},
		cross: {
			name: 'Cross platform',
			sub: 'Flutter, React Native',
			note: 'One codebase, two apps'
		},
		web: {
			name: 'Web',
			sub: 'in the browser',
			note: 'Everywhere, nothing to install'
		}
	},
	android: 'Android',
	iphone: 'iPhone',
	browser: 'Browser',
	codeLabel: '{n} codebases to write',
	codeLabelOne: '1 codebase to write',
	speedLabel: 'Speed',
	reachLabel: 'Reach',
	effortLabel: 'Work',
	clientPrompt: 'Which way fits this client?',
	clients: {
		game: {
			who: 'A game studio',
			need: 'A racing game with 3D cars that must run super smooth.'
		},
		startup: {
			who: 'A two person startup',
			need: 'They want to be in both app stores next month, and there are only two of them.'
		},
		menu: {
			who: 'A small cafe',
			need: 'Customers scan a QR code on the table to read today’s menu.'
		}
	},
	rightTag: 'good fit',
	wrongTag: 'not the best fit',
	nextClient: 'Next client',
	progress: 'Client {n} of {total}',
	doneLine: 'No way is the best everywhere. Each one wins for a different job.'
};
