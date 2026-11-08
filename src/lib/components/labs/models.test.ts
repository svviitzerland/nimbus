import { describe, it } from 'node:test';
import { strict as assert } from 'node:assert';
import { repeatRequest, readInvoice } from './http';
import { initialDataCenter, advanceDataCenter, isOnline } from './data-center';
import { checkout, checkoutCases } from './testing';
import { evaluate } from './evaluation';

describe('local HTTP experiments', () => {
	it('changes the actual product returned when the request path changes', () => {
		const a = repeatRequest('GET /products/1 HTTP/1.1\nHost: nimbus.com');
		const b = repeatRequest('GET /products/2 HTTP/1.1\r\nHost: nimbus.com');
		assert.equal(a.status, 200);
		assert.equal(b.status, 200);
		assert.notEqual(a.body, b.body);
	});
	it('rejects out of scope hosts, duplicate hosts, malformed requests and unsupported methods', () => {
		for (const raw of [
			'GET /products/1 HTTP/1.1\nHost: elsewhere.invalid',
			'GET /products/1 HTTP/1.1\nHost: nimbus.com\nHost: nimbus.com',
			'GET /products/1'
		])
			assert.equal(repeatRequest(raw).status, 400);
		assert.equal(repeatRequest('POST /products/1 HTTP/1.1\nHost: nimbus.com').status, 405);
		assert.equal(repeatRequest('GET /products/99 HTTP/1.1\nHost: nimbus.com').status, 404);
	});
	it('blocks cross account access while preserving owner access', () => {
		assert.equal(readInvoice(102, false).status, 200);
		assert.equal(readInvoice(102, true).status, 403);
		assert.equal(readInvoice(101, true).status, 200);
		assert.equal(readInvoice(102, true, 'ari').status, 200);
		assert.equal(readInvoice(101, true, '').status, 401);
	});
});
describe('data center failure and recovery', () => {
	it('keeps service on UPS, then loses power when the reserve is exhausted', () => {
		let site = { ...initialDataCenter(), mains: false };
		assert.equal(isOnline(site), true);
		site = advanceDataCenter(site);
		assert.equal(site.ups, 5);
		assert.equal(isOnline(site), true);
		site = advanceDataCenter(site);
		assert.equal(site.ups, 0);
		assert.equal(isOnline(site), false);
		site = advanceDataCenter({ ...site, generator: true });
		assert.equal(isOnline(site), true);
	});
	it('distinguishes overheating and a disconnected network from lost power', () => {
		let site = { ...initialDataCenter(), cooling: false };
		site = advanceDataCenter(advanceDataCenter(site));
		assert.equal(isOnline(site), false);
		assert.equal(site.ups, 10);
		site = advanceDataCenter({ ...site, cooling: true });
		assert.equal(isOnline(site), true);
		assert.equal(isOnline({ ...site, network: false }), false);
	});
});
it('checkout tests catch both excluded boundary and equality only regressions', () => {
	for (const c of checkoutCases) assert.equal(checkout(c.input, '>='), c.expected);
	assert.notEqual(checkout(100, '>'), 90);
	assert.notEqual(checkout(150, '==='), 140);
});
it('an evaluation with overlap overstates this memorizer’s performance', () => {
	const dirty = evaluate(false),
		clean = evaluate(true);
	assert.equal(dirty.filter((r) => r.prediction === r.label).length, 3);
	assert.equal(clean.length, 2);
	assert.equal(
		clean.some((r) => r.overlap),
		false
	);
	assert.equal(clean.filter((r) => r.prediction === r.label).length, 1);
});

import { initialCvss, scoreCvss, cvssVector, severity, type CvssBase } from './cvss';
import { scoreCvss2, scoreCvss3, type Cvss2Base, type Cvss3Base } from './cvss-legacy';
import {
	cvssCases,
	cvssVersions,
	probes,
	freshCvssCase,
	probeCvssCase,
	hasCvssEvidence,
	cvssCaseAssessment
} from './cvss-cases';
import {
	transit,
	csrfRequest,
	previewFetch,
	advisoryApplies,
	riskOutcome
} from './security-models';

it('CVSS 4.0 reproduces published FIRST Base example vectors', () => {
	// https://www.first.org/cvss/v4.0/examples, Base scores, no environment modifiers.
	const start = initialCvss();
	const fixtures: [Partial<CvssBase>, number][] = [
		[{}, 9.3],
		[{ SC: 'H', SI: 'H', SA: 'H' }, 10],
		[{ VC: 'H', VI: 'N', VA: 'N', PR: 'L' }, 7.1],
		[{ VC: 'N', VI: 'N', VA: 'N', SC: 'L', SI: 'L', UI: 'A' }, 5.1],
		[{ VC: 'H', VI: 'N', VA: 'N', AT: 'P' }, 8.2],
		[{ VC: 'N', VI: 'N', VA: 'N' }, 0]
	];
	for (const [metrics, expected] of fixtures)
		assert.equal(scoreCvss({ ...start, ...metrics }), expected);
	const repeated = scoreCvss({ ...start, PR: 'H' });
	assert.equal(repeated, 8.6);
	assert.equal(scoreCvss(start), 9.3);
	assert.match(cvssVector(start), /^CVSS:4\.0\/AV:N\/AC:L\/AT:N\/PR:N\/UI:N/);
	assert.throws(
		() => scoreCvss({ ...start, AV: 'invalid' } as unknown as CvssBase),
		/Invalid CVSS metric/
	);
});
it('CVSS severity labels preserve the official boundaries', () => {
	for (const [score, label] of [
		[0, 'none'],
		[0.1, 'low'],
		[3.9, 'low'],
		[4, 'medium'],
		[6.9, 'medium'],
		[7, 'high'],
		[8.9, 'high'],
		[9, 'critical'],
		[10, 'critical']
	] as const)
		assert.equal(severity(score), label);
});
it('CVSS 2.0 reproduces FIRST examples including local access and complete availability loss', () => {
	// FIRST v2 guide and v3.1 examples report these v2 Base vectors and scores.
	const fixtures: [Cvss2Base, number][] = [
		[{ AV: 'N', AC: 'L', Au: 'N', C: 'N', I: 'N', A: 'C' }, 7.8],
		[{ AV: 'N', AC: 'L', Au: 'S', C: 'C', I: 'C', A: 'C' }, 9],
		[{ AV: 'L', AC: 'L', Au: 'N', C: 'P', I: 'P', A: 'P' }, 4.6],
		[{ AV: 'N', AC: 'M', Au: 'S', C: 'C', I: 'C', A: 'C' }, 8.5],
		[{ AV: 'N', AC: 'L', Au: 'N', C: 'N', I: 'N', A: 'N' }, 0]
	];
	for (const [vector, expected] of fixtures) assert.equal(scoreCvss2(vector), expected);
});
it('CVSS 3 Base equations handle changed scope, privileges, user interaction and zero impact', () => {
	// https://www.first.org/cvss/v3.1/examples, VMware, Tomcat, Cisco IOS, and iWork.
	const fixtures: [Cvss3Base, number][] = [
		[{ AV: 'N', AC: 'L', PR: 'L', UI: 'N', S: 'C', C: 'H', I: 'H', A: 'H' }, 9.9],
		[{ AV: 'L', AC: 'L', PR: 'H', UI: 'N', S: 'U', C: 'L', I: 'L', A: 'L' }, 4.2],
		[{ AV: 'N', AC: 'L', PR: 'H', UI: 'N', S: 'U', C: 'H', I: 'H', A: 'H' }, 7.2],
		[{ AV: 'L', AC: 'L', PR: 'N', UI: 'R', S: 'U', C: 'H', I: 'H', A: 'H' }, 7.8],
		[{ AV: 'N', AC: 'L', PR: 'N', UI: 'N', S: 'C', C: 'N', I: 'N', A: 'N' }, 0]
	];
	for (const version of ['3.0', '3.1'] as const)
		for (const [vector, expected] of fixtures) assert.equal(scoreCvss3(vector, version), expected);
});
it('CVSS cases require impact evidence beyond an authentication refusal', () => {
	const state = freshCvssCase();
	assert.equal(hasCvssEvidence(state), false);
	for (const action of probes) state.observed[action] = probeCvssCase('admin', action, false);
	assert.equal(hasCvssEvidence(state), false);
	state.admin = true;
	for (const action of probes) state.observed[action] = probeCvssCase('admin', action, state.admin);
	assert.equal(hasCvssEvidence(state), true);
	assert.equal(probeCvssCase('invoice', 'read', false), 'limited');
	assert.equal(probeCvssCase('invoice', 'write', false), 'denied');
	assert.equal(probeCvssCase('invoice', 'stop', false), 'denied');
	assert.equal(probeCvssCase('public', 'stop', false), 'full');
	assert.deepEqual(freshCvssCase().observed, {});
});
it('CVSS comparisons retain version-specific vectors, scores and severity scales', () => {
	const scores = {
		invoice: [5, 5.3, 5.3, 6.9],
		admin: [9, 7.2, 7.2, 8.6],
		public: [10, 9.8, 9.8, 9.3]
	};
	for (const id of cvssCases)
		for (const [i, version] of cvssVersions.entries()) {
			const result = cvssCaseAssessment(id, version);
			assert.equal(result.score, scores[id][i]);
			assert.equal(result.version, version);
			if (version !== '2.0') assert(result.vector.startsWith(`CVSS:${version}/`));
		}
	assert.equal(cvssCaseAssessment('public', '2.0').level, 'high');
	assert.equal(cvssCaseAssessment('public', '3.1').level, 'critical');
	assert.match(cvssCaseAssessment('admin', '2.0').vector, /Au:S/);
	assert.match(cvssCaseAssessment('admin', '3.1').vector, /PR:H/);
	assert.match(cvssCaseAssessment('invoice', '4.0').vector, /VC:L\/VI:N\/VA:N/);
});
it('MITM position alone cannot read validated TLS, but a trusted lab proxy can terminate it', () => {
	assert.equal(transit(false, true, false).modified, true);
	assert.deepEqual(transit(true, true, false), {
		delivered: false,
		readable: false,
		modified: false,
		reason: 'certificate'
	});
	assert.equal(transit(true, true, true).readable, true);
	assert.equal(transit(true, false, false).modified, false);
});
it('CSRF defenses block a forged cookie request while allowing the intended form', () => {
	assert.equal(csrfRequest('outside', false, false).status, 200);
	assert.equal(csrfRequest('outside', true, false).status, 403);
	assert.equal(csrfRequest('outside', false, true).status, 401);
	assert.equal(csrfRequest('site', true, true).status, 200);
});
it('SSRF checks must cover redirects while allowing the legitimate preview', () => {
	assert.equal(previewFetch('internal', 'none').leaked, true);
	assert.equal(previewFetch('internal', 'first').status, 403);
	assert.equal(previewFetch('redirect', 'first').leaked, true);
	const stopped = previewFetch('redirect', 'every');
	assert.equal(stopped.status, 403);
	assert.equal(stopped.visited.length, 1);
	assert(!stopped.visited.includes('http://127.0.0.1/admin'));
	assert.equal(previewFetch('image', 'every').status, 200);
});
it('advisory applicability and risk exposure do not equate mitigation with a fix', () => {
	assert.equal(advisoryApplies('1.4', true), true);
	assert.equal(advisoryApplies('1.4', false), false);
	assert.equal(advisoryApplies('1.5', true), false);
	assert.equal(riskOutcome(false, false, true), 'limited');
	assert.equal(riskOutcome(true, true, true), 'blocked');
	assert.equal(riskOutcome(true, false, true), 'privateLeak');
});
