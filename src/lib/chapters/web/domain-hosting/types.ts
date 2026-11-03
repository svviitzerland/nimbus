import type { LessonText } from '../../types';

export type HostKind = 'shared' | 'vps' | 'cloud';
export type Tld = 'com' | 'id' | 'dev';

export interface DomainHostingText extends LessonText {
	/** The three acts, shown as numbered pills. */
	acts: [string, string, string];
	/** Act 1, the registrar. */
	registrarLabel: string;
	registrarSub: string;
	searchLabel: string;
	search: string;
	available: string;
	taken: string;
	/** Yearly price per ending, already in the local currency. */
	prices: Record<Tld, string>;
	perYear: string;
	buy: string;
	owned: string;
	toHost: string;
	/** Act 2, the hosts. */
	hosts: Record<HostKind, { name: string; sub: string; price: string; points: string[] }>;
	pick: string;
	picked: string;
	ipLabel: string;
	toConnect: string;
	/** Act 3, the DNS record and the phone. */
	dnsTitle: string;
	recordType: string;
	recordName: string;
	recordValue: string;
	valuePlaceholder: string;
	copyHint: string;
	save: string;
	saved: string;
	wrong: string;
	open: string;
	unreachable: string;
	siteTitle: string;
	siteSub: string;
	youLabel: string;
}
