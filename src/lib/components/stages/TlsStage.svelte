<script lang="ts">
	// A guided TLS lesson. Your laptop and the nimbus.com server play the handshake by themselves,
	// one step per beat (hello, certificate, check, session key, secure), and on the café beat an
	// impostor slips a self signed certificate in and the browser shows a warning. The only
	// optional play is switching between home and café WiFi on the last beat.
	import { untrack } from 'svelte';
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import Padlock from './crypto/Padlock.svelte';
	import Key from './crypto/Key.svelte';
	import Person from './crypto/Person.svelte';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';
	import type { StageProps } from '$lib/chapters/types';
	import type { TlsText, TlsWifi } from '$lib/chapters/security/tls/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as TlsText);

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

	let wifi = $state<TlsWifi>('home');
	let runId = $state(0);
	function pick(w: TlsWifi) {
		wifi = w;
		runId += 1;
		onstate?.(w);
	}

	const L = 204;
	const R = 316;
	const M = 260;
	type Msg = 'hello' | 'cert' | 'fake' | 'key' | 'data' | 'http' | null;
	let msg = $state<Msg>(null);
	let x = $state(L);
	let snap = $state(true);
	let certShown = $state(false);
	let checks = $state(0);
	let fake = $state(false);
	let keysBoth = $state(false);
	let secure = $state(false);
	let warn = $state(false);
	let cafe = $state(false);

	function reset() {
		msg = null;
		snap = true;
		certShown = false;
		checks = 0;
		fake = false;
		keysBoth = false;
		secure = false;
		warn = false;
		cafe = false;
	}

	/** A message that flies from one end of the wire to the other. */
	function fly(
		m: Msg,
		from: number,
		to: number,
		after: () => void = () => (msg = null)
	): SeqStep[] {
		return [
			[
				60,
				() => {
					snap = true;
					msg = m;
					x = from;
				}
			],
			[60, () => (snap = false)],
			[1400, () => (x = to)],
			[700, after]
		];
	}
	const hello = (): SeqStep[] => fly('hello', L, R);
	const cert = (): SeqStep[] =>
		fly('cert', R, L, () => {
			msg = null;
			certShown = true;
		});
	const check = (): SeqStep[] => [
		[700, () => ((certShown = true), (checks = 0))],
		[800, () => (checks = 1)],
		[800, () => (checks = 2)],
		[1600, () => (checks = 3)]
	];
	const key = (): SeqStep[] => [
		[400, () => (certShown = false)],
		...fly('key', L, R, () => {
			msg = null;
			keysBoth = true;
		}),
		[800, () => {}]
	];
	const data = (): SeqStep[] => [
		[200, () => ((keysBoth = true), (secure = true))],
		...fly('data', L, R),
		...fly('data', R, L)
	];
	const begin = (fn: () => void = () => {}): SeqStep => [
		200,
		() => {
			reset();
			fn();
		}
	];
	const fakeSeq = (): SeqStep[] => [
		begin(() => (cafe = true)),
		...fly('hello', L, M, () => (msg = 'fake')),
		[60, () => (snap = false)],
		[1400, () => (x = L)],
		[
			700,
			() => {
				msg = null;
				fake = true;
				certShown = true;
				checks = 0;
			}
		],
		[700, () => (checks = 1)],
		[700, () => (checks = 2)],
		[1100, () => (checks = 3)],
		[
			4200,
			() => {
				certShown = false;
				warn = true;
			}
		]
	];
	const fullSeq = (): SeqStep[] => [
		begin(),
		...hello(),
		...cert(),
		...check(),
		...key(),
		...data()
	];

	function still(s: number, w: TlsWifi) {
		reset();
		if (s === 2) {
			msg = 'http';
			x = M;
		} else if (s === 3) {
			msg = 'hello';
			x = M;
		} else if (s === 4) {
			msg = 'cert';
			x = M;
		} else if (s === 5) {
			certShown = true;
			checks = 3;
		} else if (s === 6) {
			keysBoth = true;
		} else if (s === 7 || s === 8 || (s === last && w === 'home')) {
			keysBoth = true;
			secure = true;
			msg = 'data';
			x = M;
		} else if (s === 9 || s === last) {
			cafe = true;
			warn = true;
		}
	}

	function play(s: number, w: TlsWifi, stillOnly: boolean): (() => void) | undefined {
		if (stillOnly || s <= 1) {
			still(s, w);
			return;
		}
		if (s === 2) return runSeq([begin(), ...fly('http', L, R)], true);
		if (s === 3) return runSeq([begin(), ...hello()], true);
		if (s === 4) return runSeq([begin(), ...cert()], true);
		if (s === 5) return runSeq([begin(), ...check()], true);
		if (s === 6) return runSeq([begin(), ...key()], true);
		if (s === 7) return runSeq([begin(), ...data()], true);
		if (s === 9 || (s === last && w === 'cafe')) return runSeq(fakeSeq(), true);
		return runSeq(fullSeq(), true);
	}

	$effect(() => {
		const s = step;
		const w = wifi;
		const st = reduce;
		void runId;
		return untrack(() => play(s, w, st));
	});

	const FAKE_OK = [true, false, true];
	const tunnel = $derived(step === 2);
	const history = $derived(step === 1);
</script>

{#snippet visual(i: number)}
	<div class="vis">
		{#if i === last}
			<div class="modes" role="group" aria-label={tx.wifi.label}>
				<span class="cap">{tx.wifi.label}</span>
				<div class="chips">
					<button type="button" class="chip" class:on={wifi === 'home'} onclick={() => pick('home')}
						>{tx.wifi.home}</button
					>
					<button type="button" class="chip" class:on={wifi === 'cafe'} onclick={() => pick('cafe')}
						>{tx.wifi.cafe}</button
					>
				</div>
			</div>
		{/if}

		<svg viewBox="0 0 420 224" class="art" role="img" aria-label="{tx.youLabel}, {tx.serverLabel}">
			<!-- the wire, and the tunnel around it on the HTTPS beat -->
			{#if tunnel}
				<rect x="182" y="66" width="160" height="32" rx="16" class="tunnel" in:fade />
				<text x="262" y="60" class="wire-label">TLS</text>
			{/if}
			<line x1="182" y1="82" x2="340" y2="82" class="wire" class:lit={secure} />
			{#if cafe}
				<line x1={M} y1="82" x2={M} y2="150" class="wire bad" />
				<Person x={M} y={176} label={tx.attackerLabel} sneaky />
			{/if}

			<!-- laptop -->
			<rect x="8" y="16" width="174" height="128" rx="10" class="shell" />
			<rect x="16" y="24" width="158" height="112" rx="5" class="screen" class:warn />
			<rect x="24" y="31" width="142" height="15" rx="7.5" class="addr" />
			{#if secure}
				<Padlock x={34} y={37} size={0.42} tone="var(--color-grass)" />
			{:else if warn}
				<path d="M34 33 L40 44 H28 Z" class="tri" />
			{/if}
			<text x="46" y="42" class="url">nimbus.com</text>

			{#if warn}
				<g in:fade={{ duration: 200 }}>
					<path d="M95 58 L113 90 H77 Z" class="tri big" />
					<text x="95" y="86" class="bang">!</text>
					<text x="95" y="108" class="w-title">{tx.warnTitle}</text>
					<text x="95" y="124" class="w-body">{tx.warnBody}</text>
				</g>
			{:else if certShown}
				<g in:fade={{ duration: 200 }}>
					<rect x="28" y="54" width="134" height="76" rx="6" class="card" class:bad={fake} />
					<text x="38" y="70" class="c-head">{tx.certHeading}</text>
					{#each tx.checks as c, k (k)}
						{@const ok = !fake || FAKE_OK[k]}
						<text x="38" y={88 + k * 15} class="c-row">{c}</text>
						{#if checks > k}
							<text x="152" y={88 + k * 15} class="mark" class:bad={!ok} in:fade={{ duration: 150 }}
								>{ok ? '✓' : '✗'}</text
							>
						{/if}
					{/each}
				</g>
			{:else if secure}
				<text x="28" y="68" class="p-title">nimbus.com</text>
				<rect x="28" y="78" width="120" height="6" rx="3" class="bar" />
				<rect x="28" y="90" width="96" height="6" rx="3" class="bar" />
				<rect x="28" y="106" width="44" height="12" rx="6" class="btn" />
			{:else}
				<rect x="28" y="60" width="90" height="8" rx="4" class="bar faint" />
				<rect x="28" y="76" width="130" height="6" rx="3" class="bar faint" />
				<rect x="28" y="88" width="110" height="6" rx="3" class="bar faint" />
			{/if}
			<path d="M0 146H190L182 156H8Z" class="base" />
			<text x="95" y="174" class="lbl">{tx.youLabel}</text>

			<!-- server rack -->
			<rect x="344" y="22" width="68" height="120" rx="9" class="shell" />
			{#each [32, 68, 104] as y (y)}
				<rect x="351" {y} width="54" height="28" rx="4" class="unit" />
				<circle cx="361" cy={y + 14} r="3.2" class="led" />
				<line x1="372" y1={y + 11} x2="396" y2={y + 11} class="vent" />
				<line x1="372" y1={y + 18} x2="390" y2={y + 18} class="vent" />
			{/each}
			<text x="378" y="160" class="lbl">{tx.serverLabel}</text>

			<!-- the shared session key on both sides -->
			{#if keysBoth}
				<g in:fade={{ duration: 250 }}>
					<Key x={150} y={196} />
					<Key x={378} y={186} />
					<text x="150" y="216" class="lbl small">{tx.sessionKey}</text>
					<text x="378" y="206" class="lbl small">{tx.sessionKey}</text>
				</g>
			{/if}

			<!-- the history line on the second beat -->
			{#if history}
				<g in:fade={{ duration: 250 }}>
					<line x1="200" y1="196" x2="404" y2="196" class="wire" />
					{#each tx.history as h, k (k)}
						<circle
							cx={210 + k * 62}
							cy="196"
							r="5"
							class="hdot"
							class:now={k === tx.history.length - 1}
						/>
						<text x={210 + k * 62} y="184" class="h-name">{h.name}</text>
						<text x={210 + k * 62} y="214" class="h-year">{h.year}</text>
					{/each}
				</g>
			{/if}

			<!-- the message on the wire -->
			{#if msg}
				<g class="mover" class:snap={snap || reduce} style="transform: translate({x}px, 82px)">
					{#if msg === 'cert' || msg === 'fake'}
						<rect
							x="-24"
							y="-16"
							width="48"
							height="32"
							rx="5"
							class="card"
							class:bad={msg === 'fake'}
						/>
						<rect
							x="-18"
							y="-10"
							width="12"
							height="14"
							rx="2"
							class="photo"
							class:bad={msg === 'fake'}
						/>
						<rect x="-2" y="-9" width="20" height="4" rx="2" class="bar" />
						<rect x="-2" y="-1" width="14" height="4" rx="2" class="bar" />
						<text y="13" class="chip-text">{tx.chips.cert}</text>
					{:else if msg === 'key'}
						<rect x="-20" y="-14" width="40" height="28" rx="5" class="env" />
						<Padlock x={0} y={-1} size={0.7} />
					{:else if msg === 'data'}
						<rect x="-26" y="-12" width="52" height="24" rx="5" class="env scr" />
						<text y="4" class="chip-text mono">x7#Qz9</text>
					{:else}
						<rect x="-26" y="-12" width="52" height="24" rx="5" class="env" />
						<text y="4" class="chip-text">{msg === 'http' ? 'HTTP' : tx.chips.hello}</text>
					{/if}
				</g>
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

	.wire {
		stroke: var(--color-line);
		stroke-width: 3;
		stroke-linecap: round;
		transition: stroke 0.3s;
	}
	.wire.lit {
		stroke: var(--color-grass);
	}
	.wire.bad {
		stroke: var(--color-danger);
		opacity: 0.5;
		stroke-width: 2;
	}
	.tunnel {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.5;
	}
	.wire-label {
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.08em;
		fill: var(--color-brand);
		text-anchor: middle;
	}
	.shell {
		fill: var(--color-card);
		stroke: var(--color-ink);
		stroke-width: 2;
	}
	.screen {
		fill: var(--color-paper);
		transition: fill 0.3s;
	}
	.screen.warn {
		fill: var(--color-danger-soft);
	}
	.addr {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.url {
		font-size: 9.5px;
		font-weight: 600;
		fill: var(--color-muted);
	}
	.base {
		fill: var(--color-ink);
	}
	.lbl {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-muted);
		text-anchor: middle;
	}
	.lbl.small {
		font-size: 9.5px;
		fill: var(--color-amber);
	}
	.unit {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.led {
		fill: var(--color-grass);
	}
	.vent {
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.bar {
		fill: var(--color-brand);
		opacity: 0.45;
	}
	.bar.faint {
		fill: var(--color-line);
		opacity: 1;
	}
	.btn {
		fill: var(--color-brand);
	}
	.p-title {
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.card {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 1.8;
	}
	.card.bad {
		stroke: var(--color-danger);
	}
	.photo {
		fill: var(--color-brand-soft);
	}
	.photo.bad {
		fill: var(--color-danger-soft);
	}
	.c-head {
		font-size: 10.5px;
		font-weight: 800;
		fill: var(--color-ink);
	}
	.c-row {
		font-size: 9.5px;
		fill: var(--color-muted);
	}
	.mark {
		font-size: 11px;
		font-weight: 800;
		fill: var(--color-grass);
		text-anchor: end;
	}
	.mark.bad {
		fill: var(--color-danger);
	}
	.tri {
		fill: var(--color-danger);
	}
	.bang {
		font-size: 16px;
		font-weight: 800;
		fill: var(--color-card);
		text-anchor: middle;
	}
	.w-title {
		font-size: 12px;
		font-weight: 800;
		fill: var(--color-danger);
		text-anchor: middle;
	}
	.w-body {
		font-size: 8.5px;
		fill: var(--color-muted);
		text-anchor: middle;
	}
	.env {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.6;
	}
	.env.scr {
		stroke: var(--color-amber);
		fill: var(--color-amber-soft);
	}
	.chip-text {
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-ink);
		text-anchor: middle;
	}
	.chip-text.mono {
		font-family: var(--font-mono, ui-monospace, monospace);
	}
	.mover {
		transition: transform 1.3s ease-in-out;
	}
	.mover.snap {
		transition: none;
	}
	.hdot {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 2;
	}
	.hdot.now {
		fill: var(--color-brand);
	}
	.h-name {
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-ink);
		text-anchor: middle;
	}
	.h-year {
		font-size: 9.5px;
		fill: var(--color-faint);
		text-anchor: middle;
	}
	@media (prefers-reduced-motion: reduce) {
		.wire,
		.screen {
			transition: none;
		}
	}
</style>
