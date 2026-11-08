import type { ExperimentText } from '../../types';

export const en: ExperimentText = {
	title: 'What is a data center',
	intro: [
		'A server is a computer. Where do hundreds of them live? In a <b>data center</b>, a building equipped to keep computers running.',
		'Those tall cabinets are <b>racks</b>. They hold servers, storage, and network equipment. Cables connect the machines to each other and to the internet.',
		'Turn off the mains. The servers stay on because a <b>UPS</b> supplies battery power immediately. Its reserve is limited. Advance time to watch it drain.',
		'A <b>generator</b> supplies power for longer while fuel lasts. The UPS bridges the gap until it is ready. Start the generator before the battery runs out.',
		'Servers also produce heat. Turn off cooling and advance time. In this simulation, high temperature stops the servers. A broken internet link can also make the site unreachable while the servers stay on.',
		'[ingat] <b>Computing needs facilities.</b> Servers process data, networks carry it, and data centers provide power, cooling, and physical security.',
		'Renting [[cloud|cloud/cloud]] resources means using a provider’s data centers. A [[region|cloud/region]] is a geographic area. An [[availability zone|resilience/availability-zone]] can contain one or several data centers.'
	],
	reactions: {
		ups: 'Mains power is off, but the UPS took over. Advance time. A battery buys time to act, not unlimited power.',
		generator: 'The generator is supplying power. The UPS can recharge while the servers work.',
		blackout:
			'The UPS is empty and no other supply is ready. Restore mains power or start the generator.',
		cooling:
			'Cooling has stopped. The servers work for now, but heat is building up. Advance time to see what happens.',
		hot: 'The simulation’s temperature limit was exceeded. Restore cooling and advance time to bring it down.',
		network:
			'The racks are powered, but visitors cannot reach them. Power and internet connectivity are separate requirements.',
		recovered: 'The site is reachable again. You fixed the cause of the outage.',
		running:
			'Power, cooling, and networking are working together. Change one part and watch the result.'
	},
	labLabel: 'Your experiment',
	goal: 'Keep nimbus.com running',
	tasks: ['Try backup power', 'Start the generator', 'Cause an outage', 'Restore the site'],
	hintLabel: 'Hint',
	hint: 'Turn off mains power, advance time once, then start the generator. Test cooling or networking separately, then restore it.',
	scope:
		'Simplified model. UPS capacity, heat rise, and the 50 °C limit are teaching values, not data center design specifications.',
	labels: {
		mains: 'Mains',
		generator: 'Generator',
		cooling: 'Cooling',
		network: 'Network',
		on: 'on',
		off: 'off',
		advance: 'Advance 5 minutes',
		building: 'Nimbus data center',
		minutes: 'minutes',
		rack: 'Rack',
		temperature: 'Room temperature',
		floor: 'Racks, cables, power, and cooling in one building',
		online: 'nimbus.com is reachable',
		offline: 'Site unreachable',
		noPower: 'Every power source is empty or off.',
		tooHot: 'The temperature is too high for this model.',
		noNetwork: 'The servers are on, but the internet link is down.',
		serving: 'Visitor requests reach the servers and receive a response.'
	}
};
