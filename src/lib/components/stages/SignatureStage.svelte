<script lang="ts">
	// A guided digital signature lesson. An update file leaves the nimbus.com developer, gets a
	// fingerprint and a seal, and travels to your phone, which checks it by itself. On the tamper
	// beat an attacker swaps a line on the way and the check fails. The only optional play is
	// letting the attacker meddle or not on the last beat.
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import Key from './crypto/Key.svelte';
	import Person from './crypto/Person.svelte';
	import Phone from './crypto/Phone.svelte';
	import { fingerprint } from './crypto/hash';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';
	import type { StageProps } from '$lib/chapters/types';
	import type { SignatureText } from '$lib/chapters/security/signature/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as SignatureText);

	// Watch first, play optional, so the stage is visible from the start and Next never locks.
	$effect(() => {
		untrack(() => {
			onshow?.(true);
			oncomplete?.();
		});
	});

	let reduce = $state(false);
	$effect(() => {
		reduce = prefersReducedMotion();
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const last = $derived(tx.steps.length - 1);
	const step = $derived(Math.max(0, Math.min(peek ?? beat, last)));

	let meddle = $state(false);
	let runId = $state(0);
	function pick(on: boolean) {
		meddle = on;
		runId += 1;
		onstate?.(on ? 'tampered' : 'clean');
	}

	const DEV = 150;
	const MID = 225;
	const PHONE = 300;
	const CENTER = 225;
	const PEN_FILE = 266;

	// which version of the second line the file carries right now
	type Line = 'orig' | 'one' | 'tamp';
	let line = $state<Line>('orig');
	let fx = $state(DEV);
	let snap = $state(true);
	let sealed = $state(false);
	let fpShown = $state(false);
	let sealing = $state(false);
	let rows = $state(0);
	let mark = $state<'' | 'ok' | 'bad'>('');
	let attacker = $state(false);

	const secondLine = $derived(
		line === 'orig' ? tx.lines[1] : line === 'one' ? tx.oneLetter : tx.tampered
	);
	const fileFp = $derived(fingerprint([tx.lines[0], secondLine, tx.lines[2]].join('\n')));
	const sealFp = $derived(fingerprint(tx.lines.join('\n')));
	const verdictOk = $derived(fileFp === sealFp);

	function reset(at = DEV) {
		line = 'orig';
		fx = at;
		snap = true;
		sealed = false;
		fpShown = false;
		sealing = false;
		rows = 0;
		mark = '';
		attacker = false;
	}

	function deliver(tamper: boolean): SeqStep[] {
		const travel: SeqStep[] = tamper
			? [
					[1300, () => (fx = MID)],
					[1100, () => (line = 'tamp')],
					[1300, () => (fx = PHONE)]
				]
			: [[1600, () => (fx = PHONE)]];
		return [
			[
				200,
				() => {
					reset();
					sealed = true;
					attacker = tamper;
				}
			],
			[400, () => (snap = false)],
			...travel,
			[800, () => (rows = 1)],
			[900, () => (rows = 2)],
			[3400, () => ((rows = 3), (mark = tamper ? 'bad' : 'ok'))]
		];
	}

	function still(s: number, tamper: boolean) {
		reset(s === 1 ? PEN_FILE : s === 4 ? CENTER : DEV);
		if (s === 0) {
			fx = PHONE;
			mark = 'ok';
		} else if (s === 5) {
			sealed = true;
		} else if (s >= 6) {
			const t = s === 7 || (s === last && tamper);
			fx = PHONE;
			sealed = true;
			attacker = t;
			line = t ? 'tamp' : 'orig';
			rows = 3;
			mark = t ? 'bad' : 'ok';
		}
		if (s === 1) sealed = true;
		if (s === 4) fpShown = true;
	}

	function play(s: number, tamper: boolean, stillOnly: boolean): (() => void) | undefined {
		if (stillOnly || s === 1 || s === 2 || s === 3) {
			still(s, tamper);
			return;
		}
		if (s === 0)
			return runSeq(
				[
					[400, () => reset()],
					[60, () => (snap = false)],
					[1700, () => (fx = PHONE)],
					[2600, () => (mark = 'ok')]
				],
				true
			);
		if (s === 4)
			return runSeq(
				[
					[
						2200,
						() => {
							reset(CENTER);
							fpShown = true;
						}
					],
					[2200, () => (line = 'one')]
				],
				true
			);
		if (s === 5)
			return runSeq(
				[
					[900, () => reset()],
					[1200, () => (fpShown = true)],
					[1100, () => (sealing = true)],
					[
						2600,
						() => {
							sealing = false;
							fpShown = false;
							sealed = true;
						}
					]
				],
				true
			);
		if (s === 7) return runSeq(deliver(true), true);
		if (s === last) return runSeq(deliver(tamper), true);
		return runSeq(deliver(false), true);
	}

	$effect(() => {
		const s = step;
		const t = meddle;
		const st = reduce;
		void runId;
		return untrack(() => play(s, t, st));
	});

	const showKeys = $derived(step === 2 || step === 3 || step === 5);
	const devKeyLit = $derived(step === 5 ? sealing || sealed : step === 2 || step === 3);
	const showCheck = $derived(step >= 6);
</script>

{#snippet file(cx: number)}
	<g class="mover" class:snap={snap || reduce} style="transform: translate({cx}px, 72px)">
		<rect x="-48" y="-34" width="96" height="66" rx="6" class="doc" />
		<text x="-40" y="-20" class="doc-name">{tx.fileName}</text>
		<line x1="-48" y1="-14" x2="48" y2="-14" class="doc-line" />
		<text x="-40" y="-2" class="doc-text">{tx.lines[0]}</text>
		<text x="-40" y="10" class="doc-text" class:changed={line !== 'orig'}>{secondLine}</text>
		<text x="-40" y="22" class="doc-text">{tx.lines[2]}</text>
		{#if sealed}
			<g in:fade={{ duration: 220 }}>
				<circle cx="42" cy="28" r="11" class="seal" />
				<path d="M37 28 L41 32 L48 24" class="seal-mark" />
			</g>
		{/if}
	</g>
{/snippet}

{#snippet visual(i: number)}
	<div class="vis">
		{#if i === last}
			<div class="modes" role="group" aria-label={tx.toggle.label}>
				<span class="cap">{tx.toggle.label}</span>
				<div class="chips">
					<button type="button" class="chip" class:on={!meddle} onclick={() => pick(false)}
						>{tx.toggle.clean}</button
					>
					<button type="button" class="chip" class:on={meddle} onclick={() => pick(true)}
						>{tx.toggle.tampered}</button
					>
				</div>
			</div>
		{/if}

		<svg viewBox="0 0 420 230" class="art" role="img" aria-label="{tx.devLabel}, {tx.userLabel}">
			{#if i === 1}
				<!-- pen on paper next to a signed file -->
				<g in:fade={{ duration: 250 }}>
					<rect x="44" y="40" width="96" height="66" rx="4" class="paper" />
					<rect x="56" y="54" width="60" height="4" rx="2" class="li" />
					<rect x="56" y="64" width="72" height="4" rx="2" class="li" />
					<path d="M58 92 C66 78 72 100 80 86 S94 80 98 92 S112 84 122 90" class="ink" />
					<text x="92" y="126" class="lbl">{tx.penLabel}</text>
					<path d="M160 72 H200 M194 66 L202 72 L194 78" class="arrow" />
					<text x={PEN_FILE} y="126" class="lbl">{tx.digitalLabel}</text>
				</g>
			{:else}
				<line x1="96" y1="72" x2="336" y2="72" class="road" />
				<!-- developer at a laptop -->
				<g>
					<rect x="20" y="40" width="72" height="48" rx="5" class="shell" />
					<rect x="25" y="45" width="62" height="38" rx="2" class="screen" />
					<rect x="31" y="52" width="34" height="4" rx="2" class="bar" />
					<rect x="31" y="61" width="46" height="3" rx="1.5" class="bar soft" />
					<rect x="31" y="68" width="40" height="3" rx="1.5" class="bar soft" />
					<path d="M12 90 H100 L95 96 H17 Z" class="base" />
					<text x="56" y="114" class="lbl">{tx.devLabel}</text>
				</g>
				<Phone
					x={375}
					y={72}
					label={tx.userLabel}
					lit={mark === 'ok' ? 'var(--color-grass)' : mark === 'bad' ? 'var(--color-danger)' : ''}
				>
					{#if mark}
						<g in:fade={{ duration: 200 }}>
							<circle r="11" class="mark-bg" class:bad={mark === 'bad'} />
							{#if mark === 'ok'}
								<path d="M-5 0 L-1 4 L6 -4" class="mark-ln" />
							{:else}
								<path d="M-4 -4 L4 4 M4 -4 L-4 4" class="mark-ln" />
							{/if}
						</g>
					{/if}
				</Phone>
			{/if}

			{#if attacker}
				<g in:fade={{ duration: 200 }}>
					<line x1={MID} y1="106" x2={MID} y2="150" class="tap" />
					<Person x={MID} y={178} label={tx.attackerLabel} sneaky />
				</g>
			{/if}

			{#if showKeys}
				<g in:fade={{ duration: 220 }}>
					<circle cx="56" cy="150" r="20" class="halo" class:on={devKeyLit} />
					<Key x={56} y={150} size={1.3} tone="var(--color-grass)" />
					<text x="56" y="186" class="lbl key">{tx.privateKey}</text>
					{#if step !== 5}
						<Key x={375} y={160} size={1.3} tone="var(--color-brand)" />
						<text x="375" y="190" class="lbl brand">{tx.publicKey}</text>
					{/if}
				</g>
			{/if}
			{#if step === 3}
				<text x="210" y="218" class="rule">{tx.rule}</text>
			{/if}

			{#if fpShown}
				<g in:fade={{ duration: 220 }} class="fp" class:sealing>
					<rect x={fx - 46} y="114" width="92" height="34" rx="6" class="fp-box" />
					<text x={fx} y="127" class="fp-lbl">{tx.fingerprintLabel}</text>
					<text x={fx} y="142" class="fp-val" class:changed={line !== 'orig'}>{fileFp}</text>
				</g>
			{/if}

			{#if showCheck}
				<g transform="translate(274 140)">
					{#if rows >= 1}
						<g in:fade={{ duration: 200 }}>
							<text x="0" y="12" class="row-lbl">{tx.check.fromSig}</text>
							<text x="140" y="12" class="row-val">{sealFp}</text>
						</g>
					{/if}
					{#if rows >= 2}
						<g in:fade={{ duration: 200 }}>
							<text x="0" y="32" class="row-lbl">{tx.check.fromFile}</text>
							<text x="140" y="32" class="row-val" class:bad={!verdictOk}>{fileFp}</text>
						</g>
					{/if}
					{#if rows >= 3}
						<text x="70" y="58" class="verdict" class:bad={!verdictOk} in:fade={{ duration: 200 }}
							>{verdictOk ? tx.check.ok : tx.check.bad}</text
						>
					{/if}
				</g>
			{/if}

			{@render file(fx)}
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
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.art {
		width: 100%;
		max-width: 460px;
		height: auto;
		overflow: visible;
	}
	.modes {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.cap {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.chips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.chip {
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 6px 14px;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-ink);
		transition:
			border-color 0.2s,
			background 0.2s;
	}
	.chip:hover {
		border-color: var(--color-brand);
	}
	.chip.on {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
		color: var(--color-brand);
	}

	.road {
		stroke: var(--color-line);
		stroke-width: 4;
		stroke-linecap: round;
	}
	.tap {
		stroke: var(--color-danger);
		stroke-width: 2;
		opacity: 0.5;
	}
	.shell {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-width: 2;
	}
	.screen {
		fill: var(--color-paper);
	}
	.base {
		fill: var(--color-ink);
	}
	.bar {
		fill: var(--color-grass);
		opacity: 0.7;
	}
	.bar.soft {
		fill: var(--color-line);
		opacity: 1;
	}
	.lbl {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-muted);
		text-anchor: middle;
	}
	.lbl.key {
		fill: var(--color-grass);
	}
	.lbl.brand {
		fill: var(--color-brand);
	}
	.rule {
		font-size: 13px;
		font-weight: 700;
		fill: var(--color-grass);
		text-anchor: middle;
	}
	.paper {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.li {
		fill: var(--color-line);
	}
	.ink {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.arrow {
		fill: none;
		stroke: var(--color-muted);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.mover {
		transition: transform 1.3s ease-in-out;
	}
	.mover.snap {
		transition: none;
	}
	.doc {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.8;
	}
	.doc-name {
		font-size: 9px;
		font-weight: 800;
		fill: var(--color-ink);
	}
	.doc-line {
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.doc-text {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 7.5px;
		fill: var(--color-muted);
	}
	.doc-text.changed {
		fill: var(--color-danger);
		font-weight: 700;
	}
	.seal {
		fill: var(--color-amber);
		stroke: var(--color-card);
		stroke-width: 2;
	}
	.seal-mark,
	.mark-ln {
		fill: none;
		stroke: var(--color-card);
		stroke-width: 2.4;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.mark-bg {
		fill: var(--color-grass);
	}
	.mark-bg.bad {
		fill: var(--color-danger);
	}
	.halo {
		fill: var(--color-grass-soft);
		opacity: 0;
		transition: opacity 0.3s;
	}
	.halo.on {
		opacity: 1;
	}
	.fp {
		transition:
			transform 0.9s ease,
			opacity 0.9s ease;
	}
	.fp.sealing {
		transform: translate(36px, -34px) scale(0.4);
		transform-box: fill-box;
		transform-origin: center;
		opacity: 0;
	}
	.fp-box {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 1.5;
	}
	.fp-lbl {
		font-size: 9px;
		font-weight: 700;
		fill: var(--color-muted);
		text-anchor: middle;
	}
	.fp-val,
	.row-val {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-ink);
		text-anchor: middle;
	}
	.fp-val.changed,
	.row-val.bad {
		fill: var(--color-danger);
	}
	.row-val {
		text-anchor: end;
	}
	.row-lbl {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.verdict {
		font-size: 12px;
		font-weight: 800;
		fill: var(--color-grass);
		text-anchor: middle;
	}
	.verdict.bad {
		fill: var(--color-danger);
	}
	@media (prefers-reduced-motion: reduce) {
		.fp,
		.halo {
			transition: none;
		}
	}
</style>
