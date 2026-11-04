import type { LinuxGuideText } from '$lib/components/stages/linux/text';

export interface LinuxFilesText extends LinuxGuideText {
	hereLabel: string; // next to the path you are standing in, under the tree
	/** The four commands and the question each one answers, shown on the memory beat. */
	cheats: { cmd: string; means: string }[];
}
