import type { LinuxGuideText } from '$lib/components/stages/linux/text';

export interface PermissionsText extends LinuxGuideText {
	ownedBy: string; // under the file name, template with {owner}
	permLabels: string[]; // column headings, read, write, run
	rowLabels: string[]; // row headings, owner, group, others
	sumLabel: string; // heading over the number each row adds up to
	deniedChip: string; // chip after a Permission denied
	ranChip: string; // chip after the script ran
	bossChip: string; // chip after a sudo command
	rule: string; // rule of thumb line on the numbers memory beat
	sudoRule: string; // rule of thumb line on the sudo memory beat
}
