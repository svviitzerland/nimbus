<script lang="ts">
	// Guided "watch" stage. Requests travel by themselves from the internet, through a guard booth,
	// to the nimbus.com server. A bubble over the booth shows what the guard reads inside each one.
	// Following Nim's beats the booth is first a plain firewall (attacks hidden in normal traffic
	// walk right in), then an IDS that flags them and rings, then an IPS that stops them, then a
	// strict and a loose setting that show false positives and false negatives. The only optional
	// play, on the last beat, is switching between camera mode (IDS) and guard mode (IPS).
	import { untrack } from 'svelte';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { IdsText, IdsVerdict } from '$lib/chapters/security/ids/types';
	import { sceneClock } from './shipit/clock.svelte';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as IdsText);

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
	const live = $derived(beat >= tx.intro.length - 1 && peek === null);

	type Mode = 'fw' | 'ids' | 'ips';
	let userMode = $state<'ids' | 'ips'>('ips');
	function pick(m: 'ids' | 'ips') {
		if (m === userMode) return;
		userMode = m;
		onstate?.(m);
	}
	const mode = $derived.by((): Mode => {
		if (live) return userMode;
		if (step === 0) return 'fw';
		if (step <= 2) return 'ids';
		return 'ips';
	});

	type Req = { r: string; v: IdsVerdict; stop: boolean; bad: boolean };
	const SHOP = 'GET /shop';
	const SQL = "GET /search?q=' OR 1=1 --";
	const PATH = 'GET /../../etc/passwd';
	const seq = $derived.by((): Req[] => {
		if (step === 4 && !live)
			return [
				{ r: "GET /search?q=O'Brien", v: 'falsePos', stop: true, bad: false },
				{ r: 'GET /search?q=%27%20OR%201%3D1', v: 'falseNeg', stop: false, bad: true }
			];
		if (step === 2 && !live)
			return [
				{ r: SHOP, v: 'ok', stop: false, bad: false },
				{ r: 'POST /login  x300 per min', v: 'unusual', stop: false, bad: true }
			];
		const attack: IdsVerdict = mode === 'fw' ? 'pass' : mode === 'ids' ? 'alarm' : 'blocked';
		const fine: IdsVerdict = mode === 'fw' ? 'pass' : 'ok';
		const stop = mode === 'ips';
		return [
			{ r: SHOP, v: fine, stop: false, bad: false },
			{ r: SQL, v: attack, stop, bad: true },
			{ r: 'GET /about', v: fine, stop: false, bad: false },
			{ r: PATH, v: attack, stop, bad: true }
		];
	});

	const clock = sceneClock(() => [step, userMode, live]);
	const PERIOD = 3400;
	const Y = 124;
	const now = $derived.by(() => {
		const list = seq;
		if (clock.reduced) {
			const k = Math.max(
				0,
				list.findIndex((q) => q.bad)
			);
			return { q: list[k], local: 1700 };
		}
		const k = Math.floor(clock.t / PERIOD) % list.length;
		return { q: list[k], local: clock.t % PERIOD };
	});

	const env = $derived.by(() => {
		const { q, local } = now;
		if (local < 1000) return { x: 100 + (96 * local) / 1000, y: Y, o: 1 };
		if (local < 2000) return { x: 196 + 24 * ((local - 1000) / 1000), y: Y, o: 1 };
		if (local < 3200) {
			const r = (local - 2000) / 1200;
			if (q.stop) return { x: 220, y: Y + 60 * r, o: 1 - r };
			return { x: 220 + 132 * r, y: Y, o: r > 0.85 ? (1 - r) / 0.15 : 1 };
		}
		return { x: 352, y: Y, o: 0 };
	});
	const reading = $derived(now.local >= 1000 && now.local < 2600);
	const judged = $derived(now.local >= 1350);
	const ringing = $derived(
		judged && now.local < 3200 && (now.q.v === 'alarm' || now.q.v === 'unusual')
	);
	const serverHit = $derived(now.q.bad && !now.q.stop && now.local >= 2900 && now.local < 3400);

	const TONE: Record<IdsVerdict, string> = {
		pass: 'brand',
		ok: 'grass',
		alarm: 'danger',
		blocked: 'danger',
		unusual: 'amber',
		falsePos: 'amber',
		falseNeg: 'amber'
	};
	const tone = $derived(TONE[now.q.v]);
	const boothName = $derived(
		mode === 'fw' ? tx.firewallName : mode === 'ids' ? tx.idsName : tx.ipsName
	);
</script>

{#snippet visual(i: number)}
	<div class="vis">
		{#if live}
			<div class="switch" role="group" aria-label={tx.steps[i].title}>
				<button type="button" class:on={userMode === 'ids'} onclick={() => pick('ids')}
					>{tx.cameraMode}</button
				>
				<button type="button" class:on={userMode === 'ips'} onclick={() => pick('ips')}
					>{tx.guardMode}</button
				>
			</div>
		{/if}
		<svg viewBox="0 0 420 236" class="scene" role="img" aria-label={tx.steps[i].title}>
			<!-- the road -->
			<line x1="92" y1={Y} x2="344" y2={Y} class="road" />

			<!-- the internet -->
			<path
				d="M30 142a16 16 0 0 1 2 -32a22 22 0 0 1 40 -6a16 16 0 0 1 20 22a12 12 0 0 1 -4 16Z"
				class="cloud"
			/>
			<text x="58" y="166" text-anchor="middle" class="cap">{tx.internetLabel}</text>

			<!-- the wall and the booth -->
			<rect x="214" y="70" width="12" height="18" class="wall" />
			<rect x="214" y="158" width="12" height="44" class="wall" />
			<rect x="196" y="88" width="48" height="70" rx="6" class="booth {mode}" />
			<rect x="204" y="108" width="32" height="44" rx="3" class="doorway" />
			<g transform="translate(220 98)" class="icon {mode}">
				{#if mode === 'fw'}
					<rect x="-9" y="-5" width="18" height="10" rx="1.5" />
					<line x1="-9" y1="0" x2="9" y2="0" />
					<line x1="0" y1="-5" x2="0" y2="0" />
				{:else if mode === 'ids'}
					<rect x="-8" y="-5" width="13" height="10" rx="2" />
					<path d="M5 -2l5 -3v10l-5 -3Z" />
				{:else}
					<path d="M0 -6l7 2.5v4c0 4 -3 6.5 -7 7.5c-4 -1 -7 -3.5 -7 -7.5v-4Z" />
				{/if}
			</g>
			<text x="220" y="218" text-anchor="middle" class="name {mode}">{boothName}</text>

			{#if ringing}
				<g transform="translate(252 92)" class="bell">
					<path d="M0 -9l9 16h-18Z" />
					<text y="5" text-anchor="middle" class="bang">!</text>
				</g>
			{/if}

			<!-- the server -->
			<rect x="344" y="84" width="62" height="80" rx="9" class="rack" class:hit={serverHit} />
			{#each [94, 118, 142] as y (y)}
				<rect x="352" {y} width="46" height="16" rx="3" class="unit" />
				<circle cx="360" cy={y + 8} r="2.6" class="led" class:bad={serverHit} />
			{/each}
			<text x="375" y="184" text-anchor="middle" class="cap">{tx.serverLabel}</text>

			<!-- the request on its way -->
			<g
				transform="translate({env.x} {env.y})"
				style="opacity:{env.o}"
				class="env"
				class:judged
				class:t-danger={judged && tone === 'danger'}
				class:t-amber={judged && tone === 'amber'}
				class:t-grass={judged && tone === 'grass'}
			>
				<rect x="-16" y="-11" width="32" height="22" rx="3" />
				<path d="M-15 -10L0 1L15 -10" />
			</g>
			{#if now.q.stop && judged && now.local < 3200}
				<g transform="translate(220 {Y + 30})" class="x">
					<line x1="-6" y1="-6" x2="6" y2="6" />
					<line x1="6" y1="-6" x2="-6" y2="6" />
				</g>
			{/if}

			<!-- what the guard reads -->
			{#if reading}
				<g class="bubble">
					<rect x="96" y="6" width="248" height="56" rx="10" class="bub" />
					<path d="M212 62l8 8l8 -8Z" class="bub" />
					<text x="220" y="27" text-anchor="middle" class="req" class:sealed={mode === 'fw'}
						>{now.q.r}</text
					>
					{#if judged}
						<g class="pop">
							<rect x="150" y="36" width="140" height="18" rx="9" class="pill {tone}" />
							<text x="220" y="48.5" text-anchor="middle" class="pillT">{tx.verdicts[now.q.v]}</text
							>
						</g>
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
		justify-content: center;
		overflow-x: hidden;
		padding: 0 4px 8px;
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
	.scene {
		display: block;
		width: 100%;
		max-width: 460px;
		height: auto;
	}
	.switch {
		display: inline-flex;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 3px;
		box-shadow: 0 4px 14px rgba(22, 40, 60, 0.07);
	}
	.switch button {
		border-radius: 999px;
		padding: 7px 14px;
		font-size: 13.5px;
		font-weight: 600;
		color: var(--color-muted);
		transition:
			background 0.2s,
			color 0.2s;
	}
	.switch button.on {
		background: var(--color-brand);
		color: var(--color-card);
	}

	.road {
		stroke: var(--color-line);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.cloud {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 2;
	}
	.cap {
		font-size: 10px;
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-faint);
	}
	.wall {
		fill: var(--color-line);
	}
	.booth {
		fill: var(--color-card);
		stroke-width: 2.5;
		transition: stroke 0.3s;
	}
	.booth.fw {
		stroke: var(--color-faint);
	}
	.booth.ids {
		stroke: var(--color-amber);
	}
	.booth.ips {
		stroke: var(--color-brand);
	}
	.doorway {
		fill: var(--color-paper);
	}
	.icon rect,
	.icon path {
		fill: none;
		stroke-width: 1.8;
		stroke-linejoin: round;
	}
	.icon line {
		stroke-width: 1.4;
	}
	.icon.fw * {
		stroke: var(--color-faint);
	}
	.icon.ids * {
		stroke: var(--color-amber);
	}
	.icon.ips * {
		stroke: var(--color-brand);
	}
	.name {
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0.05em;
	}
	.name.fw {
		fill: var(--color-muted);
	}
	.name.ids {
		fill: var(--color-amber);
	}
	.name.ips {
		fill: var(--color-brand);
	}
	.bell path {
		fill: var(--color-danger);
	}
	.bell {
		animation: ring 0.5s ease-in-out infinite alternate;
	}
	.bang {
		font-size: 10px;
		font-weight: 900;
		fill: var(--color-card);
	}
	.rack {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
		transition: stroke 0.2s;
	}
	.rack.hit {
		stroke: var(--color-danger);
	}
	.unit {
		fill: var(--color-paper);
		stroke: var(--color-line);
	}
	.led {
		fill: var(--color-grass);
	}
	.led.bad {
		fill: var(--color-danger);
	}
	.env rect {
		fill: var(--color-card);
		stroke: var(--color-faint);
		stroke-width: 2;
		transition: stroke 0.2s;
	}
	.env path {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 1.5;
	}
	.env.t-danger rect,
	.env.t-danger path {
		stroke: var(--color-danger);
	}
	.env.t-amber rect,
	.env.t-amber path {
		stroke: var(--color-amber);
	}
	.env.t-grass rect,
	.env.t-grass path {
		stroke: var(--color-grass);
	}
	.x line {
		stroke: var(--color-danger);
		stroke-width: 3;
		stroke-linecap: round;
	}
	.bub {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.req {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.req.sealed {
		opacity: 0.3;
	}
	.pill.brand {
		fill: var(--color-brand);
	}
	.pill.grass {
		fill: var(--color-grass);
	}
	.pill.danger {
		fill: var(--color-danger);
	}
	.pill.amber {
		fill: var(--color-amber);
	}
	.pillT {
		font-size: 10px;
		font-weight: 800;
		fill: var(--color-card);
	}
	.pop {
		transform-box: fill-box;
		transform-origin: center;
		animation: pop 0.35s ease-out both;
	}
	.bubble {
		animation: fadein 0.25s ease-out both;
	}
	@keyframes ring {
		from {
			transform: translate(252px, 92px) rotate(-10deg);
		}
		to {
			transform: translate(252px, 92px) rotate(10deg);
		}
	}
	@keyframes pop {
		from {
			transform: scale(0.6);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.bell,
		.pop,
		.bubble {
			animation: none;
		}
	}
</style>
