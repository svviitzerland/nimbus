import type { RouterLabText } from '$lib/components/stages/routerlab/text';

export interface RouterQueueText extends RouterLabText {
	// missions, in order: torch, a queue for Budi, everyone fair, queue stats
	lineLabel: string; // template with {n}, the ISP line size
	users: { name: string; doing: string }[]; // Sari (call), Budi (download), Dewi (browsing)
	status: { smooth: string; choppy: string; fine: string; slow: string; downloading: string };
	addQueue: string; // button on a user card that types the queue command
	limitLabel: string; // aria label for the max-limit slider, template with {name}
	unlimited: string; // shown when a user has no queue
	// Muted "#" lines the terminal prints to help after a command
	hintTorch: string;
	hintTarget: string;
	hintLimit: string;
	hintNeeds: string; // template with {keys}
	hintNoQueue: string;
	hintStats: string;
	hintExists: string;
}
