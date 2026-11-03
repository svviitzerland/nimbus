import type { LinuxLabText } from '$lib/components/stages/linux/text';

export interface ShellScriptText extends LinuxLabText {
	// missions, in order: back up by hand, write backup.sh, make it runnable, run it
	termTab: string; // tab that shows the terminal (the other tab is nano backup.sh)
	editorEmpty: string; // the empty file, before any line is placed
	poolLabel: string; // heading over the lines you can tap into the file
	saveBtn: string; // writes the file
	editorHint: string; // small note next to Save
	/** Shown under the file when the order would break the script. */
	orderNotes: { shebang: string; day: string; mkdir: string };
	emptyShelf: string; // ~/backups before anything is in it
	nextDayBtn: string; // jumps to the next night
	days: string[]; // short weekday names, Sunday first
	nightLine: string; // muted terminal line when a new night starts, template with {day}
	hintNano: string; // nano on any other file
}
