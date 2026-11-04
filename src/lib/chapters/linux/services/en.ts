import type { ServicesText } from './types';

export const en: ServicesText = {
	title: 'Services and systemd',
	intro: [
		'Last night you started the nimbus.com app by hand, then closed your laptop. The moment you logged out, the app stopped too, and the site went dark. Programs started by hand live only as long as you stay.',
		'Websites need to run day and night with nobody watching. A program that runs quietly in the background like that is called a <b>service</b>. On Ubuntu, a caretaker named <b>systemd</b> starts the services, watches them, and wakes them up again when they fall over.',
		'You talk to systemd with <b>systemctl</b>. First Nim asks how the app is doing, <b>systemctl status nimbus</b>. The answer is inactive (dead). Not running at all.',
		'So Nim starts it, <b>sudo systemctl start nimbus</b> (changing services is admin work, hence sudo). The lamp turns green and the site is back.',
		'Now the clever part. Nim crashes the app on purpose with <b>pkill</b> (a command that kills a program). The lamp goes red, and a moment later systemd notices and brings it back by itself. Nobody had to wake up at 3 in the morning.',
		'One problem left. If the whole server restarts (an update, a power cut), will the app come back? Only if you ask. <b>sudo systemctl enable nimbus</b> tells systemd to start it at every boot. Watch the switch.',
		'[ingat] <b>start</b> is for right now, <b>enable</b> is for every boot. You usually want both. And stop and disable are their opposites.',
		'[fyi] Same word, different world. Cloud providers sell "managed services", and Windows has its own Services window. Different places, same idea, a program kept running for you in the background.',
		'Your turn. After changing the app, admins restart it so the new version loads. Type <b>sudo systemctl restart nimbus</b> and watch the lamp blink off and on again.'
	],
	reactions: {
		restarted:
			'Off and on again in a blink. The app reloaded and the site barely noticed. That is how admins roll out a new version.',
		started: 'Running. The lamp is green and visitors can reach nimbus.com again.',
		stopped:
			'Stopped, and the site is dark. systemd does not bring back what you stopped on purpose. Start it again with <b>sudo systemctl start nimbus</b>.',
		status: 'status is the first thing to check, it tells you whether the app runs and since when.',
		enabled: 'Enabled. Now nimbus starts by itself every time the server boots.',
		disabled: 'Disabled. It still runs now, but after the next reboot it would stay off.',
		crashed: 'Crashed! Watch the gear. systemd notices and brings the app back in a moment.',
		nothingToCrash: 'Nothing to stop there, the app is not running right now.',
		needSudo:
			'systemd wants to know you are the admin. Put <b>sudo</b> in front, like in [[Permissions and sudo|linux/permissions]].',
		noUnit: 'systemd knows no service by that name here. Ours is called <b>nimbus</b>.',
		missing: 'Nothing with that name here. Try <b>sudo systemctl restart nimbus</b>.',
		denied: 'Locked, that needs the admin. Put <b>sudo</b> in front.',
		error:
			'The server did not understand that. Try <b>sudo systemctl restart nimbus</b>, exactly like that.'
	},
	panels: [
		{
			tag: 'The problem',
			title: 'Gone when you leave',
			body: 'A program you start by hand belongs to your session. Log out, and it stops with you.'
		},
		{
			tag: 'Service',
			title: 'Runs in the background',
			body: 'A <b>service</b> runs with nobody logged in. <b>systemd</b> is the caretaker that starts, watches, and restarts it.'
		},
		{
			tag: 'status',
			title: 'How is it doing',
			body: '<b>systemctl status</b> shows whether a service runs, and whether it is set to start at boot.'
		},
		{
			tag: 'start',
			title: 'Run it now',
			body: '<b>sudo systemctl start nimbus</b> starts the app in the background. The lamp on the rack shows it is alive.'
		},
		{
			tag: 'Restart=always',
			title: 'Back on its feet',
			body: 'A line in the service file asks systemd to bring the app back whenever it dies. It counts every restart too.'
		},
		{
			tag: 'enable',
			title: 'Start at every boot',
			body: '<b>enable</b> does not start anything now. It only flips the switch so the app starts whenever the server boots.'
		},
		{
			tag: 'Make it stick',
			title: 'Now or every boot',
			body: 'start, now. enable, every boot. stop and disable undo them, and restart is a quick stop plus start.'
		},
		{
			tag: 'Good to know',
			title: 'Services everywhere',
			body: 'Web servers, databases, even the SSH door you came in through are all services that systemd looks after.'
		},
		{
			tag: 'Your turn',
			title: 'Restart the app',
			body: 'Type <b>sudo systemctl restart nimbus</b> and press Enter. The lamp blinks, and the site stays up.'
		}
	],
	watchLabel: 'Nim is typing, just watch',
	tryLabel: 'Your turn, type',
	tryTip: 'Tap to let Nim type it',
	inputLabel: 'command',
	termHint: '# Nim types here first, just watch',
	hintUnknown: '# that command does not exist here',
	didYouMean: '# did you mean {word}',
	hintMissing: '# nothing with that name here',
	hintDenied: '# locked, only the admin may do that',
	serverLabel: 'nimbus.com server',
	bootLabel: 'Starts at boot',
	siteUp: 'online',
	siteDown: 'cannot connect',
	states: {
		active: 'running',
		inactive: 'not running',
		dead: 'crashed',
		restarting: 'coming back'
	},
	rule: 'start is now, enable is every boot.',
	hintSudo: '# changing services needs the admin, put sudo in front',
	hintSystemctl: '# try sudo systemctl restart nimbus'
};
