import { CVSS40 } from './vendor/cvss40.js';
export const cvssOptions = {
	AV: ['N', 'A', 'L', 'P'],
	AC: ['L', 'H'],
	AT: ['N', 'P'],
	PR: ['N', 'L', 'H'],
	UI: ['N', 'P', 'A'],
	VC: ['H', 'L', 'N'],
	VI: ['H', 'L', 'N'],
	VA: ['H', 'L', 'N'],
	SC: ['H', 'L', 'N'],
	SI: ['H', 'L', 'N'],
	SA: ['H', 'L', 'N']
} as const;
export type CvssMetric = keyof typeof cvssOptions;
export type CvssBase = { [K in CvssMetric]: (typeof cvssOptions)[K][number] };
export const cvssKeys = Object.keys(cvssOptions) as CvssMetric[];
export const initialCvss = (): CvssBase => ({
	AV: 'N',
	AC: 'L',
	AT: 'N',
	PR: 'N',
	UI: 'N',
	VC: 'H',
	VI: 'H',
	VA: 'H',
	SC: 'N',
	SI: 'N',
	SA: 'N'
});
export function cvssVector(values: CvssBase): string {
	for (const key of cvssKeys)
		if (!(cvssOptions[key] as readonly string[]).includes(values[key]))
			throw new Error('Invalid CVSS metric ' + key);
	return 'CVSS:4.0/' + cvssKeys.map((key) => key + ':' + values[key]).join('/');
}
export function scoreCvss(values: CvssBase): number {
	return new CVSS40(cvssVector(values)).score as number;
}
export function severity(score: number) {
	return score === 0
		? 'none'
		: score < 4
			? 'low'
			: score < 7
				? 'medium'
				: score < 9
					? 'high'
					: 'critical';
}
