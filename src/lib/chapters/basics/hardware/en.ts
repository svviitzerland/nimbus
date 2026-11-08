import type { HardwareText } from './types';

export const en: HardwareText = {
	title: 'Computer components',
	intro: [
		'A laptop has a screen, keyboard, and touchpad on the outside. Components inside process and store data. Start by looking at the outside.',
		'Open the laptop view to see its components. There is a motherboard, CPU, RAM, storage, fan, and battery. Their positions can differ between laptop models.',
		'The <b>motherboard</b> is a circuit board connecting components. Copper traces carry signals and power between parts.',
		'The <b>CPU</b> (central processing unit) executes program instructions, such as calculating numbers or comparing values. Instructions and data are represented using [[bits|basics/binary]].',
		'<b>RAM</b> (random access memory) temporarily holds data and instructions in use. The CPU can access it quickly. RAM loses its contents when power is removed.',
		'<b>Storage</b> holds apps and files that have been written to it. This laptop uses an SSD. Unlike RAM, an SSD retains data without power, but it can still fail, so important files need backups.',
		'When an app opens, the required program and data are loaded from storage into RAM. The CPU executes the instructions. This is one of the processes that happens during loading.',
		'[ingat] <b>RAM holds temporary data. Storage retains data written to it.</b> Save your work so changes do not remain only in memory.',
		'The <b>GPU</b> (graphics processing unit) processes graphics tasks, including producing images for the screen. Some devices place the GPU on the same chip as the CPU.',
		'The <b>battery</b> supplies energy when the laptop is unplugged. Its adapter supplies power and charges the battery. Desktop computers generally use a power supply connected to mains electricity.',
		'The <b>keyboard</b> enters data through the keys you press. The <b>screen</b> displays processed results. Devices that enter data are inputs. Devices that display or produce results are outputs.',
		'Tap a component to review its function. [[Servers|foundations/server]] also use CPUs, RAM, and storage, arranged to suit the service they run.'
	],
	reactions: {
		peek: 'Your selected component is highlighted. Check its function and position in the laptop.'
	},
	steps: [
		{
			tag: 'Laptop',
			title: 'Outside a laptop',
			body: 'The <b>screen</b> displays text and images. The <b>keyboard</b> enters data. The <b>touchpad</b> moves the pointer and selects objects on screen.'
		},
		{
			tag: 'Inside',
			title: 'Inside a laptop',
			body: 'This view shows the <b>motherboard</b>, chips, RAM, SSD, fan, and battery. Actual layouts differ between laptop models.'
		},
		{
			tag: 'Motherboard',
			title: 'Connecting components',
			body: 'The <b>motherboard</b> connects components through circuit traces. These carry data signals and distribute electrical power.'
		},
		{
			tag: 'CPU',
			title: 'Executing instructions',
			body: 'The CPU executes instructions. <b>3 GHz</b> means about three billion clock cycles per second. Cycles are not instruction counts; work per cycle varies.'
		},
		{
			tag: 'RAM',
			title: 'Temporary memory',
			body: '<b>RAM</b> temporarily holds data and instructions in use. An 8 GB capacity tells you how much it can hold. Its contents disappear when power is removed.'
		},
		{
			tag: 'Storage',
			title: 'Data storage',
			body: 'Keeps files without power. Usually larger and slower than RAM. Storage can still fail, so important files need backups.'
		},
		{
			tag: 'Loading',
			title: 'Opening an app',
			body: 'Required program code and data are loaded from storage into RAM. The CPU then executes the program’s instructions.'
		},
		{
			tag: 'Remember it',
			title: 'RAM and storage without power',
			body: 'RAM loses its contents without power. Storage keeps data already written to it, including through autosave.'
		},
		{
			tag: 'GPU',
			title: 'Processing graphics',
			body: 'A <b>GPU</b> performs many graphics calculations in parallel to produce images. It may be a separate chip or integrated with the CPU.'
		},
		{
			tag: 'Power',
			title: 'Power supply',
			body: 'The battery supplies energy when the laptop is unplugged. The adapter charges the battery and powers the laptop.'
		},
		{
			tag: 'Input and output',
			title: 'Entering data and viewing results',
			body: '<b>Input</b> devices enter data, such as keyboards and microphones. <b>Output</b> devices display or produce results, such as screens and speakers.'
		},
		{
			tag: 'Review',
			title: 'Review the components',
			body: 'Tap the CPU, RAM, storage, or another component to review its function and position.'
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
