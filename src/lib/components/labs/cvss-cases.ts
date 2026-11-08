import { initialCvss, scoreCvss, cvssVector, severity } from './cvss';
import { scoreCvss2, scoreCvss3, type Cvss2Base, type Cvss3Base } from './cvss-legacy';
export const cvssCases = ['invoice', 'admin', 'public'] as const;
export type CvssCase = (typeof cvssCases)[number];
export const probes = ['read', 'write', 'stop'] as const;
export type CvssProbe = (typeof probes)[number];
export const cvssVersions = ['2.0', '3.0', '3.1', '4.0'] as const;
export type CvssVersion = (typeof cvssVersions)[number];
export type ProbeResult = 'login' | 'limited' | 'full' | 'denied';
export function probeCvssCase(id: CvssCase, probe: CvssProbe, admin: boolean): ProbeResult {
	if (id === 'admin' && !admin) return 'login';
	if (id === 'invoice') return probe === 'read' ? 'limited' : 'denied';
	return 'full';
}
export type CvssCaseState = {
	admin: boolean;
	running: boolean;
	observed: Partial<Record<CvssProbe, ProbeResult>>;
	scored: boolean;
};
export function freshCvssCase(): CvssCaseState {
	return { admin: false, running: true, observed: {}, scored: false };
}
export function hasCvssEvidence(state: CvssCaseState): boolean {
	return probes.every(
		(probe) => state.observed[probe] !== undefined && state.observed[probe] !== 'login'
	);
}
// Each scenario is assessed independently under each version. These are NOT vector conversions.
// All cases have a network path, low complexity, no other user's interaction, one security
// authority, and no subsequent-system impact. "admin" requires one high-privilege app account.
export function cvssCaseAssessment(id: CvssCase, version: CvssVersion) {
	const restricted = id === 'admin',
		limited = id === 'invoice';
	const v2: Cvss2Base = {
		AV: 'N',
		AC: 'L',
		Au: restricted ? 'S' : 'N',
		C: limited ? 'P' : 'C',
		I: limited ? 'N' : 'C',
		A: limited ? 'N' : 'C'
	};
	const v3: Cvss3Base = {
		AV: 'N',
		AC: 'L',
		PR: restricted ? 'H' : 'N',
		UI: 'N',
		S: 'U',
		C: limited ? 'L' : 'H',
		I: limited ? 'N' : 'H',
		A: limited ? 'N' : 'H'
	};
	const v4 = {
		...initialCvss(),
		PR: restricted ? ('H' as const) : ('N' as const),
		VC: limited ? ('L' as const) : ('H' as const),
		VI: limited ? ('N' as const) : ('H' as const),
		VA: limited ? ('N' as const) : ('H' as const)
	};
	const metrics = version === '2.0' ? v2 : version === '4.0' ? v4 : v3;
	const score =
		version === '2.0'
			? scoreCvss2(v2)
			: version === '4.0'
				? scoreCvss(v4)
				: scoreCvss3(v3, version);
	const entries = Object.entries(metrics);
	const vector =
		version === '4.0'
			? cvssVector(v4)
			: (version === '2.0' ? '' : `CVSS:${version}/`) +
				entries.map(([k, v]) => `${k}:${v}`).join('/');
	// NVD's v2 qualitative bands differ from the v3/v4 scale, which includes Critical.
	const level =
		version === '2.0' ? (score < 4 ? 'low' : score < 7 ? 'medium' : 'high') : severity(score);
	return { version, score, vector, entries, level };
}
