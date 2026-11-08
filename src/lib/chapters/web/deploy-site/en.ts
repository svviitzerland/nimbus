import type { DeploySiteText } from './types';

export const en: DeploySiteText = {
	title: 'Deploying a site',
	intro: [
		'So far nimbus.com has lived on your laptop. Remember [[the laptop as a server|foundations/laptop-server]]? The moment the lid closes or the WiFi drops, the site is gone for everyone.',
		'<b>Deploying</b> means moving your site onto a computer that never sleeps, a server, so anyone can open it at any hour. Every change you make later gets deployed again, sometimes many times a day.',
		'The old way was copying files to the server by hand, one by one. Forget a single file and half the site breaks. Today you simply <b>push</b> your code to a repository (the shared folder from [[version control|compute/version-control]]), and the host takes it from there.',
		'First the host runs a <b>build</b>, turning your source code into the final files a browser reads, small and tidy. Then it serves those files at your address. Push, build, live.',
		'There are two kinds of host. A <b>platform</b> like Vercel, Netlify, or Cloudflare Pages does every step for you. A <b>VPS</b> (virtual private server) is a rented computer in a data centre where you do every step yourself. More control, more chores.',
		'To serve nimbus.com over <b>HTTPS</b>, the server needs a TLS certificate matching the domain. A certificate authority such as <b>Let’s Encrypt</b> checks domain control before issuing it. Platforms usually manage installation and renewal; on a VPS you need to configure them. See [[TLS|security/tls]] for the flow.',
		'[fyi] That push, build, and go live chain is a tiny [[CI/CD|compute/cicd]] pipeline. Big teams just add tests and checks in the middle.',
		'[ingat] On a configured platform, a push can trigger a build and deployment. On a VPS, set up your own deployment process or run the steps manually.',
		'Your turn. Change the headline of nimbus.com, pick a host, push, and watch it show up on a phone.'
	],
	reactions: {
		platform:
			'Live! You only pushed. The platform noticed the new commit, built the site, and put it online at nimbus.com. That is why most small sites start here.',
		vpsWait:
			'Pushed, and then nothing. A VPS does not watch your repository. Log in to the server and do each step yourself, top to bottom.',
		vps: 'Live, the hands on way. You logged in, pulled the code, built it, and restarted the web server. Same result, more work, but you control every piece of that machine.',
		both: 'Now you have done both. A platform is quick and calm, a VPS gives you the whole machine to shape. Plenty of teams start on a platform and move to their own servers as they grow.'
	},
	headlineLabel: 'Your new headline',
	startHeadline: 'Coming soon',
	newHeadline: 'Hello from nimbus.com',
	hostLabel: 'Host',
	hosts: {
		platform: { name: 'Platform', sub: 'Vercel, Netlify' },
		vps: { name: 'Your own VPS', sub: 'a rented server' }
	},
	pushBtn: 'Push the change',
	vpsSteps: [
		'Log in to the server',
		'Pull the new code',
		'Build the site',
		'Restart the web server'
	],
	vpsHint: 'Your turn, run each step in order',
	laptopLabel: 'Your laptop',
	serverLabel: 'Host',
	phoneLabel: 'Anyone, anywhere',
	idleNote: 'nimbus.com still shows the old headline',
	buildingNote: 'The host is building your site',
	vpsNote: 'The code reached GitHub, but the server has not moved',
	liveNote: 'Live at nimbus.com, for everyone',
	updated: 'just updated',
	certLabel: 'HTTPS uses a TLS certificate',
	certNote:
		'Let’s Encrypt can issue a certificate after domain control is verified. Renewal needs to be configured.'
};
