<script lang="ts">
	import { onDestroy } from 'svelte';
	import { SvelteSet } from 'svelte/reactivity';
	import Browser from '$lib/components/Browser.svelte';
	import Laptop from '$lib/components/Laptop.svelte';
	import CallToActionButton from '$lib/components/CallToActionButton.svelte';
	import Acts from './crypto/Acts.svelte';
	import { fingerprint } from './crypto/hash';
	import type { LessonText } from '$lib/chapters/types';
	import type { SignatureText } from '$lib/chapters/security/signature/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as SignatureText);

	// Three acts. 0 = sign and send, 1 = the attacker edits the file, 2 = the attacker signs it himself.
	let act = $state(0);
	const actDone = $state([false, false, false]);
	let completed = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	// The file is described by which sneaky edits are applied, so switching language never breaks a match.
	const applied = new SvelteSet<number>();
	let signedWith = $state<number[]>([]); // the edits that were in the file when it was signed
	let hashed = $state(false);
	let signer = $state<'' | 'nimbus' | 'attacker'>('');
	let where = $state<'dev' | 'mid' | 'phone'>('dev');
	let moving = $state(false);
	let delivered = $state(false);

	function linesFor(edits: Iterable<number>) {
		const out = [...tx.lines];
		for (const i of edits) out[tx.tampers[i].line] = tx.tampers[i].text;
		return out;
	}
	const lines = $derived(linesFor(applied));
	const fpNow = $derived(fingerprint(lines.join('\n')));
	const fpSigned = $derived(fingerprint(linesFor(signedWith).join('\n')));
	const keyName = $derived(signer === 'attacker' ? 'attacker' : 'nimbus');
	const sig = $derived(signer ? fingerprint(keyName + fpSigned).toUpperCase() : '');
	// The phone opens the signature with the nimbus public key. Only a nimbus signature opens cleanly.
	const opened = $derived(signer === 'nimbus' ? fpSigned : fingerprint('open' + sig));
	const ok = $derived(opened === fpNow);
	const changedLines = $derived(new Set([...applied].map((i) => tx.tampers[i].line)));

	function reduced() {
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}
	function clearTimers() {
		timers.forEach(clearTimeout);
		timers = [];
	}

	function makeHash() {
		hashed = true;
		onstate?.('fingerprint');
	}
	function sign() {
		signer = 'nimbus';
		signedWith = [...applied];
		onstate?.('signed');
	}

	// Moves the file to the phone, then lets the phone check it.
	function deliver(after: () => void) {
		moving = true;
		where = 'phone';
		timers.push(
			setTimeout(
				() => {
					moving = false;
					delivered = true;
					after();
				},
				reduced() ? 200 : 1100
			)
		);
	}
	function send() {
		deliver(() => {
			onstate?.('verified');
			actDone[0] = true;
		});
	}
	function toggle(i: number) {
		if (applied.has(i)) applied.delete(i);
		else applied.add(i);
		onstate?.('edit');
	}
	function letThrough() {
		deliver(() => {
			if (ok) onstate?.('untouched');
			else {
				onstate?.('tampered');
				actDone[1] = true;
			}
		});
	}
	function forge() {
		signer = 'attacker';
		signedWith = [...applied];
		deliver(() => {
			onstate?.('forged');
			actDone[2] = true;
			if (!completed) {
				completed = true;
				oncomplete?.();
			}
		});
	}
	function nextAct() {
		clearTimers();
		act += 1;
		delivered = false;
		moving = false;
		where = 'mid';
		if (act === 2 && applied.size === 0) applied.add(1);
	}
	// After "untouched", let the learner pull the file back to the attacker and try again.
	function retry() {
		delivered = false;
		where = 'mid';
	}

	onDestroy(clearTimers);
</script>

{#snippet keyIcon(size: number, color: string)}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<circle cx="8" cy="8" r="4.5" stroke={color} stroke-width="2.6" />
		<path d="M11 11.5 20 20m-3.5.5V17" stroke={color} stroke-width="2.6" stroke-linecap="round" />
	</svg>
{/snippet}

{#snippet docIcon(size: number)}
	<svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<path d="M6 3h8l4 4v14H6V3Z" stroke="currentColor" stroke-width="2.2" stroke-linejoin="round" />
		<path d="M9 12h6M9 16h6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
	</svg>
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
		{#if act < 2 && actDone[act] && !moving}
			<CallToActionButton onclick={nextAct}>
				{#snippet children()}{tx.nextAct}{/snippet}
			</CallToActionButton>
		{:else if act === 0}
			<CallToActionButton onclick={makeHash} disabled={hashed}>
				{#snippet children()}{tx.hashBtn}{/snippet}
			</CallToActionButton>
			<CallToActionButton onclick={sign} disabled={!hashed || signer !== ''}>
				{#snippet children()}{tx.signBtn}{/snippet}
			</CallToActionButton>
			<CallToActionButton onclick={send} disabled={!signer || moving || delivered}>
				{#snippet children()}{tx.sendBtn}{/snippet}
			</CallToActionButton>
		{:else if act === 1}
			{#if delivered}
				<CallToActionButton onclick={retry}>
					{#snippet children()}{tx.retryBtn}{/snippet}
				</CallToActionButton>
			{:else}
				<CallToActionButton onclick={letThrough} disabled={moving}>
					{#snippet children()}{tx.deliverBtn}{/snippet}
				</CallToActionButton>
			{/if}
		{:else if !actDone[2]}
			<CallToActionButton onclick={forge} disabled={moving}>
				{#snippet children()}{tx.forgeBtn}{/snippet}
			</CallToActionButton>
		{/if}
	</div>

	{#if act === 1 && !delivered && !moving}
		<div class="tampers" role="group" aria-label={tx.tamperHint}>
			<p class="hint">{tx.tamperHint}</p>
			<div class="tchips">
				{#each tx.tampers as t, i (i)}
					<button
						type="button"
						class="tchip"
						class:on={applied.has(i)}
						aria-pressed={applied.has(i)}
						onclick={() => toggle(i)}>{t.btn}</button
					>
				{/each}
			</div>
		</div>
	{/if}

	<div class="scene">
		<div class="actor">
			<div class="lap"><Laptop led={signer === 'nimbus' ? 'ok' : 'off'} /></div>
			<span class="alabel">{tx.devLabel}</span>
		</div>

		<div class="road">
			<div class="wire"></div>
			{#if act > 0}
				<div class="villain">
					<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<circle cx="12" cy="8" r="4" fill="var(--color-danger)" />
						<path d="M4 21a8 8 0 0 1 16 0Z" fill="var(--color-danger)" />
					</svg>
					<span class="vlabel">{tx.attackerLabel}</span>
				</div>
			{/if}
			<div class="file {where}" class:bad={changedLines.size > 0}>
				{@render docIcon(14)}
				{#if signer}<span class="seal" class:fake={signer === 'attacker'}></span>{/if}
			</div>
		</div>

		<div class="actor">
			<div class="shrink" class:good={delivered && ok} class:refused={delivered && !ok}>
				<Browser phase={delivered && ok ? 'loaded' : 'idle'} />
			</div>
			<span class="alabel">{tx.userLabel}</span>
		</div>
	</div>

	<!-- the update itself, its live fingerprint, and the signature riding along -->
	<div class="card">
		<p class="fname">{@render docIcon(13)}{tx.fileName}</p>
		<ol class="lines">
			{#each lines as l, i (i)}
				<li class:changed={changedLines.has(i)}>{l}</li>
			{/each}
		</ol>
		<div class="row">
			<span class="rlabel">{tx.fingerprintLabel}</span>
			{#if hashed}
				{#key fpNow}<code class="hex pop" class:changed={changedLines.size > 0}>{fpNow}</code>{/key}
			{:else}
				<code class="hex muted">????????</code>
			{/if}
		</div>
		<div class="row">
			<span class="rlabel">{tx.signatureLabel}</span>
			{#if signer}
				<span class="sigv">
					{#key sig}<code class="hex sealed pop" class:fake={signer === 'attacker'}>{sig}</code
						>{/key}
					<span class="who" class:fake={signer === 'attacker'}>
						{@render keyIcon(
							10,
							signer === 'attacker' ? 'var(--color-danger)' : 'var(--color-amber)'
						)}
						{signer === 'attacker' ? tx.attackerKey : tx.nimbusKey}
					</span>
				</span>
			{:else}
				<span class="none">{tx.noSig}</span>
			{/if}
		</div>
	</div>

	{#if delivered}
		<div class="check pop" class:bad={!ok}>
			<p class="chead">{tx.check.heading}</p>
			<div class="row">
				<span class="rlabel">{tx.check.opened}</span>
				<code class="hex">{opened}</code>
			</div>
			<div class="row">
				<span class="rlabel">{tx.check.computed}</span>
				<code class="hex">{fpNow}</code>
			</div>
			<p class="verdict">{ok ? tx.check.ok : tx.check.bad}</p>
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
	.btns {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
		min-height: 46px;
		max-width: 420px;
	}
	.btns :global(.cta) {
		padding: 9px 14px;
		font-size: 12.5px;
	}
	.tampers {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 6px;
	}
	.hint {
		text-align: center;
		font-size: 11.5px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.tchips {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 6px;
	}
	.tchip {
		border-radius: 999px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		padding: 5px 12px;
		font-size: 11.5px;
		font-weight: 700;
		color: var(--color-ink);
		transition:
			border-color 0.2s,
			background 0.2s,
			color 0.2s;
	}
	.tchip:hover {
		border-color: var(--color-danger);
	}
	.tchip.on {
		border-color: var(--color-danger);
		background: var(--color-danger);
		color: #fff;
	}

	.scene {
		display: flex;
		align-items: flex-end;
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
	.lap {
		display: flex;
		width: 84px;
		height: 70px;
		justify-content: center;
		align-items: flex-end;
	}
	.lap > :global(.laptop) {
		transform: scale(0.6);
		transform-origin: bottom center;
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
	.shrink.good > :global(.phone) {
		border-color: var(--color-grass);
	}
	.shrink.refused > :global(.phone) {
		border-color: var(--color-danger);
	}
	.alabel {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-muted);
		text-align: center;
		line-height: 1.2;
	}
	.road {
		position: relative;
		flex: 1;
		min-width: 0;
		height: 125px;
	}
	.wire {
		position: absolute;
		top: 45%;
		left: 0;
		right: 0;
		height: 2px;
		border-radius: 2px;
		background: var(--color-line);
	}
	.villain {
		position: absolute;
		top: calc(45% + 10px);
		left: 50%;
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 2px;
		transform: translateX(-50%);
	}
	.vlabel {
		font-size: 8.5px;
		font-weight: 700;
		color: var(--color-danger);
		white-space: nowrap;
	}
	.file {
		position: absolute;
		top: calc(45% - 30px);
		display: grid;
		place-items: center;
		width: 26px;
		height: 26px;
		border-radius: 8px;
		border: 1.5px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-ink);
		transform: translateX(-50%);
		transition:
			left 1.1s ease-in-out,
			border-color 0.2s,
			color 0.2s;
	}
	.file.dev {
		left: 13px;
	}
	.file.mid {
		left: 50%;
	}
	.file.phone {
		left: calc(100% - 13px);
	}
	.file.bad {
		border-color: var(--color-danger);
		color: var(--color-danger);
	}
	.seal {
		position: absolute;
		right: -5px;
		bottom: -5px;
		width: 11px;
		height: 11px;
		border-radius: 50%;
		border: 2px solid var(--color-card);
		background: var(--color-amber);
	}
	.seal.fake {
		background: var(--color-danger);
	}

	.card,
	.check {
		display: flex;
		width: min(94vw, 340px);
		flex-direction: column;
		gap: 6px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px 12px;
	}
	.fname {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		font-size: 11px;
		font-weight: 800;
		color: var(--color-muted);
	}
	.lines {
		display: flex;
		flex-direction: column;
		gap: 2px;
		border-radius: 8px;
		background: var(--color-paper);
		padding: 6px 8px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		color: var(--color-ink);
	}
	.lines li.changed {
		color: var(--color-danger);
		font-weight: 700;
	}
	.row {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 8px;
	}
	.rlabel {
		font-size: 10.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.hex {
		border-radius: 6px;
		background: var(--color-paper);
		padding: 1px 6px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11.5px;
		font-weight: 700;
		letter-spacing: 0.04em;
		color: var(--color-ink);
	}
	.hex.muted {
		color: var(--color-faint);
	}
	.hex.changed {
		color: var(--color-danger);
	}
	.hex.sealed {
		background: var(--color-ink);
		color: var(--color-paper);
	}
	.hex.sealed.fake {
		background: var(--color-danger);
		color: #fff;
	}
	.sigv {
		display: flex;
		flex-direction: column;
		align-items: flex-end;
		gap: 2px;
	}
	.who {
		display: inline-flex;
		align-items: center;
		gap: 3px;
		font-size: 9.5px;
		font-weight: 700;
		color: var(--color-amber);
	}
	.who.fake {
		color: var(--color-danger);
	}
	.none {
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.check {
		border-color: var(--color-grass);
	}
	.check.bad {
		border-color: var(--color-danger);
	}
	.chead {
		font-size: 10.5px;
		font-weight: 800;
		color: var(--color-muted);
	}
	.verdict {
		text-align: center;
		font-size: 12.5px;
		font-weight: 800;
		color: var(--color-grass);
	}
	.check.bad .verdict {
		color: var(--color-danger);
	}
	.pop {
		animation: popin 0.25s ease;
	}
	@keyframes popin {
		from {
			transform: scale(0.7);
			opacity: 0;
		}
		to {
			transform: scale(1);
			opacity: 1;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pop {
			animation-duration: 0.01s;
		}
		.file {
			transition-duration: 0.15s;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			gap: 16px;
		}
		.btns {
			max-width: 640px;
		}
		.btns :global(.cta) {
			padding: 11px 18px;
			font-size: 13.5px;
		}
		.scene {
			width: 560px;
			gap: 10px;
		}
		.actor {
			width: 116px;
		}
		.lap {
			width: 116px;
			height: 92px;
		}
		.lap > :global(.laptop) {
			transform: scale(0.8);
		}
		.shrink {
			width: 107px;
			height: 170px;
		}
		.shrink > :global(.phone) {
			transform: scale(0.68);
		}
		.road {
			height: 170px;
		}
		.alabel {
			font-size: 12px;
		}
		.vlabel {
			font-size: 10.5px;
		}
		.card,
		.check {
			width: 420px;
		}
		.lines,
		.hex {
			font-size: 12.5px;
		}
		.rlabel,
		.fname,
		.chead {
			font-size: 12px;
		}
	}
</style>
