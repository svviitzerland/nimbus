<script lang="ts">
	// Guided MFA. An attacker's laptop on the left already holds your password, your phone sits on
	// the right with a live authenticator code. The beats play by themselves, he walks straight in
	// with MFA off, gets stuck at the code with MFA on, a security key and the approval spam of
	// 2022 show up in turn. On the last beat the learner may type the phone's code to log in.
	import { untrack } from 'svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { MfaFactor, MfaStatus, MfaText } from '$lib/chapters/security/mfa/types';
	import GuideWrap from './secbasics/GuideWrap.svelte';
	import { startGuided } from './secbasics/guided.svelte';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as MfaText);
	startGuided(() => {
		onshow?.(true);
		oncomplete?.();
	});

	const last = $derived(tx.steps.length - 1);
	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const active = $derived(Math.max(0, Math.min(peek ?? beat, last)));

	type Scene =
		| 'stolen'
		| 'off'
		| 'factors'
		| 'atm'
		| 'app'
		| 'on'
		| 'ingat'
		| 'key'
		| 'push'
		| 'you';
	const SCENES: Scene[] = [
		'stolen',
		'off',
		'factors',
		'atm',
		'app',
		'on',
		'ingat',
		'key',
		'push',
		'you'
	];
	const scene = $derived(SCENES[active] ?? 'stolen');

	// the authenticator, a fresh random code every 30 seconds (the first one runs out quickly so
	// the change is easy to spot)
	let code = $state('000000');
	let left = $state(30);
	const fresh = () => String(Math.floor(Math.random() * 1_000_000)).padStart(6, '0');
	$effect(() => {
		code = fresh();
		left = 9;
		const t = setInterval(() => {
			left -= 1;
			if (left <= 0) {
				code = fresh();
				left = 30;
			}
		}, 1000);
		return () => clearInterval(t);
	});

	let status = $state<MfaStatus>('idle');
	let guess = $state('');
	let prompts = $state(0);
	let approved = $state(false);
	let typed = $state('');
	let reduce = $state(false);
	$effect(() => {
		reduce = prefersReducedMotion();
	});

	const GUESSES = ['481902', '113377', '650218'];

	function play(sc: Scene, still: boolean) {
		guess = '';
		prompts = 0;
		approved = false;
		typed = '';
		if (sc === 'off') {
			if (still) {
				status = 'taken';
				return;
			}
			return runSeq(
				[
					[1500, () => (status = 'idle')],
					[1200, () => (status = 'checking')],
					[3600, () => (status = 'taken')]
				],
				true
			);
		}
		if (sc === 'on') {
			if (still) {
				status = 'locked';
				return;
			}
			return runSeq(
				[
					[
						1400,
						() => {
							status = 'idle';
							guess = '';
						}
					],
					[1100, () => (status = 'checking')],
					[1700, () => (status = 'askCode')],
					...GUESSES.map(
						(g): SeqStep => [
							950,
							() => {
								status = 'guessing';
								guess = g;
							}
						]
					),
					[3400, () => (status = 'locked')]
				],
				true
			);
		}
		if (sc === 'push') {
			if (still) {
				prompts = 3;
				approved = true;
				status = 'taken';
				return;
			}
			return runSeq(
				[
					[
						1200,
						() => {
							status = 'push';
							prompts = 0;
							approved = false;
						}
					],
					[900, () => (prompts = 1)],
					[900, () => (prompts = 2)],
					[1500, () => (prompts = 3)],
					[
						3600,
						() => {
							approved = true;
							status = 'taken';
						}
					]
				],
				true
			);
		}
		status = sc === 'you' ? 'yourTurn' : 'idle';
	}

	$effect(() => {
		const sc = scene;
		const still = reduce;
		return untrack(() => play(sc, still));
	});

	function submit(e: SubmitEvent) {
		e.preventDefault();
		const digits = typed.replace(/\D/g, '');
		if (!digits) return;
		if (digits === code) {
			status = 'welcome';
			onstate?.('you');
		} else {
			status = 'wrong';
			onstate?.('wrongCode');
		}
	}

	const fmt = (c: string) => `${c.slice(0, 3)} ${c.slice(3)}`;
	const showCode = $derived(
		status === 'askCode' ||
			status === 'guessing' ||
			status === 'locked' ||
			status === 'yourTurn' ||
			status === 'wrong'
	);
	const codeValue = $derived(
		status === 'guessing' || status === 'locked'
			? fmt(guess || GUESSES[2])
			: scene === 'you'
				? typed.replace(/\D/g, '').slice(0, 6)
				: ''
	);
	const bad = $derived(
		status === 'taken' ||
			status === 'guessing' ||
			status === 'locked' ||
			status === 'wrong' ||
			status === 'push'
	);
	const statusLine = $derived(tx.status[status].replace('{code}', fmt(guess)));
	const ringLen = 2 * Math.PI * 11;

	const FX: Record<MfaFactor, number> = { know: 74, have: 210, are: 346 };
	const FACTORS: MfaFactor[] = ['know', 'have', 'are'];
	const factorsOn = $derived(
		scene === 'factors' || scene === 'atm' || scene === 'ingat' || scene === 'key'
	);
	function lit(f: MfaFactor): boolean {
		if (scene === 'factors') return true;
		if (scene === 'key') return f === 'have';
		return f !== 'are';
	}
	function exOf(f: MfaFactor): string {
		if (scene === 'atm' && f !== 'are') return tx.atm[f];
		if (scene === 'key' && f === 'have') return tx.keyLabel;
		return tx.factors[f].ex;
	}
</script>

{#snippet visual(s: number)}
	<div class="vis">
		{#if s === last}
			<form class="try" onsubmit={submit}>
				<label for="mfa-code">{tx.codeHint}</label>
				<div class="row">
					<input
						id="mfa-code"
						type="text"
						inputmode="numeric"
						autocomplete="one-time-code"
						maxlength="7"
						placeholder="000 000"
						bind:value={typed}
					/>
					<button type="submit">{tx.submitBtn}</button>
				</div>
			</form>
		{/if}

		<svg viewBox="0 0 420 262" class="scene" role="img" aria-label={tx.title}>
			<!-- the laptop -->
			<rect x="10" y="20" width="220" height="142" rx="11" class="shell" />
			<rect x="18" y="28" width="204" height="126" rx="6" class="screen" />
			<path d="M0 164 H240 L230 176 H10 Z" class="base" />
			<text x="30" y="44" class="title">{tx.loginTitle}</text>
			{#if scene !== 'stolen'}
				<g class="chip" class:off={s <= 1}>
					<rect x="150" y="34" width="62" height="15" rx="7.5" />
					<text x="181" y="45">{s <= 1 ? tx.mfaOffChip : tx.mfaOnChip}</text>
				</g>
			{/if}

			{#if status === 'taken' || status === 'welcome'}
				<g class="big" class:good={status === 'welcome'}>
					<circle cx="120" cy="86" r="18" />
					{#if status === 'welcome'}
						<path d="M111 86 l6 6 l11 -12" class="mark" />
					{:else}
						<path d="M112 78 L128 94 M128 78 L112 94" class="mark" />
					{/if}
					<text x="120" y="128">{statusLine}</text>
				</g>
			{:else}
				<rect x="30" y="54" width="180" height="17" rx="5" class="field" />
				<text x="37" y="66" class="val">{tx.emailValue}</text>
				<rect x="30" y="76" width="180" height="17" rx="5" class="field" />
				<text x="37" y="89" class="val dots">••••••••••</text>
				{#if showCode}
					<rect x="30" y="98" width="180" height="17" rx="5" class="field" class:hot={bad} />
					{#if codeValue}
						<text x="37" y="110" class="val mono" class:badt={bad}>{codeValue}</text>
					{:else}
						<text x="37" y="110" class="val faint">{tx.codeField}</text>
					{/if}
				{/if}
				<text x="120" y="140" class="status" class:badt={bad}>{statusLine}</text>
			{/if}

			{#if scene === 'stolen' || scene === 'off'}
				<g class="stolen">
					<rect x="60" y="2" width="120" height="17" rx="8.5" />
					<text x="120" y="14">{tx.stolenChip}</text>
				</g>
			{/if}
			<text x="120" y="194" class="label">{scene === 'you' ? tx.youLabel : tx.attackerLabel}</text>

			<!-- a USB security key, on the Google beat -->
			{#if scene === 'key'}
				<g class="usb">
					<rect x="248" y="98" width="34" height="20" rx="6" class="usb-body" />
					<rect x="282" y="102" width="12" height="12" rx="2" class="usb-plug" />
					<circle cx="262" cy="108" r="5" class="usb-touch" />
				</g>
			{/if}

			<!-- the phone -->
			<g class="phone" class:hot={scene === 'app' || scene === 'you' || scene === 'push'}>
				<rect x="300" y="16" width="88" height="166" rx="15" class="shell" />
				<rect x="306" y="30" width="76" height="138" rx="8" class="screen" />
				<rect x="334" y="21" width="20" height="4" rx="2" class="notch" />
			</g>
			{#if scene === 'push'}
				{#each [0, 1, 2] as k (k)}
					{#if prompts > k}
						<g class="prompt" class:yes={approved && k === 2}>
							<rect x="310" y={40 + k * 40} width="68" height="34" rx="7" class="p-card" />
							<text x="344" y={53 + k * 40} class="p-text">{tx.approvePrompt}</text>
							<rect x="314" y={58 + k * 40} width="28" height="11" rx="5.5" class="p-no" />
							<text x="328" y={66 + k * 40} class="p-btn">{tx.approveNo}</text>
							<rect x="346" y={58 + k * 40} width="28" height="11" rx="5.5" class="p-yes" />
							<text x="360" y={66 + k * 40} class="p-btn yes-t">{tx.approveYes}</text>
						</g>
					{/if}
				{/each}
			{:else}
				<text x="344" y="50" class="app">{tx.appName}</text>
				<text x="344" y="63" class="acct">{tx.appAccount}</text>
				<text x="344" y="98" class="code">{fmt(code)}</text>
				<circle cx="344" cy="132" r="11" class="ring-bg" />
				<circle
					cx="344"
					cy="132"
					r="11"
					class="ring"
					stroke-dasharray={ringLen}
					stroke-dashoffset={ringLen * (1 - left / 30)}
					transform="rotate(-90 344 132)"
				/>
				<text x="344" y="135.5" class="secs">{left}</text>
			{/if}
			<text x="344" y="194" class="label">{tx.phoneLabel}</text>

			<!-- the three kinds of proof -->
			{#if factorsOn}
				{#each FACTORS as f (f)}
					{@const x = FX[f]}
					<g class="factor" class:lit={lit(f)}>
						<rect x={x - 62} y="210" width="124" height="44" rx="12" class="f-box" />
						{#if f === 'know'}
							<path
								d="M{x -
									48} 222 h20 a5 5 0 0 1 5 5 v8 a5 5 0 0 1 -5 5 h-12 l-6 5 v-5 h-2 a5 5 0 0 1 -5 -5 v-8 a5 5 0 0 1 5 -5 z"
								class="f-ico"
							/>
						{:else if f === 'have'}
							<rect x={x - 46} y="219" width="16" height="27" rx="4" class="f-ico" />
						{:else}
							<path
								d="M{x - 46} 242 q0 -18 8 -18 q8 0 8 18 M{x - 42} 242 q0 -12 4 -12 q4 0 4 12 M{x -
									38} 236 v6"
								class="f-ico line"
							/>
						{/if}
						<text x={x - 22} y="229" class="f-name">{tx.factors[f].name}</text>
						<text x={x - 22} y="245" class="f-ex">{exOf(f)}</text>
					</g>
				{/each}
				{#if scene === 'ingat'}
					<text x="142" y="238" class="plus">+</text>
				{/if}
			{/if}
		</svg>
	</div>
{/snippet}

<GuideWrap steps={tx.steps} {active} onselect={(k) => (peek = k)} {visual} />

<style>
	.vis {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.scene {
		width: 100%;
		max-width: 420px;
		height: auto;
		overflow: visible;
	}
	.try {
		display: flex;
		width: min(100%, 300px);
		flex-direction: column;
		gap: 4px;
	}
	.try label {
		font-size: 11px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.try .row {
		display: flex;
		gap: 6px;
	}
	.try input {
		min-width: 0;
		flex: 1;
		border: 1px solid var(--color-line);
		border-radius: 12px;
		background: var(--color-card);
		padding: 9px 12px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 15px;
		letter-spacing: 0.12em;
		color: var(--color-ink);
		outline: none;
	}
	.try input:focus {
		border-color: var(--color-brand);
	}
	.try button {
		border-radius: 12px;
		background: var(--color-brand);
		padding: 0 16px;
		font-size: 13.5px;
		font-weight: 700;
		color: #fff;
	}

	.shell {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.screen {
		fill: var(--color-paper);
	}
	.base,
	.notch {
		fill: var(--color-line);
	}
	.phone .shell {
		transition: stroke 0.3s;
	}
	.phone.hot .shell {
		stroke: var(--color-brand);
		stroke-width: 2.5;
	}
	.title {
		font-size: 9.5px;
		font-weight: 800;
		fill: var(--color-ink);
	}
	.chip rect {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.chip text {
		font-size: 8px;
		font-weight: 800;
		text-anchor: middle;
		fill: var(--color-grass);
	}
	.chip.off rect {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.chip.off text {
		fill: var(--color-danger);
	}
	.field {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.field.hot {
		stroke: var(--color-danger);
	}
	.val {
		font-size: 8.5px;
		fill: var(--color-muted);
	}
	.val.dots {
		font-size: 9px;
		letter-spacing: 0.1em;
	}
	.val.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.val.faint {
		fill: var(--color-faint);
	}
	.status {
		font-size: 8.8px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-muted);
	}
	.badt {
		fill: var(--color-danger) !important;
	}
	.big circle {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
		stroke-width: 2;
	}
	.big .mark {
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 3;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.big text {
		font-size: 9.5px;
		font-weight: 800;
		text-anchor: middle;
		fill: var(--color-danger);
	}
	.big.good circle {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.big.good .mark {
		stroke: var(--color-grass);
	}
	.big.good text {
		fill: var(--color-grass);
	}
	.stolen rect {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.stolen text {
		font-size: 8.5px;
		font-weight: 800;
		text-anchor: middle;
		fill: var(--color-danger);
	}
	.label {
		font-size: 10.5px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-muted);
	}

	.app {
		font-size: 8.5px;
		font-weight: 800;
		text-anchor: middle;
		fill: var(--color-ink);
	}
	.acct {
		font-size: 7.5px;
		text-anchor: middle;
		fill: var(--color-faint);
	}
	.code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 15px;
		font-weight: 800;
		letter-spacing: 0.04em;
		text-anchor: middle;
		fill: var(--color-brand);
	}
	.ring-bg {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 3;
	}
	.ring {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 3;
		stroke-linecap: round;
		transition: stroke-dashoffset 1s linear;
	}
	.secs {
		font-size: 8.5px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-muted);
	}
	.p-card {
		fill: var(--color-card);
		stroke: var(--color-line);
	}
	.p-text {
		font-size: 7.6px;
		font-weight: 800;
		text-anchor: middle;
		fill: var(--color-ink);
	}
	.p-no {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.p-yes {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
	}
	.p-btn {
		font-size: 6.4px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-muted);
	}
	.p-btn.yes-t {
		fill: var(--color-brand);
	}
	.prompt.yes .p-yes {
		fill: var(--color-danger);
		stroke: var(--color-danger);
	}
	.prompt.yes .yes-t {
		fill: #fff;
	}
	.usb-body {
		fill: var(--color-ink);
		opacity: 0.85;
	}
	.usb-plug {
		fill: var(--color-faint);
	}
	.usb-touch {
		fill: var(--color-amber);
	}

	.f-box {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.f-ico {
		fill: var(--color-faint);
	}
	.f-ico.line {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.f-name {
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		fill: var(--color-faint);
	}
	.f-ex {
		font-size: 10px;
		fill: var(--color-faint);
	}
	.factor.lit .f-box {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.factor.lit .f-ico {
		fill: var(--color-grass);
	}
	.factor.lit .f-ico.line {
		fill: none;
		stroke: var(--color-grass);
	}
	.factor.lit .f-name {
		fill: var(--color-grass);
	}
	.factor.lit .f-ex {
		fill: var(--color-ink);
	}
	.plus {
		font-size: 20px;
		font-weight: 800;
		text-anchor: middle;
		fill: var(--color-grass);
	}

	@media (prefers-reduced-motion: no-preference) {
		.prompt {
			animation: drop 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.3) both;
		}
		.usb-touch {
			animation: glow 1.6s ease-in-out infinite;
		}
		.stolen {
			animation: glow 2.4s ease-in-out infinite;
		}
	}
	@keyframes drop {
		from {
			opacity: 0;
			transform: translateY(-8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@keyframes glow {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.45;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ring,
		.f-box,
		.phone .shell {
			transition: none;
		}
	}
</style>
