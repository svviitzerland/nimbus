/** Closed teaching models. No network traffic, credentials, or executable payloads. */
export function transit(https: boolean, onPath: boolean, trustLabCa: boolean) {
	if (https && onPath && !trustLabCa)
		return { delivered: false, readable: false, modified: false, reason: 'certificate' } as const;
	const readable = onPath && (!https || trustLabCa);
	return {
		delivered: true,
		readable,
		modified: readable,
		reason: readable ? 'intercepted' : 'delivered'
	} as const;
}
export function csrfRequest(
	source: 'site' | 'outside',
	checkToken: boolean,
	strictCookie: boolean
) {
	const hasCookie = source === 'site' || !strictCookie;
	const validToken = source === 'site';
	return {
		hasCookie,
		validToken,
		status: !hasCookie ? 401 : checkToken && !validToken ? 403 : 200
	};
}
export const ssrfTargets = ['image', 'internal', 'redirect'] as const;
export type SsrfTarget = (typeof ssrfTargets)[number];
export type FetchGuard = 'none' | 'first' | 'every';
export function previewFetch(target: SsrfTarget, guard: FetchGuard) {
	const urls = {
		image: 'https://nimbus.com/banner.png',
		internal: 'http://127.0.0.1/admin',
		redirect: 'https://nimbus.com/redirect'
	};
	const hops = [urls[target], ...(target === 'redirect' ? [urls.internal] : [])];
	const visited: string[] = [];
	for (const [index, url] of hops.entries()) {
		const parsed = new URL(url);
		const allowed = parsed.protocol === 'https:' && parsed.hostname === 'nimbus.com';
		if ((guard === 'every' || (guard === 'first' && index === 0)) && !allowed)
			return { status: 403, leaked: false, visited, blocked: url };
		visited.push(url);
	}
	return { status: 200, leaked: target !== 'image', visited, blocked: '' };
}
export function advisoryApplies(version: '1.4' | '1.5', enabled: boolean) {
	return version === '1.4' && enabled;
}
export function riskOutcome(publicAccess: boolean, patched: boolean, sensitive: boolean) {
	return !publicAccess ? 'limited' : patched ? 'blocked' : sensitive ? 'privateLeak' : 'publicLeak';
}
