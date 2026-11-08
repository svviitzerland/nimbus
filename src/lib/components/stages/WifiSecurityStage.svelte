<script lang="ts">
	import { SvelteSet } from 'svelte/reactivity';
	import type { LessonText } from '$lib/chapters/types';
	import type { WifiSecurityText } from '$lib/chapters/network/wifi-security/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as WifiSecurityText);

	type Mode = 'open' | 'wpa2' | 'wpa3';
	const MODES: Mode[] = ['open', 'wpa2', 'wpa3'];
	const SSID = 'NimbusHome';
	const GUEST_SSID = 'NimbusGuest';
	// The kind of list a snooper really guesses from, plus anything short.
	const COMMON = ['12345678', '123456789', 'password', 'qwerty123', '11111111', 'nimbus123'];

	let mode = $state<Mode>('wpa2');
	let password = $state('12345678');
	let guest = $state(false);
	let lines = $state<{ text: string; tone: 'bad' | 'ok' | 'muted' }[]>([]);
	let running = $state(false);

	const weak = $derived(
		password.trim().length < 12 || COMMON.includes(password.trim().toLowerCase())
	);

	const tried = new SvelteSet<string>();
	let done = false;
	let timers: ReturnType<typeof setTimeout>[] = [];
	function clear() {
		timers.forEach(clearTimeout);
		timers = [];
	}
	$effect(() => () => clear());

	function pick(m: Mode) {
		if (running) return;
		mode = m;
		lines = [];
	}

	function toggleGuest() {
		guest = !guest;
		if (guest) onstate?.('guest');
	}

	function apply() {
		if (running) return;
		clear();
		lines = [];
		const s = tx.snoop;
		let script: { text: string; tone: 'bad' | 'ok' | 'muted' }[];
		let token: string;
		if (mode === 'open') {
			script = [
				{ text: s.joinOpen, tone: 'bad' },
				{ text: s.readPlain, tone: 'bad' }
			];
			token = 'open';
		} else if (mode === 'wpa2') {
			script = [
				{ text: s.captured, tone: 'muted' },
				{ text: s.guessing, tone: 'muted' },
				weak
					? { text: s.cracked.replace('{pw}', password.trim() || '?'), tone: 'bad' }
					: { text: s.noLuck, tone: 'ok' },
				weak ? { text: s.readPlain, tone: 'bad' } : { text: s.noise, tone: 'ok' }
			];
			token = weak ? 'wpa2weak' : 'wpa2';
		} else {
			script = [
				{ text: s.wpa3Live, tone: 'muted' },
				{ text: s.wpa3Slow, tone: 'ok' },
				{ text: s.noise, tone: 'ok' }
			];
			token = 'wpa3';
		}
		running = true;
		script.forEach((l, i) => timers.push(setTimeout(() => (lines = [...lines, l]), 350 + i * 650)));
		timers.push(
			setTimeout(
				() => {
					running = false;
					tried.add(mode);
					onstate?.(token);
					if (!done && tried.has('open') && tried.has('wpa3')) {
						done = true;
						oncomplete?.();
					}
				},
				350 + script.length * 650
			)
		);
	}
</script>

{#snippet device(kind: 'laptop' | 'tv' | 'phone')}
	<svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		{#if kind === 'laptop'}
			<rect x="4" y="5" width="16" height="11" rx="1.5" stroke="currentColor" stroke-width="1.8" />
			<path d="M2 19h20" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
		{:else if kind === 'tv'}
			<rect x="3" y="4" width="18" height="12" rx="1.5" stroke="currentColor" stroke-width="1.8" />
			<path d="M8 20h8M12 16v4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
		{:else}
			<rect x="7" y="2.5" width="10" height="19" rx="2" stroke="currentColor" stroke-width="1.8" />
			<path d="M11 18.5h2" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
		{/if}
	</svg>
{/snippet}

<div class="wrap">
	<div class="router">
		<div class="rhead">
			<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
				<rect x="3" y="13" width="18" height="7" rx="2" stroke="currentColor" stroke-width="1.8" />
				<path
					d="M8 13V9M16 13V9M6.5 16.5h.01M10 16.5h.01"
					stroke="currentColor"
					stroke-width="1.8"
					stroke-linecap="round"
				/>
			</svg>
			<b>{tx.routerTitle}</b>
			<code>{SSID}</code>
		</div>

		<div class="field">
			<span class="flabel">{tx.securityLabel}</span>
			<div class="seg" role="radiogroup" aria-label={tx.securityLabel}>
				{#each MODES as m (m)}
					<button
						type="button"
						role="radio"
						aria-checked={mode === m}
						class:sel={mode === m}
						class:danger={m === 'open'}
						disabled={running}
						onclick={() => pick(m)}>{tx.modes[m]}</button
					>
				{/each}
			</div>
			<span class="hint" class:warn={mode === 'open'}>{tx.modeHints[mode]}</span>
		</div>

		<label class="field" class:off={mode === 'open'}>
			<span class="flabel">{tx.passwordLabel}</span>
			<span class="pwrow">
				<input
					class="pw"
					type="text"
					bind:value={password}
					oninput={() => (lines = [])}
					disabled={mode === 'open' || running}
					maxlength="40"
					spellcheck="false"
					autocomplete="off"
					autocapitalize="off"
				/>
				{#if mode !== 'open'}
					<em class="strength" class:weak>{weak ? tx.weakTag : tx.strongTag}</em>
				{/if}
			</span>
		</label>

		<button
			type="button"
			class="guestsw"
			class:on={guest}
			role="switch"
			aria-checked={guest}
			onclick={toggleGuest}
		>
			<span class="track"><span class="knob"></span></span>
			<span>{tx.guestLabel}</span>
		</button>

		<button type="button" class="cta" disabled={running} onclick={apply}>{tx.applyBtn}</button>
	</div>

	<div class="snoop">
		<div class="sbar">
			<span class="dot"></span>
			{tx.snooperLabel}
		</div>
		<div class="sbody">
			{#if lines.length}
				{#each lines as l, i (i)}<div class="ln {l.tone}">{l.text}</div>{/each}
			{:else}
				<div class="ln idle">{running ? '' : tx.snooperIdle}</div>
			{/if}
		</div>
	</div>

	<div class="nets">
		<div class="net">
			<span class="nlabel">{tx.homeNet} <code>{SSID}</code></span>
			<div class="devs">
				<span class="dev">{@render device('laptop')}{tx.devices.laptop}</span>
				<span class="dev">{@render device('tv')}{tx.devices.tv}</span>
				{#if !guest}<span class="dev friend">{@render device('phone')}{tx.devices.friend}</span
					>{/if}
			</div>
		</div>
		{#if guest}
			<div class="net guestnet">
				<span class="nlabel">{tx.guestNet} <code>{GUEST_SSID}</code></span>
				<div class="devs">
					<span class="dev friend">{@render device('phone')}{tx.devices.friend}</span>
				</div>
			</div>
		{/if}
	</div>
	<p class="note">{guest ? tx.noteGuestOn : tx.noteGuestOff}</p>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 12px;
		width: min(94vw, 380px);
		max-height: 100%;
		overflow-y: auto;
		padding-bottom: 4px;
	}
	.router {
		width: 100%;
		display: flex;
		flex-direction: column;
		gap: 10px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 12px 14px;
	}
	.rhead {
		display: flex;
		align-items: center;
		gap: 8px;
		color: var(--color-brand);
	}
	.rhead b {
		flex: 1;
		font-size: 13px;
		font-weight: 800;
		color: var(--color-ink);
	}
	code {
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 11px;
		color: var(--color-muted);
	}
	.field {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}
	.field.off {
		opacity: 0.45;
	}
	.flabel {
		font-size: 10.5px;
		font-weight: 800;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		color: var(--color-faint);
	}
	.seg {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 4px;
		border-radius: 11px;
		background: var(--color-paper);
		border: 1px solid var(--color-line);
		padding: 3px;
	}
	.seg button {
		border-radius: 8px;
		padding: 7px 0;
		font-size: 12.5px;
		font-weight: 700;
		color: var(--color-muted);
		transition:
			background 0.2s ease,
			color 0.2s ease;
	}
	.seg button.sel {
		background: var(--color-brand);
		color: #fff;
	}
	.seg button.sel.danger {
		background: var(--color-danger);
	}
	.hint {
		font-size: 11.5px;
		color: var(--color-muted);
	}
	.hint.warn {
		color: var(--color-danger);
	}
	.pwrow {
		display: flex;
		align-items: center;
		gap: 8px;
	}
	.pw {
		flex: 1;
		min-width: 0;
		border-radius: 9px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		color: var(--color-ink);
		padding: 6px 10px;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		font-size: 13px;
	}
	.pw:focus {
		border-color: var(--color-brand);
		box-shadow: none;
	}
	.strength {
		flex: none;
		border-radius: 999px;
		background: var(--color-grass-soft);
		color: var(--color-grass);
		font-size: 10.5px;
		font-style: normal;
		font-weight: 800;
		padding: 3px 9px;
	}
	.strength.weak {
		background: var(--color-danger-soft);
		color: var(--color-danger);
	}
	.guestsw {
		display: flex;
		align-items: center;
		gap: 9px;
		font-size: 12.5px;
		font-weight: 650;
		color: var(--color-ink);
		text-align: left;
	}
	.track {
		position: relative;
		flex: none;
		width: 34px;
		height: 20px;
		border-radius: 999px;
		background: var(--color-line);
		transition: background 0.2s ease;
	}
	.guestsw.on .track {
		background: var(--color-grass);
	}
	.knob {
		position: absolute;
		top: 2px;
		left: 2px;
		width: 16px;
		height: 16px;
		border-radius: 50%;
		background: var(--color-card);
		box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
		transition: transform 0.2s ease;
	}
	.guestsw.on .knob {
		transform: translateX(14px);
	}
	.cta {
		border-radius: 12px;
		background: var(--btn-primary);
		color: #fff;
		padding: 10px 16px;
		font-size: 13px;
		font-weight: 600;
		transition: filter 0.2s ease;
	}
	.cta:enabled:hover {
		filter: brightness(1.18);
	}
	.cta:disabled,
	.seg button:disabled {
		opacity: 0.6;
	}

	.snoop {
		width: 100%;
		border-radius: 12px;
		overflow: hidden;
		background: #10212f;
		border: 1px solid #1d3547;
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
	}
	.sbar {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 6px 11px;
		background: #16293a;
		border-bottom: 1px solid #1d3547;
		font-family: var(--font-sans);
		font-size: 11px;
		font-weight: 700;
		color: #ff9d92;
	}
	.dot {
		width: 7px;
		height: 7px;
		border-radius: 50%;
		background: #e06a5b;
	}
	.sbody {
		min-height: 92px;
		padding: 9px 11px;
		display: flex;
		flex-direction: column;
		gap: 3px;
		font-size: 11.5px;
		line-height: 1.45;
	}
	.ln {
		word-break: break-word;
		animation: fade 0.25s ease;
	}
	.ln.muted {
		color: #93a7b6;
	}
	.ln.bad {
		color: #ff9d92;
	}
	.ln.ok {
		color: #6fd39a;
	}
	.ln.idle {
		color: #6b8496;
		font-family: var(--font-sans);
		font-style: italic;
	}
	@keyframes fade {
		from {
			opacity: 0;
			transform: translateY(2px);
		}
	}

	.nets {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		gap: 8px;
		width: 100%;
	}
	.net {
		display: flex;
		flex-direction: column;
		gap: 6px;
		border-radius: 12px;
		border: 1.5px solid var(--color-brand);
		background: var(--color-brand-soft);
		padding: 8px 10px;
	}
	.net.guestnet {
		border-color: var(--color-amber);
		background: var(--color-amber-soft);
		animation: fade 0.3s ease;
	}
	.nlabel {
		font-size: 10px;
		font-weight: 800;
		letter-spacing: 0.05em;
		text-transform: uppercase;
		color: var(--color-muted);
	}
	.devs {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.dev {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		border-radius: 8px;
		background: var(--color-card);
		border: 1px solid var(--color-line);
		padding: 4px 8px;
		font-size: 11.5px;
		font-weight: 650;
		color: var(--color-ink);
	}
	.dev.friend {
		color: var(--color-amber);
	}
	.note {
		margin: 0;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}

	@media (prefers-reduced-motion: reduce) {
		.ln,
		.net.guestnet {
			animation-duration: 0.01s;
		}
		.knob,
		.track {
			transition: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 460px;
			gap: 14px;
		}
		.sbody {
			font-size: 12.5px;
		}
		.note {
			font-size: 13.5px;
		}
	}
</style>
