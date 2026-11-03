import type { LinuxLabText } from '$lib/components/stages/linux/text';

export interface PermissionsText extends LinuxLabText {
	// missions, in order: ls -l, make backup.sh runnable and run it, sudo cat, 777 then undo
	cardLabel: string; // aria label of the permission grid
	permLabels: string[]; // column headings, read, write, run
	ownerLabel: string; // row heading, followed by the owner's name
	groupLabel: string; // row heading, followed by the group's name
	othersLabel: string; // row heading for everyone else
	cardNote: string; // caption under the grid, invites tapping a switch
	dangerNote: string; // caption while others may write the file
}
