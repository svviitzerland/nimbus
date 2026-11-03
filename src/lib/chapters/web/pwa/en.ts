import type { PwaText } from './types';

export const en: PwaText = {
	title: 'What is a PWA',
	intro: [
		'Remember the trade off from [[native and cross platform|web/mobile-apps]]? A website reaches everyone with nothing to install, but it is not quite an app. So people asked, what if a website could act like one?',
		'That is a <b>PWA</b>, short for Progressive Web App. It is still a normal website, the same nimbus.com, but you can put it on your home screen, it opens full screen without the address bar, and it keeps working when the internet drops.',
		'The first secret ingredient is a tiny file called the <b>manifest</b>. It tells the phone the app name, its icon, and its colours. When a phone finds one, it offers to install the site like an app.',
		'The second is a <b>service worker</b>, a small script that sits between the page and the internet like a helpful doorman. On your first visit it saves the important files into a <b>cache</b>, a storage box right on the phone. Later, if the internet is gone, it hands you the copies from that box.',
		'[fyi] When Twitter launched Twitter Lite as a PWA in 2017, it took up less than 1 MB on the phone, while the Android app needed many times more. Starbucks and Pinterest built PWAs too, so people on slow connections could still order and scroll.',
		'Let us try it. First see what a plain website does offline, then turn nimbus.com into a PWA, install it, and pull the plug again.'
	],
	reactions: {
		plainOffline:
			'There it is, the sad offline page. A plain website lives on the server, so with no internet the browser has nothing to show. Turn it back on and let us fix that.',
		manifest:
			'Manifest added. The phone now knows the name, the icon, and the colours, so it shows an install banner. On a real phone you would see Add to Home Screen.',
		worker:
			'Service worker on duty. Watch the cache box fill up, it quietly saved the page, the styles, and the logo while you were still online.',
		installed:
			'Installed. nimbus.com now has its own icon next to your other apps, and nobody went through an app store. Now pull the plug.',
		offlineApp:
			'It opened, with no internet at all! The service worker answered from the cache instead of the server. That is the whole magic of a PWA, a website that behaves like an app.'
	},
	steps: ['Plain site', 'PWA pieces', 'Install', 'Offline'],
	internetOn: 'online',
	internetOff: 'offline',
	offBtn: 'Turn off the internet',
	onBtn: 'Turn the internet back on',
	manifestBtn: 'Add manifest.json',
	workerBtn: 'Add a service worker',
	installBtn: 'Install to home screen',
	offAgainBtn: 'Turn off the internet',
	openAppBtn: 'Open the nimbus app',
	noInternet: 'No internet',
	installBanner: 'Install nimbus?',
	fromCache: 'from cache',
	pageTagline: 'Learn tech from zero',
	appName: 'nimbus',
	cacheLabel: 'Cache on the phone',
	cacheEmpty: 'empty, nothing saved yet',
	notes: {
		plain: 'A plain nimbus.com, straight from the server',
		plainOffline: 'Without internet, the plain site cannot load',
		addPieces: 'Give nimbus.com the two PWA pieces',
		install: 'Now the phone offers to install it',
		goOffline: 'Installed, now cut the internet',
		openApp: 'Offline. Will the app still open?',
		done: 'Opened offline, served by the service worker'
	}
};
