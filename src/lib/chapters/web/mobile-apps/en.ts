import type { MobileAppsText } from './types';

export const en: MobileAppsText = {
	title: 'Native and cross platform',
	intro: [
		'nimbus.com is getting popular, and people keep asking the same question. Is there an app? An <b>app</b> is a program you install on your phone from the Play Store or the App Store, with its own icon on the home screen.',
		'Here is the catch. Phones speak different languages. Android apps are mostly written in <b>Kotlin</b>, iPhone apps in <b>Swift</b>. An app written in the phone’s own language is called <b>native</b>, like a native speaker who grew up there. Watch it being written.',
		'Native apps are the fastest and can use everything on the phone, the camera, the sensors, the notifications. The price is that you write the whole app twice, often with two separate teams.',
		'At the other end sits a plain website, the kind you built with [[HTML|web/html]]. One code runs in the browser of every phone and laptop, with nothing to install. It feels a little less smooth and cannot reach every part of the phone.',
		'In between is <b>cross platform</b>. You write once with <b>Flutter</b> (from Google, in a language called Dart) or <b>React Native</b> (from Meta, in JavaScript), and out come both an Android app and an iPhone app. Nearly native speed, one team.',
		'So which one wins? None of them wins at everything. A smooth 3D racing game goes native. A two person startup that wants both app stores goes cross platform. A cafe menu behind a QR code is simply a website.',
		'[ingat] Count the codes. Native, two codes for two phones. Cross platform, one code for two phones. Web, one code for everyone, nothing to install.',
		'[fyi] Parts of Instagram are built with React Native, and the My BMW app is built with Flutter. Big companies mix and match, picking the way that fits each screen.',
		'Curious how the work adds up? Add a new feature and watch who has to write it twice. Totally optional.'
	],
	reactions: {
		feature:
			'See that? Native wrote the new feature twice, once in Kotlin and once in Swift. Cross platform and web each wrote it once. That is the real cost of native, every change is double work.'
	},
	panels: [
		{
			tag: 'App',
			title: 'An icon on the home screen',
			body: 'An <b>app</b> is installed from an app store and opens from its own icon. Android and iPhone each have their own store.'
		},
		{
			tag: 'Way 1',
			title: 'Native',
			body: 'Written in each phone’s own language, <b>Kotlin</b> for Android and <b>Swift</b> for iPhone. One app, written two times.'
		},
		{
			tag: 'Native',
			title: 'Fastest, but double the work',
			body: 'Full speed and full access to the camera and sensors. Every feature lives in two <b>codebases</b> (a codebase is all the code of one app).'
		},
		{
			tag: 'Way 2',
			title: 'Web',
			body: 'One <b>website</b> that opens in any browser. It reaches everyone with nothing to install, but it stays inside the browser.'
		},
		{
			tag: 'Way 3',
			title: 'Cross platform',
			body: 'One codebase in <b>Flutter</b> or <b>React Native</b> turns into two real apps, one for each store.'
		},
		{
			tag: 'Choosing',
			title: 'Each wins a different job',
			body: 'Need raw speed, go native. Need both stores with a small team, go cross platform. Need everyone to open it in a second, go web.'
		},
		{
			tag: 'Make it stick',
			title: 'Count the codes',
			body: 'Native is written twice, cross platform once for two apps, web once for everyone. Fewer codes means less work, and a little less power from the phone.'
		},
		{
			tag: 'Try it',
			title: 'One new feature',
			body: 'A new feature means new code. Native writes it in both languages, the other two write it once.'
		}
	],
	picture:
		'The nimbus app built three ways side by side. Native has two code sheets for two phones, cross platform has one sheet for two phones, and web has one sheet for a phone and a laptop.',
	ways: { native: 'Native', cross: 'Cross platform', web: 'Web' },
	sheets: { kotlin: 'Kotlin', swift: 'Swift', dart: 'Dart', html: 'HTML' },
	devices: { android: 'Android', iphone: 'iPhone', phone: 'Phone', laptop: 'Laptop' },
	counts: { native: '2 codebases', cross: '1 codebase, 2 apps', web: '1 codebase, everywhere' },
	examples: { native: '3D racing game', cross: 'Two person startup', web: 'Cafe menu' },
	rule: 'Native twice, cross once, web once for all',
	featureBtn: 'Add a new feature',
	featureDone: 'Two features added'
};
