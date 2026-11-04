<script lang="ts">
	// The operating system as a guided story. One laptop with its hardware underneath, and the
	// OS appearing in between as the manager. The picture follows Nim's beats by itself (apps
	// open, the CPU passes from app to app, RAM fills up, a little process list with PID numbers,
	// a song comes up from storage). The
	// last scene lets the learner open and close apps, which is optional.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { OsAppId, OsText } from '$lib/chapters/basics/os/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as OsText);

	/** Beat index to scene index (the [ingat] beat keeps the manager scene). */
	const STEP_OF_BEAT = [0, 1, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	const PROC = 5;
	const SWAP = 6;
	const FILES = 7;
	const NAMES = 8;
	const PLAY = 9;
	/** The process number (PID) the OS gave each app when it started. */
	const PID: Record<OsAppId, number> = { browser: 412, music: 538, chat: 761, game: 903 };
	const TOTAL = 8;
	const OS_GB = 2;

	/** RAM each app asks for, its colour, and where its window sits on the screen. */
	const APP: Record<
		OsAppId,
		{ gb: number; color: string; x: number; y: number; w: number; h: number }
	> = {
		browser: { gb: 2, color: 'var(--color-brand)', x: 58, y: 24, w: 122, h: 62 },
		music: { gb: 1, color: 'var(--color-grass)', x: 188, y: 24, w: 114, h: 54 },
		chat: { gb: 1, color: 'var(--color-amber)', x: 188, y: 84, w: 114, h: 58 },
		game: { gb: 3, color: 'var(--color-muted)', x: 58, y: 92, w: 122, h: 50 }
	};
	const ORDER: OsAppId[] = ['browser', 'music', 'chat', 'game'];
	const THREE: OsAppId[] = ['browser', 'music', 'chat'];

	/** Which parts of the picture are in focus for each scene, the rest fades back. */
	const FOCUS: string[][] = [
		['screen', 'cpu', 'ram', 'disk'],
		['os'],
		['screen', 'os'],
		['screen', 'cpu'],
		['screen', 'ram'],
		['screen', 'cpu', 'ram'],
		['screen', 'ram', 'disk'],
		['screen', 'os', 'disk'],
		[],
		['screen', 'os', 'cpu', 'ram', 'disk']
	];

	let peek = $state<number | null>(null);
	const step = $derived(peek ?? STEP_OF_BEAT[Math.min(beat, STEP_OF_BEAT.length - 1)]);
	const on = (part: string) => FOCUS[step]?.includes(part);
	let reduced = $state(false);

	$effect(() => {
		void beat;
		peek = null;
	});

	// guided lesson, nothing to unlock, visible while Nim narrates
	$effect(() => {
		onshow?.(true);
		oncomplete?.();
		if (typeof window !== 'undefined' && window.matchMedia) {
			reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
		}
	});

	// the optional play scene keeps its own set of open apps
	let mine = $state<OsAppId[]>([...THREE]);
	let saidOpen = false;
	let saidClose = false;
	let wasSlow = false;

	const open = $derived<OsAppId[]>(
		step === PLAY ? mine : step === SWAP ? ['browser', 'music', 'chat', 'game'] : THREE
	);
	const used = $derived(OS_GB + open.reduce((s, a) => s + APP[a].gb, 0));
	const slow = $derived(used > TOTAL);
	const showRam = $derived(step >= 4);
	/** Eight RAM slots, each one GB, coloured by whoever owns it. */
	const slots = $derived.by(() => {
		const out: string[] = Array(OS_GB).fill('os');
		for (const a of open) for (let k = 0; k < APP[a].gb; k++) out.push(a);
		return out;
	});
	const slotColor = (owner: string) =>
		owner === 'os'
			? 'color-mix(in srgb, var(--color-ink) 30%, var(--color-card))'
			: APP[owner as OsAppId].color;

	// the CPU passes from app to app while its scene (or the play scene) is showing
	let turn = $state(0);
	const cycling = $derived(step === 3 || step === PROC || step === PLAY);
	$effect(() => {
		if (!cycling || reduced) {
			turn = 0;
			return;
		}
		const t = setInterval(() => (turn += 1), 1100);
		return () => clearInterval(t);
	});
	const turnApp = $derived(cycling && open.length ? open[turn % open.length] : null);
	const nameOf = (id: OsAppId) => tx.apps.find((a) => a.id === id)?.name ?? '';
	const fill = (s: string, map: Record<string, string | number>) =>
		Object.entries(map).reduce((acc, [k, v]) => acc.replace(`{${k}}`, String(v)), s);

	function toggle(id: OsAppId) {
		const closing = mine.includes(id);
		mine = closing
			? mine.filter((a) => a !== id)
			: ORDER.filter((a) => a === id || mine.includes(a));
		const nowUsed = OS_GB + mine.reduce((s, a) => s + APP[a].gb, 0);
		if (nowUsed > TOTAL) {
			wasSlow = true;
			onstate?.('slow');
		} else if (closing && (!saidClose || wasSlow)) {
			saidClose = true;
			wasSlow = false;
			onstate?.('close');
		} else if (!closing && !saidOpen) {
			saidOpen = true;
			onstate?.('open');
		}
	}

	const popOf = (id: OsAppId) => step === 2 || step === PLAY || (step === SWAP && id === 'game');
	const DEVICE_X = [40, 110, 180, 250, 320];
</script>

{#snippet windowBody(id: OsAppId, x: number, y: number, w: number, h: number, c: string)}
	{#if id === 'browser'}
		<rect x={x + 8} y={y + 18} width={w - 16} height="7" rx="3.5" fill="var(--color-line)" />
		<rect x={x + 8} y={y + 31} width={w * 0.6} height="5" rx="2.5" fill={c} opacity="0.5" />
		<rect x={x + 8} y={y + 41} width={w * 0.75} height="5" rx="2.5" fill="var(--color-line)" />
		<rect x={x + 8} y={y + 50} width={w * 0.5} height="5" rx="2.5" fill="var(--color-line)" />
	{:else if id === 'music'}
		<circle cx={x + 20} cy={y + 34} r="9" fill={c} opacity="0.85" />
		<circle cx={x + 20} cy={y + 34} r="3" fill="var(--color-card)" />
		<rect x={x + 36} y={y + 27} width={w - 48} height="5" rx="2.5" fill="var(--color-line)" />
		<rect x={x + 36} y={y + 37} width={w - 48} height="4" rx="2" fill="var(--color-line)" />
		<rect x={x + 36} y={y + 37} width={(w - 48) * 0.4} height="4" rx="2" fill={c} />
	{:else if id === 'chat'}
		<rect x={x + 8} y={y + 19} width={w * 0.5} height="11" rx="5.5" fill="var(--color-line)" />
		<rect x={x + w * 0.42} y={y + 34} width={w * 0.5} height="11" rx="5.5" fill={c} opacity="0.7" />
		<rect x={x + 8} y={y + h - 11} width={w * 0.35} height="6" rx="3" fill="var(--color-line)" />
	{:else}
		<rect x={x + 10} y={y + h - 12} width={w - 20} height="4" rx="2" fill="var(--color-line)" />
		<circle cx={x + w * 0.35} cy={y + h - 20} r="5" fill={c} />
		<rect x={x + w * 0.62} y={y + h - 26} width="12" height="14" rx="2" fill="var(--color-line)" />
	{/if}
{/snippet}

{#snippet laptop()}
	<svg class="art" viewBox="0 0 360 330" role="img" aria-label={tx.steps[step]?.title}>
		<!-- the laptop -->
		<g class="part" class:dim={!on('screen')}>
			<rect
				x="40"
				y="6"
				width="280"
				height="168"
				rx="12"
				fill="var(--color-card)"
				stroke="var(--color-line)"
				stroke-width="2"
			/>
			<rect x="50" y="16" width="260" height="148" rx="6" fill="var(--color-paper)" />
			{#key step === 2 || step === PLAY}
				{#each open as id, i (id)}
					{@const a = APP[id]}
					{@const has = turnApp === id}
					<g class:pop={popOf(id)} style="animation-delay:{step === 2 ? i * 0.7 : 0}s">
						<rect
							x={a.x}
							y={a.y}
							width={a.w}
							height={a.h}
							rx="6"
							fill="var(--color-card)"
							stroke={has ? a.color : 'var(--color-line)'}
							stroke-width={has ? 2.4 : 1.2}
							class="win"
						/>
						<path
							d="M{a.x} {a.y + 12} V{a.y + 6} a6 6 0 0 1 6 -6 H{a.x +
								a.w -
								6} a6 6 0 0 1 6 6 V{a.y + 12} Z"
							fill="color-mix(in srgb, {a.color} 22%, var(--color-card))"
						/>
						<text x={a.x + 8} y={a.y + 6} dy="0.35em" class="t-win">{nameOf(id)}</text>
						{#if step === PROC}
							<text x={a.x + a.w - 7} y={a.y + 6} dy="0.35em" text-anchor="end" class="t-pid"
								>{PID[id]}</text
							>
						{/if}
						{@render windowBody(id, a.x, a.y, a.w, a.h, a.color)}
					</g>
				{/each}
			{/key}
			<!-- taskbar -->
			<rect x="50" y="150" width="260" height="14" fill="var(--color-card)" />
			{#each ORDER as id, i (id)}
				<circle
					cx={150 + i * 20}
					cy="157"
					r="4"
					fill={open.includes(id) ? APP[id].color : 'var(--color-line)'}
				/>
			{/each}
			{#if slow}
				<g class="spin-wrap">
					<circle cx="180" cy="84" r="16" fill="var(--color-card)" opacity="0.9" />
					<path
						d="M180 72 a12 12 0 0 1 12 12"
						fill="none"
						stroke="var(--color-danger)"
						stroke-width="3"
						stroke-linecap="round"
						class="spin"
					/>
				</g>
				<g>
					<rect x="152" y="104" width="56" height="18" rx="9" fill="var(--color-danger)" />
					<text x="180" y="113" dy="0.35em" text-anchor="middle" class="t-badge">{tx.slowTag}</text>
				</g>
			{/if}
			<path
				d="M18 176 H342 L332 188 H28 Z"
				fill="var(--color-card)"
				stroke="var(--color-line)"
				stroke-width="2"
				stroke-linejoin="round"
			/>
		</g>

		<!-- wires from the laptop through the OS to the hardware -->
		<g class="wires" class:shown={step >= 1}>
			<path d="M180 188 V204" />
			<path d="M100 232 L70 252" />
			<path d="M180 232 V264" />
			<path d="M260 232 L290 252" />
		</g>

		<!-- the OS, the manager in the middle -->
		{#if step === 0}
			<g class="ask">
				<circle
					cx="180"
					cy="218"
					r="13"
					fill="var(--color-card)"
					stroke="var(--color-line)"
					stroke-width="1.5"
				/>
				<text x="180" y="218" dy="0.35em" text-anchor="middle" class="t-q">?</text>
			</g>
		{:else}
			<g class="part osband" class:dim={!on('os')}>
				<rect
					x="40"
					y="204"
					width="280"
					height="28"
					rx="14"
					fill="var(--color-brand-soft)"
					stroke="var(--color-brand)"
					stroke-width="1.5"
				/>
				<text x="180" y="218" dy="0.35em" text-anchor="middle" class="t-os">{tx.osLabel}</text>
			</g>
		{/if}

		<!-- CPU -->
		<g class="part" class:dim={!on('cpu')}>
			{#each [0, 1, 2, 3] as k (k)}
				<rect x={52 + k * 11} y="247" width="4" height="6" rx="1" fill="var(--color-faint)" />
				<rect x={52 + k * 11} y="301" width="4" height="6" rx="1" fill="var(--color-faint)" />
			{/each}
			<rect
				x="45"
				y="252"
				width="50"
				height="50"
				rx="8"
				fill={turnApp
					? `color-mix(in srgb, ${APP[turnApp].color} 22%, var(--color-card))`
					: 'var(--color-card)'}
				stroke={turnApp ? APP[turnApp].color : 'var(--color-line)'}
				stroke-width="2"
				class="chip"
			/>
			<text x="70" y="277" dy="0.35em" text-anchor="middle" class="t-hw">{tx.cpuLabel}</text>
			{#if turnApp}
				<text x="70" y="322" text-anchor="middle" class="t-sub">
					{fill(tx.turn, { app: nameOf(turnApp) })}
				</text>
			{/if}
		</g>

		<!-- RAM -->
		<g class="part" class:dim={!on('ram')}>
			<rect
				x="120"
				y="264"
				width="120"
				height="28"
				rx="4"
				fill="var(--color-card)"
				stroke={slow && showRam ? 'var(--color-danger)' : 'var(--color-line)'}
				stroke-width="2"
			/>
			{#each Array(TOTAL) as _, k (k)}
				<rect
					x={124 + k * 14.2}
					y="269"
					width="12"
					height="18"
					rx="2.5"
					fill={showRam && slots[k] ? slotColor(slots[k]) : 'var(--color-line)'}
					class="slot"
				/>
			{/each}
			<text x="180" y="258" text-anchor="middle" class="t-hw small">{tx.ramLabel}</text>
			{#if showRam}
				<text x="180" y="310" text-anchor="middle" class="t-sub" class:bad={slow}>
					{fill(tx.ramUsed, { n: used })}
				</text>
			{/if}
		</g>

		<!-- storage -->
		<g class="part" class:dim={!on('disk')}>
			<rect
				x="265"
				y="252"
				width="50"
				height="50"
				rx="8"
				fill="var(--color-card)"
				stroke="var(--color-line)"
				stroke-width="2"
			/>
			<rect x="273" y="260" width="34" height="5" rx="2.5" fill="var(--color-line)" />
			<rect x="273" y="269" width="24" height="5" rx="2.5" fill="var(--color-line)" />
			{#if slow && showRam}
				<rect x="273" y="282" width="34" height="12" rx="3" fill={APP.game.color} class="pop" />
			{/if}
			<text x="290" y="322" text-anchor="middle" class="t-hw small">{tx.diskLabel}</text>
		</g>

		<!-- requests travelling through the OS -->
		{#if !reduced && step === 1}
			{#each [['M180 188 V204 M100 232 L70 252', 'var(--color-brand)'], ['M180 188 V204 M180 232 V264', 'var(--color-grass)'], ['M180 188 V204 M260 232 L290 252', 'var(--color-amber)']] as [p, c], i (i)}
				<circle r="4.5" fill={c}>
					<animateMotion dur="2.4s" begin="{i * 0.8}s" repeatCount="indefinite" path={p} />
				</circle>
			{/each}
		{/if}
		{#if step === FILES}
			<g>
				{#if reduced}
					<g transform="translate(260 218)">{@render file()}</g>
				{:else}
					<g>
						{@render file()}
						<animateMotion
							dur="3s"
							repeatCount="indefinite"
							path="M290 252 L260 232 M180 204 V188 L250 54"
						/>
					</g>
				{/if}
			</g>
		{/if}
		{#if slow && showRam && !reduced}
			<rect width="10" height="8" rx="2" fill={APP.game.color} x="-5" y="-4">
				<animateMotion dur="1.6s" repeatCount="indefinite" path="M232 278 L290 288" />
			</rect>
		{/if}
	</svg>
{/snippet}

{#snippet file()}
	<rect
		x="-9"
		y="-11"
		width="18"
		height="22"
		rx="3"
		fill="var(--color-card)"
		stroke="var(--color-grass)"
		stroke-width="2"
	/>
	<circle cx="-1" cy="4" r="3" fill="var(--color-grass)" />
	<path
		d="M2 4 V-5 L5 -3"
		fill="none"
		stroke="var(--color-grass)"
		stroke-width="1.6"
		stroke-linecap="round"
	/>
	<text x="14" y="0" dy="0.35em" class="t-file">{tx.fileName}</text>
{/snippet}

{#snippet names()}
	<svg class="art" viewBox="0 0 360 190" role="img" aria-label={tx.steps[NAMES].title}>
		{#each tx.devices as d, i (i)}
			{@const cx = DEVICE_X[i]}
			<g class="pop" style="animation-delay:{i * 0.35}s">
				{#if i < 2}
					<rect
						x={cx - 27}
						y="66"
						width="54"
						height="38"
						rx="5"
						fill="var(--color-card)"
						stroke="var(--color-line)"
						stroke-width="2"
					/>
					<rect
						x={cx - 22}
						y="71"
						width="44"
						height="28"
						rx="2"
						fill={i === 0 ? 'var(--color-brand-soft)' : 'var(--color-paper)'}
					/>
					<rect
						x={cx - 33}
						y="104"
						width="66"
						height="7"
						rx="3.5"
						fill="var(--color-card)"
						stroke="var(--color-line)"
						stroke-width="2"
					/>
				{:else if i === 2}
					<rect
						x={cx - 22}
						y="54"
						width="44"
						height="58"
						rx="6"
						fill="var(--color-card)"
						stroke="var(--color-line)"
						stroke-width="2"
					/>
					{#each [0, 1, 2] as k (k)}
						<rect
							x={cx - 16}
							y={61 + k * 16}
							width="32"
							height="11"
							rx="2.5"
							fill="var(--color-paper)"
							stroke="var(--color-line)"
							stroke-width="1"
						/>
						<circle cx={cx + 10} cy={66.5 + k * 16} r="2" fill="var(--color-grass)" />
					{/each}
				{:else}
					<!-- a phone about twice as tall as it is wide, like a real one -->
					<rect
						x={cx - 15}
						y="53"
						width="30"
						height="61"
						rx="7"
						fill="var(--color-card)"
						stroke="var(--color-line)"
						stroke-width="2"
					/>
					<rect
						x={cx - 11}
						y="60"
						width="22"
						height="45"
						rx="3"
						fill={i === 3 ? 'var(--color-grass-soft)' : 'var(--color-paper)'}
					/>
					<rect x={cx - 5} y="108" width="10" height="2.5" rx="1.25" fill="var(--color-line)" />
				{/if}
				<text x={cx} y="136" text-anchor="middle" class="t-name">{d.os}</text>
				<text x={cx} y="152" text-anchor="middle" class="t-kind">{d.kind}</text>
			</g>
		{/each}
	</svg>
{/snippet}

{#snippet visual(s: number)}
	<div class="scene" class:still={reduced}>
		{#if s === NAMES}
			{@render names()}
		{:else}
			{@render laptop()}
			{#if s === PROC}
				<div class="procs">
					<p class="proc-title">{tx.procTitle}</p>
					<div class="prow head">
						<span>{tx.procCols.pid}</span><span>{tx.procCols.name}</span><span
							>{tx.procCols.ram}</span
						><span>{tx.procCols.state}</span>
					</div>
					{#each open as id (id)}
						{@const run = turnApp === id}
						<div class="prow" class:run style="--c:{APP[id].color}">
							<span class="pid">{PID[id]}</span>
							<span class="pname"><i></i>{nameOf(id)}</span>
							<span>{APP[id].gb} GB</span>
							<span class="state">{run ? tx.running : tx.waiting}</span>
						</div>
					{/each}
				</div>
			{/if}
			{#if s === PLAY}
				<div class="dock">
					<span class="hint">{tx.dockHint}</span>
					<div class="apps">
						{#each tx.apps as a (a.id)}
							<button
								type="button"
								class="app"
								class:open={mine.includes(a.id)}
								aria-pressed={mine.includes(a.id)}
								aria-label={fill(tx.toggleLabel, { app: a.name })}
								style="--c:{APP[a.id].color}"
								onclick={() => toggle(a.id)}
							>
								<span class="dot"></span>{a.name}
							</button>
						{/each}
					</div>
				</div>
			{/if}
		{/if}
	</div>
{/snippet}

<div
	class="flex h-full w-full items-start justify-center overflow-y-auto pb-28 md:items-center md:pb-4"
>
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.scene {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
	}
	.art {
		width: 100%;
		max-width: 440px;
	}
	.part {
		transition: opacity 0.5s;
	}
	.part.dim {
		opacity: 0.4;
	}
	.wires path {
		fill: none;
		stroke: var(--color-line);
		stroke-width: 2;
		stroke-linecap: round;
	}
	.wires {
		opacity: 0;
		transition: opacity 0.6s;
	}
	.wires.shown {
		opacity: 1;
	}
	.osband {
		transform-box: fill-box;
		transform-origin: center;
		animation: pop 0.6s cubic-bezier(0.3, 0.8, 0.3, 1.2) both;
	}
	.osband.dim {
		opacity: 0.55;
	}
	.pop {
		transform-box: fill-box;
		transform-origin: center;
		animation: pop 0.55s cubic-bezier(0.3, 0.8, 0.3, 1.2) both;
	}
	.win,
	.chip {
		transition:
			stroke 0.3s,
			fill 0.3s;
	}
	.slot {
		transition: fill 0.4s;
	}
	.spin {
		transform-box: view-box;
		transform-origin: 180px 84px;
		animation: spin 1s linear infinite;
	}
	.t-win {
		font-size: 8px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.t-pid {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 7.5px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.t-os {
		font-size: 12px;
		font-weight: 800;
		fill: var(--color-brand);
	}
	.t-q {
		font-size: 14px;
		font-weight: 800;
		fill: var(--color-faint);
	}
	.t-hw {
		font-size: 12px;
		font-weight: 800;
		fill: var(--color-ink);
	}
	.t-hw.small {
		font-size: 11px;
		fill: var(--color-muted);
	}
	.t-sub {
		font-size: 10px;
		font-weight: 700;
		fill: var(--color-muted);
	}
	.t-sub.bad {
		fill: var(--color-danger);
	}
	.t-badge {
		font-size: 10px;
		font-weight: 800;
		fill: #fff;
	}
	.t-file {
		font-size: 9px;
		font-weight: 700;
		fill: var(--color-grass);
	}
	.t-name {
		font-size: 12px;
		font-weight: 800;
		fill: var(--color-ink);
	}
	.t-kind {
		font-size: 10px;
		fill: var(--color-muted);
	}

	/* the little process list under the laptop */
	.procs {
		width: 100%;
		max-width: 360px;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
		padding: 8px 10px;
	}
	.proc-title {
		margin: 0 0 4px;
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.prow {
		display: grid;
		grid-template-columns: 44px 1fr 48px 64px;
		align-items: center;
		gap: 6px;
		border-radius: 8px;
		padding: 3px 6px;
		font-size: 12.5px;
		color: var(--color-muted);
		transition: background 0.3s;
	}
	.prow.head {
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-faint);
	}
	.prow.run {
		background: color-mix(in srgb, var(--c) 14%, var(--color-card));
		color: var(--color-ink);
	}
	.pid {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-weight: 700;
	}
	.pname {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		font-weight: 700;
	}
	.pname i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--c);
	}
	.state {
		font-weight: 700;
	}
	.prow.run .state {
		color: var(--c);
	}

	/* the optional dock under the laptop */
	.dock {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.hint {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.apps {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.app {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border: 1.5px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 5px 12px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-muted);
		cursor: pointer;
		transition:
			border-color 0.2s,
			color 0.2s;
	}
	.app .dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-line);
		transition: background 0.2s;
	}
	.app.open {
		border-color: var(--c);
		color: var(--color-ink);
	}
	.app.open .dot {
		background: var(--c);
	}
	.app:focus-visible {
		outline: 2px solid var(--color-brand);
		outline-offset: 2px;
	}

	@keyframes pop {
		from {
			opacity: 0;
			transform: scale(0.7);
		}
	}
	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.part,
		.wires,
		.win,
		.chip,
		.slot,
		.prow,
		.app,
		.app .dot {
			transition: none;
		}
		.pop,
		.osband,
		.spin {
			animation: none;
		}
	}
</style>
