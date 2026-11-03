import type { LinuxFilesText } from './types';

export const en: LinuxFilesText = {
	title: 'The Linux file system',
	intro: [
		'Your nimbus.com server is a computer in a data center, and like most servers on the internet it runs <b>Linux</b>. This one runs <b>Ubuntu</b>, one of the most popular kinds of Linux. There is no desktop to click on, only a terminal, so today you learn to find your way around by typing.',
		'Every file on a Linux machine lives in one big tree. The very top is called <b>root</b> and is written as a single slash, <b>/</b>. Every other folder grows out of it, so a path like /var/log/nimbus simply walks from the top, one folder at a time.',
		"A few folders you will visit all the time. <b>home</b> holds each user's own files (yours is /home/nim), <b>etc</b> keeps the settings, and <b>var</b> keeps things that change all day long, like logs.",
		'[fyi] Windows does this differently, every drive gets its own tree, like drive C and drive D. On Linux a second disk or a USB stick simply shows up as one more folder inside the same single tree.',
		'You reach this server through SSH, the remote door from [[remote access|cloud/remote-access]], and you move with the same commands as in [[CLI vs GUI|foundations/cli-gui]]. <b>pwd</b> says where you stand, <b>ls</b> lists what is around, <b>cd</b> walks into a folder, and <b>cat</b> prints a file.',
		'Bad news, nimbus.com went down last night. Servers keep a diary called a <b>log</b>, so the reason is written down somewhere. Find the error log and read what happened. Tap a folder in the tree, or tap Help when you feel lost.'
	],
	reactions: {
		pwd: '/home/nim, that is your home folder. Every user gets one inside /home, and the <b>~</b> in the prompt is just a short way of writing it.',
		root: 'That is the whole top of the tree at a glance. Programs in bin and usr, settings in etc, people in home, logs in var. Nearly every Linux server on earth has this same layout.',
		varlog:
			'You made it to the diary room. Every app writes its own log here, and nimbus.com has two. Print the error one.',
		found:
			'There it is. The disk filled up at 03.07 and nimbus.com stopped. Finish the other missions to wrap up the tour.',
		etc: 'Welcome to /etc, where the settings live. Try <b>cat hostname</b>, that tiny file holds the name of this server.',
		hostname:
			'nimbus, the name of this machine. Settings in /etc are plain text files like this one, which is why admins love them, you can read and change them with any editor.',
		access:
			'That is the access log, one line for every visit to nimbus.com. Handy, but the crash story lives in <b>error.log</b>.',
		notes: 'Your own note from yesterday. Good hint, logs live in /var/log.',
		rootHome:
			'Locked. <b>/root</b> is the home folder of the user called root, the all powerful admin, and nobody else may walk in. Same word as the top of the tree, totally different place.',
		missing:
			'Nothing with that name lives there. Run <b>ls</b> to see what is around. Also, Linux cares about capital letters, so Log and log are two different names.',
		denied:
			'Locked. Some files are for the admin only, you will learn how to open them in [[Permissions and sudo|linux/permissions]].',
		error:
			'The server does not know that command. Check the spelling, or type <b>help</b> to see what it knows.',
		done: 'Mystery solved! At 03.07 the disk got completely full, uploads could not be saved, and nimbus.com stopped. You walked from / all the way down to /var/log/nimbus and read the log, which is the very first thing an admin does when a server breaks.'
	},
	missionsLabel: 'Missions',
	missions: [
		'Find out where you are',
		'Look around from the very top, /',
		'Walk into /var/log/nimbus',
		'Read error.log'
	],
	hintBtn: 'Help',
	doneNote: 'All missions done, you found why the site went down',
	inputLabel: 'command',
	termHint: '# type a command like pwd or ls, then press Enter',
	hintUnknown: '# that command does not exist here, type help to see the list',
	didYouMean: '# maybe you meant {word}',
	hintMissing: '# nothing with that name here, ls shows what is around',
	hintDenied: '# locked, only its owner or the admin may open it',
	treeLabel: 'Folder tree',
	hereLabel: 'you are here',
	dirNotes: {
		bin: 'basic programs',
		etc: 'settings',
		home: "users' own files",
		root: "the admin's home",
		tmp: 'scratch space',
		usr: 'installed apps',
		var: 'logs and websites'
	}
};
