// Base equations from FIRST CVSS v2 and v3 specifications. No temporal or environmental metrics.
export type Cvss2Base = {
	AV: 'L' | 'A' | 'N';
	AC: 'H' | 'M' | 'L';
	Au: 'M' | 'S' | 'N';
	C: 'N' | 'P' | 'C';
	I: 'N' | 'P' | 'C';
	A: 'N' | 'P' | 'C';
};
export type Cvss3Base = {
	AV: 'N' | 'A' | 'L' | 'P';
	AC: 'L' | 'H';
	PR: 'N' | 'L' | 'H';
	UI: 'N' | 'R';
	S: 'U' | 'C';
	C: 'N' | 'L' | 'H';
	I: 'N' | 'L' | 'H';
	A: 'N' | 'L' | 'H';
};
export function scoreCvss2(m: Cvss2Base): number {
	const impactWeight = { N: 0, P: 0.275, C: 0.66 };
	const impact =
		10.41 * (1 - (1 - impactWeight[m.C]) * (1 - impactWeight[m.I]) * (1 - impactWeight[m.A]));
	if (impact === 0) return 0;
	const exploitability =
		20 *
		{ L: 0.395, A: 0.646, N: 1 }[m.AV] *
		{ H: 0.35, M: 0.61, L: 0.71 }[m.AC] *
		{ M: 0.45, S: 0.56, N: 0.704 }[m.Au];
	return Math.round((0.6 * impact + 0.4 * exploitability - 1.5) * 1.176 * 10) / 10;
}
// Integer intermediate recommended by FIRST v3.1 Appendix A, avoids floating point over-rounding.
function roundup(value: number) {
	const integer = Math.round(value * 100000);
	return integer % 10000 === 0 ? integer / 100000 : (Math.floor(integer / 10000) + 1) / 10;
}
export function scoreCvss3(m: Cvss3Base, version: '3.0' | '3.1'): number {
	const weight = { N: 0, L: 0.22, H: 0.56 };
	const iss = 1 - (1 - weight[m.C]) * (1 - weight[m.I]) * (1 - weight[m.A]);
	const changed = m.S === 'C';
	const impact = changed ? 7.52 * (iss - 0.029) - 3.25 * (iss - 0.02) ** 15 : 6.42 * iss;
	if (impact <= 0) return 0;
	const privileges =
		m.PR === 'N' ? 0.85 : m.PR === 'L' ? (changed ? 0.68 : 0.62) : changed ? 0.5 : 0.27;
	const exploitability =
		8.22 *
		{ N: 0.85, A: 0.62, L: 0.55, P: 0.2 }[m.AV] *
		{ L: 0.77, H: 0.44 }[m.AC] *
		privileges *
		{ N: 0.85, R: 0.62 }[m.UI];
	const total = Math.min((impact + exploitability) * (changed ? 1.08 : 1), 10);
	return version === '3.1' ? roundup(total) : Math.ceil(total * 10) / 10;
}
