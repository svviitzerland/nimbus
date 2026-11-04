import type { HardwareText } from './types';

export const en: HardwareText = {
	title: 'Computer components',
	intro: [
		'Remember how computers kept getting smaller? Today a whole one fits inside this thin laptop. From the outside you only see a <b>screen</b>, a <b>keyboard</b>, and a touchpad. So where is the brain?',
		'Let us open it up. Out come the screws, up comes the keyboard, and... ta da! It is busy in there. Every part has its own job, so let us meet them one by one.',
		'The big board everything sits on is the <b>motherboard</b>. Think of it as the streets of a tiny city. Every part lives on it, and thin copper roads carry messages from one part to another.',
		'In the middle sits the <b>CPU</b> (central processing unit), the brain. It reads instructions one after another and follows them, billions of tiny steps every second. Deep down it only understands on and off ([[bits|basics/binary]]).',
		'Right next to it are the <b>RAM</b> sticks (random access memory). RAM is the desk, where everything you are using right now is laid out within easy reach. Very fast, but it forgets everything when the power goes off.',
		'That small stick is <b>storage</b>, an SSD (older computers use a spinning hard disk). Storage is the cupboard. Your photos, apps, and games stay in there even when the computer is off.',
		'Watch what happens when you open a game. It is carried out of the cupboard onto the desk, and the CPU works on it from there. That little wait while a game loads is exactly this trip.',
		'[ingat] RAM is the desk, storage is the cupboard. Power off clears the desk, the cupboard stays full. That is why you press save, saving means putting your work back in the cupboard.',
		'This chip is the <b>GPU</b> (graphics processing unit). It draws everything you see, millions of tiny dots on the screen, many times every second. Games and videos keep it very busy.',
		'The biggest piece, under where your hands rest, is the <b>battery</b>. It feeds power to every part through the motherboard. A desktop computer has a power supply plugged into the wall instead, same job.',
		'Let us put the keyboard back on. And this is how you and the computer talk. The <b>keyboard</b> is <b>input</b>, it sends your presses in. The <b>screen</b> is <b>output</b>, it shows you the result. Press a key, the CPU hears it, and a letter appears.',
		'That is the whole team. Even a big [[server|foundations/server]] is built from the very same parts. Tap any part if you want to see it again, then let us find out how the CPU thinks in nothing but 0 and 1.'
	],
	reactions: {
		peek: 'There it is again. Look around as long as you like, the picture does not mind.'
	},
	steps: [
		{
			tag: 'Laptop',
			title: 'A whole laptop',
			body: 'What you see every day is only the outside, the <b>screen</b>, the <b>keyboard</b>, and the <b>touchpad</b>. The parts doing the real work are hidden inside the body.'
		},
		{
			tag: 'Opened',
			title: 'Inside a laptop',
			body: 'Under the keyboard sit the <b>motherboard</b> with its chips, a cooling <b>fan</b>, and a big <b>battery</b> under where your hands rest. Phones, desktops, and servers have the same kinds of parts.'
		},
		{
			tag: 'Motherboard',
			title: 'The city streets',
			body: 'A large circuit board covered in thin copper lines called <b>traces</b>. They carry electricity and data between the parts, like roads between houses.'
		},
		{
			tag: 'CPU',
			title: 'The brain',
			body: 'Follows instructions one at a time, extremely fast. Its speed is written in GHz, and <b>3 GHz</b> means about three billion tiny steps every second.'
		},
		{
			tag: 'RAM',
			title: 'The desk',
			body: 'Holds the apps and files open right now, so the CPU can grab them instantly. It needs power to remember. <b>8 GB RAM</b> on a shop label tells you how big the desk is.'
		},
		{
			tag: 'Storage',
			title: 'The cupboard',
			body: 'Keeps files for good, even with no power. Much bigger than RAM, but slower to reach. <b>512 GB SSD</b> on a label is the size of the cupboard.'
		},
		{
			tag: 'Loading',
			title: 'Storage, then RAM, then CPU',
			body: 'Files are copied from storage into RAM, and the CPU reads them from RAM. It almost never reaches into storage directly, that would be far too slow.'
		},
		{
			tag: 'Remember it',
			title: 'The desk and the cupboard',
			body: 'Power off clears the desk (RAM), the cupboard (storage) keeps everything. Rule of thumb, if you did not save it, it only lived in RAM.'
		},
		{
			tag: 'GPU',
			title: 'The painter',
			body: 'A chip built to do thousands of small drawing jobs at the same time, colouring every dot (<b>pixel</b>) of the screen. In many laptops it lives inside the same chip as the CPU.'
		},
		{
			tag: 'Power',
			title: 'The battery',
			body: 'Stores energy and sends it through the motherboard to every part. No power, no work, and RAM empties.'
		},
		{
			tag: 'Input and output',
			title: 'Keyboard in, screen out',
			body: '<b>Input</b> brings things in (keyboard, mouse, touch, microphone). <b>Output</b> sends results out (screen, speakers). The CPU sits in between.'
		},
		{
			tag: 'The team',
			title: 'Every part together',
			body: 'Tap any part in the picture to look at it again. Nothing here is required, it is just for a second look.'
		}
	],
	labels: {
		screen: 'Screen',
		keyboard: 'Keyboard',
		board: 'Motherboard',
		cpu: 'CPU',
		ram: 'RAM',
		storage: 'SSD',
		gpu: 'GPU',
		battery: 'Battery'
	},
	powerOff: 'Power off',
	cleared: 'empty',
	kept: 'still here',
	typed: 'hello',
	picture: 'A laptop opened up, showing the motherboard, chips, fan, and battery inside'
};
