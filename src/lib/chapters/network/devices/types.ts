import type { LessonText } from '../../types';
import type { GuideStepText } from '$lib/components/stages/netguide/types';

export type DevicePart = 'modem' | 'router' | 'switch' | 'ap';

export interface DevicesText extends LessonText {
	/** The side panel, one step per beat (same length as intro). */
	steps: GuideStepText[];
	/** Each box, its short name and the word of the memory trick (gate, receptionist, and so on). */
	parts: Record<DevicePart, { name: string; memo: string }>;
	internetLabel: string; // the provider's line coming in
	pcLabel: string; // template with {n}
	phoneLabel: string;
	homeBoxLabel: string; // the outline drawn around all four boxes, "one box at home"
	status: { online: string; local: string; offline: string };
	unplugHint: string; // shown over the picture on the last beat
}
