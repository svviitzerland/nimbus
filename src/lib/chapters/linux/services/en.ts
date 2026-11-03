import type { ServicesText } from './types';

export const en: ServicesText = {
	title: 'Services and systemd',
	intro: [
		'The nimbus.com app is a program, and a program only works while it is running. Close it and the site is gone. So who starts it when the server boots at 3 in the morning, and who picks it back up when it crashes while you sleep?',
		'On Linux that job belongs to <b>systemd</b>, the very first program that starts when the machine boots. It reads a short recipe for every program, starts them in the right order, and keeps an eye on them all day long.',
		'A program systemd looks after is called a <b>service</b>, and its recipe is a small text file called a <b>unit</b>. Ours says which command to run, plus one magic line, <b>Restart=always</b>, which means if it ever dies, start it again.',
		'You talk to systemd with <b>systemctl</b>. <b>status</b> shows how a service is doing, <b>start</b> and <b>stop</b> do what they say, and <b>enable</b> means start it by itself at every boot. Changing services is admin work, so those need sudo.',
		'[fyi] Windows has the same idea. Open its Services window and you will see programs set to start Automatically. Your phone does it too, which is why your chat app still gets messages right after a restart.',
		'Your turn. Check on the nimbus service and start it. Then be a little mean, crash it, and reboot the whole server, and watch who brings the site back.'
	],
	reactions: {
		status:
			'<b>inactive (dead)</b>, so nimbus.com is down right now. Also look at <b>disabled</b> on the Loaded line, that means it will not start by itself at boot either.',
		started:
			'The app is running, see the PID (its process number) and the green strip. Visitors can reach nimbus.com again.',
		startedAgain: 'Running again.',
		restarted:
			'Restarted, it stopped and started in one go, with a fresh PID. Handy after you change a setting.',
		crashed:
			'Boom, the app is dead and visitors see nothing. Now do nothing at all, just watch the systemd card.',
		revived:
			'Back by itself! systemd saw the program die, waited a moment, and started it again with a new PID. Thanks to Restart=always the site was down for about two seconds instead of until morning.',
		revivedAgain: 'Back again, every single time. Look at the restarts counter climb.',
		nothingToCrash: 'Nothing to crash, the app is not running. Start it first.',
		statusRestarting:
			'Caught it mid rescue. <b>activating (auto-restart)</b> means systemd is about to bring it back.',
		stopped:
			'Stopped on purpose. systemd does not restart a service you stopped yourself, Restart=always is only for surprises.',
		enabled:
			'Enabled. systemd made a little link that says start nimbus at every boot. Now try the reboot button.',
		disabled: 'Disabled, so after the next reboot the app will stay off until someone starts it.',
		rebooting:
			'The server is restarting. Your SSH session drops too, because everything shuts down, then you log back in.',
		bootDown:
			'The server is back, but nimbus.com is not. The service was never <b>enabled</b>, so systemd did not start it at boot. This is exactly the 3 in the morning problem. Enable it, then reboot again.',
		bootIdle:
			'The server is back, and the app is off, the same as before. Start it, enable it, then reboot to see the difference.',
		boot: 'Up by itself after a full reboot! Because it is enabled, systemd started the app during boot, before you even logged back in.',
		bootAgain: 'Back after the reboot again. Enabled services just come back.',
		journal:
			"That is the <b>journal</b>, systemd's diary. Every start, crash, and restart is written there with the time, so you can see what happened while you were away.",
		unitFile:
			'That is the whole unit. <b>ExecStart</b> is the command to run, <b>Restart=always</b> brings it back when it dies, and <b>WantedBy</b> is what enable hooks it into at boot.',
		needSudo:
			'Changing services is admin work, so systemd asks who you are. Put <b>sudo</b> in front, like in [[Permissions and sudo|linux/permissions]].',
		noUnit: 'systemd has no service by that name. The one we care about is called <b>nimbus</b>.',
		missing: 'Nothing with that name here. Run <b>ls</b> to see what is around.',
		denied: 'Locked. That one needs admin power, so try <b>sudo</b> in front.',
		error:
			'The server does not know that command. Check the spelling, or type <b>help</b> to see what it knows.',
		done: 'All missions done! You checked a service, started it, crashed it and watched systemd revive it, and made it survive a full reboot. Real servers run dozens of services like this, nginx, databases, SSH, and systemd quietly babysits every one of them.'
	},
	missionsLabel: 'Missions',
	missions: [
		'Check the nimbus service',
		'Start it',
		'Crash it, watch it come back',
		'Make it start at boot, then reboot'
	],
	hintBtn: 'Help',
	doneNote: 'All missions done, nimbus.com takes care of itself',
	inputLabel: 'command',
	termHint: '# try systemctl status nimbus, then press Enter',
	hintUnknown: '# that command does not exist here, type help to see the list',
	didYouMean: '# maybe you meant {word}',
	hintMissing: '# nothing with that name here, ls shows what is around',
	hintDenied: '# locked, try sudo in front',
	crashBtn: 'Crash the app',
	rebootBtn: 'Reboot server',
	serverLabel: 'Your server',
	bootLabel: 'Starts at boot',
	restartsLabel: 'Restarts',
	yes: 'yes',
	no: 'no',
	visitorsLabel: 'What visitors see',
	siteUp: 'nimbus.com is up',
	siteDown: 'nimbus.com is down',
	states: {
		active: 'running',
		inactive: 'stopped',
		dead: 'crashed',
		restarting: 'restarting',
		booting: 'server rebooting'
	},
	hintSudo: '# changing services needs admin power, put sudo in front',
	hintSystemctl: '# try systemctl status nimbus',
	hintUnit: '# the service is called nimbus',
	hintKill: '# ps shows running programs and their PID'
};
