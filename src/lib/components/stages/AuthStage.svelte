<script lang="ts">
	// Guided "watch" stage. A phone and the nimbus.com server trade little envelopes by
	// themselves. First the server forgets every visitor, then a login earns a cookie, the
	// cookie rides along on every request, and the server looks it up on its session list.
	// Then the cookie turns into a stamped wristband (a token) and the list is not needed.
	// The only optional play, on the last beat, is deleting the cookie.
	import Guide from '$lib/components/Guide.svelte';
	import SvgPhone from '$lib/components/stages/backend-guided/SvgPhone.svelte';
	import SvgRack from '$lib/components/stages/backend-guided/SvgRack.svelte';
	import { sceneClock } from '$lib/components/stages/backend-guided/clock.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { AuthText } from '$lib/chapters/web/auth/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as AuthText);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const lastBeat = $derived(tx.intro.length - 1);
	const step = $derived(peek ?? Math.min(beat, tx.steps.length - 1));
	const live = $derived(beat >= lastBeat && peek === null);

	let deleted = $state(false);
	function toggleCookie() {
		deleted = !deleted;
		onstate?.(deleted ? 'deleted' : 'login');
	}

	const clock = sceneClock(() => [step, deleted]);
	const PERIOD = 4200;

	/** One round trip. 0 waiting, 1 request flying, 2 server thinks, 3 answer flying, 4 settled. */
	function trip(t: number, loop: boolean) {
		if (clock.reduced) return 4;
		const m = loop ? t % PERIOD : t;
		return m < 400 ? 0 : m < 1400 ? 1 : m < 2000 ? 2 : m < 3000 ? 3 : 4;
	}

	type Scene = {
		sub: number;
		attach: 'none' | 'cookie' | 'band' | 'key';
		answer: 'none' | 'page' | 'cookie';
		screen: 'who' | 'login' | 'hello';
		holder: 'hidden' | 'empty' | 'cookie' | 'band';
		board: 'none' | 'session' | 'token' | 'hash';
		bubble: 'none' | 'who' | 'ok';
		lookup: boolean;
	};

	const scene = $derived.by((): Scene => {
		const t = clock.t;
		const base: Scene = {
			sub: 4,
			attach: 'none',
			answer: 'page',
			screen: 'hello',
			holder: 'cookie',
			board: 'session',
			bubble: 'none',
			lookup: false
		};
		const thinking = (sub: number) => sub === 2 || sub === 3;
		if (step === 9 && live && deleted) {
			const sub = trip(t, true);
			const first = clock.reduced || t >= PERIOD || sub >= 4;
			return {
				...base,
				sub,
				holder: 'empty',
				screen: first ? 'who' : 'hello',
				bubble: thinking(sub) ? 'who' : 'none'
			};
		}
		switch (step) {
			case 0: {
				const sub = trip(t, true);
				return {
					...base,
					sub,
					screen: 'who',
					holder: 'hidden',
					board: 'none',
					bubble: thinking(sub) ? 'who' : 'none'
				};
			}
			case 1: {
				const sub = trip(t, false);
				return {
					...base,
					sub,
					attach: 'key',
					answer: 'none',
					screen: 'login',
					holder: 'hidden',
					board: 'none',
					bubble: sub >= 2 ? 'ok' : 'none'
				};
			}
			case 2: {
				const sub = clock.reduced ? 4 : t < 600 ? 2 : t < 1600 ? 3 : 4;
				return {
					...base,
					sub,
					answer: 'cookie',
					screen: sub >= 4 ? 'hello' : 'login',
					holder: sub >= 4 ? 'cookie' : 'hidden',
					board: 'none',
					bubble: 'ok'
				};
			}
			case 3:
				return { ...base, lookup: true };
			case 5: {
				const sub = trip(t, true);
				return {
					...base,
					sub,
					attach: 'band',
					holder: 'band',
					board: 'token',
					bubble: thinking(sub) ? 'ok' : 'none',
					lookup: sub === 2
				};
			}
			case 6: {
				const token = !clock.reduced && Math.floor(t / 3000) % 2 === 1;
				return { ...base, holder: token ? 'band' : 'cookie', board: token ? 'token' : 'session' };
			}
			case 7:
				return { ...base, screen: 'login', holder: 'hidden', board: 'hash', answer: 'none' };
			case 8:
				return { ...base, holder: 'band', board: 'token' };
			default: {
				const sub = trip(t, true);
				return {
					...base,
					sub,
					attach: 'cookie',
					bubble: thinking(sub) ? 'ok' : 'none',
					lookup: sub === 2
				};
			}
		}
	});

	const reqOn = $derived(scene.sub === 1 || scene.sub === 2);
	const ansOn = $derived(scene.answer !== 'none' && scene.sub === 3);
	const LANE_REQ = 98;
	const LANE_ANS = 130;
</script>

{#snippet envelope(attach: string)}
	<rect x="-12" y="-8" width="24" height="16" rx="2.5" class="env" />
	<path d="M-11 -7l11 8 11 -8" class="flap" />
	{#if attach === 'cookie'}
		<circle cx="12" cy="-8" r="6.5" class="cookie" />
		<circle cx="10" cy="-10" r="1.2" class="chip" />
		<circle cx="14" cy="-6.5" r="1.2" class="chip" />
	{:else if attach === 'band'}
		<rect x="3" y="-15" width="22" height="9" rx="4.5" class="band" />
		<circle cx="20" cy="-10.5" r="2.5" class="stampDot" />
	{:else if attach === 'key'}
		<circle cx="10" cy="-9" r="4" class="keyC" />
		<path d="M14 -9h7m-3 0v3" class="keyL" />
	{/if}
{/snippet}

{#snippet visual()}
	<div class="w-full">
		<svg
			viewBox="0 0 360 290"
			class="mx-auto block w-full max-w-[420px]"
			role="img"
			aria-label={tx.steps[step].title}
		>
			<!-- the two lanes -->
			<line x1="128" y1={LANE_REQ} x2="232" y2={LANE_REQ} class="lane" />
			<line x1="128" y1={LANE_ANS} x2="232" y2={LANE_ANS} class="lane" />

			<!-- you, the phone -->
			<SvgPhone x={18} y={40} w={104} h={200}>
				{#key scene.screen}
					<g class="fade">
						{#if scene.screen === 'login'}
							<text x="45" y="26" text-anchor="middle" class="pTitle">{tx.page.loginTitle}</text>
							<rect x="8" y="40" width="74" height="22" rx="5" class="field" />
							<text x="13" y="55" class="fieldT">{tx.page.email}</text>
							<rect x="8" y="68" width="74" height="22" rx="5" class="field" />
							<text x="13" y="84" class="fieldT dots">••••••••</text>
							<rect x="8" y="102" width="74" height="24" rx="12" class="btn" />
							<text x="45" y="118" text-anchor="middle" class="btnT">{tx.page.loginBtn}</text>
						{:else if scene.screen === 'hello'}
							<text x="45" y="28" text-anchor="middle" class="pTitle">{tx.page.hello}</text>
							<text x="45" y="46" text-anchor="middle" class="pSub">{tx.page.ordersLabel}</text>
							{#each tx.page.orders as o, i (i)}
								<rect x="8" y={58 + i * 32} width="74" height="24" rx="6" class="field" />
								<rect x="13" y={64 + i * 32} width="12" height="12" rx="3" class="thumb" />
								<text x="30" y={74 + i * 32} class="fieldT">{o}</text>
							{/each}
						{:else}
							<circle cx="45" cy="56" r="22" class="who" />
							<text x="45" y="65" text-anchor="middle" class="whoQ">?</text>
							<text x="45" y="104" text-anchor="middle" class="pTitle sm">{tx.page.whoTitle}</text>
							<text x="45" y="120" text-anchor="middle" class="pSub">{tx.page.whoHint}</text>
						{/if}
					</g>
				{/key}
			</SvgPhone>

			<!-- what the browser holds -->
			{#if scene.holder !== 'hidden'}
				{#key scene.holder}
					<g class="fade">
						{#if scene.holder === 'cookie'}
							<circle cx="44" cy="264" r="11" class="cookie" />
							<circle cx="40" cy="260" r="1.8" class="chip" />
							<circle cx="48" cy="262" r="1.8" class="chip" />
							<circle cx="43" cy="269" r="1.8" class="chip" />
							<text x="62" y="268" class="holdT">{tx.sessionNumber}</text>
						{:else if scene.holder === 'band'}
							<rect x="22" y="254" width="96" height="20" rx="10" class="band" />
							<text x="34" y="268" class="holdT sm">{tx.wristband}</text>
							<circle cx="106" cy="264" r="6" class="stampDot" />
						{:else}
							<text x="70" y="268" text-anchor="middle" class="holdT none">{tx.noCookie}</text>
						{/if}
					</g>
				{/key}
			{/if}

			<!-- the server -->
			<text x="290" y="26" text-anchor="middle" class="label">{tx.serverLabel}</text>
			<SvgRack x={236} y={40} w={108} units={3} busy={scene.sub === 2} />
			{#if scene.bubble !== 'none'}
				<g class="fade">
					<circle cx="232" cy="44" r="12" class="bubble {scene.bubble}" />
					{#if scene.bubble === 'who'}
						<text x="232" y="49.5" text-anchor="middle" class="bubbleQ">?</text>
					{:else}
						<path d="M226 44l4 4 8 -8" class="tick" />
					{/if}
				</g>
			{/if}

			<!-- the board behind the counter -->
			{#if scene.board !== 'none'}
				{#key scene.board}
					<g class="fade">
						<rect x="226" y="156" width="124" height="110" rx="10" class="board" />
						{#if scene.board === 'session'}
							<text x="238" y="176" class="boardT">{tx.listLabel}</text>
							{#each tx.listRows as r, i (i)}
								{@const mine = i === 1}
								<rect
									x="234"
									y={186 + i * 24}
									width="108"
									height="20"
									rx="5"
									class="row"
									class:mine
									class:look={mine && scene.lookup}
								/>
								<text x="242" y={200 + i * 24} class="rowT mono">{r.number}</text>
								<text x="300" y={200 + i * 24} class="rowT">{r.name}</text>
							{/each}
						{:else if scene.board === 'token'}
							<text x="238" y="176" class="boardT">{tx.tokenLabel}</text>
							<circle cx="256" cy="216" r="9" class="keyC big" />
							<path d="M265 216h16m-6 0v6" class="keyL big" />
							<circle cx="318" cy="216" r="16" class="stamp" class:look={scene.lookup} />
							<path d="M310 216l6 6 10 -11" class="tick dark" />
							<text x="288" y="254" text-anchor="middle" class="rowT faint">{tx.tokenNote}</text>
						{:else}
							<text x="238" y="176" class="boardT">{tx.hashLabel}</text>
							<rect x="234" y="190" width="108" height="22" rx="5" class="row" />
							<text x="242" y="205" class="rowT">{tx.hashUser}</text>
							<text x="276" y="205" class="rowT mono">{tx.hashValue}</text>
						{/if}
					</g>
				{/key}
			{/if}

			<!-- the travelling envelopes -->
			<g
				class="move"
				style="transform:translate({scene.sub >= 1 ? 214 : 140}px, {LANE_REQ}px);opacity:{reqOn
					? 1
					: 0}"
			>
				{@render envelope(scene.attach)}
			</g>
			<g
				class="move"
				style="transform:translate({scene.sub >= 3 ? 140 : 214}px, {LANE_ANS}px);opacity:{ansOn
					? 1
					: 0}"
			>
				{@render envelope(scene.answer === 'cookie' ? 'cookie' : 'none')}
			</g>
		</svg>
		{#if live}
			<div class="mt-3 flex justify-center">
				<button type="button" class="play" class:on={deleted} onclick={toggleCookie}>
					{deleted ? tx.againBtn : tx.deleteBtn}
				</button>
			</div>
		{/if}
	</div>
{/snippet}

<div class="flex w-full justify-center px-1 pb-28 md:pb-6">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.move {
		transition:
			transform 0.9s cubic-bezier(0.45, 0, 0.2, 1),
			opacity 0.3s;
	}
	.fade {
		animation: fadeIn 0.45s ease-out;
	}
	@keyframes fadeIn {
		from {
			opacity: 0;
		}
	}
	.lane {
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.label {
		font-size: 11px;
		font-weight: 700;
		fill: var(--color-faint);
	}
	.env {
		fill: var(--color-card);
		stroke: var(--color-brand);
		stroke-width: 1.8;
	}
	.flap {
		fill: none;
		stroke: var(--color-brand);
		stroke-width: 1.4;
		stroke-linejoin: round;
	}
	.cookie {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 2;
	}
	.chip {
		fill: var(--color-amber);
	}
	.band {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1.8;
	}
	.stampDot {
		fill: var(--color-grass);
	}
	.keyC {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 2;
	}
	.keyL {
		fill: none;
		stroke: var(--color-amber);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.keyC.big,
	.keyL.big {
		stroke-width: 3;
	}
	.pTitle {
		font-family: var(--font-display);
		font-size: 13px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.pTitle.sm {
		font-size: 11.5px;
	}
	.pSub {
		font-size: 9.5px;
		fill: var(--color-faint);
	}
	.field {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.3;
	}
	.fieldT {
		font-size: 8.5px;
		fill: var(--color-muted);
	}
	.fieldT.dots {
		letter-spacing: 0.08em;
	}
	.thumb {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1;
	}
	.btn {
		fill: var(--color-brand);
	}
	.btnT {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-card);
	}
	.who {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
		stroke-width: 2;
	}
	.whoQ {
		font-size: 24px;
		font-weight: 800;
		fill: var(--color-danger);
	}
	.holdT {
		font-size: 12px;
		font-weight: 700;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		fill: var(--color-ink);
	}
	.holdT.sm {
		font-family: inherit;
		font-size: 10.5px;
		fill: var(--color-brand);
	}
	.holdT.none {
		font-family: inherit;
		font-weight: 600;
		fill: var(--color-danger);
	}
	.bubble.who {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
		stroke-width: 2;
	}
	.bubble.ok {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 2;
	}
	.bubbleQ {
		font-size: 15px;
		font-weight: 800;
		fill: var(--color-danger);
	}
	.tick {
		fill: none;
		stroke: var(--color-grass);
		stroke-width: 2.5;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.board {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.boardT {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		fill: var(--color-faint);
	}
	.row {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.2;
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.row.mine {
		stroke: var(--color-amber);
	}
	.row.look {
		fill: var(--color-amber-soft);
		stroke-width: 2;
	}
	.rowT {
		font-size: 10.5px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.rowT.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
	}
	.rowT.faint {
		fill: var(--color-faint);
	}
	.stamp {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
		stroke-width: 2;
		transition: stroke-width 0.3s;
	}
	.stamp.look {
		stroke-width: 4;
	}
	.play {
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 18px;
		font-size: 14px;
		font-weight: 600;
		color: var(--color-ink);
		box-shadow: 0 4px 14px rgba(22, 40, 60, 0.07);
	}
	.play.on {
		border-color: var(--color-brand);
		color: var(--color-brand);
	}
	@media (prefers-reduced-motion: reduce) {
		.move,
		.row,
		.stamp {
			transition: none;
		}
		.fade {
			animation: none;
		}
	}
</style>
