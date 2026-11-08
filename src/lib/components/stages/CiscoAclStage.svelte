<script lang="ts">
	import { untrack } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { CiscoAclText } from '$lib/chapters/netlab/cisco-acl/types';
	import LabGuide from './ciscolab/LabGuide.svelte';
	import { IosShell, type Run } from './ciscolab/shell.svelte';
	import { Director } from './ciscolab/director';
	import { Anim } from './ciscolab/anim';
	import { aceText, aclHit, officeRouter, type Acl } from './ciscolab/ios';
	import { nimToken } from './ciscolab/look';

	let {
		text,
		beat = 0,
		oncomplete,
		onstate,
		onshow
	}: {
		text: LessonText;
		beat?: number;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		onshow?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as CiscoAclText);
	const last = $derived(tx.intro.length - 1);
	const live = $derived(beat >= last);
	let done = $state(false);

	// Beats: 0 the boss's two wishes (tests with no list), 1 what an ACL is, 2 the bouncer trick,
	// 3 the first line (extended list 100), 4 apply it (implicit deny bites), 5 permit the rest,
	// 6 lock the remote login to Budi, 7 the counters, 8 elsewhere, 9 your turn (let Dewi in).
	const TEST_BEATS = [0, 4, 5, 6];
	const SCRIPTS: string[][] = [
		[],
		[],
		[],
		['configure terminal', 'access-list 100 deny tcp any host 45.76.10.20 eq 443'],
		['interface g0/1', 'ip access-group 100 in', 'exit'],
		['access-list 100 permit ip any any'],
		['access-list 10 permit host 192.168.88.12', 'line vty 0 4', 'access-class 10 in', 'end'],
		['show access-lists'],
		[],
		[]
	];

	// ---- the test packets ----
	const ROUTER = '192.168.88.1';
	const GAME = '45.76.10.20';
	const WEB = '104.21.5.9';
	type Target = 'game' | 'web' | 'router';
	type Test = { who: string; src: string; to: Target; port: number; want: boolean };
	const TESTS: Test[] = [
		{ who: 'Sari', src: '192.168.88.11', to: 'game', port: 443, want: false },
		{ who: 'Sari', src: '192.168.88.11', to: 'web', port: 443, want: true },
		{ who: 'Budi', src: '192.168.88.12', to: 'router', port: 22, want: true },
		{ who: 'Sari', src: '192.168.88.11', to: 'router', port: 22, want: false },
		{ who: 'Dewi', src: '192.168.88.13', to: 'router', port: 22, want: true }
	];
	const dstOf = (t: Target) => (t === 'game' ? GAME : t === 'web' ? WEB : ROUTER);
	const visibleTests = $derived(live ? TESTS : TESTS.slice(0, 4));

	type Spot = { list: string; row: number }; // row -1 is the invisible deny at the bottom
	type Verdict = { ok: boolean; by: Spot | null };

	function walk(acl: Acl | undefined, t: Test, steps: Spot[]): Verdict {
		if (!acl) return { ok: true, by: null }; // an applied list that does not exist lets all in
		for (let i = 0; i < acl.aces.length; i++) {
			const e = acl.aces[i];
			steps.push({ list: acl.id, row: i });
			const hit = acl.ext
				? (e.proto === 'ip' || e.proto === 'tcp') &&
					aclHit(e.src, t.src) &&
					aclHit(e.dst ?? { any: true }, dstOf(t.to)) &&
					(e.port === undefined || e.port === t.port)
				: aclHit(e.src, t.src);
			if (hit) return { ok: e.action === 'permit', by: { list: acl.id, row: i } };
		}
		steps.push({ list: acl.id, row: -1 });
		return { ok: false, by: { list: acl.id, row: -1 } };
	}
	function judge(t: Test): { steps: Spot[]; v: Verdict } {
		const steps: Spot[] = [];
		const c = shell.cfg;
		const lan = c.ifaces.find((i) => i.name === 'GigabitEthernet0/1');
		let v: Verdict = { ok: true, by: null };
		if (lan?.aclIn) {
			v = walk(shell.acl(lan.aclIn), t, steps);
			if (!v.ok) return { steps, v };
		}
		if (t.to === 'router' && c.vty.acl) v = walk(shell.acl(c.vty.acl), t, steps);
		return { steps, v };
	}

	function onrun(r: Run) {
		if (!live || done) return;
		if (r.id !== 'acl') return;
		if (!judge(TESTS[4]).v.ok) return;
		if (judge(TESTS[3]).v.ok) {
			onstate?.('tooOpen');
			return runTests(false);
		}
		done = true;
		onstate?.('task');
		runTests(false);
	}
	const shell = new IosShell({
		dev: 'router',
		cfg: officeRouter(3),
		text: () => tx,
		onrun,
		onerror: (t) => {
			if (live) onstate?.(nimToken(t, tx.reactions));
		}
	});

	const anim = new Anim();
	let verdicts = $state<(Verdict | null)[]>([null, null, null, null, null]);
	let cursor = $state<Spot | null>(null);
	let testing = $state(-1);

	function finish() {
		const hits: Record<string, number> = {};
		verdicts = TESTS.map((t, i) => {
			if (i === 4 && !live) return null;
			const { v } = judge(t);
			if (v.by && v.by.row >= 0) {
				const seq = shell.acl(v.by.list)!.aces[v.by.row].seq;
				hits[`${v.by.list}:${seq}`] = (hits[`${v.by.list}:${seq}`] ?? 0) + 1;
			}
			return v;
		});
		shell.hits = hits;
		cursor = null;
		testing = -1;
	}
	function runTests(instant: boolean) {
		if (instant) return finish();
		anim.play(async (wait) => {
			verdicts = [null, null, null, null, null];
			const n = live ? 5 : 4;
			for (let i = 0; i < n; i++) {
				testing = i;
				const { steps, v } = judge(TESTS[i]);
				for (const s of steps) {
					cursor = s;
					await wait(420);
				}
				verdicts[i] = v;
				await wait(380);
			}
		}, finish);
	}

	const director = new Director(
		shell,
		SCRIPTS,
		() => {
			shell.reset(officeRouter(3));
			verdicts = [null, null, null, null, null];
			cursor = null;
			testing = -1;
			done = false;
		},
		(b, instant) => {
			if (TEST_BEATS.includes(b)) runTests(instant);
		}
	);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});
	$effect(() => {
		const b = beat;
		untrack(() => {
			anim.cancel();
			director.go(b);
		});
	});
	$effect(() => () => {
		anim.stop();
		shell.destroy();
	});

	// the lists to draw, list 100 on the office port and list 10 on the remote login lines
	const cards = $derived(
		[
			{ id: '100', where: tx.on100 },
			{ id: '10', where: tx.on10 }
		]
			.map((k) => ({ ...k, acl: shell.acl(k.id) }))
			.filter((k) => k.acl || (k.id === '100' && beat >= 1 && beat <= 3))
	);
	const isHere = (list: string, row: number) =>
		!!cursor && cursor.list === list && cursor.row === row;
	const verdictAt = (list: string, row: number) => {
		const v = testing >= 0 ? verdicts[testing] : null;
		return v && v.by && v.by.list === list && v.by.row === row ? (v.ok ? 'pass' : 'stop') : '';
	};
	const targetName = (t: Target) => tx.targets[t];
</script>

<LabGuide
	steps={tx.steps}
	active={beat}
	{shell}
	{live}
	inputLabel={tx.inputLabel}
	{done}
	doneNote={tx.doneNote}
	termHeight={150}
>
	{#snippet art()}
		<div class="tests">
			{#each visibleTests as t, i (i)}
				{@const v = verdicts[i]}
				<div class="ticket" class:now={testing === i}>
					<span class="who">{t.who}</span>
					<svg viewBox="0 0 20 10" aria-hidden="true"><path d="M1 5h16M13 1l4 4-4 4" /></svg>
					<span class="to">{targetName(t.to)}</span>
					{#if v}
						<span class="pill" class:ok={v.ok}>{v.ok ? tx.allowed : tx.blocked}</span>
						{#if v.ok !== t.want}<span class="wish">{t.want ? tx.wantAllow : tx.wantBlock}</span
							>{/if}
					{:else}
						<span class="pill idle">{tx.waiting}</span>
					{/if}
				</div>
			{/each}
		</div>

		{#each cards as k (k.id)}
			<div class="acl">
				<div class="ahead">
					<code>access-list {k.id}</code>
					<span>{k.where}</span>
				</div>
				{#each k.acl?.aces ?? [] as e, r (e.seq)}
					<div class="arow {e.action} {verdictAt(k.id, r)}" class:here={isHere(k.id, r)}>
						<span class="seq">{e.seq}</span>
						<code>{aceText(e, k.acl!.ext)}</code>
					</div>
				{/each}
				<div class="arow implicit {verdictAt(k.id, -1)}" class:here={isHere(k.id, -1)}>
					<span class="seq"></span>
					<code>deny any</code>
					<span class="ghost">{tx.implicitNote}</span>
				</div>
			</div>
		{/each}
	{/snippet}
</LabGuide>

<style>
	.tests {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 4px;
	}
	.ticket {
		display: flex;
		align-items: center;
		gap: 7px;
		border: 1px solid var(--color-line);
		border-radius: 10px;
		background: var(--color-card);
		padding: 5px 9px;
		font-size: 12px;
		transition: border-color 0.25s ease;
	}
	.ticket.now {
		border-color: var(--color-brand);
	}
	.who {
		font-weight: 750;
		color: var(--color-ink);
	}
	.to {
		flex: 1;
		min-width: 0;
		color: var(--color-muted);
		font-weight: 600;
	}
	.ticket svg {
		width: 16px;
		flex: none;
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 1.6;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.pill {
		border-radius: 999px;
		padding: 1px 9px;
		font-size: 10.5px;
		font-weight: 800;
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.pill.ok {
		background: var(--color-grass-soft);
		color: var(--color-grass);
	}
	.pill.idle {
		background: var(--color-paper);
		color: var(--color-faint);
	}
	.wish {
		font-size: 10px;
		font-weight: 750;
		color: var(--color-amber);
	}
	.acl {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 12px;
		background: var(--color-card);
		padding: 6px 8px;
	}
	.ahead {
		display: flex;
		align-items: baseline;
		gap: 8px;
		padding: 0 2px 4px;
	}
	.ahead code {
		font-size: 11.5px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.ahead span {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.arow {
		display: flex;
		align-items: center;
		gap: 8px;
		border-radius: 7px;
		border: 1.5px solid transparent;
		padding: 3px 6px;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.arow code {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 11px;
		color: var(--color-ink);
	}
	.arow.deny code {
		color: var(--color-danger);
	}
	.arow.permit code {
		color: var(--color-grass);
	}
	.seq {
		width: 18px;
		flex: none;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10px;
		color: var(--color-faint);
	}
	.arow.implicit {
		opacity: 0.6;
	}
	.arow.implicit code {
		color: var(--color-danger);
		font-style: italic;
	}
	.ghost {
		font-size: 10px;
		color: var(--color-faint);
	}
	.arow.here {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		opacity: 1;
	}
	.arow.pass {
		border-color: var(--color-grass);
		background: var(--color-grass-soft);
		opacity: 1;
	}
	.arow.stop {
		border-color: var(--color-danger);
		background: var(--color-danger-soft);
		opacity: 1;
	}
	@media (prefers-reduced-motion: reduce) {
		.ticket,
		.arow {
			transition: none;
		}
	}
</style>
