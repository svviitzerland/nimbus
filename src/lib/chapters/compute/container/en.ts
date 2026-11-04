import type { ContainerText } from '../types';

export const en: ContainerText = {
	title: 'Containers',
	intro: [
		'Your app does not run alone. It needs a language, libraries, and config files. Move it to another computer, forget one piece, instant error. The classic, "works on my laptop".',
		'So everything it needs gets wrapped into one package called a <b>container</b>. Look at the stack. The machine sits at the bottom, <b>Docker</b> sits on it as the base that runs containers, and on top the containers stand in a row, each carrying its own needs.',
		'<b>Docker</b> is the most common container tool, nearly everyone starts here. When there is more than one machine, <b>Docker Swarm</b> makes a few machines run containers together.',
		'Then there is <b>Kubernetes</b>, and that is a different world. A brain called the <b>control plane</b> manages many machines holding hundreds of containers, with its own automatic scaling and failover. Companies the size of Spotify or Gojek run their services on Kubernetes. And note this, Docker does not have to come with Kubernetes. Many people assume they are a bundle, yet Docker stands perfectly well on its own, and your small project does fine with plain Docker.',
		'That container package is stored as an <b>image</b>, a frozen template ready to run. Images live in a <b>registry</b>, an online warehouse just for images, and the best known one is <b>Docker Hub</b>. You <b>push</b> (send) the image from your laptop up there, then every server simply <b>pulls</b> (fetches) the same image from it.',
		'Now it is your app’s turn to be packed. Turn it into an <b>image</b> (a frozen template that can run as a container anywhere), then run the exact same copy in three different places.'
	],
	reactions: {
		built:
			'The image is built. Your app, libraries, and settings are locked into one package that cannot forget anything.',
		ran: 'And they all run. Three different places, the exact same container, no "works on my laptop" drama. That is why containers are everywhere.'
	},
	buildLabel: 'Pack into an image',
	runLabel: 'Run in 3 places',
	imageLabel: 'nimbus-app v1',
	machines: ['Your laptop', 'Office server', 'Cloud'],
	sameTag: 'identical',
	pieces: ['app.js', 'library', 'config'],
	yourLaptop: 'Your laptop',
	otherMachine: 'Another computer',
	brokenTag: 'error, something forgotten',
	archMachine: 'Machine, laptop or server',
	archDocker: 'Docker',
	archApps: ['App A + its needs', 'App B + its needs'],
	swarmTag: 'Docker Swarm, a few machines managed together',
	k8sPlane: 'Control plane, the Kubernetes brain',
	nodeLabel: 'Node {n}',
	k8sBadge: 'automatic scaling & failover',
	registryName: 'Docker Hub',
	registrySub: 'registry, the image warehouse',
	pushTag: 'push',
	pullTag: 'pull',
	serverLabel: 'Server {n}',
	noteIdle: 'Pack your app first',
	noteBuilt: 'Packed tight, ready to travel anywhere',
	noteRan: 'One image, three places, the exact same result'
};
