<script lang="ts">
	// Guided SSO and OAuth. One browser window plays the whole "Sign in with Google" flow by itself
	// while Nim tells it. The address bar is the star, it changes from nimbus.com to
	// accounts.google.com and back. Beats show password dominoes, the old bad way, the redirect,
	// the Google login, consent, the token, and one login opening every app at work. On the last
	// beat the learner may remove nimbus.com's access and watch the token stop working.
	import { untrack } from 'svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { SsoScope, SsoText } from '$lib/chapters/security/sso/types';
	import GuideWrap from './secbasics/GuideWrap.svelte';
	import { startGuided } from './secbasics/guided.svelte';
	import { prefersReducedMotion, runSeq, type SeqStep } from './webguide/seq';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as SsoText);
	startGuided(() => {
		onshow?.(true);
		oncomplete?.();
	});

	const last = $derived(tx.steps.length - 1);
	let peek = $state<number | null>(null);
	let revoked = $state(false);
	$effect(() => {
		void beat;
		peek = null;
		revoked = false;
	});
	const active = $derived(Math.max(0, Math.min(peek ?? beat, last)));

	type Scene =
		| 'many'
		| 'sso'
		| 'bad'
		| 'redirect'
		| 'google'
		| 'consent'
		| 'token'
		| 'ingat'
		| 'office'
		| 'revoke';
	const SCENES: Scene[] = [
		'many',
		'sso',
		'bad',
		'redirect',
		'google',
		'consent',
		'token',
		'ingat',
		'office',
		'revoke'
	];
	const scene = $derived(SCENES[active] ?? 'sso');

	type Page = 'nimbus' | 'bad' | 'google' | 'consent' | 'signed';
	let page = $state<Page>('nimbus');
	let cursor = $state(false);
	let click = $state(false);
	let dots = $state(10);
	let next = $state(false);
	let allow = $state(false);
	let reduce = $state(false);
	$effect(() => {
		reduce = prefersReducedMotion();
	});

	function play(sc: Scene, still: boolean) {
		cursor = false;
		click = false;
		dots = 10;
		next = false;
		allow = false;
		if (sc === 'bad') {
			page = 'bad';
			return;
		}
		if (sc === 'redirect') {
			if (still) {
				page = 'google';
				dots = 0;
				return;
			}
			return runSeq(
				[
					[
						1700,
						() => {
							page = 'nimbus';
							cursor = false;
							click = false;
						}
					],
					[1000, () => (cursor = true)],
					[600, () => (click = true)],
					[
						3400,
						() => {
							page = 'google';
							cursor = false;
							click = false;
							dots = 0;
						}
					]
				],
				true
			);
		}
		if (sc === 'google' || sc === 'ingat') {
			page = 'google';
			if (still || sc === 'ingat') {
				next = sc === 'google';
				return;
			}
			const typing = Array.from({ length: 10 }, (_, k): SeqStep => [170, () => (dots = k + 1)]);
			return runSeq(
				[
					[
						700,
						() => {
							dots = 0;
							next = false;
						}
					],
					...typing,
					[2600, () => (next = true)]
				],
				true
			);
		}
		if (sc === 'consent') {
			page = 'consent';
			if (still) {
				allow = true;
				return;
			}
			return runSeq(
				[
					[2000, () => (allow = false)],
					[2400, () => (allow = true)]
				],
				true
			);
		}
		if (sc === 'token' || sc === 'office' || sc === 'revoke') {
			page = 'signed';
			return;
		}
		page = 'nimbus';
	}

	$effect(() => {
		const sc = scene;
		const still = reduce;
		return untrack(() => play(sc, still));
	});

	function revoke() {
		if (revoked) return;
		peek = null;
		revoked = true;
		onstate?.('revoke');
	}

	const URLS: Record<Page, string> = {
		nimbus: 'nimbus.com/login',
		bad: 'nimbus.com/friends',
		google: 'accounts.google.com',
		consent: 'accounts.google.com',
		signed: 'nimbus.com'
	};
	const atGoogle = $derived(page === 'google' || page === 'consent');
	const SCOPES: SsoScope[] = ['name', 'email', 'photo'];
</script>

{#snippet visual(s: number)}
	<div class="vis">
		{#if s === last}
			<button type="button" class="revoke" disabled={revoked} onclick={revoke}>
				{revoked ? tx.revokedNote : tx.revokeBtn}
			</button>
		{/if}

		<svg viewBox="0 0 420 296" class="scene" role="img" aria-label={tx.title}>
			<!-- the browser window -->
			<rect x="10" y="8" width="400" height="240" rx="13" class="win" />
			<path d="M10 44 V21 a13 13 0 0 1 13 -13 H397 a13 13 0 0 1 13 13 V44 Z" class="bar" />
			{#each [28, 42, 56] as x (x)}
				<circle cx={x} cy="26" r="4.5" class="light" />
			{/each}
			<rect
				x="76"
				y="16"
				width="314"
				height="20"
				rx="10"
				class="addr"
				class:google={atGoogle}
				class:hot={scene === 'ingat' || scene === 'redirect'}
			/>
			<g transform="translate(88 21)" class="lock" class:google={atGoogle}>
				<rect x="0" y="4" width="8" height="6.5" rx="1.2" />
				<path d="M1.7 4V2.6a2.3 2.3 0 0 1 4.6 0V4" />
			</g>
			{#key page}
				<text x="102" y="30" class="url" class:google={atGoogle}>{URLS[page]}</text>
			{/key}

			<!-- the page itself -->
			{#if page === 'nimbus'}
				<text x="210" y="78" class="h">{tx.signInTitle}</text>
				<g class="gbtn" class:pulse={scene === 'sso' && !reduce} class:pressed={click}>
					<rect x="110" y="92" width="200" height="32" rx="16" />
					<circle cx="130" cy="108" r="9" class="g-dot" />
					<text x="130" y="112" class="g-letter">G</text>
					<text x="222" y="112.5" class="g-text">{tx.googleBtn}</text>
				</g>
				<text x="210" y="146" class="faint" class:warn={scene === 'many'}>{tx.orPassword}</text>
				<rect x="130" y="156" width="160" height="22" rx="7" class="field" />
				<text x="140" y="171" class="ph">{tx.emailField}</text>
				<rect
					x="130"
					y="184"
					width="160"
					height="22"
					rx="7"
					class="field"
					class:amber={scene === 'many'}
				/>
				<text x="140" y="199" class="ph">{tx.passwordField}</text>
				<g class="cursor" class:on={cursor || click}>
					<path d="M0 0 L0 16 L4.5 12 L8 19 L10.5 18 L7 11 L13 11 Z" />
				</g>
			{:else if page === 'bad'}
				<text x="210" y="84" class="h">{tx.badTitle}</text>
				<rect x="100" y="104" width="220" height="30" rx="8" class="field danger" />
				<text x="114" y="123" class="danger-t">{tx.badField}</text>
				<g transform="translate(296 119)" class="key-ico">
					<circle r="6" />
					<path d="M6 0 H18 M14 0 V5 M18 0 V4" />
				</g>
				<text x="210" y="160" class="faint">{tx.badSub}</text>
				<rect x="170" y="176" width="80" height="24" rx="12" class="btn danger-b" />
			{:else if page === 'google'}
				<text x="210" y="78" class="gword">Google</text>
				<text x="210" y="100" class="h small">{tx.googleTitle}</text>
				<text x="210" y="116" class="faint">{tx.googleSub}</text>
				<rect x="120" y="128" width="180" height="24" rx="7" class="field" />
				<text x="132" y="144" class="val">{tx.googleEmail}</text>
				<rect
					x="120"
					y="160"
					width="180"
					height="24"
					rx="7"
					class="field"
					class:ok={scene === 'ingat'}
				/>
				<text x="132" y="177" class="val dots">{'•'.repeat(dots)}</text>
				<g class="btn-g" class:on={next}>
					<rect x="246" y="196" width="54" height="24" rx="12" />
					<text x="273" y="212">{tx.nextBtn}</text>
				</g>
			{:else if page === 'consent'}
				<text x="210" y="72" class="gword small">Google</text>
				<text x="210" y="94" class="h small">{tx.consentTitle}</text>
				{#each SCOPES as sc, k (sc)}
					<rect x="124" y={108 + k * 24} width="13" height="13" rx="3" class="check" />
					<path d="M127 {115 + k * 24} l3 3 l5 -6" class="tick" />
					<text x="146" y={119 + k * 24} class="val">{tx.scopes[sc]}</text>
				{/each}
				<g class="btn-g" class:on={allow}>
					<rect x="238" y="192" width="62" height="24" rx="12" />
					<text x="269" y="208">{tx.allowBtn}</text>
				</g>
			{:else}
				<circle cx="140" cy="84" r="17" class="avatar" class:gone={revoked} />
				<circle cx="140" cy="79" r="6" class="avatar-head" class:gone={revoked} />
				<path d="M129 95 Q140 84 151 95" class="avatar-body" class:gone={revoked} />
				<text x="166" y="82" class="h left">{revoked ? tx.revokedTitle : tx.welcomeTitle}</text>
				<text x="166" y="98" class="faint left">{revoked ? tx.revokedNote : tx.welcomeSub}</text>
				{#if scene === 'office'}
					{#each tx.apps as app, k (app)}
						{@const x = 126 + k * 62}
						<g class="app-tile" style="animation-delay:{k * 0.35}s">
							<rect {x} y="124" width="48" height="48" rx="12" />
							<path d="M{x + 16} 148 l6 6 l11 -12" class="tick big" />
							<text x={x + 24} y="190" class="app-name">{app}</text>
						</g>
					{/each}
				{:else}
					<rect x="110" y="114" width="200" height="104" rx="11" class="box" />
					<text x="124" y="134" class="cap">{tx.gotTitle}</text>
					<g class="token" class:arrive={scene === 'token' && !reduce} class:dead={revoked}>
						<rect x="124" y="142" width="116" height="24" rx="12" />
						<g transform="translate(138 154)" class="key-ico small">
							<circle r="4.5" />
							<path d="M4.5 0 H13 M10 0 V4" />
						</g>
						<text x="194" y="158">{tx.tokenChip}</text>
						{#if revoked}
							<line x1="128" y1="154" x2="236" y2="154" class="strike" />
						{/if}
					</g>
					<text x="124" y="190" class="val small">{tx.passwordRow}</text>
					<g class="never">
						<rect x="234" y="178" width="64" height="18" rx="9" />
						<text x="266" y="191">{tx.neverTag}</text>
					</g>
					<text x="124" y="210" class="faint left tiny"
						>{tx.scopes.name}, {tx.scopes.email.toLowerCase()}</text
					>
				{/if}
			{/if}

			<!-- the domino row, only on the first beat -->
			{#if scene === 'many'}
				{#each tx.sites as site, k (site)}
					{@const x = 56 + k * 66}
					<g class="domino" class:first={k === 0} style="animation-delay:{k * 0.32}s">
						<rect {x} y="258" width="50" height="32" rx="7" />
						<text x={x + 25} y="278">{site}</text>
					</g>
				{/each}
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
	.revoke {
		border: 1px solid var(--color-danger);
		border-radius: 999px;
		background: var(--color-card);
		padding: 7px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-danger);
		transition: background 0.2s;
	}
	.revoke:hover:not(:disabled) {
		background: var(--color-danger-soft);
	}
	.revoke:disabled {
		border-color: var(--color-line);
		color: var(--color-muted);
		cursor: default;
	}

	.win {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.bar {
		fill: var(--color-paper);
	}
	.light {
		fill: var(--color-line);
	}
	.addr {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
		transition:
			stroke 0.3s,
			fill 0.3s;
	}
	.addr.google {
		fill: var(--color-brand-soft);
	}
	.addr.hot {
		stroke: var(--color-grass);
		stroke-width: 2.5;
	}
	.lock rect {
		fill: var(--color-faint);
	}
	.lock path {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 1.3;
	}
	.lock.google rect {
		fill: var(--color-grass);
	}
	.lock.google path {
		stroke: var(--color-grass);
	}
	.url {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.url.google {
		fill: var(--color-brand);
	}

	.h {
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 600;
		text-anchor: middle;
		fill: var(--color-ink);
	}
	.h.small {
		font-size: 13px;
	}
	.h.left,
	.faint.left {
		text-anchor: start;
	}
	.faint {
		font-size: 10px;
		text-anchor: middle;
		fill: var(--color-faint);
	}
	.faint.tiny {
		font-size: 9px;
	}
	.faint.warn {
		fill: var(--color-amber);
		font-weight: 700;
	}
	.field {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.field.amber {
		stroke: var(--color-amber);
		fill: var(--color-amber-soft);
	}
	.field.danger {
		stroke: var(--color-danger);
		fill: var(--color-danger-soft);
	}
	.field.ok {
		stroke: var(--color-grass);
		stroke-width: 2;
	}
	.ph {
		font-size: 9.5px;
		fill: var(--color-faint);
	}
	.val {
		font-size: 10px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.val.small {
		font-size: 9.5px;
		fill: var(--color-muted);
	}
	.val.dots {
		font-size: 12px;
		letter-spacing: 0.08em;
	}
	.danger-t {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-danger);
	}
	.btn.danger-b {
		fill: var(--color-danger);
		opacity: 0.85;
	}
	.key-ico circle,
	.key-ico path {
		fill: none;
		stroke: var(--color-danger);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.key-ico.small circle,
	.key-ico.small path {
		stroke: var(--color-brand);
		stroke-width: 1.6;
	}

	.gbtn rect {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 1.8;
		transition: fill 0.2s;
	}
	.gbtn.pressed rect {
		fill: var(--color-brand-soft);
	}
	.g-dot {
		fill: var(--color-brand);
	}
	.g-letter {
		font-size: 11px;
		font-weight: 800;
		text-anchor: middle;
		fill: #fff;
	}
	.g-text {
		font-size: 11.5px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-brand);
	}
	.gword {
		font-family: var(--font-display);
		font-size: 20px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-brand);
	}
	.gword.small {
		font-size: 13px;
	}
	.btn-g rect {
		fill: var(--color-line);
		transition: fill 0.3s;
	}
	.btn-g text {
		font-size: 10.5px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-muted);
	}
	.btn-g.on rect {
		fill: var(--color-brand);
	}
	.btn-g.on text {
		fill: #fff;
	}
	.check {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 1.4;
	}
	.tick {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.tick.big {
		stroke-width: 3;
	}
	.cursor {
		opacity: 0;
		transform: translate(340px, 226px);
		transition:
			transform 0.9s cubic-bezier(0.45, 0, 0.3, 1),
			opacity 0.3s;
	}
	.cursor.on {
		opacity: 1;
		transform: translate(236px, 106px);
	}
	.cursor path {
		fill: var(--color-ink);
		stroke: var(--color-card);
		stroke-width: 1.2;
	}

	.avatar {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.6;
	}
	.avatar-head {
		fill: var(--color-brand);
	}
	.avatar-body {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.gone {
		opacity: 0.3;
	}
	.box {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.cap {
		font-size: 8.5px;
		font-weight: 800;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		fill: var(--color-faint);
	}
	.token rect {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.5;
	}
	.token text {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 9.5px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-brand);
	}
	.token.dead rect {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.token.dead text {
		fill: var(--color-danger);
	}
	.token.dead .key-ico.small circle,
	.token.dead .key-ico.small path {
		stroke: var(--color-danger);
	}
	.strike {
		stroke: var(--color-danger);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.never rect {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.never text {
		font-size: 9.5px;
		font-weight: 800;
		text-anchor: middle;
		fill: var(--color-grass);
	}
	.app-tile rect {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 1.6;
	}
	.app-name {
		font-size: 10.5px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-ink);
	}
	.domino rect {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 1.5;
	}
	.domino text {
		font-size: 10px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-muted);
	}
	.domino.first rect {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.domino.first text {
		fill: var(--color-danger);
	}
	.domino {
		transform-box: fill-box;
		transform-origin: right bottom;
		transform: rotate(14deg);
	}

	@media (prefers-reduced-motion: no-preference) {
		.gbtn.pulse rect {
			animation: pulse 1.8s ease-in-out infinite;
		}
		.domino {
			animation: topple 5s ease-in-out infinite;
		}
		.token.arrive {
			animation: arrive 4.2s cubic-bezier(0.3, 0.8, 0.3, 1) infinite;
		}
		.app-tile {
			animation: unlock 0.5s ease both;
		}
	}
	@keyframes pulse {
		0%,
		100% {
			stroke-width: 1.8;
		}
		50% {
			stroke-width: 4;
		}
	}
	@keyframes topple {
		0%,
		12% {
			transform: rotate(0);
		}
		22%,
		82% {
			transform: rotate(14deg);
		}
		94%,
		100% {
			transform: rotate(0);
		}
	}
	@keyframes arrive {
		0% {
			transform: translate(150px, -120px);
			opacity: 0;
		}
		25% {
			opacity: 1;
		}
		40%,
		100% {
			transform: translate(0, 0);
			opacity: 1;
		}
	}
	@keyframes unlock {
		from {
			opacity: 0;
			transform: translateY(8px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.cursor,
		.addr,
		.gbtn rect,
		.btn-g rect,
		.revoke {
			transition: none;
		}
	}
</style>
