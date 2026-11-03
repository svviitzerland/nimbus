<script lang="ts">
	import { onDestroy } from 'svelte';
	import Browser from '$lib/components/Browser.svelte';
	import Server from '$lib/components/Server.svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import Acts from './crypto/Acts.svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { TlsText } from '$lib/chapters/security/tls/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as TlsText);

	// Two acts. 0 = the handshake, step by step. 1 = an impostor with a bad certificate.
	let act = $state(0);
	const actDone = $state([false, false]);
	let completed = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	function reduced() {
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}
	function clearTimers() {
		timers.forEach(clearTimeout);
		timers = [];
	}

	// Act 1. `step` counts finished steps (0 to 5), `flying` is the step whose chip is on the wire.
	const tokens = ['hello', 'cert', 'check', 'key', 'secure'];
	// Which way each step's chip travels, true means from you to the server.
	const outward = [true, false, true, true, true];
	let step = $state(0);
	let flying = $state(-1);

	function nextStep() {
		if (flying !== -1 || step >= tokens.length) return;
		const i = step;
		const finish = () => {
			step = i + 1;
			flying = -1;
			onstate?.(tokens[i]);
			if (step === tokens.length) actDone[0] = true;
		};
		if (tx.steps[i].chip) {
			flying = i;
			timers.push(setTimeout(finish, reduced() ? 200 : 1100));
		} else finish();
	}
	function nextAct() {
		clearTimers();
		act = 1;
	}

	// Act 2. 'idle', then the warning, then the learner's choice.
	let visit = $state<'idle' | 'warn' | 'back' | 'proceed'>('idle');
	const fakePass = [true, true, false, true];
	function openFake() {
		visit = 'warn';
		onstate?.('warn');
	}
	function choose(c: 'back' | 'proceed') {
		visit = c;
		onstate?.(c);
		actDone[1] = true;
		if (!completed) {
			completed = true;
			oncomplete?.();
		}
	}

	const locked = $derived(act === 0 && step >= 5);

	onDestroy(clearTimers);
</script>

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

{#snippet mark(ok: boolean)}
	<span class="mark" class:bad={!ok}>
		<svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
			{#if ok}
				<path
					d="m5 12.5 4.5 4.5L19 7.5"
					stroke="#fff"
					stroke-width="3.2"
					stroke-linecap="round"
					stroke-linejoin="round"
				/>
			{:else}
				<path d="M7 7l10 10M17 7 7 17" stroke="#fff" stroke-width="3.2" stroke-linecap="round" />
			{/if}
		</svg>
	</span>
{/snippet}

<div class="wrap">
	<Acts
		names={tx.acts}
		current={act}
		done={actDone}
		label={tx.actLabel.replace('{n}', String(act + 1))}
	/>

	<!-- the action for this act, up top and clear of Nim -->
	<div class="btns">
		{#if act === 0 && actDone[0]}
			<CallToActionButton onclick={nextAct}>
				{#snippet children()}{tx.nextAct}{/snippet}
			</CallToActionButton>
		{:else if act === 0}
			<CallToActionButton onclick={nextStep} disabled={flying !== -1}>
				{#snippet children()}{tx.stepBtn} ({step + 1}/5){/snippet}
			</CallToActionButton>
		{:else if visit === 'idle'}
			<CallToActionButton onclick={openFake}>
				{#snippet children()}{tx.visitBtn}{/snippet}
			</CallToActionButton>
		{:else if visit !== 'warn'}
			<CallToActionButton onclick={() => (visit = 'idle')}>
				{#snippet children()}{tx.again}{/snippet}
			</CallToActionButton>
		{/if}
	</div>

	{#if act === 0}
		<!-- the address bar of your browser, the padlock lights up at the end -->
		<div class="addr" class:on={locked}>
			{@render padlock(13, !locked, locked ? 'var(--color-grass)' : 'var(--color-faint)')}
			<span>{locked ? 'https://' : ''}nimbus.com</span>
		</div>

		<div class="scene">
			<div class="actor">
				<div class="shrink" class:got={locked}><Browser phase={locked ? 'loaded' : 'idle'} /></div>
				<span class="alabel">{tx.youLabel}</span>
				<div class="hold">
					{#if step >= 4}<span class="skey pop">{@render keyIcon(11)}{tx.sessionKey}</span>{/if}
				</div>
			</div>

			<div class="road">
				<div class="wire" class:safe={locked}></div>
				{#if flying !== -1}
					{#key flying}
						<div class="chip" class:back={!outward[flying]} class:dark={flying === 4}>
							{#if flying === 1}{@render padlock(10, true, 'var(--color-brand)')}{/if}
							{tx.steps[flying].chip}
						</div>
					{/key}
				{:else if locked}
					<div class="chip loop dark">{@render padlock(10, false, '#fff')}{tx.secretMsg}</div>
				{/if}
			</div>

			<div class="actor">
				<div class="srv"><Server active={step >= 1} /></div>
				<span class="alabel">{tx.serverLabel}</span>
				<div class="hold">
					{#if step >= 4}<span class="skey pop">{@render keyIcon(11)}{tx.sessionKey}</span>{/if}
				</div>
			</div>
		</div>

		{#if step >= 2}
			<div class="cert pop">
				<p class="chead">{tx.cert.heading}</p>
				<dl>
					<dt>{tx.cert.subjectLabel}</dt>
					<dd>{tx.cert.subject}</dd>
					<dt>{tx.cert.issuerLabel}</dt>
					<dd>{tx.cert.issuer}</dd>
					<dt>{tx.cert.validLabel}</dt>
					<dd>{tx.cert.valid}</dd>
					<dt>{tx.cert.keyLabel}</dt>
					<dd class="mono">{tx.cert.keyValue}</dd>
				</dl>
				{#if step >= 3}
					<ul class="checks">
						{#each tx.checks as c, i (i)}
							<li class="tick" style="animation-delay:{i * 0.22}s">{@render mark(true)}{c}</li>
						{/each}
					</ul>
				{/if}
			</div>
		{/if}

		<ol class="steps">
			{#each tx.steps as s, i (i)}
				<li class:done={i < step} class:now={i === step || i === flying}>
					<span class="snum">{i + 1}</span>
					<span class="stext"><b>{s.title}</b>{s.body}</span>
				</li>
			{/each}
		</ol>
	{:else}
		<div class="scene">
			<div class="actor">
				<div class="shrink"><Browser phase="idle" /></div>
				<span class="alabel">{tx.youLabel}</span>
			</div>
			<div class="road">
				<div class="wire" class:bad={visit === 'proceed'}></div>
				<div class="mitm">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<circle cx="12" cy="8" r="4" fill="var(--color-danger)" />
						<path d="M4 21a8 8 0 0 1 16 0Z" fill="var(--color-danger)" />
					</svg>
					<span class="mlabel">{tx.attackerLabel}</span>
				</div>
				{#if visit === 'proceed'}
					<div class="chip half bad">{@render keyIcon(10)}password</div>
				{/if}
				<span class="wifi">{tx.wifiLabel}</span>
			</div>
			<div class="actor faded">
				<div class="srv"><Server /></div>
				<span class="alabel">{tx.serverLabel}</span>
			</div>
		</div>

		{#if visit !== 'idle'}
			<div class="window pop">
				<div class="wbar">
					<span class="badlock">{@render padlock(12, true, 'var(--color-danger)')}</span>
					<span class="waddr">{tx.addr}</span>
				</div>
				{#if visit === 'warn'}
					<div class="wbody">
						<svg width="34" height="34" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path d="M12 3 22 20H2L12 3Z" fill="var(--color-danger)" />
							<path d="M12 9.5v5" stroke="#fff" stroke-width="2.2" stroke-linecap="round" />
							<circle cx="12" cy="17.4" r="1.2" fill="#fff" />
						</svg>
						<p class="wtitle">{tx.warn.title}</p>
						<p class="wtext">{tx.warn.body}</p>
						<div class="wbtns">
							<button type="button" class="wgood" onclick={() => choose('back')}
								>{tx.warn.back}</button
							>
							<button type="button" class="wbad" onclick={() => choose('proceed')}
								>{tx.warn.proceed}</button
							>
						</div>
					</div>
				{:else}
					<div class="wbody">
						<p class="verdict pop" class:bad={visit === 'proceed'}>
							{visit === 'proceed' ? tx.stolen : tx.safe}
						</p>
					</div>
				{/if}
			</div>

			<div class="cert fake">
				<p class="chead">{tx.warn.details}</p>
				<dl>
					<dt>{tx.cert.subjectLabel}</dt>
					<dd>{tx.cert.subject}</dd>
					<dt>{tx.cert.issuerLabel}</dt>
					<dd class="red">{tx.fakeIssuer}</dd>
					<dt>{tx.cert.validLabel}</dt>
					<dd>{tx.fakeValid}</dd>
				</dl>
				<ul class="checks">
					{#each tx.checks as c, i (i)}
						<li class:fail={!fakePass[i]}>
							{@render mark(fakePass[i])}<span>{c} <em>({tx.fakeChecks[i]})</em></span>
						</li>
					{/each}
				</ul>
			</div>
		{/if}
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
	.addr {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border-radius: 999px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 4px 12px;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
		transition:
			border-color 0.3s,
			color 0.3s;
	}
	.addr.on {
		border-color: var(--color-grass);
		color: var(--color-ink);
	}

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
		transition: opacity 0.3s;
	}
	.actor.faded {
		opacity: 0.45;
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
	.srv {
		display: flex;
		height: 125px;
		align-items: center;
	}
	.srv > :global(.server) {
		width: 70px;
	}
	.alabel {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.hold {
		display: flex;
		min-height: 18px;
		align-items: center;
		justify-content: center;
	}
	.skey {
		gap: 3px;
		border-radius: 999px;
		background: var(--color-amber-soft);
		color: var(--color-amber);
		font-size: 8.5px;
		font-weight: 800;
		padding: 2px 6px;
		white-space: nowrap;
	}
	.road {
		position: relative;
		flex: 1;
		min-width: 0;
		height: 125px;
	}
	.wire {
		position: absolute;
		top: 50%;
		left: 0;
		right: 0;
		height: 2px;
		border-radius: 2px;
		background: var(--color-line);
		transition: background 0.3s;
	}
	.wire.safe {
		background: var(--color-grass);
	}
	.wire.bad {
		background: var(--color-danger);
	}
	.chip {
		position: absolute;
		top: calc(50% - 22px);
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
		animation: out 1.1s ease-in-out forwards;
	}
	.chip.back {
		animation-name: back;
	}
	.chip.dark {
		border-color: var(--color-ink);
		background: var(--color-ink);
		color: var(--color-paper);
	}
	.chip.loop {
		animation: out 1.6s linear infinite;
	}
	.chip.half {
		animation: half 1s ease-in forwards;
	}
	.chip.bad {
		border-color: var(--color-danger);
		background: var(--color-danger);
		color: #fff;
	}
	@keyframes out {
		from {
			left: 0;
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		to {
			left: calc(100% - 64px);
			opacity: 0;
		}
	}
	@keyframes back {
		from {
			left: calc(100% - 72px);
			opacity: 0;
		}
		15% {
			opacity: 1;
		}
		85% {
			opacity: 1;
		}
		to {
			left: 0;
			opacity: 0;
		}
	}
	@keyframes half {
		from {
			left: 0;
			opacity: 0;
		}
		20% {
			opacity: 1;
		}
		to {
			left: calc(50% - 34px);
		}
	}
	.mitm {
		position: absolute;
		top: calc(50% + 8px);
		left: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		transform: translateX(-50%);
	}
	.mlabel {
		max-width: 110px;
		text-align: center;
		font-size: 8.5px;
		font-weight: 700;
		line-height: 1.2;
		color: var(--color-danger);
	}
	.wifi {
		position: absolute;
		top: 12px;
		left: 50%;
		transform: translateX(-50%);
		font-size: 8.5px;
		font-weight: 700;
		color: var(--color-faint);
		white-space: nowrap;
	}

	.cert {
		display: flex;
		width: min(94vw, 340px);
		flex-direction: column;
		gap: 6px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 12px;
	}
	.cert.fake {
		border-color: var(--color-danger);
	}
	.chead {
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-muted);
	}
	dl {
		display: grid;
		grid-template-columns: auto 1fr;
		gap: 2px 10px;
		font-size: 11px;
	}
	dt {
		color: var(--color-faint);
		font-weight: 600;
	}
	dd {
		color: var(--color-ink);
		font-weight: 700;
	}
	dd.red {
		color: var(--color-danger);
	}
	.mono {
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-weight: 500;
	}
	.checks {
		display: flex;
		flex-direction: column;
		gap: 4px;
		border-top: 1px solid var(--color-line);
		padding-top: 6px;
	}
	.checks li {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-ink);
	}
	.checks li.fail {
		color: var(--color-danger);
	}
	.checks em {
		font-style: normal;
		font-weight: 500;
		color: var(--color-faint);
	}
	.checks li.fail em {
		color: var(--color-danger);
	}
	.tick {
		opacity: 0;
		animation: popin 0.3s ease forwards;
	}
	.mark {
		display: inline-grid;
		flex: none;
		place-items: center;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--color-grass);
	}
	.mark.bad {
		background: var(--color-danger);
	}

	.steps {
		display: flex;
		width: min(94vw, 340px);
		flex-direction: column;
		gap: 4px;
	}
	.steps li {
		display: flex;
		align-items: flex-start;
		gap: 8px;
		border-radius: 10px;
		padding: 4px 8px;
		color: var(--color-faint);
		transition:
			background 0.2s,
			color 0.2s;
	}
	.steps li.now {
		background: var(--color-brand-soft);
		color: var(--color-ink);
	}
	.steps li.done {
		color: var(--color-muted);
	}
	.snum {
		display: inline-grid;
		flex: none;
		place-items: center;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--color-line);
		color: var(--color-muted);
		font-size: 9.5px;
		font-weight: 800;
	}
	.steps li.now .snum {
		background: var(--color-brand);
		color: #fff;
	}
	.steps li.done .snum {
		background: var(--color-grass);
		color: #fff;
	}
	.stext {
		font-size: 11px;
		line-height: 1.35;
	}
	.stext b {
		margin-right: 5px;
		font-weight: 800;
	}

	.window {
		display: flex;
		width: min(94vw, 340px);
		flex-direction: column;
		overflow: hidden;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		box-shadow: 0 10px 26px rgba(22, 40, 60, 0.1);
	}
	.wbar {
		display: flex;
		align-items: center;
		gap: 6px;
		border-bottom: 1px solid var(--color-line);
		padding: 7px 10px;
	}
	.badlock {
		display: inline-flex;
		position: relative;
	}
	.badlock::after {
		content: '';
		position: absolute;
		left: 0;
		top: 50%;
		width: 100%;
		height: 2px;
		background: var(--color-danger);
		transform: rotate(-40deg);
	}
	.waddr {
		flex: 1;
		border-radius: 999px;
		background: var(--color-paper);
		padding: 2px 10px;
		font-size: 11px;
		font-weight: 600;
		color: var(--color-danger);
	}
	.wbody {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
		background: var(--color-danger-soft);
		padding: 14px 14px 12px;
		text-align: center;
	}
	.wtitle {
		font-family: var(--font-display);
		font-size: 17px;
		color: var(--color-ink);
	}
	.wtext {
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.wbtns {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
		margin-top: 4px;
	}
	.wgood,
	.wbad {
		border-radius: 10px;
		padding: 7px 14px;
		font-size: 12px;
		font-weight: 700;
	}
	.wgood {
		background: var(--color-brand);
		color: #fff;
	}
	.wbad {
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
	}
	.verdict {
		font-size: 13px;
		font-weight: 800;
		color: var(--color-grass);
	}
	.verdict.bad {
		color: var(--color-danger);
	}

	.pop {
		display: inline-flex;
		align-items: center;
		animation: popin 0.25s ease;
	}
	.cert.pop,
	.window.pop {
		display: flex;
	}
	@keyframes popin {
		from {
			transform: scale(0.6);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.chip,
		.pop,
		.tick {
			animation-duration: 0.01s;
			animation-delay: 0s !important;
		}
		.chip.loop {
			animation: none;
			left: calc(50% - 34px);
		}
	}
	@media (min-width: 768px) {
		.wrap {
			gap: 16px;
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
		.srv,
		.road {
			height: 170px;
		}
		.srv > :global(.server) {
			width: 86px;
		}
		.alabel {
			font-size: 12px;
		}
		.chip,
		.skey,
		.mlabel,
		.wifi {
			font-size: 10.5px;
		}
		.cert,
		.steps,
		.window {
			width: 420px;
		}
		dl,
		.checks li,
		.stext {
			font-size: 12.5px;
		}
	}
</style>
