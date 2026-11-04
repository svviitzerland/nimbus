import type { KubernetesText } from './types';

export const en: KubernetesText = {
	title: 'What is Kubernetes',
	intro: [
		'You already pack nimbus.com into [[containers|compute/container]], neat little boxes that hold an app and everything it needs. Maybe you even split it into [[microservices|compute/microservices]]. Now there are many containers, spread over several machines.',
		'Someone has to decide which machine runs which container, and notice when one crashes at three in the morning. Doing that by hand means never sleeping.',
		'<b>Kubernetes</b> (often written K8s, a K, eight letters, then an s) does that job. You do not tell it every step. You write down what you <b>want</b>, for example keep five copies of nimbus.com running.',
		'Its brain is the <b>control plane</b>. The machines it looks after are <b>nodes</b>, and each running copy of your app sits in a <b>pod</b>, a small wrapper around a container. The control plane keeps comparing what you want with what is really running.',
		'Watch. A pod crashes, so only four are running. The control plane spots the gap and starts a fresh pod right away. Five again, and nobody had to wake up.',
		'Even a whole node can fail. Kubernetes moves its pods onto the nodes that are still healthy, and when the node comes back, it simply joins in again.',
		'[ingat] Kubernetes is Greek for the one who steers a ship, the <b>captain at the wheel</b>. That is why its logo is a ship wheel. You say five containers, the captain keeps five containers, whatever the sea throws at it.',
		'[fyi] In networking, a node means any device on a network. In Kubernetes, a node is one machine that runs your pods. Same word, different world. Kubernetes was born at Google, inspired by their internal system called Borg, and shared with everyone in 2014. It can even raise the count by itself when traffic grows, much like [[auto scaling|traffic/auto-scaling]].',
		'Want to be the storm? Tap any pod to knock it over and watch the captain replace it. Or just enjoy the calm sea.'
	],
	reactions: {
		healed:
			'You knocked one over, and a new pod was already starting before you could blink. Wanted five, running five, promise kept.'
	},
	steps: [
		{
			tag: 'The setup',
			title: 'Containers on machines',
			body: 'Five copies of nimbus.com, each in its own little box, spread over three machines.'
		},
		{
			tag: 'The problem',
			title: 'Who is watching',
			body: 'A container crashed and nobody noticed. Without help, it stays down until a human wakes up.'
		},
		{
			tag: 'The idea',
			title: 'Say what you want',
			body: 'You write <code>replicas: 5</code> and that is it. Kubernetes figures out the steps by itself.'
		},
		{
			tag: 'The parts',
			title: 'Control plane, node, pod',
			body: 'The <b>control plane</b> is the wheel at the top. <b>Nodes</b> are the machines. <b>Pods</b> are the boxes on them.'
		},
		{
			tag: 'Self healing',
			title: 'A pod dies',
			body: 'Running drops to 4, the control plane notices, and a new pod appears. Back to 5.'
		},
		{
			tag: 'Bigger trouble',
			title: 'A node dies',
			body: 'Its pods are rebuilt on the healthy nodes. The count never stays wrong for long.'
		},
		{
			tag: 'Rule of thumb',
			title: 'The captain',
			body: 'Kubernetes is the ship captain. It keeps the number of containers you asked for.'
		},
		{
			tag: 'Good to know',
			title: 'Born at Google',
			body: 'Open source since 2014, and today it runs on every big cloud and in many server rooms.'
		},
		{
			tag: 'Optional',
			title: 'Knock one over',
			body: 'Tap a pod. Watch the count dip and come right back.'
		}
	],
	planeLabel: 'Control plane',
	nodeLabel: 'node {n}',
	readout: 'Wanted {w}, running {r}',
	night: '3 AM',
	rule: 'You say 5, it keeps 5',
	tapHint: 'Tap a pod',
	podLabel: 'Pod'
};
