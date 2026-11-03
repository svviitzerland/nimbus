import type { LinuxLabText } from '$lib/components/stages/linux/text';

export interface LinuxFilesText extends LinuxLabText {
	// missions, in order: pwd, ls at /, cd /var/log/nimbus, read error.log
	treeLabel: string; // heading over the folder tree
	hereLabel: string; // pill on the folder you are standing in
	/** One short note per top level folder (bin, etc, home, root, tmp, usr, var). */
	dirNotes: Record<string, string>;
}
