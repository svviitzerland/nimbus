import type { LessonText } from '../../types';

export type HostKind = 'shared' | 'vps' | 'cloud';

export interface DomainHostingText extends LessonText {
	/** The side panel, one entry per beat (a small tag, a title, a short plain explanation). */
	steps: { tag: string; title: string; body: string }[];
	shopLabel: string;
	/** Yearly price shown under the name tag, already in the local currency. */
	price: string;
	hostLabel: string;
	/** The three sizes of hosting, cycled under the host on the beat about sizes. */
	hostKinds: Record<HostKind, string>;
	dnsLabel: string;
	recordLabel: string;
	noRecord: string;
	/** What the phone screen shows. */
	phone: { cannot: string; welcome: string };
	/** The optional switch on the last beat, to break the record and to fix it again. */
	breakIt: string;
	fixIt: string;
}
