// Turns the router config into what CiscoRig draws (port lights and the little tags under them).
import type { PortLook } from './CiscoRig.svelte';
import type { Cfg, Iface } from './ios';

export function portLooks(
	cfg: Cfg,
	tag?: (i: Iface) => Pick<PortLook, 'tag' | 'tone'> | undefined
): Record<string, PortLook> {
	const out: Record<string, PortLook> = {};
	for (const i of cfg.ifaces)
		out[i.name] = { state: i.shut ? 'admin' : i.cable ? 'up' : 'down', ...(tag?.(i) ?? {}) };
	return out;
}

/** Tell Nim about a mistake, falling back to the generic line when the lesson has none. */
export function nimToken(token: string, reactions: Record<string, string>) {
	return token in reactions ? token : 'error';
}
