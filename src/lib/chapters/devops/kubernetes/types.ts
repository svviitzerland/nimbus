import type { LessonText } from '../../types';

export interface KubernetesText extends LessonText {
	youDeclare: string; // heading over the desired count
	replicasLabel: string; // the word next to the number (replicas)
	runningLabel: string; // template with {n} and {d}, actual versus desired
	planeLabel: string; // the control plane
	planeWatching: string;
	planeFixing: string; // template with {n}, pods it is starting
	planePending: string; // template with {n}, pods with nowhere to go
	nodeLabel: string; // template with {n}
	nodeDownTag: string;
	podHint: string; // tells the learner to tap a pod
	unplugBtn: string; // template with {n}
	plugBtn: string; // template with {n}
	pendingLabel: string;
}
