import type { CliGuiText } from '../../types';

export const en: CliGuiText = {
	title: 'CLI vs GUI',
	intro: [
		'So how do we tell a computer to do something? There are two ways, through a <b>GUI</b> or through a <b>CLI</b>. To feel the difference, we will do one same task with both, open the <b>Documents</b> folder and look inside.',
		'With a <b>GUI</b> (Graphical User Interface) you just look and click. On this screen there is a <b>Documents</b> folder icon, click it to open it and the files show up right away.',
		'With a <b>CLI</b> (Command Line Interface) you type a command and press Enter. Same task, just typed. Type <b>cd documents</b> to go in, then <b>ls</b> to list what is inside. Typos are fine, the terminal will tell you.',
		'Now your turn, try it with the GUI and with the CLI. Same result, right? The GUI is clicking you can watch, the CLI is typing that is fast and easy to repeat. The better you get, the more you reach for the CLI.',
		'[ingat] GUI uses clicks; CLI uses commands. The goal can be the same.'
	],
	reactions: {
		gui: 'That is the GUI way, just click. Now do the same thing with the CLI.',
		cli: 'The CLI command performed the task. Now try the same task using the GUI button.',
		both: 'Exactly, same result. The only difference is how, you click in the GUI, you type in the CLI. Later in the cloud we will lean on the CLI a lot because it is fast and easy to repeat.'
	},
	taskLabel: 'Task, open the Documents folder and look inside',
	guiTab: 'GUI',
	cliTab: 'CLI',
	homeCrumb: 'Home',
	folderName: 'Documents',
	files: ['report.pdf', 'photo.jpg', 'notes.txt'],
	guiHint: 'Click the Documents folder to open it',
	guiOpened: 'Documents is open, these are the files inside',
	backLabel: 'Back',
	promptUser: 'nim@nimbus',
	cliHint: '# type a command then press Enter'
};
