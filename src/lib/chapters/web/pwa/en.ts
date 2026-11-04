import type { PwaText } from './types';

export const en: PwaText = {
	title: 'What is a PWA',
	intro: [
		'Remember the trade off from [[native and cross platform|web/mobile-apps]]? A website reaches everyone with nothing to install, but it is not quite an app. Here is a plain nimbus.com on a phone, and every file comes fresh from the server.',
		'Now watch the internet drop. A plain website lives on the server, so with no connection the browser has nothing at all to show.',
		'A <b>PWA</b>, short for Progressive Web App, fixes both. It is still the same website, but it can sit on your home screen like an app, open full screen without the address bar, and keep working offline.',
		'The first ingredient is a tiny file called the <b>manifest</b>. It tells the phone the app name, the icon, and the colours. When a phone finds one, it offers to install the site.',
		'The second is a <b>service worker</b>, a small script that stands between the page and the internet like a doorman. On your first visit it saves the important files into a <b>cache</b>, a storage box right on the phone.',
		'Tap install, and nimbus.com gets its own icon next to your other apps. No app store, no waiting for approval.',
		'Now cut the internet again and open the app. It still opens! The service worker answers from the cache instead of the server.',
		'[ingat] The manifest is the ID card, the service worker is the doorman with a backpack. The ID card gets it installed, the backpack keeps it working offline.',
		'[fyi] When Twitter launched Twitter Lite as a PWA in 2017, it took less than 1 MB on the phone, while the Android app needed many times more. Starbucks and Pinterest built PWAs too, so people on slow connections could still order and scroll.',
		'If you like, flip the internet off and on and watch the app open either way. Totally optional.'
	],
	reactions: {
		offline:
			'Still there! No internet, and the app opens anyway, straight from the cache on the phone.',
		online:
			'Back online. Now the service worker can fetch fresh files from the server again and quietly refresh the cache.'
	},
	panels: [
		{
			tag: 'Plain site',
			title: 'Fresh from the server',
			body: 'A normal website asks the server for every file, each time you open it.'
		},
		{
			tag: 'Offline',
			title: 'Nothing to show',
			body: 'No connection, no files. The browser can only show its sad offline page.'
		},
		{
			tag: 'PWA',
			title: 'A website that acts like an app',
			body: 'Same site, same address, but with its own icon on the <b>home screen</b> and the power to open offline.'
		},
		{
			tag: 'Piece 1',
			title: 'The manifest',
			body: '<b>manifest.json</b> holds the name, the icons, and the colours. Finding it is what makes the phone offer to install.'
		},
		{
			tag: 'Piece 2',
			title: 'The service worker',
			body: 'A script that sits between the page and the internet. It copies the page, the styles, and the logo into the <b>cache</b>.'
		},
		{
			tag: 'Install',
			title: 'Onto the home screen',
			body: 'Thanks to the manifest, the site lands next to your other apps and opens full screen.'
		},
		{
			tag: 'Offline again',
			title: 'Served from the cache',
			body: 'The service worker catches the request and hands over the saved copies. The server is never asked.'
		},
		{
			tag: 'Remember',
			title: 'ID card and doorman',
			body: 'Manifest means installable. Service worker means offline. A PWA needs both.'
		},
		{
			tag: 'Try it',
			title: 'Online or not',
			body: 'Online, the files can come from the server. Offline, they come from the cache. The app opens either way.'
		}
	],
	picture:
		'A phone showing nimbus.com, a server connected over the internet, a manifest file, a service worker standing on the connection, and a cache box on the phone.',
	serverLabel: 'nimbus.com',
	noInternet: 'No internet',
	installAsk: 'Install nimbus?',
	installBtn: 'Install',
	appName: 'nimbus',
	tagline: 'Learn tech from zero',
	fromCache: 'from cache',
	fromServer: 'from server',
	cacheLabel: 'Cache on the phone',
	workerLabel: 'service worker',
	memo: { manifest: 'ID card', worker: 'doorman' },
	rule: 'ID card to install, doorman to go offline',
	offBtn: 'Turn off the internet',
	onBtn: 'Turn the internet back on'
};
