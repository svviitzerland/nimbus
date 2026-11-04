import type { OsText } from './types';

export const en: OsText = {
	title: 'Operating systems',
	intro: [
		'Look at this laptop. A browser, music, and chat are all running at once, yet it has only one CPU, one RAM, and one storage, the parts you met in [[CPU, RAM, and storage|basics/hardware]]. So who decides which app gets what?',
		'That is the job of the <b>operating system</b>, or <b>OS</b>. It is the manager sitting between the apps and the hardware. Apps never grab the CPU or RAM themselves, they ask the OS, and the OS hands it out.',
		'[ingat] The OS is like a waiter in a restaurant. The apps are the guests and the hardware is the kitchen. Guests never walk into the kitchen, they order through the waiter.',
		'Watch the apps open. Each one first asks the OS for a window and some memory, and only then does it show up on the screen.',
		'There is only one CPU, so the OS lets the apps take turns. Each app gets a tiny slice of time, a few thousandths of a second, then the next one goes. It switches so fast that everything looks like it runs at once.',
		'The OS also hands each app its own piece of RAM and keeps those pieces apart. That way a crashing game cannot mess up your chat. The OS keeps a little RAM for itself, too.',
		'[fyi] Open one app too many and RAM fills up. The OS then parks the extra on storage (this is called <b>swap</b>). Storage is much slower than RAM, and that is the moment a laptop starts to crawl.',
		'It looks after your files as well. When the music app wants a song, it asks the OS, and the OS fetches it from storage. Folders are simply the OS keeping your files tidy.',
		'You already know a few OSes. <b>Windows</b> and <b>macOS</b> run laptops, <b>Linux</b> runs most of the servers on the internet, and <b>Android</b> and <b>iOS</b> run phones (Android is built on Linux). You can talk to any of them with icons or typed commands, see [[CLI and GUI|foundations/cli-gui]].',
		'Different names, same job. If you like, open and close apps on the laptop and watch the OS share out the RAM.'
	],
	reactions: {
		open: 'Another app, another piece of RAM. The OS slots it in and adds it to the line for CPU turns.',
		slow: 'Uh oh, RAM is full. The OS parks the rest on slow storage, so everything stutters. This is when the fan gets loud. Try closing an app.',
		close:
			'Closing an app gives its RAM back to the OS, and the others can breathe again. That is why closing apps you do not use helps an older laptop.'
	},
	steps: [
		{
			title: 'One of each',
			body: 'Many apps, but just one <b>CPU</b>, one <b>RAM</b>, and one <b>storage</b>. Someone has to share them out.'
		},
		{
			title: 'The manager',
			body: 'The <b>OS</b> sits between the apps and the hardware. Apps ask, the OS decides and hands out.'
		},
		{
			title: 'Opening apps',
			body: 'Before an app can start, the OS gives it a window on the screen and a place in memory.'
		},
		{
			title: 'Turns on the CPU',
			body: 'The CPU works for one app at a time. The OS passes it around in tiny slices, round and round.'
		},
		{
			title: 'Sharing RAM',
			body: 'Each app gets its <b>own piece</b> of RAM, kept apart from the others. 8 GB is shared by everyone.'
		},
		{
			title: 'When RAM is full',
			body: 'The extra spills onto storage, called <b>swap</b>. It still works, just slowly.'
		},
		{
			title: 'Files',
			body: 'Apps ask the OS for files. The OS finds them on storage and keeps the folders in order.'
		},
		{
			title: 'OSes you know',
			body: '<b>Windows</b>, <b>macOS</b>, and <b>Linux</b> on computers and servers. <b>Android</b> and <b>iOS</b> on phones.'
		},
		{
			title: 'Try it, if you like',
			body: 'Tap an app under the laptop to open or close it, and watch the RAM.'
		}
	],
	apps: [
		{ id: 'browser', name: 'Browser' },
		{ id: 'music', name: 'Music' },
		{ id: 'chat', name: 'Chat' },
		{ id: 'game', name: 'Game' }
	],
	osLabel: 'Operating system',
	cpuLabel: 'CPU',
	ramLabel: 'RAM',
	diskLabel: 'Storage',
	turn: '{app} has its turn',
	ramUsed: '{n} of 8 GB used',
	slowTag: 'slow',
	fileName: 'song.mp3',
	osTrick: 'apps order, the OS serves',
	devices: [
		{ os: 'Windows', kind: 'laptop' },
		{ os: 'macOS', kind: 'laptop' },
		{ os: 'Linux', kind: 'server' },
		{ os: 'Android', kind: 'phone' },
		{ os: 'iOS', kind: 'phone' }
	],
	dockHint: 'Tap an app',
	toggleLabel: 'Open or close {app}'
};
