<script lang="ts">
	// A guided "watch" stage for the first words of code. A box with a name label holds a value
	// (a variable), the value gets swapped, jars on a shelf make it stick, then three boxes show
	// the data types. A list lines values up by position, a contact card finds them by key. Last,
	// the tea recipe from basics/program becomes a little machine called make_tea (a function)
	// that takes sugar in and hands tea out. The only optional play is on the last beat, calling
	// make_tea with your own amount of sugar.
	import { fade, fly } from 'svelte/transition';
	import Guide from '$lib/components/Guide.svelte';
	import Nim from '$lib/components/Nim.svelte';
	import type { StageProps } from '$lib/chapters/types';
	import type { CodeBasicsText } from '$lib/chapters/basics/code-basics/types';

	let { text, oncomplete, onstate, onshow, beat = 0 }: StageProps = $props();
	const tx = $derived(text as CodeBasicsText);

	// One scene per beat, in story order.
	const BOX = 0;
	const SWAP = 1;
	const JARS = 2;
	const TYPES = 3;
	const LIST = 4;
	const CARD = 5;
	const FUNC = 6;
	const CALL = 7;
	const COOKER = 8;
	const PLAY = 9;

	const STEPS = ['cup', 'teabag', 'water', 'sugar'];
	const CONTACT = [
		['name', 'Nim'],
		['phone', '0812 3456 7890'],
		['email', 'nim@nimbus.com']
	] as const;
	// The tea recipe from basics/program, wrapped up as a function. Real code, shown as is.
	const DEF = [
		'def make_tea(sugar):',
		'    cup = take("cup")',
		'    put("teabag", cup)',
		'    pour("water", cup)',
		'    add("sugar", sugar, cup)',
		'    return cup'
	];

	let peek = $state<number | null>(null);
	let reduced = $state(false);
	const scene = $derived(peek ?? Math.min(beat, PLAY));

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

	// One slow clock drives the self playing scenes, restarted whenever the scene changes.
	let tick = $state(0);
	$effect(() => {
		void scene;
		tick = 0;
		if (reduced) return;
		const t = setInterval(() => (tick += 1), 700);
		return () => clearInterval(t);
	});

	// scene 1, the value inside swaps between 2 and 3
	const swapLine = $derived(reduced ? 1 : Math.floor(tick / 3) % 2);
	const sugarNow = $derived(scene === SWAP ? (swapLine ? 3 : 2) : 2);
	// scene 4 and 5, the position or key being looked up
	const pos = $derived(reduced ? 0 : Math.floor(tick / 3) % STEPS.length);
	const keyAt = $derived(reduced ? 2 : Math.floor(tick / 3) % CONTACT.length);
	// scene 7, two calls in turn, each one goes in, runs, and comes out
	const callIdx = $derived(reduced ? 0 : Math.floor(tick / 7) % 2);
	const phase = $derived(reduced ? 4 : tick % 7);
	const callSugar = $derived(callIdx === 0 ? 2 : 0);

	// the optional play
	let pick = $state(2);
	let played = $state<number | null>(null);
	let running = $state(false);
	let runTimer: ReturnType<typeof setTimeout> | undefined;
	function call() {
		clearTimeout(runTimer);
		played = null;
		running = true;
		const n = pick;
		runTimer = setTimeout(
			() => {
				running = false;
				played = n;
				onstate?.(n === 0 ? 'plain' : 'call');
			},
			reduced ? 0 : 1100
		);
	}
	$effect(() => () => clearTimeout(runTimer));

	const out = (n: number) => (n === 0 ? tx.plainOut : tx.teaOut.replace('{n}', String(n)));
	const typeOf = (k: 'number' | 'text' | 'bool') => tx.types[k];
</script>

{#snippet code(lines: string[], hot: number[] = [], stagger = false)}
	<div class="card code">
		{#each lines as line, i (i)}
			<div
				class="code-line"
				class:hot={hot.includes(i)}
				in:fly={{ y: 6, duration: 300, delay: stagger && !reduced ? i * 180 : 0 }}
			>
				<span class="ln">{i + 1}</span><span class="src">{line}</span>
			</div>
		{/each}
	</div>
{/snippet}

{#snippet varBox(name: string, value: string, color: string, tags: boolean)}
	<div class="var" style="--c:{color}">
		{#if tags}<span class="vtag left">{tx.nameTag}</span>{/if}
		<div class="vbox">
			<div class="vslot">
				{#key value}
					<span
						class="vval"
						in:fly={{ y: reduced ? 0 : -34, duration: 450 }}
						out:fly={{ y: reduced ? 0 : -34, duration: 350 }}>{value}</span
					>
				{/key}
			</div>
			<span class="vlabel">{name}</span>
		</div>
		{#if tags}<span class="vtag right">{tx.valueTag}</span>{/if}
	</div>
{/snippet}

{#snippet teaCup(sugar: number | null, size = 54)}
	<svg viewBox="0 0 40 36" width={size} height={size * 0.9} aria-hidden="true">
		{#if sugar !== null}
			<path
				d="M5 12 H31 L29.6 30 H6.4 Z"
				class="drink"
				style="fill:{sugar === 0
					? 'color-mix(in srgb, var(--color-amber) 45%, var(--color-card))'
					: 'var(--color-amber)'}"
			/>
			{#each Array(Math.min(sugar, 3)) as _, k (k)}
				<rect x={9 + k * 7} y="16" width="5" height="5" rx="1" class="cube" />
			{/each}
		{/if}
		<path d="M3 6 H33 L31 32 H5 Z" class="cup-body" />
		<path d="M33 11 Q40 12 39 18 Q38 24 31.5 24" class="cup-body" />
	</svg>
{/snippet}

{#snippet machine(input: string, run: boolean, output: number | null, inKey: string | number)}
	<div class="mrow">
		<div class="io">
			<span class="iotag">{tx.inputTag}</span>
			{#key inKey}
				<span class="chip in" class:go={run} in:fly={{ x: reduced ? 0 : -14, duration: 350 }}
					>{input}</span
				>
			{/key}
		</div>
		<svg class="arrow" viewBox="0 0 24 14" aria-hidden="true"
			><path d="M2 7 H20 M15 2 L21 7 L15 12" /></svg
		>
		<div class="machine" class:run>
			<span class="mname">make_tea</span>
			<span class="lights">
				{#each [0, 1, 2] as k (k)}<i style="animation-delay:{k * 0.18}s"></i>{/each}
			</span>
		</div>
		<svg class="arrow" viewBox="0 0 24 14" aria-hidden="true"
			><path d="M2 7 H20 M15 2 L21 7 L15 12" /></svg
		>
		<div class="io">
			<span class="iotag">{tx.outputTag}</span>
			<div class="outcup">
				{#if output !== null}
					<div in:fly={{ y: reduced ? 0 : 8, duration: 400 }}>{@render teaCup(output, 46)}</div>
				{:else}
					{@render teaCup(null, 46)}
				{/if}
			</div>
		</div>
	</div>
	<p class="outcap" class:shown={output !== null}>{output !== null ? out(output) : ''}</p>
{/snippet}

{#snippet jars()}
	<svg viewBox="0 0 320 150" class="jars" aria-hidden="true">
		<rect x="10" y="128" width="300" height="6" rx="3" class="shelf" />
		{#each [['sugar', '2'], ['cups', '1'], ['name', '"Nim"']] as [n, v], i (i)}
			{@const x = 30 + i * 96}
			<g class="jar" style="animation-delay:{reduced ? 0 : i * 0.3}s">
				<rect x={x + 6} y="38" width="52" height="10" rx="3" class="lid" />
				<rect {x} y="48" width="64" height="80" rx="12" class="glass" />
				<text x={x + 32} y="74" class="jar-val">{v}</text>
				<rect x={x + 8} y="90" width="48" height="22" rx="5" class="sticker" />
				<text x={x + 32} y="105" class="jar-name">{n}</text>
			</g>
		{/each}
	</svg>
	<div class="legend">
		<span class="lchip"><i class="sw sticker-sw"></i>{tx.nameTag}</span>
		<span class="lchip"><i class="sw inside-sw"></i>{tx.valueTag}</span>
	</div>
{/snippet}

{#snippet cooker()}
	<svg viewBox="0 0 340 170" class="cooker" aria-hidden="true">
		<defs>
			<marker
				id="code-basics-arrow"
				viewBox="0 0 10 10"
				refX="9"
				refY="5"
				markerWidth="6"
				markerHeight="6"
				orient="auto"
			>
				<path d="M0 0 L10 5 L0 10 Z" class="head" />
			</marker>
		</defs>
		<!-- input, rice and water -->
		<g transform="translate(18 40)">
			<ellipse cx="40" cy="22" rx="30" ry="9" class="bowl" />
			{#each [0, 1, 2, 3, 4, 5] as k (k)}
				<ellipse cx={24 + k * 6} cy={19 + (k % 2) * 2} rx="2.4" ry="1.4" class="grain" />
			{/each}
			<path d="M36 0 Q32 6 36 10 Q40 6 36 0 Z" class="drop" />
			<text x="40" y="50" class="ck-label">{tx.cooker.input}</text>
		</g>
		<path d="M100 66 H118" class="ck-line" marker-end="url(#code-basics-arrow)" />
		<!-- the rice cooker -->
		<g transform="translate(124 30)">
			<path d="M8 34 Q46 4 84 34 Z" class="ck-lid" />
			<rect x="38" y="12" width="16" height="6" rx="3" class="ck-knob" />
			<rect x="2" y="34" width="88" height="70" rx="18" class="ck-body" />
			<circle cx="46" cy="76" r="11" class="ck-btn" class:pulse={!reduced} />
			<text x="46" y="122" class="ck-label strong">{tx.cooker.button}</text>
			{#if !reduced}
				<g class="steam">
					<path d="M34 6 Q30 -2 34 -10" />
					<path d="M58 6 Q54 -2 58 -12" />
				</g>
			{/if}
		</g>
		<path d="M222 66 H240" class="ck-line" marker-end="url(#code-basics-arrow)" />
		<!-- output, cooked rice -->
		<g transform="translate(244 40)">
			<path d="M10 18 Q40 -6 70 18 Z" class="rice" />
			<path d="M8 18 H72 Q68 40 40 40 Q12 40 8 18 Z" class="bowl2" />
			<text x="40" y="58" class="ck-label">{tx.cooker.output}</text>
		</g>
	</svg>
{/snippet}

<div class="stage">
	<Guide steps={tx.panels} active={scene} onselect={(i) => (peek = i)}>
		{#snippet visual()}
			<div class="visual">
				{#key scene}
					<div class="scene" in:fade={{ duration: 300 }}>
						{#if scene === BOX}
							{@render code(['sugar = 2'], [0])}
							{@render varBox('sugar', '2', 'var(--color-brand)', true)}
						{:else if scene === SWAP}
							{@render code(['sugar = 2', 'sugar = 3'], [swapLine])}
							{@render varBox('sugar', String(sugarNow), 'var(--color-brand)', true)}
						{:else if scene === JARS}
							{@render jars()}
						{:else if scene === TYPES}
							{@render code(
								[
									`cups = 2        # ${typeOf('number')}`,
									`name = "Nim"    # ${typeOf('text')}`,
									`hot = True      # ${typeOf('bool')}`
								],
								[],
								true
							)}
							<div class="types">
								{#each [['cups', '2', 'number', 'var(--color-brand)'], ['name', '"Nim"', 'text', 'var(--color-amber)'], ['hot', 'True', 'bool', 'var(--color-grass)']] as [n, v, k, c], i (i)}
									<div class="tcol" style="animation-delay:{reduced ? 0 : 0.4 + i * 0.35}s">
										{@render varBox(n, v, c, false)}
										<span class="ttag" style="--c:{c}"
											>{typeOf(k as 'number' | 'text' | 'bool')}</span
										>
									</div>
								{/each}
							</div>
						{:else if scene === LIST}
							{@render code(
								['steps = ["cup", "teabag",', '         "water", "sugar"]', `steps[${pos}]`],
								[2]
							)}
							<div class="list">
								<span class="lname">steps</span>
								<div class="cells">
									{#each STEPS as s, i (i)}
										<div class="cell" class:on={i === pos}>
											<span class="cval">"{s}"</span>
											<span class="cidx">{i}</span>
										</div>
									{/each}
								</div>
								<span class="note">{tx.listNote}</span>
							</div>
						{:else if scene === CARD}
							{@render code(
								[
									'contact = {',
									'    "name": "Nim",',
									'    "phone": "0812 3456 7890",',
									'    "email": "nim@nimbus.com"',
									'}',
									`contact["${CONTACT[keyAt][0]}"]`
								],
								[keyAt + 1, 5]
							)}
							<div class="contact">
								<div class="chead">
									<span class="avatar"><Nim mood="happy" size={30} /></span>
									<span class="ctitle">{tx.cardTitle}</span>
								</div>
								{#each CONTACT as [k, v], i (k)}
									<div class="crow" class:on={i === keyAt}>
										<span class="ckey">{k}</span>
										<span class="cv">{v}</span>
									</div>
								{/each}
								<span class="note">{tx.cardNote}</span>
							</div>
						{:else if scene === FUNC}
							{@render code(DEF, [0, 5], true)}
							{@render machine('sugar', false, null, 'def')}
						{:else if scene === CALL}
							{@render code(
								['def make_tea(sugar): ...', 'make_tea(2)', 'make_tea(0)'],
								[callIdx + 1]
							)}
							{@render machine(
								String(callSugar),
								phase >= 1 && phase <= 2,
								phase >= 3 ? callSugar : null,
								callIdx
							)}
							<span class="trick">{tx.reuseNote}</span>
						{:else if scene === COOKER}
							{@render cooker()}
						{:else}
							<div class="play">
								<span class="hint">{tx.playHint}</span>
								<div class="picks">
									{#each [0, 1, 2, 3] as n (n)}
										<button
											type="button"
											class="pick"
											class:on={pick === n}
											aria-pressed={pick === n}
											onclick={() => {
												pick = n;
												played = null;
											}}>{n}</button
										>
									{/each}
								</div>
								<button type="button" class="callbtn" onclick={call}>{tx.callButton}</button>
							</div>
							{@render code([`make_tea(${pick})`], running ? [0] : [])}
							{@render machine(String(pick), running, played, pick)}
						{/if}
					</div>
				{/key}
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
		max-width: 420px;
		flex-direction: column;
		align-items: center;
	}
	.scene {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 20px;
	}

	/* code card */
	.card {
		width: 100%;
		border: 1px solid var(--color-line);
		border-radius: 16px;
		background: var(--color-card);
		padding: 10px 12px;
	}
	.code {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 12.5px;
	}
	.code-line {
		display: flex;
		gap: 12px;
		border-radius: 8px;
		padding: 2px 6px;
		transition: background 0.3s;
	}
	.code-line.hot {
		background: var(--color-brand-soft);
	}
	.ln {
		width: 12px;
		flex: none;
		text-align: right;
		color: var(--color-faint);
	}
	.src {
		white-space: pre;
		color: var(--color-ink);
	}

	/* a variable, a labelled box */
	.var {
		display: flex;
		align-items: center;
		gap: 10px;
	}
	.vbox {
		position: relative;
		display: flex;
		width: 108px;
		flex-direction: column;
		align-items: center;
		border: 2.5px solid var(--c);
		border-top: none;
		border-radius: 0 0 16px 16px;
		background: color-mix(in srgb, var(--c) 8%, var(--color-card));
		padding: 0 8px 10px;
	}
	/* the open top of the box, a rim a little wider than its walls */
	.vbox::before {
		content: '';
		position: absolute;
		top: -3px;
		left: -8px;
		right: -8px;
		height: 6px;
		border-radius: 3px;
		background: var(--c);
	}
	.vslot {
		position: relative;
		display: grid;
		height: 54px;
		width: 100%;
		place-items: center;
	}
	.vval {
		grid-area: 1 / 1;
		border-radius: 10px;
		background: var(--color-card);
		padding: 4px 10px;
		box-shadow: 0 3px 10px rgba(22, 40, 60, 0.1);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 17px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.vlabel {
		border-radius: 6px;
		background: var(--c);
		padding: 2px 10px;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 13px;
		font-weight: 700;
		color: var(--color-card);
	}
	.vtag {
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.vtag.left {
		align-self: flex-end;
		margin-bottom: 10px;
	}
	.vtag.left::after {
		content: '';
		display: inline-block;
		margin-left: 6px;
		width: 14px;
		height: 2px;
		vertical-align: middle;
		background: var(--color-faint);
	}
	.vtag.right {
		align-self: flex-start;
		margin-top: 18px;
	}
	.vtag.right::before {
		content: '';
		display: inline-block;
		margin-right: 6px;
		width: 14px;
		height: 2px;
		vertical-align: middle;
		background: var(--color-faint);
	}

	/* jars */
	.jars {
		display: block;
		width: 100%;
		max-width: 380px;
	}
	.shelf {
		fill: var(--color-amber);
		opacity: 0.55;
	}
	.lid {
		fill: var(--color-muted);
		opacity: 0.7;
	}
	.glass {
		fill: color-mix(in srgb, var(--color-brand) 8%, var(--color-card));
		stroke: var(--color-line);
		stroke-width: 2;
	}
	.jar-val {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 15px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-ink);
	}
	.sticker {
		fill: var(--color-brand);
	}
	.jar-name {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 12px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-card);
	}
	.jar {
		animation: pop 0.5s ease both;
	}
	.legend {
		display: flex;
		gap: 8px;
	}
	.lchip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border: 1px solid var(--color-line);
		border-radius: 999px;
		background: var(--color-card);
		padding: 3px 10px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.lchip .sw {
		width: 10px;
		height: 10px;
		border-radius: 3px;
	}
	.sticker-sw {
		background: var(--color-brand);
	}
	.inside-sw {
		border: 1.5px solid var(--color-line);
		background: color-mix(in srgb, var(--color-brand) 8%, var(--color-card));
	}

	/* data types */
	.types {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
	}
	.types :global(.vbox) {
		width: 92px;
	}
	.tcol {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		animation: pop 0.5s ease both;
	}
	.ttag {
		border-radius: 999px;
		background: color-mix(in srgb, var(--c) 14%, transparent);
		padding: 2px 9px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--c);
	}

	/* list */
	.list {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.lname {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.cells {
		display: flex;
		border: 2px solid var(--color-brand);
		border-radius: 12px;
		overflow: hidden;
	}
	.cell {
		display: flex;
		width: 76px;
		flex-direction: column;
		align-items: center;
		gap: 4px;
		background: var(--color-card);
		padding: 10px 2px 6px;
		transition: background 0.3s;
	}
	.cell + .cell {
		border-left: 1.5px solid var(--color-line);
	}
	.cell.on {
		background: var(--color-brand-soft);
	}
	.cval {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 12px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.cidx {
		display: grid;
		height: 20px;
		width: 20px;
		place-items: center;
		border-radius: 999px;
		background: var(--color-paper);
		font-size: 11px;
		font-weight: 800;
		color: var(--color-muted);
		transition:
			background 0.3s,
			color 0.3s;
	}
	.cell.on .cidx {
		background: var(--color-brand);
		color: var(--color-card);
	}
	.note {
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-muted);
	}

	/* contact card */
	.contact {
		display: flex;
		width: 100%;
		max-width: 300px;
		flex-direction: column;
		gap: 4px;
		border: 1px solid var(--color-line);
		border-radius: 16px;
		background: var(--color-card);
		padding: 10px 12px;
		box-shadow: 0 8px 22px rgba(22, 40, 60, 0.07);
	}
	.chead {
		display: flex;
		align-items: center;
		gap: 8px;
		margin-bottom: 4px;
	}
	.avatar {
		display: grid;
		height: 38px;
		width: 38px;
		place-items: center;
		border-radius: 999px;
		background: var(--color-brand-soft);
	}
	.ctitle {
		font-family: var(--font-display);
		font-size: 16px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.crow {
		display: grid;
		grid-template-columns: 58px 1fr;
		align-items: center;
		gap: 8px;
		border-radius: 8px;
		padding: 4px 6px;
		transition: background 0.3s;
	}
	.crow.on {
		background: var(--color-amber-soft);
	}
	.ckey {
		border-radius: 6px;
		background: var(--color-paper);
		padding: 1px 6px;
		text-align: center;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-amber);
	}
	.cv {
		font-size: 13px;
		font-weight: 600;
		color: var(--color-ink);
		overflow-wrap: anywhere;
	}
	.contact .note {
		margin-top: 4px;
		text-align: center;
	}

	/* the function machine */
	.mrow {
		display: flex;
		align-items: flex-end;
		gap: 6px;
	}
	.io {
		display: flex;
		width: 64px;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.iotag {
		font-size: 11px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.chip.in {
		display: grid;
		min-width: 40px;
		height: 40px;
		place-items: center;
		border: 1.5px solid var(--color-amber);
		border-radius: 10px;
		background: var(--color-amber-soft);
		padding: 0 6px;
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 14px;
		font-weight: 700;
		color: var(--color-ink);
		transition:
			transform 0.5s,
			opacity 0.5s;
	}
	.chip.in.go {
		opacity: 0.35;
		transform: translateX(14px) scale(0.85);
	}
	.outcup {
		display: grid;
		height: 44px;
		place-items: end center;
	}
	.arrow {
		width: 22px;
		margin-bottom: 14px;
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 2;
		stroke-linecap: round;
		stroke-linejoin: round;
	}
	.machine {
		display: flex;
		width: 118px;
		height: 72px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 8px;
		border: 2px solid var(--color-brand);
		border-radius: 16px;
		background: var(--color-brand-soft);
	}
	.mname {
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
	}
	.lights {
		display: flex;
		gap: 6px;
	}
	.lights i {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--color-line);
	}
	.machine.run .lights i {
		animation: light 0.55s ease-in-out infinite alternate;
	}
	.machine.run {
		animation: hum 0.18s linear infinite alternate;
	}
	.outcap {
		margin: -6px 0 0;
		min-height: 18px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-grass);
		opacity: 0;
		transition: opacity 0.3s;
	}
	.outcap.shown {
		opacity: 1;
	}
	.drink {
		transition: fill 0.3s;
	}
	.cube {
		fill: var(--color-card);
		stroke: var(--color-line);
		stroke-width: 0.8;
	}
	.cup-body {
		fill: none;
		stroke: var(--color-ink);
		stroke-width: 2;
		stroke-linejoin: round;
	}
	.trick {
		border-radius: 999px;
		background: var(--color-grass-soft);
		padding: 3px 12px;
		font-size: 12px;
		font-weight: 700;
		color: var(--color-grass);
	}

	/* rice cooker */
	.cooker {
		display: block;
		width: 100%;
		max-width: 400px;
	}
	.head {
		fill: var(--color-faint);
	}
	.ck-line {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 2;
	}
	.bowl,
	.bowl2 {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 2;
	}
	.grain {
		fill: var(--color-faint);
	}
	.drop {
		fill: var(--color-brand);
		opacity: 0.7;
	}
	.rice {
		fill: var(--color-paper);
		stroke: var(--color-line);
		stroke-width: 1.5;
	}
	.ck-lid {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 2;
		stroke-linejoin: round;
	}
	.ck-knob {
		fill: var(--color-muted);
	}
	.ck-body {
		fill: var(--color-card);
		stroke: var(--color-muted);
		stroke-width: 2;
	}
	.ck-btn {
		fill: var(--color-grass);
		transform-box: fill-box;
		transform-origin: center;
	}
	.ck-btn.pulse {
		animation: press 1.8s ease-in-out infinite;
	}
	.ck-label {
		font-size: 11.5px;
		font-weight: 700;
		text-anchor: middle;
		fill: var(--color-muted);
	}
	.ck-label.strong {
		fill: var(--color-grass);
	}
	.steam path {
		fill: none;
		stroke: var(--color-faint);
		stroke-width: 2;
		stroke-linecap: round;
		animation: rise 1.6s ease-in-out infinite;
	}
	.steam path:nth-child(2) {
		animation-delay: 0.5s;
	}

	/* the optional play */
	.play {
		display: flex;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 8px 10px;
	}
	.hint {
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-muted);
	}
	.picks {
		display: flex;
		gap: 6px;
	}
	.pick {
		height: 34px;
		width: 34px;
		border: 1.5px solid var(--color-line);
		border-radius: 10px;
		background: var(--color-card);
		font-family: var(--font-mono, ui-monospace, monospace);
		font-size: 14px;
		font-weight: 700;
		color: var(--color-muted);
		cursor: pointer;
	}
	.pick.on {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
		color: var(--color-ink);
	}
	.callbtn {
		border: 1.5px solid var(--color-brand);
		border-radius: 999px;
		background: var(--color-brand-soft);
		padding: 7px 16px;
		font-size: 13px;
		font-weight: 700;
		color: var(--color-brand);
		cursor: pointer;
		transition: transform 0.15s;
	}
	.callbtn:hover {
		transform: translateY(-1px);
	}
	.pick:focus-visible,
	.callbtn:focus-visible {
		outline: 2px solid var(--color-brand);
		outline-offset: 2px;
	}

	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}
	@keyframes light {
		to {
			background: var(--color-brand);
		}
	}
	@keyframes hum {
		from {
			transform: translateX(-1px);
		}
		to {
			transform: translateX(1px);
		}
	}
	@keyframes press {
		0%,
		70%,
		100% {
			transform: scale(1);
		}
		80% {
			transform: scale(0.82);
		}
	}
	@keyframes rise {
		0% {
			opacity: 0;
			transform: translateY(4px);
		}
		50% {
			opacity: 0.9;
		}
		100% {
			opacity: 0;
			transform: translateY(-6px);
		}
	}

	@media (max-width: 767px) {
		.stage {
			padding-bottom: 7rem;
		}
		.cell {
			width: 70px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.code-line,
		.cell,
		.cidx,
		.crow,
		.chip.in,
		.outcap,
		.callbtn {
			transition: none;
		}
		.jar,
		.tcol,
		.machine.run,
		.machine.run .lights i {
			animation: none;
		}
	}
</style>
