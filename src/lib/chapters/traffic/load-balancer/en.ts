import type { LoadBalancerText } from '../types';

export const en: LoadBalancerText = {
	title: 'Load balancer',
	intro: [
		'A single server has a limit. While traffic is calm it stays relaxed. But the moment visitors flood in, it gets overwhelmed.',
		'Picture running a <b>flash sale</b>. At noon sharp, thousands of people open your site at once. One server fills up instantly, the site slows down, then goes down.',
		'The fix is to put a <b>load balancer</b> in front of several identical servers. Its job is to spread requests across them, by default one after another (round robin, though other methods like least connections exist), so no single server gets flooded.',
		'As a bonus, if one server dies the balancer stops sending to it and reroutes traffic to the ones still alive. Visitors never notice.',
		'The flash sale is ready to go, and a single server is on duty. Let it fall first, then bring in a load balancer with a few servers and watch the load spread out evenly.',
		'[ingat] A load balancer distributes requests across servers that can serve them.'
	],
	reactions: {
		overload:
			'Right, one server cannot hold a flash sale surge. Its load goes red and the site starts going down. Add a load balancer to spread the load.',
		balanced:
			'See, now the load is split evenly across every server. They all stay green and the site stays fast even under heavy traffic. That is the load balancer at work.',
		rerouted:
			'One server died, but the balancer instantly reroutes its traffic to the servers still alive. The site keeps running without a hitch.'
	},
	startSale: 'Start flash sale',
	addServer: 'Add a server',
	killServer: 'Kill one server',
	reset: 'Reset',
	balancerLabel: 'Load balancer',
	balancerNote: 'splits visitors evenly',
	serverLabel: 'Server {n}',
	crowdOne: '1 visitor',
	crowdMany: 'Visitors flooding in',
	promptStart: 'The site is calm, just one visitor and one server. Try making it suddenly busy.',
	promptOverload: 'Visitors are flooding one server and it cannot cope. Try adding a server.',
	promptBalanced:
		'Now there are several servers, and the load balancer splits visitors evenly across them. Try killing one server.',
	promptDone:
		'One server died, but the load balancer instantly reroutes visitors to the others. The site stays up.',
	statusUp: 'Online',
	statusOver: 'Overwhelmed',
	statusDown: 'Down',
	siteFast: 'Site is fast',
	siteSlow: 'Site is slow',
	siteDown: 'Site is down',
	loadLabel: 'Load'
};
