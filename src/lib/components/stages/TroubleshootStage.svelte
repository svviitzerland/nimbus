<script lang="ts">
	import type { LessonText } from '$lib/chapters/types';
	import type { CheckId, TroubleshootText } from '$lib/chapters/network/troubleshoot/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as TroubleshootText);

	// Bottom up, the order a network is built in.
	const ORDER: CheckId[] = ['cable', 'wifi', 'ip', 'gateway', 'dns', 'site'];
	// Which checks turn red for each hidden fault. The lowest red one is always the fault itself.
	// A loose internet cable leaves the home side (WiFi, address, router) working, like in real life.
	const FAILS: Record<CheckId, CheckId[]> = {
		cable: ['cable', 'dns', 'site'],
		wifi: ['wifi', 'ip', 'gateway', 'dns', 'site'],
		ip: ['ip', 'gateway', 'dns', 'site'],
		gateway: ['gateway', 'dns', 'site'],
		dns: ['dns', 'site'],
		site: ['site']
	};
	const blank = (): Record<CheckId, '' | 'ok' | 'fail'> => ({
		cable: '',
		wifi: '',
		ip: '',
		gateway: '',
		dns: '',
		site: ''
	});

	// The first case is fixed so the server and browser agree; later cases are random.
	let fault = $state<CheckId>('dns');
	let caseNo = $state(1);
	let results = $state(blank());
	let solved = $state(false);
	let shake = $state<CheckId | null>(null);
	let done = false;
	let shakeTimer: ReturnType<typeof setTimeout> | undefined;
	$effect(() => () => clearTimeout(shakeTimer));

	function check(id: CheckId) {
		if (solved || results[id]) return;
		const i = ORDER.indexOf(id);
		const skipped = ORDER.slice(0, i).some((x) => !results[x]);
		const res = FAILS[fault].includes(id) ? 'fail' : 'ok';
		results[id] = res;
		onstate?.(skipped ? 'skip' : res);
	}

	function blame(id: CheckId) {
		if (solved) return;
		if (id === fault) {
			solved = true;
			onstate?.('solved');
			if (!done) {
				done = true;
				oncomplete?.();
			}
			return;
		}
		clearTimeout(shakeTimer);
		shake = id;
		shakeTimer = setTimeout(() => (shake = null), 500);
		onstate?.('wrong');
	}

	function newCase() {
		const others = ORDER.filter((x) => x !== fault);
		fault = others[Math.floor(Math.random() * others.length)];
		caseNo += 1;
		results = blank();
		solved = false;
	}

	// Once fixed, every step reads green.
	const shown = (id: CheckId) => (solved ? 'ok' : results[id]);
	const rows = [...ORDER].reverse(); // drawn with the site on top, the cable at the bottom
</script>

<div class="wrap">
	<div class="case" class:fixed={solved}>
		<div class="chead">
			<span class="cno">{tx.caseLabel.replace('{n}', String(caseNo))}</span>
			{#if solved}
				<button type="button" class="cta" onclick={newCase}>{tx.newCase}</button>
			{/if}
		</div>
		<div class="sym">
			<span class="led"></span>
			<code>nimbus.com</code>
			<span>{solved ? tx.fixedSymptom : tx.symptom}</span>
		</div>
		{#if solved}<p class="fix">{tx.fixes[fault]}</p>{/if}
	</div>

	<ol class="stack">
		{#each rows as id (id)}
			{@const r = shown(id)}
			{@const c = tx.checks[id]}
			<li class="step {r}" class:shake={shake === id}>
				<span class="node"></span>
				<div class="info">
					<span class="name">
						{c.name}
						{#if id === 'cable' && !r}<em class="start">{tx.bottomLabel}</em>{/if}
					</span>
					<code class="how">{c.how}</code>
					{#if results[id]}
						<span class="out">{solved ? c.ok : results[id] === 'ok' ? c.ok : c.fail}</span>
					{/if}
				</div>
				<div class="act">
					{#if r === 'ok'}
						<span class="tag ok">{tx.okTag}</span>
					{:else if r === 'fail'}
						<button type="button" class="blame" onclick={() => blame(id)}>{tx.blameBtn}</button>
					{:else}
						<button type="button" class="chk" onclick={() => check(id)}>{tx.checkBtn}</button>
					{/if}
				</div>
			</li>
		{/each}
	</ol>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		width: min(94vw, 390px);
		max-height: 100%;
		overflow-y: auto;
		padding-bottom: 4px;
	}

	.case {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 7px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 12px;
		transition: border-color 0.3s ease;
	}
	.case.fixed {
		border-color: var(--color-grass);
	}
	.chead {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
		min-height: 30px;
	}
	.cno {
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.sym {
		display: flex;
		align-items: center;
		gap: 8px;
		border-radius: 9px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		padding: 6px 10px;
		font-size: 12.5px;
		font-weight: 650;
		color: var(--color-ink);
	}
	.sym code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.led {
		flex: none;
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-danger);
	}
	.case.fixed .led {
		background: var(--color-grass);
	}
	.fix {
		margin: 0;
		font-size: 12px;
		line-height: 1.45;
		color: var(--color-muted);
		animation: fade 0.3s ease;
	}
	.cta {
		border-radius: 10px;
		background: var(--btn-primary);
		color: #fff;
		padding: 6px 14px;
		font-size: 12.5px;
		font-weight: 600;
		transition: filter 0.2s ease;
	}
	.cta:hover {
		filter: brightness(1.18);
	}

	.stack {
		width: 100%;
		margin: 0;
		padding: 0;
		list-style: none;
		display: flex;
		flex-direction: column;
		gap: 6px;
	}
	.step {
		position: relative;
		display: grid;
		grid-template-columns: 14px 1fr auto;
		align-items: center;
		gap: 10px;
		border-radius: 12px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 8px 10px;
		transition:
			border-color 0.25s ease,
			background 0.25s ease;
	}
	.step.ok {
		border-color: color-mix(in srgb, var(--color-grass) 55%, var(--color-line));
		background: var(--color-grass-soft);
	}
	.step.fail {
		border-color: color-mix(in srgb, var(--color-danger) 60%, var(--color-line));
		background: var(--color-danger-soft);
	}
	.step.shake {
		animation: shake 0.45s ease;
	}
	@keyframes shake {
		20%,
		60% {
			transform: translateX(-4px);
		}
		40%,
		80% {
			transform: translateX(4px);
		}
	}
	.node {
		width: 12px;
		height: 12px;
		border-radius: 50%;
		border: 2px solid var(--color-line);
		background: var(--color-card);
	}
	.step.ok .node {
		border-color: var(--color-grass);
		background: var(--color-grass);
	}
	.step.fail .node {
		border-color: var(--color-danger);
		background: var(--color-danger);
	}
	.info {
		display: flex;
		flex-direction: column;
		gap: 1px;
		min-width: 0;
	}
	.name {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 13px;
		font-weight: 750;
		color: var(--color-ink);
	}
	.start {
		border-radius: 999px;
		background: var(--color-amber-soft);
		color: var(--color-amber);
		font-size: 9.5px;
		font-style: normal;
		font-weight: 800;
		padding: 1px 7px;
	}
	.how {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 10.5px;
		color: var(--color-faint);
	}
	.out {
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
		animation: fade 0.25s ease;
	}
	.step.ok .out {
		color: var(--color-grass);
	}
	.step.fail .out {
		color: var(--color-danger);
	}
	@keyframes fade {
		from {
			opacity: 0;
		}
	}
	.act {
		flex: none;
	}
	.chk,
	.blame {
		border-radius: 9px;
		padding: 6px 12px;
		font-size: 12px;
		font-weight: 700;
		transition:
			border-color 0.2s ease,
			background 0.2s ease;
	}
	.chk {
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-ink);
	}
	.chk:hover {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.blame {
		border: 1px solid var(--color-danger);
		background: var(--color-card);
		color: var(--color-danger);
	}
	.blame:hover {
		background: var(--color-danger);
		color: #fff;
	}
	.tag {
		font-size: 11px;
		font-weight: 800;
		color: var(--color-grass);
	}

	@media (prefers-reduced-motion: reduce) {
		.step.shake {
			animation: none;
		}
		.out,
		.fix {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
		}
		.name {
			font-size: 14px;
		}
		.out {
			font-size: 12.5px;
		}
	}
</style>
