import type { LessonText } from '../../types';

export interface KubernetesText extends LessonText {
	/** The side panel, one entry per beat (a small tag, a title, a short plain explanation). */
	steps: { tag: string; title: string; body: string }[];
	planeLabel: string; // caption under the ship wheel (the control plane)
	nodeLabel: string; // template with {n}
	readout: string; // template with {w} wanted and {r} running
	night: string; // shown on the beat about crashes in the middle of the night
	rule: string; // the rule of thumb line under the readout
	tapHint: string; // caption on the last beat
	podLabel: string; // accessible label for a pod
}
