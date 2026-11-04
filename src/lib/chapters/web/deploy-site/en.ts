import type { DeploySiteText } from './types';

export const en: DeploySiteText = {
	title: 'Deploying a site',
	intro: [
		'Right now nimbus.com lives on your laptop, like in [[the laptop as a server|foundations/laptop-server]]. Watch what happens when the lid closes. The site vanishes for everyone, because the only computer serving it just went to sleep.',
		'<b>Deploying</b> means putting your site on a computer that never sleeps, a <b>server</b> in a data centre, so anyone can open it at any hour, even while you are fast asleep.',
		'You already know the first move from the Git lessons. You <b>push</b> your commits to a repository on GitHub (the online copy from [[Git is not GitHub|compute/git-vs-github]]). Watch the little package leave your laptop.',
		'A <b>host</b> is the company whose servers keep your site online. It watches your repository, spots the new commit, and runs a <b>build</b>. A build turns the code you wrote into the final, tidy files a browser can read.',
		'Then the host serves those files at nimbus.com. Open it on any phone, anywhere, and the new headline is already there. You never touched the server yourself.',
		'[ingat] Push, build, live. You only do the first word, the host does the other two. Three words, and a change on your laptop lands on every phone.',
		'Hosts come in two kinds. A <b>platform</b> like Vercel, Netlify, or Cloudflare Pages does every step by itself. A <b>VPS</b> (virtual private server) is a rented computer where you log in and type each step yourself. More control, more chores.',
		'One more thing for your own site, the little lock. Visitors expect <b>HTTPS</b>, and for that the server needs a <b>certificate</b>, a digital ID card that proves it really is nimbus.com. <b>Let’s Encrypt</b> hands them out for free, and most hosts set one up for you by themselves.',
		'[fyi] Push, build, live is a tiny [[CI/CD|compute/cicd]] pipeline. Bigger teams add automatic tests in the middle, so a broken change gets stopped before it ever reaches a phone.',
		'Want to watch it once more? Push a new headline and follow it all the way to the phone. Totally optional.'
	],
	reactions: {
		push: 'There it goes. One push from your laptop, and moments later the new headline is on the phone. Nobody copied a single file by hand.'
	},
	panels: [
		{
			tag: 'On your laptop',
			title: 'Lid closed, site gone',
			body: 'A site served from your own laptop only lives while that laptop is awake and online.'
		},
		{
			tag: 'Server',
			title: 'A computer that never sleeps',
			body: 'A <b>server</b> sits in a data centre with steady power and internet, switched on day and night.'
		},
		{
			tag: 'Step 1',
			title: 'Push',
			body: '<b>git push</b> sends your new commit from the laptop to the repository on GitHub. Your part ends right here.'
		},
		{
			tag: 'Step 2',
			title: 'Build',
			body: 'The host notices the new commit and runs a <b>build</b>, packing your source code into small files that are ready for browsers.'
		},
		{
			tag: 'Step 3',
			title: 'Live',
			body: 'The host serves the fresh files at <b>nimbus.com</b>. Every visitor gets the new version the next time they open it.'
		},
		{
			tag: 'Make it stick',
			title: 'Push, build, live',
			body: 'You push, the host builds, the world sees it. The same three steps, every single time.'
		},
		{
			tag: 'Hosts',
			title: 'Platform or VPS',
			body: 'A <b>platform</b> runs the steps for you. On a <b>VPS</b> you log in and type them yourself, like the commands on that little screen.'
		},
		{
			tag: 'HTTPS',
			title: 'A free certificate',
			body: 'The host asks <b>Let’s Encrypt</b> for a certificate, and a lock appears next to nimbus.com. It even renews itself before it runs out.'
		},
		{
			tag: 'Pipeline',
			title: 'Tests in the middle',
			body: 'A <b>pipeline</b> is a chain of automatic steps. With tests in it, a broken change never gets past the checkpoint.'
		},
		{
			tag: 'Try it',
			title: 'Your own push',
			body: 'Each push runs the whole chain again. Real teams do this many times a day.'
		}
	],
	picture:
		'A laptop pushes code to GitHub, a host server builds it, and a phone shows the live site.',
	labels: { laptop: 'Your laptop', repo: 'GitHub', host: 'Host', phone: 'Any phone' },
	arrows: { push: 'push', build: 'build', live: 'live', tests: 'tests' },
	headlines: ['Coming soon', 'Hello, world', 'Now on phones', 'Learn from zero'],
	unreachable: 'Site not found',
	alwaysOn: 'on 24/7',
	updated: 'just updated',
	hosts: { platform: 'Platform, by itself', vps: 'VPS, by hand' },
	vpsCommands: ['$ ssh nimbus.com', '$ git pull', '$ npm run build', '$ nginx -s reload'],
	cert: { title: 'Let’s Encrypt', sub: 'free certificate' },
	rule: 'Push, build, live',
	pushBtn: 'Push a new headline',
	pushing: 'On its way'
};
