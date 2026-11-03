import type { HardwareText } from './types';

export const en: HardwareText = {
	title: 'CPU, RAM, and storage',
	intro: [
		'Every computer, from the phone in your pocket to the biggest server, is built from the same three main parts. To meet them, picture something you already know well, a kitchen.',
		'The <b>CPU</b> (central processing unit) is the cook. It does all the thinking, adding numbers, drawing your screen, deciding what happens next. It is unbelievably quick, billions of tiny steps every second, and deep down it only understands on and off ([[bits|basics/binary]]).',
		'A cook needs a counter to work on. That is <b>RAM</b> (random access memory), the desk where everything you are using right now sits within easy reach. It is very fast, but it forgets everything the moment the power goes out.',
		'Then there is the cupboard, <b>storage</b> (an SSD or a hard disk). Your photos, apps, and games live there, and they stay put even when the computer is off. It is much bigger than RAM, but slower to reach into.',
		'So when you open a game, the computer carries it from the cupboard onto the desk, and the CPU plays it from there. That is why a game makes you wait a moment while it loads, then runs smoothly.',
		'[fyi] When a shop lists a laptop as "8 GB RAM, 512 GB SSD", those are exactly the desk and the cupboard. And careful with phones, many people call storage "memory" there, but the real memory is RAM. A [[server|foundations/server]] is built from the very same three parts, just bigger.',
		'Here is a laptop with its insides showing. Load the game from storage into RAM, let the CPU play it, then pull the plug and see who remembers what.'
	],
	reactions: {
		load: 'There it goes, from the cupboard onto the desk. That little wait is storage being slower than RAM. Now the game sits right next to the CPU, ready to play.',
		run: 'The CPU grabs the game from RAM and works through it, step after step, billions of times a second. While playing it never reaches into the cupboard, the desk is so much quicker.',
		unplug:
			'Power gone. RAM forgot everything instantly, the game on the desk simply vanished. But look at storage, the game is still sitting safe in the cupboard. That is why you save your work, saving means writing it to storage.',
		power:
			'Back on, and RAM starts out empty, like a fresh desk every morning. The game is still in storage though, so you can load it again whenever you like.'
	},
	locale: 'en-US',
	cpu: { label: 'CPU', sub: 'the cook, does all the thinking', spec: '3 GHz' },
	ram: { label: 'RAM', sub: 'the desk, what you use right now', spec: '8 GB' },
	storage: { label: 'Storage', sub: 'the cupboard, keeps things for good', spec: '512 GB' },
	gameName: 'Nimbus Racer',
	otherFiles: ['Photos', 'Homework'],
	powerOn: 'Plugged in',
	powerOff: 'Unplugged',
	loadBtn: 'Load the game into RAM',
	runBtn: 'Play the game',
	unplugBtn: 'Pull the plug',
	powerBtn: 'Plug it back in',
	ramEmpty: 'empty',
	loadingTag: 'loading',
	cpuIdle: 'resting',
	cpuBusy: 'working',
	cpuOff: 'off',
	steps: '{n} steps done',
	keptTag: 'still here',
	notes: {
		idle: 'The game sits in storage, waiting to be opened',
		loading: 'Copying the game from storage into RAM',
		loaded: 'The game is on the desk, right next to the CPU',
		running: 'The CPU is playing the game straight from RAM',
		off: 'No power, so RAM is wiped clean while storage keeps its files',
		back: 'A fresh start, RAM is empty and storage still has everything'
	}
};
