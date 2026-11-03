import type { KubernetesText } from './types';

export const en: KubernetesText = {
	title: 'What is Kubernetes',
	intro: [
		'You already pack nimbus.com into [[containers|compute/container]]. Maybe you even split it into [[microservices|compute/microservices]]. Now there are dozens of containers, spread over several machines.',
		'Someone has to decide which machine runs which container, notice when one crashes at three in the morning, and start a new one. Doing that by hand means never sleeping.',
		'<b>Kubernetes</b> (often written K8s, a K, eight letters, then an s) is the one that does it. You do not tell it what to do step by step. You tell it what you <b>want</b>, for example "keep five copies of nimbus.com running".',
		'Its brain, the <b>control plane</b>, keeps comparing what you want with what is actually running. The machines it manages are called <b>nodes</b>, and each running copy lives in a <b>pod</b> (a small wrapper around your container).',
		'[fyi] The word "node" means something else in networking, where any device on a network is a node. In Kubernetes a node is one machine that runs your pods. Kubernetes itself was born at Google, inspired by their internal system called Borg, and was shared with the world in 2014.',
		'Five copies are running on three nodes. Be the chaos, tap pods to kill them, unplug a node, or change how many copies you want, and watch Kubernetes keep its promise.'
	],
	reactions: {
		healed:
			'You killed a pod, the control plane noticed one copy was missing, and started a fresh one. Nobody had to wake up.',
		healed2:
			'Again, and again it heals. That is the big idea. You declare what you want, and Kubernetes keeps fixing reality until it matches.',
		scaledUp:
			'You asked for more, so Kubernetes placed new pods on the nodes with room. Busy traffic day? Just raise the number, much like [[auto scaling|traffic/auto-scaling]].',
		scaledDown: 'You asked for fewer, so Kubernetes gently removed the extra pods.',
		nodeDown:
			'A whole machine died, taking its pods with it. Kubernetes moved them to the nodes that are still alive. Your users never saw the gap.',
		nodeBack: 'The node is back and ready for new pods whenever they are needed.'
	},
	youDeclare: 'You want',
	replicasLabel: 'copies',
	runningLabel: '{n} of {d} running',
	planeLabel: 'Control plane',
	planeWatching: 'watching, all good',
	planeFixing: 'starting {n} new',
	planePending: '{n} waiting for room',
	nodeLabel: 'node {n}',
	nodeDownTag: 'offline',
	podHint: 'Tap a pod to kill it',
	unplugBtn: 'Unplug node {n}',
	plugBtn: 'Plug node {n} back in',
	pendingLabel: 'pending'
};
