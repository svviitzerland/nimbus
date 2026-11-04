import type { LinuxGuideText } from '$lib/components/stages/linux/text';

export interface ShellScriptText extends LinuxGuideText {
	byHand: string; // shown before the script card appears
	runnableChip: string; // on the script card once it may run
	emptyShelf: string; // ~/backups before anything is in it
	rule: string; // rule of thumb line on the memory beat
	nightLine: string; // muted terminal line on the learner's turn, template with {day}
}
