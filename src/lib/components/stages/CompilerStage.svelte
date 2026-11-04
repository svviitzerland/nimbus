<script lang="ts">
	// Guided "watch" stage. Nim's beat picks what is in focus, and the picture plays by itself.
	// Opening: words cannot reach the CPU, then a translator turns them into 0 and 1.
	// Then two little monitors translate the same program side by side (compiler versus
	// interpreter), with a typo part, a Grace Hopper portrait, and a "translate once" part.
	// The only optional play is a typo toggle on the last beat.
	import { fade } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { CompilerText } from '$lib/chapters/basics/compiler/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as CompilerText);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});

	const lastBeat = $derived(tx.intro.length - 1);
	const isPlay = $derived(beat >= lastBeat);

	// The learner may tap a dot to peek at another part. A new beat clears the peek.
	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const step = $derived(peek ?? Math.min(beat, tx.steps.length - 1));

	let userTypo = $state(false);
	function toggleTypo() {
		userTypo = !userTypo;
		onstate?.(userTypo ? 'typo' : 'fixed');
	}

	type LaneMode = 'play' | 'done' | 'idle';
	type View = {
		scene: 'cpu' | 'lanes' | 'hopper';
		translate: boolean;
		comp: LaneMode;
		interp: LaneMode;
		typo: boolean;
		cached: boolean;
	};
	const view = $derived.by((): View => {
		const base: View = {
			scene: 'lanes',
			translate: false,
			comp: 'play',
			interp: 'play',
			typo: false,
			cached: false
		};
		if (step === 0) return { ...base, scene: 'cpu' };
		if (step === 1) return { ...base, scene: 'cpu', translate: true };
		if (step === 2) return { ...base, interp: 'idle' };
		if (step === 3) return { ...base, comp: 'done' };
		if (step === 5) return { ...base, typo: true };
		if (step === 6) return { ...base, scene: 'hopper' };
		if (step === 7) return { ...base, cached: true };
		if (step === tx.steps.length - 1 && isPlay && peek === null) return { ...base, typo: userTypo };
		return base;
	});

	// Timings in ms, slow enough to follow.
	const C_T = 650; // compiler, translating one line
	const C_R = 230; // compiled file, running one line
	const I_T = 1000; // interpreter, one line (translate, then run)
	const I_READ = 560; // the translate part of that line

	const n = $derived(tx.code.length);
	const L = $derived(tx.typoLine);
	const shownCode = $derived(tx.code.map((c, i) => (view.typo && i === L ? tx.typoCode : c)));

	type Lane = {
		translated: boolean[];
		current: number;
		ran: number;
		error: boolean;
		saved: boolean;
		status: string;
		end: number;
	};

	function compilerAt(t: number): Lane {
		const translated = Array(n).fill(false);
		if (view.typo) {
			const errAt = (L + 1) * C_T;
			const k = Math.floor(t / C_T);
			for (let i = 0; i < Math.min(k, L); i++) translated[i] = true;
			const error = t >= errAt;
			return {
				translated,
				current: error ? L : k,
				ran: 0,
				error,
				saved: false,
				status: error ? tx.errCompile.replace('{n}', String(L + 1)) : tx.compiling,
				end: errAt
			};
		}
		const tEnd = view.cached ? 0 : n * C_T;
		const k = Math.floor(t / C_T);
		for (let i = 0; i < n; i++) translated[i] = view.cached || i < k;
		const end = tEnd + n * C_R;
		if (t < tEnd)
			return {
				translated,
				current: k,
				ran: 0,
				error: false,
				saved: false,
				status: tx.compiling,
				end
			};
		const ran = Math.min(n, Math.floor((t - tEnd) / C_R));
		return {
			translated,
			current: ran < n ? ran : -1,
			ran,
			error: false,
			saved: true,
			status: ran >= n ? tx.done : view.cached ? tx.reused : tx.saved,
			end
		};
	}

	function interpreterAt(t: number): Lane {
		const translated = Array(n).fill(false);
		const k = Math.floor(t / I_T);
		const within = t - k * I_T;
		if (view.typo && (k > L || (k === L && within >= I_READ))) {
			return {
				translated,
				current: L,
				ran: L,
				error: true,
				saved: false,
				status: tx.errInterp.replace('{n}', String(L + 1)),
				end: L * I_T + I_READ
			};
		}
		const end = n * I_T;
		if (k >= n)
			return { translated, current: -1, ran: n, error: false, saved: false, status: tx.done, end };
		translated[k] = within >= I_READ * 0.5;
		return {
			translated,
			current: k,
			ran: k,
			error: false,
			saved: false,
			status: tx.readingLine.replace('{n}', String(k + 1)),
			end
		};
	}

	const idleLane = $derived<Lane>({
		translated: Array(n).fill(false),
		current: -1,
		ran: 0,
		error: false,
		saved: false,
		status: tx.waiting,
		end: 0
	});

	// One clock drives both lanes, restarted whenever the view changes, looping with a pause.
	let t = $state(0);
	const BIG = 1e9;
	const viewKey = $derived(
		`${view.scene}|${view.comp}|${view.interp}|${view.typo}|${view.cached}|${view.translate}`
	);
	$effect(() => {
		void viewKey;
		if (view.scene !== 'lanes') return;
		const reduced =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
		if (reduced) {
			t = BIG;
			return;
		}
		t = 0;
		let start = Date.now();
		const id = setInterval(() => {
			const now = Date.now() - start;
			const endC = view.comp === 'play' ? compilerAt(BIG).end : 0;
			const endI = view.interp === 'play' ? interpreterAt(BIG).end : 0;
			if (now > Math.max(endC, endI) + 2600) {
				start = Date.now();
				t = 0;
			} else t = now;
		}, 60);
		return () => clearInterval(id);
	});

	const comp = $derived(
		view.comp === 'idle' ? idleLane : compilerAt(view.comp === 'done' ? BIG : t)
	);
	const interp = $derived(
		view.interp === 'idle' ? idleLane : interpreterAt(view.interp === 'done' ? BIG : t)
	);
</script>

{#snippet laneView(kind: 'comp' | 'interp', lane: Lane, mode: LaneMode)}
	{@const info = kind === 'comp' ? tx.compiler : tx.interpreter}
	<div class="lane" class:dim={mode !== 'play'}>
		<div class="head">
			<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
				{#if kind === 'comp'}
					<path
						d="M3 5.5c3-1.2 6-1.2 9 .5v13c-3-1.7-6-1.7-9-.5Z"
						style="fill:var(--color-brand-soft);stroke:var(--color-brand)"
						stroke-width="1.5"
						stroke-linejoin="round"
					/>
					<path
						d="M21 5.5c-3-1.2-6-1.2-9 .5v13c3-1.7 6-1.7 9-.5Z"
						style="fill:var(--color-brand-soft);stroke:var(--color-brand)"
						stroke-width="1.5"
						stroke-linejoin="round"
					/>
				{:else}
					<path
						d="M4 5h16a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1h-9l-4 3v-3H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1Z"
						style="fill:var(--color-amber-soft);stroke:var(--color-amber)"
						stroke-width="1.5"
						stroke-linejoin="round"
					/>
					<circle cx="8.5" cy="10.5" r="1" style="fill:var(--color-amber)" />
					<circle cx="12" cy="10.5" r="1" style="fill:var(--color-amber)" />
					<circle cx="15.5" cy="10.5" r="1" style="fill:var(--color-amber)" />
				{/if}
			</svg>
			<div class="min-w-0">
				<div class="name">{info.name}</div>
				<div class="sub">{info.sub}</div>
			</div>
		</div>
		<div class="monitor">
			<div class="code">
				{#each shownCode as line, i (i)}
					{@const isErr = lane.error && i === L}
					<div
						class="row"
						class:cur={!lane.error && lane.current === i}
						class:err={isErr}
						class:ranrow={i < lane.ran}
					>
						<span class="gut" class:bits={lane.translated[i]}>
							{lane.translated[i] ? '01' : i + 1}
						</span>
						<span class="src">{line}</span>
					</div>
				{/each}
			</div>
			{#if kind === 'comp'}
				<div class="file" class:show={lane.saved}>
					<svg viewBox="0 0 16 16" width="12" height="12" aria-hidden="true">
						<path
							d="M3 1.5h7l3 3v10H3Z"
							style="fill:var(--color-grass-soft);stroke:var(--color-grass)"
							stroke-width="1.3"
						/>
					</svg>
					{tx.fileName}
				</div>
			{/if}
			<div class="screen" aria-label={tx.screenLabel}>
				{#each tx.output.slice(0, lane.ran) as out, i (i)}
					{#if out !== null}<div>{out}</div>{/if}
				{/each}
				{#if lane.error}<div class="crash">✕ {shownCode[L]}</div>{/if}
			</div>
		</div>
		<div class="stand"></div>
		<div class="status" class:bad={lane.error} class:good={lane.status === tx.done}>
			{lane.status}
		</div>
	</div>
{/snippet}

{#snippet visual()}
	<div class="w-full">
		{#key view.scene}
			<div in:fade={{ duration: 260 }}>
				{#if view.scene === 'cpu'}
					<svg viewBox="0 0 420 220" class="w-full" role="img" aria-label={tx.steps[step].title}>
						<!-- the code sheet -->
						<g>
							<path
								d="M14 24h138l18 18v160H14Z"
								style="fill:var(--color-card);stroke:var(--color-line)"
								stroke-width="2"
							/>
							<path d="M152 24v18h18" style="fill:none;stroke:var(--color-line)" stroke-width="2" />
							<text x="26" y="46" class="lbl">{tx.codeLabel}</text>
							{#each tx.code as line, i (i)}
								<text x="26" y={78 + i * 26} class="mono sheet">{line}</text>
							{/each}
						</g>
						<!-- the CPU chip -->
						<g>
							{#each [0, 1, 2, 3, 4] as p (p)}
								<rect
									x={322 + p * 14}
									y="52"
									width="4"
									height="12"
									rx="1"
									style="fill:var(--color-faint)"
								/>
								<rect
									x={322 + p * 14}
									y="156"
									width="4"
									height="12"
									rx="1"
									style="fill:var(--color-faint)"
								/>
								<rect
									x="302"
									y={72 + p * 14}
									width="12"
									height="4"
									rx="1"
									style="fill:var(--color-faint)"
								/>
								<rect
									x="390"
									y={72 + p * 14}
									width="12"
									height="4"
									rx="1"
									style="fill:var(--color-faint)"
								/>
							{/each}
							<rect
								x="312"
								y="62"
								width="80"
								height="96"
								rx="10"
								class="chip"
								class:ok={view.translate}
							/>
							<text x="352" y="104" text-anchor="middle" class="cpu">{tx.cpuLabel}</text>
							<text x="352" y="128" text-anchor="middle" class="mono faint">0 1 1 0</text>
							{#if !view.translate}
								<g class="huh">
									<circle cx="392" cy="56" r="15" style="fill:var(--color-danger)" />
									<text x="392" y="62" text-anchor="middle" class="q">?</text>
								</g>
							{:else}
								<g>
									<circle cx="392" cy="56" r="15" style="fill:var(--color-grass)" />
									<path
										d="M385 56l5 5 9-10"
										style="fill:none;stroke:var(--color-card)"
										stroke-width="3"
										stroke-linecap="round"
										stroke-linejoin="round"
									/>
								</g>
							{/if}
						</g>
						{#if !view.translate}
							<line
								x1="178"
								y1="110"
								x2="292"
								y2="110"
								style="stroke:var(--color-line)"
								stroke-width="3"
							/>
							<g class="fly bounce"><text x="180" y="104" class="mono word">print</text></g>
						{:else}
							<line
								x1="176"
								y1="110"
								x2="200"
								y2="110"
								style="stroke:var(--color-line)"
								stroke-width="3"
							/>
							<line
								x1="262"
								y1="110"
								x2="296"
								y2="110"
								style="stroke:var(--color-line)"
								stroke-width="3"
							/>
							<rect
								x="200"
								y="78"
								width="62"
								height="64"
								rx="12"
								style="fill:var(--color-brand-soft);stroke:var(--color-brand)"
								stroke-width="2"
							/>
							<path
								d="M216 96h14M223 92v4M218 104c3 6 8 9 12 10M229 100c-2 7-6 11-11 14M240 116l5-14 5 14M242 111h6"
								style="fill:none;stroke:var(--color-brand)"
								stroke-width="2"
								stroke-linecap="round"
							/>
							<text x="231" y="160" text-anchor="middle" class="lbl">{tx.translatorLabel}</text>
							<g class="fly in"><text x="170" y="104" class="mono word">print</text></g>
							<g class="fly out"><text x="262" y="104" class="mono bitsTxt">0110</text></g>
						{/if}
					</svg>
				{:else if view.scene === 'hopper'}
					<div class="hopper">
						<figure class="frame">
							<img
								src="/images/people/grace-hopper.jpg"
								alt={tx.hopper.alt}
								width="500"
								height="625"
								loading="lazy"
							/>
							<figcaption>
								<b>{tx.hopper.name}</b>
								<span>{tx.hopper.caption}</span>
							</figcaption>
						</figure>
						<div class="logbook" aria-hidden="true">
							<div class="tape">
								<svg viewBox="0 0 80 50" width="80" height="50">
									<rect
										x="12"
										y="10"
										width="56"
										height="30"
										rx="2"
										style="fill:var(--color-amber-soft)"
										opacity="0.9"
									/>
									<ellipse cx="40" cy="25" rx="4" ry="11" style="fill:var(--color-ink)" />
									<path d="M37 20c-10-8-22-6-24 2s10 8 24 1Z" style="fill:var(--color-muted)" />
									<path d="M43 20c10-8 22-6 24 2s-10 8-24 1Z" style="fill:var(--color-muted)" />
									<path
										d="M38 15l-4-6M42 15l4-6"
										style="stroke:var(--color-ink)"
										stroke-width="1"
									/>
								</svg>
							</div>
							<p class="hand">{tx.hopper.logbook}</p>
							<p class="year">Harvard Mark II, 1947</p>
						</div>
					</div>
				{:else}
					<div class="lanes">
						{@render laneView('comp', comp, view.comp)}
						{@render laneView('interp', interp, view.interp)}
					</div>
				{/if}
			</div>
		{/key}
		{#if isPlay && peek === null}
			<div class="mt-4 flex justify-center">
				<button type="button" class="play" class:on={userTypo} onclick={toggleTypo}>
					{userTypo ? tx.fixTypo : tx.addTypo}
				</button>
			</div>
		{/if}
	</div>
{/snippet}

<div class="flex w-full justify-center px-1 pb-28 md:pb-6">
	<Guide steps={tx.steps} active={step} onselect={(k) => (peek = k)} {visual} />
</div>

<style>
	.lbl {
		font-size: 12px;
		font-weight: 700;
		fill: var(--color-faint);
	}
	.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		fill: var(--color-ink);
	}
	.mono.sheet {
		font-size: 11px;
	}
	.faint {
		fill: var(--color-faint);
	}
	.word {
		fill: var(--color-brand);
		font-weight: 700;
	}
	.bitsTxt {
		fill: var(--color-grass);
		font-weight: 700;
	}
	.cpu {
		font-size: 18px;
		font-weight: 800;
		fill: var(--color-ink);
	}
	.q {
		font-size: 18px;
		font-weight: 800;
		fill: var(--color-card);
	}
	.chip {
		fill: var(--color-card);
		stroke: var(--color-faint);
		stroke-width: 2;
		transition:
			stroke 0.4s,
			fill 0.4s;
	}
	.chip.ok {
		fill: var(--color-grass-soft);
		stroke: var(--color-grass);
	}
	.fly.bounce {
		animation: bounce 2.6s ease-in-out infinite;
	}
	.fly.in {
		animation: flyIn 2.2s linear infinite;
	}
	.fly.out {
		animation: flyOut 2.2s linear infinite;
	}
	.huh {
		animation: pulse 2.6s ease-in-out infinite;
		transform-origin: 392px 56px;
	}
	@keyframes bounce {
		0% {
			transform: translateX(0);
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		60% {
			transform: translateX(84px);
			opacity: 1;
		}
		75% {
			transform: translateX(70px);
			opacity: 0.6;
		}
		100% {
			transform: translateX(70px);
			opacity: 0;
		}
	}
	@keyframes flyIn {
		0% {
			transform: translateX(0);
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		45% {
			transform: translateX(26px);
			opacity: 0;
		}
		100% {
			transform: translateX(26px);
			opacity: 0;
		}
	}
	@keyframes flyOut {
		0%,
		45% {
			transform: translateX(0);
			opacity: 0;
		}
		55% {
			opacity: 1;
		}
		90% {
			transform: translateX(10px);
			opacity: 1;
		}
		100% {
			transform: translateX(14px);
			opacity: 0;
		}
	}
	@keyframes pulse {
		0%,
		100% {
			transform: scale(1);
		}
		60% {
			transform: scale(1.12);
		}
	}

	.lanes {
		display: grid;
		grid-template-columns: repeat(2, minmax(0, 1fr));
		gap: 12px;
	}
	.lane {
		display: flex;
		min-width: 0;
		flex-direction: column;
		align-items: stretch;
		transition: opacity 0.4s;
	}
	.lane.dim {
		opacity: 0.45;
	}
	.head {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 8px;
	}
	.name {
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
		color: var(--color-ink);
		line-height: 1.1;
	}
	.sub {
		font-size: 11px;
		color: var(--color-faint);
	}
	.monitor {
		border: 6px solid var(--color-ink);
		border-radius: 12px;
		background: var(--color-card);
		padding: 8px;
		box-shadow: 0 10px 24px rgba(22, 40, 60, 0.08);
	}
	.stand {
		align-self: center;
		width: 34%;
		height: 10px;
		border-radius: 0 0 8px 8px;
		background: var(--color-line);
	}
	.code {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
	}
	.row {
		display: flex;
		align-items: center;
		gap: 6px;
		border-radius: 6px;
		padding: 2px 4px;
		white-space: pre;
		color: var(--color-ink);
		transition: background 0.25s;
	}
	.row.cur {
		background: var(--color-brand-soft);
	}
	.row.err {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.src {
		overflow: hidden;
		text-overflow: clip;
	}
	.gut {
		flex: none;
		width: 20px;
		border-radius: 4px;
		text-align: center;
		font-size: 10px;
		color: var(--color-faint);
		transition:
			background 0.25s,
			color 0.25s;
	}
	.gut.bits {
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-weight: 700;
	}
	.file {
		display: flex;
		align-items: center;
		gap: 5px;
		margin: 6px 4px 0;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-grass);
		opacity: 0;
		transition: opacity 0.4s;
	}
	.file.show {
		opacity: 1;
	}
	.screen {
		margin-top: 8px;
		min-height: 64px;
		border-radius: 6px;
		background: var(--color-ink);
		padding: 6px 8px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 12px;
		line-height: 1.45;
		color: var(--color-paper);
	}
	.crash {
		color: var(--color-danger);
		font-weight: 700;
		overflow: hidden;
		white-space: nowrap;
	}
	.status {
		margin-top: 8px;
		min-height: 2.6em;
		text-align: center;
		font-size: 12px;
		line-height: 1.3;
		color: var(--color-muted);
	}
	.status.bad {
		color: var(--color-danger);
		font-weight: 600;
	}
	.status.good {
		color: var(--color-grass);
		font-weight: 600;
	}

	.hopper {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 18px;
	}
	.frame {
		margin: 0;
		width: 168px;
		border: 1px solid var(--color-line);
		border-radius: 14px;
		background: var(--color-card);
		padding: 8px 8px 10px;
		box-shadow: 0 10px 24px rgba(22, 40, 60, 0.1);
		transform: rotate(-1.5deg);
	}
	.frame img {
		display: block;
		width: 100%;
		height: auto;
		border-radius: 8px;
	}
	.frame figcaption {
		margin-top: 8px;
		text-align: center;
		font-size: 12px;
		line-height: 1.35;
		color: var(--color-muted);
	}
	.frame figcaption b {
		display: block;
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.logbook {
		width: 170px;
		border: 1px solid var(--color-line);
		border-radius: 6px;
		background: var(--color-card);
		background-image: repeating-linear-gradient(
			to bottom,
			transparent 0,
			transparent 21px,
			var(--color-line) 22px
		);
		padding: 14px 14px 12px;
		transform: rotate(1.5deg);
	}
	.tape {
		display: flex;
		justify-content: center;
	}
	.hand {
		margin: 8px 0 0;
		font-family: var(--font-display);
		font-style: italic;
		font-size: 14px;
		line-height: 1.45;
		color: var(--color-ink);
	}
	.year {
		margin: 6px 0 0;
		font-size: 11px;
		color: var(--color-faint);
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
		border-color: var(--color-grass);
		color: var(--color-grass);
	}

	@media (max-width: 520px) {
		.code,
		.screen {
			font-size: 10px;
		}
		.monitor {
			border-width: 5px;
			padding: 6px;
		}
		.gut {
			width: 16px;
			font-size: 9px;
		}
		.hopper {
			gap: 10px;
		}
		.frame {
			width: 140px;
		}
		.logbook {
			width: 150px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.fly,
		.huh {
			animation: none;
		}
		.fly.in,
		.fly.out {
			opacity: 1;
		}
		.chip,
		.row,
		.gut,
		.file,
		.lane {
			transition: none;
		}
	}
</style>
