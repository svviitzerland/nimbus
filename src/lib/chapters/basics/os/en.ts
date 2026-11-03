import type { OsText } from './types';

export const en: OsText = {
	title: 'Operating systems',
	intro: [
		'Right now your phone or laptop is running lots of apps at once, music, chat, a browser. Yet it has only one CPU and one RAM, the parts you met in [[CPU, RAM, and storage|basics/hardware]]. So who decides which app gets what?',
		'That is the job of the <b>operating system</b>, or <b>OS</b>. Think of it as the manager standing between the apps and the hardware. Apps never grab the CPU, RAM, or storage themselves, they politely ask the OS.',
		'You already know a few. <b>Windows</b> and <b>macOS</b> run laptops, <b>Android</b> and <b>iOS</b> run phones, and <b>Linux</b> runs most of the servers on the internet (Android is built on Linux too). You talk to an OS by tapping icons or by typing commands, see [[CLI and GUI|foundations/cli-gui]].',
		'The OS shares the CPU by taking turns. Each app gets a tiny slice of time, a few thousandths of a second, then the next app gets one. It switches so fast that everything looks like it runs at the same time.',
		'It also hands every app its own piece of RAM and keeps those pieces apart, so a crashing game cannot mess up your chat. And it looks after the files in storage, that is where folders come from.',
		'[fyi] When RAM is full, the OS borrows a corner of storage and pretends it is RAM (called <b>swap</b>, or virtual memory). It works, but storage is far slower than RAM, and that is the moment a computer starts to crawl.',
		'Here is a laptop with its OS in the middle. Open the apps one by one, watch the OS share out the CPU and RAM, and keep going until it struggles.'
	],
	reactions: {
		first:
			'One app open. The OS gave it a piece of RAM and a turn on the CPU. With nobody else around, it has the CPU almost all to itself.',
		more: 'Now the CPU takes turns. See the highlight hopping between apps? Each one gets a tiny slice, over and over, far too fast for you to notice in real life. So they all feel like they run together.',
		slow: 'Uh oh, RAM is full. The OS starts parking pieces of apps on storage, and storage is slow, so everything stutters. This is when the fan spins up and the loading circle keeps spinning. Try closing an app.',
		close:
			'Closing an app gives its RAM back to the OS, which hands it to the others. That is why closing apps you are not using really does help an older laptop.'
	},
	dockHint: 'Tap an app to open it',
	apps: [
		{ id: 'browser', name: 'Browser' },
		{ id: 'music', name: 'Music' },
		{ id: 'chat', name: 'Chat' },
		{ id: 'game', name: 'Game' }
	],
	desktopEmpty: 'Nothing open yet',
	osLabel: 'Operating system',
	osSub: 'the manager between apps and hardware',
	cpuLabel: 'CPU',
	turn: '{app} has its turn',
	cpuIdle: 'waiting for work',
	ramLabel: 'RAM',
	ramUsed: '{n} of 8 GB used',
	osChunk: 'OS',
	swapLabel: 'spilled onto slow storage',
	closeLabel: 'Close {app}',
	slowTag: 'slow',
	notes: {
		idle: 'Only the OS is running, keeping a little RAM for itself',
		one: 'One app, one piece of RAM, the CPU all to itself',
		sharing: 'The OS hands the CPU to each app in turn',
		slow: 'RAM is full, so the OS pushes the rest onto storage',
		eased: 'RAM freed up, everything runs smoothly again'
	}
};
