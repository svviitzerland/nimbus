<script lang="ts">
	// A guided configuration management lesson. A window on the left, six servers stacked on the
	// right with a wire to each. First the window types SSH commands into one server at a time
	// (and makes a typo on the fourth), then it becomes an Ansible playbook and one command updates
	// all six at once. On the last beat the learner may tap a server to change it by hand, and the
	// playbook runs again and puts it back.
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { ConfigMgmtText } from '$lib/chapters/devops/config-mgmt/types';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as ConfigMgmtText);

	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const last = $derived(tx.steps.length - 1);
	const step = $derived(Math.max(0, Math.min(peek ?? beat, last)));

	let reduce = $state(false);
	$effect(() => {
		reduce = prefersReducedMotion();
	});

	type Ver = 'v1' | 'v2' | 'bad' | 'drift';
	const N = 6;
	const SRV = Array.from({ length: N }, (_, k) => k);
	const TYPO = 3;
	const PLAYBOOK = [
		'- name: Update nimbus.com',
		'  hosts: web',
		'  become: true',
		'  tasks:',
		'    - name: Install version 2',
		'      apt:',
		'        name: nimbus-app=2.0',
		'    - name: Restart the app',
		'      service:',
		'        name: nimbus-app',
		'        state: restarted'
	];
	const CMD = '$ ansible-playbook update.yml';

	const sessLines = (k: number, typo: boolean) => {
		const h = `web${k + 1}$`;
		return typo
			? [
					`$ ssh web${k + 1}`,
					`${h} sudo apt install nimbus-ap=2.0`,
					'E: Unable to locate package nimbus-ap',
					`${h} exit`
				]
			: [
					`$ ssh web${k + 1}`,
					`${h} sudo apt install nimbus-app=2.0`,
					`${h} sudo systemctl restart nimbus-app`,
					`${h} exit`
				];
	};
	const recap = (changed: (k: number) => number, rows: number[]) => [
		'PLAY RECAP',
		...rows.map((k) => `web${k + 1} : ok=3  changed=${changed(k)}  failed=0`)
	];

	let ver = $state<Ver[]>(Array(N).fill('v1'));
	let lit = $state<boolean[]>(Array(N).fill(false));
	let ping = $state(0);
	let sess = $state<string[]>([]);
	let typed = $state(PLAYBOOK.length);
	let term = $state<string[]>(['$']);
	let pickRun = $state(0);
	let picked = -1;

	const mode = $derived(step === 0 ? 'idle' : step <= 2 ? 'manual' : 'book');
	const all = (v: Ver) => Array<Ver>(N).fill(v);
	const none = () => Array<boolean>(N).fill(false);
	const MIXED: Ver[] = ['v2', 'v2', 'v2', 'bad', 'v1', 'v1'];

	function manual(typo: boolean): SeqStep[] {
		const seq: SeqStep[] = [
			[
				700,
				() => {
					ver = all('v1');
					lit = none();
					sess = [];
				}
			]
		];
		for (let k = 0; k < N; k++) {
			const bad = typo && k === TYPO;
			const lines = sessLines(k, bad);
			seq.push([
				500,
				() => {
					lit = SRV.map((j) => j === k);
					sess = [];
				}
			]);
			lines.forEach((_, n) =>
				seq.push([n === 3 ? 500 : 650, () => (sess = lines.slice(0, n + 1))])
			);
			seq.push([
				450,
				() => {
					const next = [...ver];
					next[k] = bad ? 'bad' : 'v2';
					ver = next;
				}
			]);
		}
		seq.push([2600, () => (lit = none())]);
		return seq;
	}

	function book(start: Ver[], rows: number[], changed: (k: number) => number): SeqStep[] {
		return [
			[
				1300,
				() => {
					ver = start;
					lit = none();
					term = ['$'];
				}
			],
			[900, () => (term = [CMD])],
			[1300, () => (lit = SRV.map(() => true))],
			[
				4200,
				() => {
					ver = all('v2');
					ping += 1;
					term = recap(changed, rows);
				}
			],
			[400, () => (lit = none())]
		];
	}

	function play(s: number, still: boolean, run: number): (() => void) | undefined {
		lit = none();
		sess = [];
		typed = PLAYBOOK.length;
		term = ['$'];
		if (s === last && run > 0 && picked >= 0) {
			const k = picked;
			const start = ver.map((v, j) => (j === k ? 'drift' : 'v2')) as Ver[];
			const rows = [k, (k + 1) % N];
			const changed = (j: number) => (j === k ? 1 : 0);
			if (still) {
				ver = all('v2');
				term = recap(changed, rows);
				return;
			}
			ver = start;
			return runSeq(book(start, rows, changed));
		}
		if (s === 0) {
			ver = all('v1');
			return;
		}
		if (s <= 2) {
			if (still) {
				ver = s === 2 ? MIXED : ['v2', 'v2', 'v1', 'v1', 'v1', 'v1'];
				sess = sessLines(s === 2 ? TYPO : 1, s === 2);
				lit = SRV.map((j) => j === (s === 2 ? TYPO : 1));
				return;
			}
			return runSeq(manual(s === 2), true);
		}
		if (s === 3) {
			ver = MIXED;
			if (still) return;
			typed = 0;
			return runSeq(PLAYBOOK.map((_, k) => [360, () => (typed = k + 1)] as SeqStep));
		}
		const rows = [0, 3];
		if (s === 4) {
			const changed = (k: number) => (MIXED[k] === 'v2' ? 0 : 2);
			if (still) {
				ver = all('v2');
				term = recap(changed, rows);
				return;
			}
			return runSeq(book(MIXED, rows, changed), true);
		}
		ver = all('v2');
		if (s === 5 && !still)
			return runSeq(
				book(all('v2'), [0, 1], () => 0),
				true
			);
		term = recap(() => 0, [0, 1]);
	}

	$effect(() => {
		const s = step;
		const still = reduce;
		const run = pickRun;
		return untrack(() => play(s, still, run));
	});

	function tap(k: number) {
		if (step !== last) return;
		picked = k;
		pickRun += 1;
		onstate?.('drift');
	}

	const sy = (k: number) => 14 + k * 38;
	const badge = (v: Ver) => (v === 'bad' ? tx.brokenTag : v === 'drift' ? tx.driftTag : v);
</script>

{#snippet visual(i: number)}
	<div class="vis">
		<svg viewBox="0 0 460 250" class="scene" role="img" aria-label={tx.serversLabel}>
			<!-- the window, a terminal or the playbook -->
			<rect x="8" y="8" width="250" height="168" rx="10" class="win" />
			<path d="M8 30V18a10 10 0 0 1 10 -10H248a10 10 0 0 1 10 10V30Z" class="bar" />
			{#each [22, 34, 46] as x (x)}
				<circle cx={x} cy="19" r="3.5" class="dot" />
			{/each}
			<text x="62" y="23" class="tab">{mode === 'book' ? 'update.yml' : tx.terminalTab}</text>

			{#if mode === 'book'}
				{#each PLAYBOOK.slice(0, typed) as l, n (n)}
					<text x="20" y={47 + n * 11.8} class="mono" class:key={!l.includes(':') || n === 0}
						>{l}</text
					>
				{/each}
			{:else if mode === 'manual'}
				{#each sess as l, n (n)}
					<text
						x="20"
						y={50 + n * 16}
						class="mono"
						class:err={l.startsWith('E:')}
						class:cmd={l.startsWith('$')}>{l}</text
					>
				{/each}
			{:else}
				<text x="20" y="50" class="mono cmd">$</text>
			{/if}

			<!-- the command terminal under the playbook -->
			<rect x="8" y="184" width="250" height="58" rx="8" class="term" />
			{#each term.slice(-3) as l, n (n + l)}
				<text
					x="18"
					y={201 + n * 14}
					class="mono t"
					class:cmd={l.startsWith('$')}
					class:head={l === 'PLAY RECAP'}
					class:changed={/changed=[1-9]/.test(l)}>{l}</text
				>
			{/each}

			<!-- one wire to each server -->
			{#each SRV as k (k)}
				<path d="M258 92C292 92 296 {sy(k) + 15} 330 {sy(k) + 15}" class="wire" class:on={lit[k]} />
			{/each}

			<!-- the servers -->
			{#each SRV as k (k)}
				{@const y = sy(k)}
				{@const v = ver[k]}
				<g
					class="srv {v}"
					class:tap={i === last}
					role="button"
					tabindex={i === last ? 0 : -1}
					aria-disabled={i !== last}
					aria-label="web{k + 1}"
					onclick={() => tap(k)}
					onkeydown={(e) => {
						if (e.key === 'Enter' || e.key === ' ') {
							e.preventDefault();
							tap(k);
						}
					}}
				>
					<rect x="330" {y} width="78" height="30" rx="5" class="box" />
					<circle cx="342" cy={y + 15} r="3.4" class="led" />
					<text x="352" y={y + 19} class="name">web{k + 1}</text>
					<line x1="388" y1={y + 11} x2="400" y2={y + 11} class="vent" />
					<line x1="388" y1={y + 19} x2="400" y2={y + 19} class="vent" />
					{#key ping}
						{#if v === 'v2' && !reduce && ping > 0}
							<rect
								x="330"
								{y}
								width="78"
								height="30"
								rx="5"
								class="ping"
								style="animation-delay:{k * 0.05}s"
							/>
						{/if}
					{/key}
					<text x="414" y={y + 19} class="ver">{badge(v)}</text>
				</g>
			{/each}
			{#if i === last}
				<text x="330" y="249" class="hint">{tx.tapHint}</text>
			{/if}
		</svg>
	</div>
{/snippet}

<div class="stage">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.stage {
		display: flex;
		width: 100%;
		max-height: 100%;
		justify-content: center;
		overflow-x: hidden;
		overflow-y: auto;
		padding-bottom: 8px;
	}
	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	.vis {
		display: flex;
		width: 100%;
		justify-content: center;
	}
	.scene {
		width: 100%;
		max-width: 460px;
		height: auto;
		overflow: visible;
	}
	.win {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.bar {
		fill: var(--color-paper);
	}
	.dot {
		fill: var(--color-line);
	}
	.tab {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9.2px;
		white-space: pre;
		fill: var(--color-ink);
	}
	.mono.key {
		fill: var(--color-brand);
		font-weight: 700;
	}
	.mono.cmd {
		fill: var(--color-brand);
		font-weight: 700;
	}
	.mono.err {
		fill: var(--color-danger);
		font-weight: 700;
	}
	.term {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.t {
		font-size: 8.8px;
	}
	.t.head {
		fill: var(--color-muted);
		font-weight: 700;
	}
	.t.changed {
		fill: var(--color-amber);
		font-weight: 700;
	}

	.wire {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 2;
		transition: stroke 0.35s;
	}
	.wire.on {
		stroke: var(--color-brand);
	}

	.box {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition:
			stroke 0.35s,
			fill 0.35s;
	}
	.led {
		fill: var(--color-faint);
		transition: fill 0.35s;
	}
	.name {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.vent {
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.ver {
		font-size: 10.5px;
		font-weight: 800;
		fill: var(--color-faint);
	}
	.srv.v2 .led {
		fill: var(--color-grass);
	}
	.srv.v2 .ver {
		fill: var(--color-grass);
	}
	.srv.bad .box {
		stroke: var(--color-danger);
		fill: var(--color-danger-soft);
	}
	.srv.bad .led,
	.srv.bad .ver {
		fill: var(--color-danger);
	}
	.srv.drift .box {
		stroke: var(--color-amber);
		fill: var(--color-amber-soft);
	}
	.srv.drift .led,
	.srv.drift .ver {
		fill: var(--color-amber);
	}
	.srv.tap {
		cursor: pointer;
	}
	.srv.tap:hover .box,
	.srv.tap:focus-visible .box {
		stroke: var(--color-brand);
	}
	.srv:focus {
		outline: none;
	}
	.ping {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2;
		transform-box: fill-box;
		transform-origin: center;
		animation: ping 0.9s ease-out both;
	}
	@keyframes ping {
		from {
			opacity: 0.9;
			transform: scale(1);
		}
		to {
			opacity: 0;
			transform: scale(1.18);
		}
	}
	.hint {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-brand);
	}

	@media (prefers-reduced-motion: reduce) {
		.wire,
		.box,
		.led {
			transition: none;
		}
		.ping {
			animation: none;
			opacity: 0;
		}
	}
</style>
