<script lang="ts">
	// Guided "watch" stage. A stack assembles itself while Nim talks, hardware and operating
	// system at the bottom, then the runtime (the stage), then library bricks (ready made
	// parts), with your small app.js on top. A little shop window above shows if it runs.
	// The only optional play is taking the runtime away on the last beat.
	import Guide from '$lib/components/Guide.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { RuntimeText } from '$lib/chapters/basics/runtime/types';

	let { text, beat = 0, oncomplete, onstate, onshow }: StageProps = $props();
	const tx = $derived(text as RuntimeText);

	$effect(() => {
		onshow?.(true);
		oncomplete?.();
	});

	const lastBeat = $derived(tx.intro.length - 1);
	const isPlay = $derived(beat >= lastBeat);

	let peek = $state<number | null>(null);
	$effect(() => {
		void beat;
		peek = null;
	});
	const step = $derived(peek ?? Math.min(beat, tx.steps.length - 1));
	const live = $derived(isPlay && peek === null);

	let removed = $state(false);
	function toggleRuntime() {
		removed = !removed;
		onstate?.(removed ? 'noRuntime' : 'runtime');
	}

	// A clock that restarts on every step, for the typing, the runtime carousel, and the lock.
	let t = $state(0);
	let reduced = $state(false);
	$effect(() => {
		void step;
		reduced =
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
		t = reduced ? 1e9 : 0;
		if (reduced) return;
		const start = Date.now();
		const id = setInterval(() => (t = Date.now() - start), 80);
		return () => clearInterval(id);
	});

	// Step 5, the little terminal types the install command, then the third brick drops in.
	const TYPE_MS = 65;
	const typed = $derived(
		step === 5 ? tx.installCmd.slice(0, Math.floor(t / TYPE_MS)) : tx.installCmd
	);
	const installDoneAt = $derived(tx.installCmd.length * TYPE_MS + 500);
	const installed = $derived(step !== 5 || t >= installDoneAt);

	const runtimeOn = $derived(step >= 1 && !(live && removed));
	const libsCount = $derived(step < 4 ? 0 : step === 4 ? 2 : step === 5 && !installed ? 2 : 3);
	const rtIndex = $derived(step === 2 && !reduced ? Math.floor(t / 1900) % tx.runtimes.length : 0);
	const rt = $derived(tx.runtimes[rtIndex]);

	// Step 8, a loop of three moments, fine on v2, broken on v3, then locked back on v2.
	const lockPhase = $derived(step !== 8 ? -1 : reduced ? 2 : Math.floor(t / 2200) % 3);
	const broken = $derived(lockPhase === 1);

	const floating = $derived(!runtimeOn);
	const codeY = $derived(libsCount > 0 ? 114 : 172);
	const appState = $derived(!runtimeOn ? 'off' : broken ? 'down' : 'up');
	const appLabel = $derived(
		appState === 'up' ? tx.appUp : appState === 'down' ? tx.appDown : tx.appOff
	);

	const LIB_X = [40, 135, 230];
</script>

{#snippet visual()}
	<div class="w-full">
		<svg
			viewBox="0 0 360 390"
			class="mx-auto block w-full max-w-[400px]"
			role="img"
			aria-label={tx.steps[step].title}
		>
			<!-- the shop window, or the terminal while installing -->
			{#if step === 5}
				<g>
					<rect x="60" y="14" width="240" height="78" rx="10" style="fill:var(--color-ink)" />
					<circle cx="76" cy="28" r="3.5" style="fill:var(--color-danger)" />
					<circle cx="88" cy="28" r="3.5" style="fill:var(--color-amber)" />
					<circle cx="100" cy="28" r="3.5" style="fill:var(--color-grass)" />
					<text x="74" y="56" class="term"
						>$ {typed}{typed.length < tx.installCmd.length ? '▍' : ''}</text
					>
					{#if installed}
						<text x="74" y="78" class="term ok">{tx.installDone}</text>
					{/if}
				</g>
			{:else}
				<g>
					<rect
						x="80"
						y="14"
						width="200"
						height="78"
						rx="10"
						style="fill:var(--color-card);stroke:var(--color-line)"
						stroke-width="2"
					/>
					<line
						x1="80"
						y1="34"
						x2="280"
						y2="34"
						style="stroke:var(--color-line)"
						stroke-width="2"
					/>
					<circle cx="94" cy="24" r="3" style="fill:var(--color-line)" />
					<circle cx="104" cy="24" r="3" style="fill:var(--color-line)" />
					<circle cx="114" cy="24" r="3" style="fill:var(--color-line)" />
					<text x="180" y="58" text-anchor="middle" class="app">{tx.appName}</text>
					<circle cx={180 - appLabel.length * 3.4 - 9} cy="76" r="4.5" class="dot {appState}" />
					<text x={180 - appLabel.length * 3.4 + 1} y="80" class="appst {appState}">{appLabel}</text
					>
				</g>
			{/if}

			<!-- hardware -->
			<g>
				<rect
					x="40"
					y="330"
					width="280"
					height="50"
					rx="10"
					class="slab"
					class:dimmed={step === 6}
				/>
				<rect x="58" y="342" width="26" height="26" rx="4" style="fill:var(--color-line)" />
				<rect x="64" y="348" width="14" height="14" rx="2" style="fill:var(--color-faint)" />
				<text x="98" y="352" class="slabT">{tx.layers.hw}</text>
				<text x="98" y="369" class="slabS">{tx.hwNote}</text>
			</g>
			<!-- operating system -->
			<g>
				<rect
					x="40"
					y="274"
					width="280"
					height="50"
					rx="10"
					class="slab"
					class:dimmed={step === 6}
				/>
				<rect
					x="58"
					y="286"
					width="26"
					height="22"
					rx="3"
					style="fill:none;stroke:var(--color-faint)"
					stroke-width="2"
				/>
				<line
					x1="64"
					y1="314"
					x2="78"
					y2="314"
					style="stroke:var(--color-faint)"
					stroke-width="2"
				/>
				<text x="98" y="296" class="slabT">{tx.layers.os}</text>
				<text x="98" y="313" class="slabS">{tx.osNote}</text>
			</g>
			<!-- runtime, the stage -->
			<g
				class="move"
				style="transform:translate({runtimeOn ? 0 : 60}px, {runtimeOn
					? 0
					: -30}px);opacity:{runtimeOn ? 1 : 0}"
			>
				<rect x="40" y="218" width="280" height="50" rx="10" class="rt" class:hl={step === 6} />
				<path d="M56 256h28l-4-18H60Z" style="fill:var(--color-brand)" opacity="0.85" />
				<path
					d="M60 238c4-8 16-8 20 0"
					style="fill:none;stroke:var(--color-brand)"
					stroke-width="2"
				/>
				<text x="98" y="240" class="slabS brandT">{tx.layers.runtime}</text>
				{#key rtIndex}
					<g class="swap">
						<text x="98" y="258" class="slabT">{rt.name}</text>
						<text x={98 + rt.name.length * 8.6 + 8} y="258" class="slabS">{rt.note}</text>
					</g>
				{/key}
			</g>
			<!-- library bricks, ready made parts -->
			<g class:bob={floating && !reduced}>
				{#each tx.libs as lib, i (i)}
					{@const on = i < libsCount}
					{@const bad = broken && i === 2}
					{@const locked = lockPhase === 2 && i === 2}
					<g
						class="move"
						style="transform:translateY({on ? 0 : -70}px);opacity:{on
							? 1
							: 0};transition-delay:{step === 4 ? i * 350 : 0}ms"
					>
						<rect x={LIB_X[i] + 16} y="160" width="16" height="8" rx="2" class="stud" class:bad />
						<rect x={LIB_X[i] + 58} y="160" width="16" height="8" rx="2" class="stud" class:bad />
						<rect
							x={LIB_X[i]}
							y="166"
							width="90"
							height="46"
							rx="7"
							class="brick"
							class:bad
							class:hl={step === 6}
						/>
						<text x={LIB_X[i] + 45} y="194" text-anchor="middle" class="brickT" class:badT={bad}>
							{lib}
						</text>
						{#if step === 8 && i === 2}
							<g>
								<rect
									x={LIB_X[i] + 60}
									y="148"
									width="34"
									height="18"
									rx="9"
									class="ver"
									class:bad
								/>
								<text x={LIB_X[i] + 77} y="161" text-anchor="middle" class="verT" class:badT={bad}>
									{bad ? tx.newVersion : tx.oldVersion}
								</text>
								{#if locked}
									<g transform="translate({LIB_X[i] - 4} 146)">
										<rect
											x="0"
											y="7"
											width="14"
											height="11"
											rx="2"
											style="fill:var(--color-grass)"
										/>
										<path
											d="M3 7V5a4 4 0 0 1 8 0v2"
											style="fill:none;stroke:var(--color-grass)"
											stroke-width="2"
										/>
									</g>
								{/if}
							</g>
						{/if}
					</g>
				{/each}
			</g>
			<!-- your code, the actor on top -->
			<g class:bob={floating && !reduced}>
				<g class="move" style="transform:translateY({codeY - 114}px)">
					<path d="M125 114h96l14 12v28H125Z" class="sheet" class:mine={step === 6} />
					<path d="M221 114v12h14" style="fill:none;stroke:var(--color-line)" stroke-width="2" />
					<text x="137" y="139" class="code">{tx.layers.code}</text>
					{#if floating}
						<g>
							<circle cx="242" cy="114" r="12" style="fill:var(--color-danger)" />
							<text x="242" y="119.5" text-anchor="middle" class="q">?</text>
						</g>
					{/if}
				</g>
			</g>
		</svg>
		{#if live}
			<div class="mt-3 flex justify-center">
				<button type="button" class="play" class:on={removed} onclick={toggleRuntime}>
					{removed ? tx.returnBtn : tx.removeBtn}
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
			transform 0.7s cubic-bezier(0.22, 1, 0.36, 1),
			opacity 0.5s;
	}
	.swap {
		animation: swapIn 0.45s ease-out;
	}
	@keyframes swapIn {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}
	.bob {
		animation: bob 2.4s ease-in-out infinite;
	}
	@keyframes bob {
		0%,
		100% {
			transform: translateY(0);
		}
		50% {
			transform: translateY(-6px);
		}
	}
	.slab {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
		transition: opacity 0.4s;
	}
	.slab.dimmed {
		opacity: 0.55;
	}
	.rt {
		fill: var(--color-brand-soft);
		stroke: var(--color-brand);
		stroke-width: 2;
	}
	.rt.hl,
	.brick.hl {
		stroke: var(--color-amber);
		stroke-width: 3;
	}
	.slabT {
		font-size: 14px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.slabS {
		font-size: 11px;
		fill: var(--color-faint);
	}
	.brandT {
		fill: var(--color-brand);
		font-weight: 700;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		font-size: 10px;
	}
	.brick,
	.stud {
		fill: var(--color-amber-soft);
		stroke: var(--color-amber);
		stroke-width: 2;
		transition:
			fill 0.3s,
			stroke 0.3s;
	}
	.brick.bad,
	.stud.bad {
		fill: var(--color-danger-soft);
		stroke: var(--color-danger);
	}
	.brickT {
		font-size: 13px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.badT {
		fill: var(--color-danger);
	}
	.ver {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.ver.bad {
		stroke: var(--color-danger);
	}
	.verT {
		font-size: 10.5px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.sheet {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.sheet.mine {
		stroke: var(--color-grass);
		stroke-width: 3;
	}
	.code,
	.term {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 13px;
		font-weight: 700;
		fill: var(--color-ink);
	}
	.term {
		font-size: 12.5px;
		font-weight: 500;
		fill: var(--color-paper);
	}
	.term.ok {
		fill: var(--color-grass);
	}
	.q {
		font-size: 15px;
		font-weight: 800;
		fill: var(--color-card);
	}
	.app {
		font-family: var(--font-display);
		font-size: 15px;
		font-weight: 600;
		fill: var(--color-ink);
	}
	.appst {
		font-size: 12px;
		font-weight: 600;
		fill: var(--color-faint);
	}
	.appst.up {
		fill: var(--color-grass);
	}
	.appst.down {
		fill: var(--color-danger);
	}
	.dot {
		fill: var(--color-faint);
	}
	.dot.up {
		fill: var(--color-grass);
	}
	.dot.down {
		fill: var(--color-danger);
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
		.slab,
		.brick,
		.stud {
			transition: none;
		}
		.swap,
		.bob {
			animation: none;
		}
	}
</style>
