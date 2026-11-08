<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Browser from '$lib/components/Browser.svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { KeysText } from '$lib/chapters/security/keys/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as KeysText);

	// Three acts. 0 = one shared key, 1 = padlock and private key, 2 = primes.
	let act = $state(0);
	const actDone = $state([false, false, false]);

	// Acts 0 and 1 are two sends each.
	// step 0 idle, 1 first item on the road, 2 landed, 3 second item on the road, 4 landed.
	let step = $state(0);
	let mid = $state(false); // the travelling item has passed the eavesdropper
	let timers: ReturnType<typeof setTimeout>[] = [];
	let auto: ReturnType<typeof setInterval> | undefined;
	let autoRunning = $state(false); // Nim is trying primes by itself
	let completed = false;

	function reduced() {
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}
	function clearAll() {
		timers.forEach(clearTimeout);
		timers = [];
		stopAuto();
	}
	function stopAuto() {
		if (auto) clearInterval(auto);
		auto = undefined;
		autoRunning = false;
	}

	function send(token: string) {
		const half = reduced() ? 250 : 1000;
		step += 1;
		mid = false;
		timers.push(setTimeout(() => (mid = true), half));
		timers.push(
			setTimeout(() => {
				step += 1;
				mid = false;
				onstate?.(token);
				if (step === 4) actDone[act] = true;
			}, half * 2)
		);
	}

	function nextAct() {
		clearAll();
		act += 1;
		step = 0;
		mid = false;
	}

	const flying = $derived(act < 2 && (step === 1 || step === 3));
	const copied = $derived(step >= 2 || (step === 1 && mid));
	const reached = $derived(step === 4 || (step === 3 && mid));
	const note = $derived.by(() => {
		if (flying) return ' ';
		if (step === 0) return act === 0 ? tx.sym.noteIdle : tx.asym.noteIdle;
		if (step === 2) return act === 0 ? tx.sym.noteKey : tx.asym.noteLock;
		return act === 0 ? tx.sym.noteRead : tx.asym.noteSafe;
	});

	// Act 2, the prime race.
	const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61];
	const targets = [15, 221, 3233];
	let multiplied = $state(false);
	let round = $state(0);
	const tried = new SvelteSet<number>();
	let found = $state<number | null>(null);
	const triesPer = $state<number[]>([]);
	const finished = $derived(triesPer.length === targets.length);
	const n = $derived(targets[round]);

	function multiply() {
		multiplied = true;
		onstate?.('multiply');
	}
	function attempt(p: number) {
		if (found !== null || tried.has(p)) return;
		tried.add(p);
		if (n % p === 0) {
			found = p;
			triesPer.push(tried.size);
			stopAuto();
			onstate?.(`factor${round + 1}`);
			if (round === targets.length - 1 && !completed) {
				completed = true;
				actDone[2] = true;
				oncomplete?.();
			}
		}
	}
	function nextRound() {
		round += 1;
		tried.clear();
		found = null;
	}
	function letNimTry() {
		if (auto || found !== null) return;
		autoRunning = true;
		auto = setInterval(
			() => {
				const p = primes.find((q) => !tried.has(q));
				if (p === undefined || found !== null) {
					stopAuto();
					return;
				}
				attempt(p);
			},
			reduced() ? 60 : 260
		);
	}
	const triesText = (k: number) =>
		k === 1 ? tx.rsa.triesOne : tx.rsa.tries.replace('{n}', String(k));
	// Just a sense of scale, a real RSA modulus is about 617 digits long and this is only its opening stretch.
	const bigNumber =
		'251959084756578934940271832400483985714292821262040320277771378360436620207075955562640185258807';

	onDestroy(clearAll);
</script>

{#snippet keyIcon(size: number)}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<circle cx="8" cy="8" r="4.5" stroke="var(--color-amber)" stroke-width="2.6" />
		<path
			d="M11 11.5 20 20m-3.5.5V17"
			stroke="var(--color-amber)"
			stroke-width="2.6"
			stroke-linecap="round"
		/>
	</svg>
{/snippet}

{#snippet padlock(size: number, open: boolean, color: string)}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<rect x="5" y="10.5" width="14" height="9.5" rx="2.5" stroke={color} stroke-width="2.4" />
		<path
			d={open ? 'M8.5 10.5V6a3.5 3.5 0 0 1 7 0v.5' : 'M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3'}
			stroke={color}
			stroke-width="2.4"
			stroke-linecap="round"
		/>
	</svg>
{/snippet}

<div class="wrap">
	<!-- which act we are in -->
	<ol class="acts" aria-label={tx.actLabel.replace('{n}', String(act + 1))}>
		{#each tx.acts as name, i (i)}
			<li class:on={act === i} class:done={actDone[i]}>
				<span class="num">{actDone[i] ? '✓' : i + 1}</span>
				<span class="aname">{name}</span>
			</li>
		{/each}
	</ol>

	<!-- the action for this act, kept up top and clear of Nim -->
	<div class="btns">
		{#if act < 2 && actDone[act]}
			<CallToActionButton onclick={nextAct}>
				{tx.nextAct}
			</CallToActionButton>
		{:else if act === 0}
			<CallToActionButton onclick={() => send('symKey')} disabled={step !== 0}>
				{tx.sym.sendKey}
			</CallToActionButton>
			<CallToActionButton onclick={() => send('symRead')} disabled={step !== 2}>
				{tx.sym.sendBox}
			</CallToActionButton>
		{:else if act === 1}
			<CallToActionButton onclick={() => send('padlock')} disabled={step !== 0}>
				{tx.asym.askLock}
			</CallToActionButton>
			<CallToActionButton onclick={() => send('sealed')} disabled={step !== 2}>
				{tx.asym.sendBox}
			</CallToActionButton>
		{:else if !multiplied}
			<CallToActionButton onclick={multiply}>
				{tx.rsa.multiplyBtn}
			</CallToActionButton>
		{:else if found !== null && !finished}
			<CallToActionButton onclick={nextRound}>
				{tx.rsa.nextBtn}
			</CallToActionButton>
		{:else if round === targets.length - 1 && !finished}
			<CallToActionButton onclick={letNimTry} disabled={autoRunning}>
				{tx.rsa.autoBtn}
			</CallToActionButton>
		{/if}
	</div>

	{#if act < 2}
		<div class="scene">
			<!-- you -->
			<div class="actor">
				<div class="shrink"><Browser phase="loaded" /></div>
				<span class="alabel">{tx.youLabel}</span>
				<div class="hold">
					{#if act === 0}
						{@render keyIcon(13)}
					{:else if step === 2}
						<span class="pop">{@render padlock(14, true, 'var(--color-grass)')}</span>
					{/if}
				</div>
			</div>

			<!-- the road, with someone listening in the middle -->
			<div class="road">
				<div class="wire"></div>
				<div class="snoop" class:grin={act === 0 && reached}>
					<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<circle cx="12" cy="8" r="4" fill="var(--color-faint)" />
						<path d="M4 21a8 8 0 0 1 16 0Z" fill="var(--color-faint)" />
					</svg>
					<span class="slabel">{tx.snooperLabel}</span>
					{#if copied}
						<span class="stag pop">
							{#if act === 0}
								{@render keyIcon(10)}{tx.sym.copiedTag}
							{:else}
								{@render padlock(10, true, 'var(--color-grass)')}{tx.asym.copiedTag}
							{/if}
						</span>
					{/if}
					{#if reached}
						{#if act === 0}
							<span class="stag bad pop">{tx.sym.readTag}, {tx.message}</span>
						{:else}
							<span class="stag pop">{tx.asym.stuckTag}</span>
						{/if}
					{/if}
				</div>

				{#if flying}
					{#key `${act}${step}${mid}`}
						<div class="chip" class:half={mid} class:back={act === 1 && step === 1}>
							{#if step === 1 && act === 0}
								{@render keyIcon(11)}{tx.keyChip}
							{:else if step === 1}
								{@render padlock(11, true, 'var(--color-grass)')}{tx.padlockChip}
							{:else}
								<span class="sealed">
									{@render padlock(10, false, '#fff')}{act === 0 ? tx.cipher : tx.boxChip}
								</span>
							{/if}
						</div>
					{/key}
				{/if}
			</div>

			<!-- the friend at nimbus.com -->
			<div class="actor">
				<div class="shrink" class:got={step === 4}><Browser phase="loaded" /></div>
				<span class="alabel">{tx.friendLabel}</span>
				<span class="asub">{tx.friendSub}</span>
				<div class="hold">
					{#if act === 1}
						<span class="priv">{@render keyIcon(12)}{tx.privateKey}</span>
					{:else if step >= 2}
						<span class="pop">{@render keyIcon(13)}</span>
					{/if}
				</div>
				{#if step === 4}
					<span class="opened pop">{tx.message}</span>
				{/if}
			</div>
		</div>

		<p class="note">{note}</p>
	{:else}
		<div class="rsa">
			{#if multiplied}
				<p class="eq pop">
					61 × 53 = <b>3233</b>
					<span class="fast">{tx.rsa.instant}</span>
				</p>
			{/if}

			{#if multiplied && !finished}
				<p class="prompt">{tx.rsa.prompt.replace('{n}', String(n))}</p>
				<p class="target">
					{#if found !== null}
						<span class="pop">{n} = {found} × {n / found}</span>
					{:else}
						{n} = ? × ?
					{/if}
				</p>
				<div class="grid" role="group" aria-label={tx.rsa.pickHint}>
					{#each primes as p (p)}
						<button
							type="button"
							class="prime"
							class:miss={tried.has(p) && found !== p}
							class:hit={found === p || (found !== null && n / found === p)}
							disabled={found !== null || tried.has(p) || autoRunning}
							onclick={() => attempt(p)}>{p}</button
						>
					{/each}
				</div>
				<p class="count">
					{tried.size ? triesText(tried.size) : tx.rsa.pickHint}
				</p>
			{/if}

			{#if finished}
				<div class="effort pop">
					<p class="ehead">{tx.rsa.effortLabel}</p>
					{#each targets as t, i (t)}
						<div class="erow">
							<span class="elabel">{t}</span>
							<span class="track">
								<span class="fill" style="width:{Math.max(8, (triesPer[i] / 18) * 100)}%"></span>
							</span>
							<span class="eval">{triesText(triesPer[i])}</span>
						</div>
					{/each}
					<div class="erow">
						<span class="elabel">RSA</span>
						<span class="track"><span class="fill huge"></span></span>
					</div>
					<p class="forever">{tx.rsa.forever}</p>
				</div>
				<div class="real pop">
					<p class="ehead">{tx.rsa.realLabel}</p>
					<p class="digits">{bigNumber}</p>
					<p class="rsub">{tx.rsa.realDigits}</p>
				</div>
			{/if}
		</div>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 12px;
	}
	.acts {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.acts li {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 3px 10px 3px 4px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-faint);
		transition:
			color 0.2s,
			border-color 0.2s;
	}
	.acts li.on {
		border-color: var(--color-brand);
		color: var(--color-ink);
	}
	.num {
		display: inline-grid;
		place-items: center;
		width: 17px;
		height: 17px;
		border-radius: 50%;
		background: var(--color-line);
		color: var(--color-muted);
		font-size: 9.5px;
		font-weight: 800;
	}
	.acts li.on .num {
		background: var(--color-brand);
		color: #fff;
	}
	.acts li.done .num {
		background: var(--color-grass);
		color: #fff;
	}
	.btns {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 10px;
		min-height: 46px;
	}
	.btns :global(.cta) {
		padding: 10px 18px;
		font-size: 13px;
	}

	/* acts 1 and 2, the road */
	.scene {
		display: flex;
		align-items: flex-start;
		justify-content: center;
		gap: 4px;
		width: min(94vw, 380px);
	}
	.actor {
		display: flex;
		width: 84px;
		flex: none;
		flex-direction: column;
		align-items: center;
		gap: 3px;
	}
	.shrink {
		width: 79px;
		height: 125px;
		overflow: visible;
	}
	.shrink > :global(.phone) {
		max-width: none;
		transform: scale(0.5);
		transform-origin: top left;
		transition: border-color 0.3s;
	}
	.shrink.got > :global(.phone) {
		border-color: var(--color-grass);
	}
	.alabel {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.asub {
		margin-top: -3px;
		font-size: 9px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.hold {
		display: flex;
		min-height: 16px;
		align-items: center;
		justify-content: center;
	}
	.priv {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		border-radius: 999px;
		background: var(--color-amber-soft);
		color: var(--color-amber);
		font-size: 8.5px;
		font-weight: 800;
		padding: 2px 6px;
		white-space: nowrap;
	}
	.opened {
		border-radius: 6px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-size: 9px;
		font-weight: 800;
		padding: 2px 6px;
		white-space: nowrap;
	}
	.road {
		position: relative;
		flex: 1;
		min-width: 0;
		height: 140px;
	}
	.wire {
		position: absolute;
		top: 42%;
		left: 0;
		right: 0;
		height: 2px;
		border-radius: 2px;
		background: var(--color-line);
	}
	.snoop {
		position: absolute;
		top: calc(42% + 10px);
		left: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		line-height: 1;
		transform: translateX(-50%);
		transition: transform 0.2s ease;
	}
	.snoop.grin {
		transform: translateX(-50%) scale(1.1);
	}
	.slabel {
		font-size: 8.5px;
		font-weight: 700;
		color: var(--color-faint);
		white-space: nowrap;
	}
	.stag {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		border-radius: 999px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		color: var(--color-muted);
		font-size: 8px;
		font-weight: 800;
		padding: 2px 6px;
		white-space: nowrap;
	}
	.stag.bad {
		border-color: var(--color-danger);
		background: var(--color-danger);
		color: #fff;
	}
	.chip {
		position: absolute;
		top: calc(42% - 24px);
		left: 0;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		gap: 3px;
		border-radius: 999px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		font-size: 9px;
		font-weight: 800;
		padding: 2px 8px;
		white-space: nowrap;
		animation: go1 1s linear forwards;
	}
	.chip.half {
		animation: go2 1s linear forwards;
	}
	.chip.back {
		animation: back1 1s linear forwards;
	}
	.chip.back.half {
		animation: back2 1s linear forwards;
	}
	.sealed {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		margin: -2px -8px;
		border-radius: 999px;
		background: var(--color-ink);
		color: var(--color-paper);
		padding: 2px 8px;
	}
	@keyframes go1 {
		from {
			left: 0;
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		to {
			left: 34%;
		}
	}
	@keyframes go2 {
		from {
			left: 34%;
		}
		to {
			left: 68%;
		}
	}
	@keyframes back1 {
		from {
			left: 68%;
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		to {
			left: 34%;
		}
	}
	@keyframes back2 {
		from {
			left: 34%;
		}
		to {
			left: 0;
		}
	}
	.pop {
		display: inline-flex;
		align-items: center;
		animation: popin 0.25s ease;
	}
	@keyframes popin {
		from {
			transform: scale(0.5);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}
	.note {
		min-height: 2.6em;
		max-width: 330px;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}

	/* act 3, the primes */
	.rsa {
		display: flex;
		width: min(94vw, 360px);
		flex-direction: column;
		align-items: center;
		gap: 8px;
	}
	.eq {
		gap: 8px;
		font-family: var(--font-display);
		font-size: 22px;
		color: var(--color-ink);
	}
	.eq b {
		font-weight: 600;
	}
	.fast {
		border-radius: 999px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-family: var(--font-sans);
		font-size: 10px;
		font-weight: 800;
		padding: 2px 8px;
	}
	.prompt {
		text-align: center;
		font-size: 12.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.target {
		font-family: var(--font-display);
		font-size: 26px;
		color: var(--color-ink);
	}
	.grid {
		display: grid;
		grid-template-columns: repeat(6, minmax(0, 1fr));
		gap: 6px;
		width: 100%;
		max-width: 300px;
	}
	.prime {
		height: 32px;
		border-radius: 9px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		font-size: 13px;
		font-weight: 700;
		transition:
			background 0.2s,
			color 0.2s,
			opacity 0.2s;
	}
	.prime:enabled:hover {
		border-color: var(--color-brand);
	}
	.prime.miss {
		opacity: 0.35;
		text-decoration: line-through;
	}
	.prime.hit {
		border-color: var(--color-grass);
		background: var(--color-grass);
		color: #fff;
		opacity: 1;
	}
	.prime:disabled:not(.miss):not(.hit) {
		opacity: 0.7;
	}
	.count {
		min-height: 1.4em;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.effort,
	.real {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 6px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 12px;
	}
	.ehead {
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-muted);
	}
	.erow {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.elabel {
		width: 34px;
		flex: none;
		font-size: 11px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.track {
		position: relative;
		flex: 1;
		height: 8px;
		overflow: hidden;
		border-radius: 999px;
		background: var(--color-paper);
	}
	.fill {
		position: absolute;
		inset: 0 auto 0 0;
		border-radius: 999px;
		background: var(--color-brand);
		animation: grow 0.6s ease;
	}
	.fill.huge {
		width: 100%;
		background: var(--color-danger);
		animation: grow 1.4s ease;
	}
	@keyframes grow {
		from {
			width: 0;
		}
	}
	.eval {
		width: 64px;
		flex: none;
		text-align: right;
		font-size: 10px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.forever {
		text-align: right;
		font-size: 10px;
		font-weight: 800;
		color: var(--color-danger);
	}
	.digits {
		overflow-wrap: anywhere;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 10px;
		line-height: 1.45;
		color: var(--color-ink);
	}
	.rsub {
		font-size: 10px;
		font-weight: 600;
		color: var(--color-faint);
	}

	@media (prefers-reduced-motion: reduce) {
		.chip,
		.pop,
		.fill,
		.fill.huge {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			gap: 16px;
		}
		.acts li {
			font-size: 12.5px;
		}
		.btns :global(.cta) {
			padding: 12px 22px;
			font-size: 14px;
		}
		.scene {
			width: 560px;
			gap: 10px;
		}
		.actor {
			width: 116px;
		}
		.shrink {
			width: 107px;
			height: 170px;
		}
		.shrink > :global(.phone) {
			transform: scale(0.68);
		}
		.road {
			height: 180px;
		}
		.alabel {
			font-size: 12px;
		}
		.asub,
		.slabel,
		.priv,
		.opened {
			font-size: 10.5px;
		}
		.chip,
		.stag {
			font-size: 10.5px;
		}
		.note {
			max-width: 460px;
			font-size: 14px;
		}
		.rsa {
			width: 420px;
		}
		.eq {
			font-size: 26px;
		}
		.target {
			font-size: 32px;
		}
		.prime {
			height: 38px;
			font-size: 14px;
		}
		.grid {
			max-width: 360px;
		}
	}
</style>
