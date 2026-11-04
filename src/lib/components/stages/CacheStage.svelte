<script lang="ts">
	// A guided "watch" stage for caching. A phone, an app server, Redis and a database sit on one
	// small map, and a request travels between them by itself. First every visit goes all the way
	// to the database (slow, and its counter keeps climbing), then Redis appears, misses once,
	// fills up, and serves every visit after that from memory. A stale price shows the catch. The
	// only optional play is opening the page yourself, starting from an empty cache.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { CacheText } from '$lib/chapters/web/cache/types';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as CacheText);

	// One scene per beat (nine beats, nine scenes).
	const SCENE_OF_BEAT = [0, 1, 2, 3, 4, 5, 6, 7, 8];
	type Pt = { x: number; y: number };
	const P: Pt = { x: 84, y: 120 }; // the phone
	const S: Pt = { x: 160, y: 122 }; // the app server
	const R: Pt = { x: 250, y: 58 }; // Redis
	const D: Pt = { x: 262, y: 168 }; // the database
	const LEG = 420;
	type Kind = 'direct' | 'miss' | 'hit';
	type Screen = { state: 'idle' | 'loading' | 'shown'; ms: number; kind: Kind; price: number };

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	let pos = $state<Pt>(P);
	let packet = $state(false);
	let redisHas = $state(false);
	let redisPrice = $state(0);
	let checking = $state(false); // Redis is being looked at and has nothing
	let dbCount = $state(0);
	let dbBusy = $state(false);
	let busy = $state(false);
	let screen = $state<Screen>({ state: 'idle', ms: 0, kind: 'direct', price: 0 });

	const scene = $derived(peek ?? SCENE_OF_BEAT[Math.min(beat, SCENE_OF_BEAT.length - 1)]);
	const showRedis = $derived(scene >= 2);
	const stale = $derived(scene === 7);
	const dbPrice = $derived(stale ? tx.product.salePrice : tx.product.price);
	const fmt = $derived(new Intl.NumberFormat(tx.locale));

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		if (typeof matchMedia !== 'undefined') {
			reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	});

	// A new beat always brings the picture back to the story.
	$effect(() => {
		void beat;
		peek = null;
	});

	// Every pending timer, so a scene change can stop a visit halfway.
	let timers: ReturnType<typeof setTimeout>[] = [];
	const later = (fn: () => void, ms: number) => {
		timers.push(setTimeout(fn, ms));
	};
	const clearAll = () => {
		timers.forEach(clearTimeout);
		timers = [];
	};

	/** Send one visit along its path, firing little events at the stops. */
	function visit(kind: Kind, done?: () => void) {
		type Stop = { at: Pt; hold?: number; on?: () => void };
		const ask: Stop = {
			at: D,
			hold: 700,
			on: () => {
				dbBusy = true;
				dbCount += 1;
				later(() => (dbBusy = false), 650);
			}
		};
		const look: Stop = {
			at: R,
			hold: 260,
			on: () => {
				if (!redisHas) {
					checking = true;
					later(() => (checking = false), 500);
				}
			}
		};
		const store: Stop = {
			at: R,
			hold: 260,
			on: () => {
				redisHas = true;
				redisPrice = dbPrice;
			}
		};
		const path: Stop[] =
			kind === 'direct'
				? [{ at: S }, ask, { at: S }, { at: P }]
				: kind === 'miss'
					? [{ at: S }, look, { at: S }, ask, { at: S }, store, { at: S }, { at: P }]
					: [{ at: S }, look, { at: S }, { at: P }];
		const price = kind === 'hit' ? redisPrice : dbPrice;
		const ms = kind === 'hit' ? 2 : 780 + ((dbCount * 37) % 90);
		busy = true;
		pos = P;
		packet = true;
		screen = { state: 'loading', ms: 0, kind, price: 0 };
		let i = 0;
		const next = () => {
			if (i >= path.length) {
				packet = false;
				busy = false;
				screen = { state: 'shown', ms, kind, price };
				done?.();
				return;
			}
			const stop = path[i];
			i += 1;
			pos = stop.at;
			later(() => {
				stop.on?.();
				later(next, stop.hold ?? 0);
			}, LEG);
		};
		later(next, 60);
	}

	// Each scene sets the cache the way the story needs it, then plays its visits by itself.
	$effect(() => {
		const sc = scene;
		const old = tx.product.price;
		clearAll();
		packet = false;
		busy = false;
		checking = false;
		dbBusy = false;
		dbCount = 0;
		pos = P;
		redisHas = sc >= 5 && sc <= 7;
		redisPrice = old;
		screen = { state: 'idle', ms: 0, kind: 'direct', price: 0 };
		if (sc === 2 || sc === 3 || sc === 8) return;
		const kind: Kind = sc <= 1 ? 'direct' : sc === 4 ? 'miss' : 'hit';
		if (reduced) {
			if (kind === 'miss') redisHas = true;
			dbCount = kind === 'hit' ? 1 : sc === 1 ? 3 : 1;
			screen = {
				state: 'shown',
				ms: kind === 'hit' ? 2 : 812,
				kind,
				price: kind === 'hit' ? old : tx.product.price
			};
			return;
		}
		if (kind === 'hit') dbCount = 1; // the miss that filled Redis earlier
		const gap = sc === 1 ? 700 : 1900;
		const cycle = () => {
			if (sc === 4) redisHas = false;
			visit(kind, () => later(cycle, gap));
		};
		later(cycle, 700);
		return clearAll;
	});

	function open() {
		if (busy) return;
		const kind: Kind = redisHas ? 'hit' : 'miss';
		onstate?.(kind);
		visit(kind);
	}

	const tagOf = (s: Screen) =>
		s.kind === 'direct'
			? tx.directTag
			: s.kind === 'miss'
				? tx.missTag
				: stale && s.price !== dbPrice
					? tx.staleTag
					: tx.hitTag;
	const fast = $derived(screen.state === 'shown' && screen.ms < 50);
</script>

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual(s: number)}
			<div class="visual">
				{#if s === 8}
					<button type="button" class="try" onclick={open} disabled={busy}>{tx.open}</button>
				{/if}

				<div class="card">
					<svg viewBox="0 0 360 250" class="map" aria-hidden="true">
						<!-- wires -->
						<line x1={P.x} y1={P.y} x2="136" y2={S.y} class="wire" />
						<line x1="184" y1="134" x2={D.x} y2={D.y} class="wire" />
						<line x1="184" y1="110" x2={R.x} y2={R.y} class="wire" class:hide={!showRedis} />

						<!-- the phone -->
						<g transform="translate(12 52)">
							<rect width="70" height="138" rx="13" class="phone" />
							<rect x="6" y="14" width="58" height="110" rx="5" class="screen" />
							<rect x="26" y="6" width="18" height="3" rx="1.5" class="notch" />
							{#if screen.state === 'loading'}
								<g class="dots" transform="translate(35 68)">
									<circle cx="-10" r="3" />
									<circle r="3" />
									<circle cx="10" r="3" />
								</g>
							{:else if screen.state === 'shown'}
								<g in:fade={{ duration: 200 }}>
									<rect x="12" y="28" width="46" height="34" rx="4" class="photo" />
									<text x="35" y="80" class="pname">{tx.product.name}</text>
									<text x="35" y="96" class="pprice" class:bad={stale && screen.price !== dbPrice}
										>{fmt.format(screen.price)}</text
									>
								</g>
							{/if}
						</g>
						{#if screen.state === 'shown'}
							<g in:fade={{ duration: 200 }}>
								<text x="47" y="204" class="ms" class:fast>{screen.ms} {tx.ms}</text>
								<text
									x="47"
									y="222"
									class="kind"
									class:fast
									class:bad={stale && screen.price !== dbPrice}>{tagOf(screen)}</text
								>
							</g>
						{/if}

						<!-- the app server -->
						<g transform="translate(136 95)">
							<rect width="48" height="56" rx="6" class="rack" />
							{#each [0, 1, 2] as k (k)}
								<rect x="6" y={7 + k * 16} width="36" height="10" rx="3" class="slot" />
								<circle cx="35" cy={12 + k * 16} r="2" class="led" class:blink={packet} />
							{/each}
						</g>
						<text x="160" y="168" class="label">{tx.serverLabel}</text>

						<!-- Redis, a little memory box -->
						<g class="redis" class:hide={!showRedis} class:focus={s === 3}>
							<rect x="250" y="14" width="102" height="76" rx="10" class="mem" />
							{#each [0, 1, 2, 3, 4, 5, 6] as k (k)}
								<rect x={262 + k * 12} y="88" width="5" height="6" class="pin" />
							{/each}
							<text x="262" y="32" class="box-title">{tx.redisLabel}</text>
							<text x="340" y="32" class="box-sub">{s === 3 ? `1 ${tx.ms}` : tx.redisSub}</text>
							<rect
								x="258"
								y="42"
								width="86"
								height="38"
								rx="6"
								class="key"
								class:full={redisHas}
								class:empty-check={checking}
							/>
							{#if redisHas}
								<g in:fade={{ duration: 250 }}>
									<text x="266" y="57" class="key-name">{tx.keyName}</text>
									<text x="266" y="72" class="key-val" class:bad={stale}
										>{fmt.format(redisPrice)}</text
									>
								</g>
							{:else}
								<text x="301" y="65" class="key-empty">{tx.emptyCache}</text>
							{/if}
						</g>

						<!-- the database, a disk shaped cylinder -->
						<g class="db" class:busy={dbBusy} class:focus={s === 3}>
							<path d="M264 150 V196 A36 10 0 0 0 336 196 V150" class="cyl" />
							<ellipse cx="300" cy="150" rx="36" ry="10" class="cyl top" />
							<path d="M264 166 A36 10 0 0 0 336 166" class="band" />
							<path d="M264 182 A36 10 0 0 0 336 182" class="band" />
							<text x="300" y="178" class="db-price" class:sale={stale}>{fmt.format(dbPrice)}</text>
						</g>
						<text x="300" y="224" class="label">{tx.dbLabel}</text>
						<text x="300" y="240" class="count" class:focus={s === 3}>
							{s === 3 ? `800 ${tx.ms}` : tx.asked.replace('{n}', String(dbCount))}
						</text>
						{#if stale}
							<g in:fade={{ duration: 250 }}>
								<rect x="314" y="124" width="44" height="16" rx="8" class="sale-tag" />
								<text x="336" y="135" class="sale-text">{tx.saleTag}</text>
							</g>
						{/if}

						<!-- the request on its way -->
						<circle
							r="6"
							class="packet"
							class:show={packet}
							style="transform:translate({pos.x}px,{pos.y}px)"
						/>
					</svg>
				</div>

				{#if s === 6}
					<p class="rule" in:fade={{ duration: 300 }}>{tx.rule}</p>
				{/if}
			</div>
		{/snippet}
	</Guide>
</div>

<style>
	.stage {
		display: flex;
		height: 100%;
		width: 100%;
		justify-content: center;
		align-items: safe center;
		overflow-y: auto;
		overflow-x: hidden;
		padding-bottom: 16px;
	}
	.visual {
		display: flex;
		width: 100%;
		max-width: 440px;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.try {
		border: 1.5px solid var(--color-brand);
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 7px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
		transition:
			transform 0.15s,
			opacity 0.2s;
	}
	.try:hover:not(:disabled) {
		transform: translateY(-1px);
	}
	.try:disabled {
		opacity: 0.5;
	}
	.card {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 18px;
		background: var(--color-card);
		padding: 10px 12px;
	}
	.map {
		display: block;
		width: 100%;
		height: auto;
		max-height: 56vh;
	}
	.wire {
		stroke: var(--color-line);
		stroke-width: 2;
		transition: opacity 0.5s;
	}
	.hide {
		opacity: 0;
	}
	.redis {
		transition: opacity 0.6s;
	}

	/* phone */
	.phone {
		fill: var(--color-ink);
		opacity: 0.88;
	}
	.screen {
		fill: var(--color-card);
	}
	.notch {
		fill: var(--color-faint);
	}
	.photo {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 1;
	}
	.pname {
		fill: var(--color-ink);
		font-size: 8.5px;
		font-weight: 700;
		text-anchor: middle;
	}
	.pprice {
		fill: var(--color-muted);
		font-size: 8.5px;
		font-weight: 600;
		text-anchor: middle;
	}
	.pprice.bad {
		fill: var(--color-danger);
	}
	.dots circle {
		fill: var(--color-faint);
		animation: dot 1s ease-in-out infinite;
	}
	.dots circle:nth-child(2) {
		animation-delay: 0.15s;
	}
	.dots circle:nth-child(3) {
		animation-delay: 0.3s;
	}
	@keyframes dot {
		50% {
			opacity: 0.25;
		}
	}
	.ms {
		fill: var(--color-amber);
		font-size: 15px;
		font-weight: 800;
		text-anchor: middle;
		font-variant-numeric: tabular-nums;
	}
	.kind {
		fill: var(--color-amber);
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
	}
	.ms.fast,
	.kind.fast {
		fill: var(--color-grass);
	}
	.kind.bad {
		fill: var(--color-danger);
	}

	/* server */
	.rack {
		fill: var(--color-ink);
		opacity: 0.85;
	}
	.slot {
		fill: var(--color-faint);
		opacity: 0.35;
	}
	.led {
		fill: var(--color-grass);
	}
	.led.blink {
		animation: dot 0.6s ease-in-out infinite;
	}
	.label {
		fill: var(--color-muted);
		font-size: 11px;
		font-weight: 700;
		text-anchor: middle;
	}

	/* redis */
	.mem {
		fill: var(--color-card);
		stroke: var(--color-danger);
		stroke-width: 1.5;
		transition: stroke-width 0.3s;
	}
	.redis.focus .mem {
		stroke-width: 3;
	}
	.pin {
		fill: var(--color-amber);
		opacity: 0.7;
	}
	.box-title {
		fill: var(--color-ink);
		font-size: 12px;
		font-weight: 700;
	}
	.box-sub {
		fill: var(--color-muted);
		font-size: 9.5px;
		font-weight: 600;
		text-anchor: end;
	}
	.redis.focus .box-sub {
		fill: var(--color-grass);
		font-size: 11px;
		font-weight: 800;
	}
	.key {
		fill: var(--color-paper);
		stroke: var(--color-line);
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.key.full {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.key.empty-check {
		stroke: var(--color-danger);
		stroke-width: 2;
	}
	.key-name {
		fill: var(--color-muted);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 9.5px;
		font-weight: 700;
	}
	.key-val {
		fill: var(--color-ink);
		font-size: 11px;
		font-weight: 700;
	}
	.key-val.bad {
		fill: var(--color-danger);
	}
	.key-empty {
		fill: var(--color-faint);
		font-size: 10.5px;
		font-weight: 600;
		text-anchor: middle;
	}

	/* database */
	.cyl {
		fill: var(--color-paper);
		stroke: var(--color-muted);
		stroke-width: 1.5;
	}
	.cyl.top {
		fill: var(--color-card);
	}
	.band {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 1.2;
	}
	.db.busy .cyl {
		stroke: var(--color-amber);
		fill: var(--color-amber-soft);
	}
	.db.focus .cyl {
		stroke-width: 3;
	}
	.db-price {
		fill: var(--color-muted);
		font-size: 10px;
		font-weight: 700;
		text-anchor: middle;
	}
	.db-price.sale {
		fill: var(--color-grass);
	}
	.count {
		fill: var(--color-faint);
		font-size: 10.5px;
		font-weight: 600;
		text-anchor: middle;
	}
	.count.focus {
		fill: var(--color-amber);
		font-size: 11px;
		font-weight: 800;
	}
	.sale-tag {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.sale-text {
		fill: var(--color-grass);
		font-size: 8.5px;
		font-weight: 800;
		text-anchor: middle;
	}

	.packet {
		fill: var(--color-brand);
		opacity: 0;
		transition:
			transform 0.4s cubic-bezier(0.4, 0, 0.3, 1),
			opacity 0.2s;
	}
	.packet.show {
		opacity: 1;
	}
	.rule {
		margin: 0;
		text-align: center;
		font-size: 13px;
		font-weight: 600;
		color: var(--color-grass);
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.packet,
		.wire,
		.redis,
		.key,
		.mem {
			transition: none;
		}
		.dots circle,
		.led.blink {
			animation: none;
		}
	}
</style>
