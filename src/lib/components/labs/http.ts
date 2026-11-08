/** Local model only. No fetch, credentials, or requests to the displayed host. */
export type LabResponse = { status: number; reason: string; body: string };
export function reply(status: number, reason: string, body: unknown): LabResponse {
	return { status, reason, body: JSON.stringify(body, null, 2) };
}
export function repeatRequest(raw: string): LabResponse {
	const lines = raw.trim().split(/\r?\n/);
	const request = /^(GET|POST) (\/\S*) HTTP\/1\.[01]$/.exec(lines[0] ?? '');
	const hosts = lines.filter((line) => /^host\s*:/i.test(line));
	if (!request || hosts.length !== 1 || !/^host:\s*nimbus\.com\s*$/i.test(hosts[0]))
		return reply(400, 'Bad Request', {
			error: 'Use GET or POST, a path, HTTP/1.1 and Host: nimbus.com'
		});
	if (request[1] !== 'GET') return reply(405, 'Method Not Allowed', { allowed: ['GET'] });
	const products: Record<string, { name: string; price: number }> = {
		'/products/1': { name: 'Nimbus notebook', price: 25 },
		'/products/2': { name: 'Nimbus mug', price: 40 }
	};
	const product = products[request[2]];
	return product
		? reply(200, 'OK', product)
		: reply(404, 'Not Found', { error: 'Product not found' });
}
export function readInvoice(id: number, enforceOwner: boolean, sessionUser = 'nim'): LabResponse {
	const invoices: Record<number, { owner: string; total: number }> = {
		101: { owner: 'nim', total: 25 },
		102: { owner: 'ari', total: 40 }
	};
	if (!sessionUser) return reply(401, 'Unauthorized', { error: 'Sign in first' });
	const invoice = invoices[id];
	if (!invoice) return reply(404, 'Not Found', { error: 'Invoice not found' });
	if (enforceOwner && invoice.owner !== sessionUser)
		return reply(403, 'Forbidden', { error: 'This invoice belongs to another account' });
	return reply(200, 'OK', { id, ...invoice });
}
export const rawResponse = (r: LabResponse) =>
	`HTTP/1.1 ${r.status} ${r.reason}\nContent-Type: application/json\n\n${r.body}`;
