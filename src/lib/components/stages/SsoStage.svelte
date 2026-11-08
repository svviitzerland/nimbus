<script lang="ts">
	import { onDestroy } from 'svelte';
	import type { LessonText } from '$lib/chapters/types';
	import type { SsoScope, SsoText } from '$lib/chapters/security/sso/types';

	let {
		text,
		oncomplete,
		onstate
	}: { text: LessonText; oncomplete?: () => void; onstate?: (s: string) => void } = $props();
	const tx = $derived(text as SsoText);

	type Screen = 'nimbus' | 'google' | 'consent' | 'returning' | 'home';
	let screen = $state<Screen>('nimbus');
	let revoked = $state(false);
	let completed = false;
	let timers: ReturnType<typeof setTimeout>[] = [];

	// What nimbus.com asks for. Name and email are needed, the rest you can switch off.
	const scopeList: { id: SsoScope; required: boolean; risky: boolean }[] = [
		{ id: 'name', required: true, risky: false },
		{ id: 'email', required: true, risky: false },
		{ id: 'photo', required: false, risky: false },
		{ id: 'contacts', required: false, risky: true },
		{ id: 'drive', required: false, risky: true }
	];
	// A sneaky default, the shop pre ticks your contacts, just like plenty of real apps do.
	let granted = $state<Record<SsoScope, boolean>>({
		name: true,
		email: true,
		photo: true,
		contacts: true,
		drive: false
	});

	const host = $derived(
		screen === 'google' || screen === 'consent' ? 'accounts.google.com' : 'nimbus.com'
	);
	const hint = $derived(
		screen === 'nimbus'
			? tx.hints.start
			: screen === 'google'
				? tx.hints.google
				: screen === 'consent'
					? tx.hints.consent
					: screen === 'returning'
						? tx.returning
						: revoked
							? tx.revokedNote
							: tx.hints.done
	);

	function reduced() {
		return (
			typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
		);
	}
	function toGoogle() {
		screen = 'google';
		onstate?.('redirect');
	}
	function signIn() {
		screen = 'consent';
		onstate?.('google');
	}
	function allow() {
		screen = 'returning';
		const greedy = scopeList.some((s) => s.risky && granted[s.id]);
		timers.push(
			setTimeout(
				() => {
					screen = 'home';
					onstate?.(greedy ? 'greedy' : 'consent');
					if (!completed) {
						completed = true;
						oncomplete?.();
					}
				},
				reduced() ? 150 : 1100
			)
		);
	}
	function revoke() {
		revoked = true;
		onstate?.('revoke');
	}

	onDestroy(() => timers.forEach(clearTimeout));
</script>

{#snippet lock(color: string)}
	<svg width="10" height="10" viewBox="0 0 24 24" fill="none" aria-hidden="true">
		<rect x="5" y="10.5" width="14" height="9.5" rx="2.5" stroke={color} stroke-width="2.6" />
		<path d="M8.5 10.5V7.5a3.5 3.5 0 0 1 7 0v3" stroke={color} stroke-width="2.6" />
	</svg>
{/snippet}

{#snippet gmark()}
	<span class="gmark" aria-hidden="true">G</span>
{/snippet}

<div class="wrap">
	<div class="phone">
		<!-- the address bar, the most important clue on this stage -->
		<div class="addr" class:away={host !== 'nimbus.com'}>
			{@render lock(host === 'nimbus.com' ? 'var(--color-grass)' : 'var(--color-brand)')}
			{#key host}<span class="host pop">{host}</span>{/key}
		</div>

		<div class="page" class:short={screen === 'home'}>
			{#if screen === 'nimbus'}
				<div class="pane pop">
					<p class="ptitle">{tx.signInTitle}</p>
					<button type="button" class="gbtn" onclick={toGoogle}>
						{@render gmark()}{tx.googleBtn}
					</button>
					<p class="alt">{tx.orPassword}</p>
				</div>
			{:else if screen === 'google'}
				<div class="pane pop">
					<div class="ghead">{@render gmark()}</div>
					<p class="ptitle">{tx.googleTitle}</p>
					<p class="psub">{tx.googleSub}</p>
					<span class="field"><i>email</i>{tx.googleEmail}</span>
					<span class="field"><i>{tx.passwordField}</i>••••••••••</span>
					<button type="button" class="pbtn" onclick={signIn}>{tx.nextBtn}</button>
				</div>
			{:else if screen === 'consent'}
				<div class="pane pop">
					<div class="ghead">{@render gmark()}</div>
					<p class="ptitle">{tx.consentTitle}</p>
					<ul class="scopes">
						{#each scopeList as s (s.id)}
							<li>
								<label class:risky={s.risky && granted[s.id]}>
									<input type="checkbox" bind:checked={granted[s.id]} disabled={s.required} />
									<span class="sname">{tx.scopes[s.id]}</span>
									{#if s.required}<span class="req">{tx.requiredTag}</span>{/if}
								</label>
							</li>
						{/each}
					</ul>
					<button type="button" class="pbtn" onclick={allow}>{tx.allowBtn}</button>
				</div>
			{:else if screen === 'returning'}
				<div class="pane center">
					<span class="token travel">{@render lock('#fff')}{tx.tokenChip}</span>
				</div>
			{:else}
				<div class="pane pop">
					<div class="hello">
						<span class="avatar" class:pic={granted.photo && !revoked}
							>{tx.googleEmail.charAt(0).toUpperCase()}</span
						>
						<div>
							<p class="ptitle">{revoked ? tx.signInTitle : tx.welcomeTitle}</p>
							{#if !revoked}<p class="psub">{tx.welcomeSub}</p>{/if}
						</div>
					</div>
					<div class="skel"><i></i><i class="s"></i><i></i></div>
				</div>
			{/if}
		</div>
	</div>

	<p class="hint">{hint}</p>

	{#if screen === 'home'}
		<div class="got pop">
			<p class="gtitle">
				{tx.gotTitle}
				<span class="token small" class:dead={revoked}>{@render lock('#fff')}{tx.tokenChip}</span>
			</p>
			{#each scopeList as s (s.id)}
				<div class="grow" class:no={!granted[s.id]} class:risky={s.risky && granted[s.id]}>
					<span>{tx.scopes[s.id]}</span>
					<b>{granted[s.id] ? '✓' : tx.notSharedTag}</b>
				</div>
			{/each}
			<div class="safe grow">
				<span>{tx.passwordRow}</span>
				<b>{tx.neverTag}</b>
			</div>
			{#if !revoked}
				<button type="button" class="ghost" onclick={revoke}>{tx.revokeBtn}</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.wrap {
		display: flex;
		width: min(94vw, 360px);
		max-height: 100%;
		flex-direction: column;
		align-items: center;
		gap: 10px;
		overflow-y: auto;
	}
	.phone {
		display: flex;
		width: 230px;
		flex: none;
		flex-direction: column;
		gap: 8px;
		border-radius: 24px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 10px;
		box-shadow: 0 8px 20px rgba(22, 40, 60, 0.08);
	}
	.addr {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 5px;
		border-radius: 999px;
		background: var(--color-paper);
		border: 1.5px solid var(--color-line);
		padding: 4px 10px;
		transition:
			border-color 0.3s,
			background 0.3s;
	}
	.addr.away {
		border-color: var(--color-brand);
		background: var(--color-brand-soft);
	}
	.host {
		font-size: 11px;
		font-weight: 700;
		color: var(--color-ink);
	}
	.page {
		min-height: 230px;
	}
	.page.short {
		min-height: 0;
	}
	.pane {
		display: flex;
		flex-direction: column;
		gap: 7px;
		padding: 4px 2px;
	}
	.pane.center {
		height: 230px;
		align-items: center;
		justify-content: center;
	}
	.ptitle {
		font-family: var(--font-display);
		font-size: 16px;
		color: var(--color-ink);
	}
	.psub {
		margin-top: -5px;
		font-size: 10.5px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.gmark {
		display: inline-grid;
		place-items: center;
		width: 18px;
		height: 18px;
		border-radius: 50%;
		background: var(--color-brand);
		color: #fff;
		font-size: 11px;
		font-weight: 800;
	}
	.ghead {
		display: flex;
	}
	.gbtn {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 8px;
		margin-top: 10px;
		border-radius: 10px;
		border: 1.5px solid var(--color-ink);
		background: var(--color-card);
		color: var(--color-ink);
		font-size: 13px;
		font-weight: 700;
		padding: 9px 10px;
		animation: invite 2s ease-in-out infinite;
	}
	.alt {
		text-align: center;
		font-size: 10.5px;
		color: var(--color-faint);
		text-decoration: line-through;
	}
	.field {
		display: flex;
		flex-direction: column;
		border-radius: 8px;
		border: 1px solid var(--color-line);
		background: var(--color-paper);
		padding: 3px 8px;
		font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
		font-size: 11px;
		color: var(--color-ink);
	}
	.field i {
		font-family: var(--font-sans);
		font-style: normal;
		font-size: 8.5px;
		font-weight: 700;
		color: var(--color-faint);
	}
	.pbtn {
		align-self: flex-end;
		border-radius: 10px;
		background: var(--color-brand);
		color: #fff;
		font-size: 12.5px;
		font-weight: 700;
		padding: 7px 18px;
		animation: invite 2s ease-in-out infinite;
	}
	.scopes {
		display: flex;
		flex-direction: column;
		gap: 3px;
	}
	.scopes label {
		display: flex;
		align-items: center;
		gap: 7px;
		border-radius: 8px;
		padding: 4px 6px;
		font-size: 11.5px;
		color: var(--color-ink);
		cursor: pointer;
		transition: background 0.2s;
	}
	.scopes label.risky {
		background: var(--color-amber-soft);
	}
	.scopes input {
		width: 15px;
		height: 15px;
		accent-color: var(--color-brand);
	}
	.sname {
		flex: 1;
	}
	.req {
		border-radius: 999px;
		background: var(--color-line);
		color: var(--color-muted);
		font-size: 8.5px;
		font-weight: 800;
		padding: 1px 6px;
	}
	.token {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		border-radius: 999px;
		background: var(--color-grass);
		color: #fff;
		font-size: 11px;
		font-weight: 800;
		padding: 4px 10px;
	}
	.token.small {
		font-size: 9px;
		padding: 1px 7px;
	}
	.token.dead {
		background: var(--color-faint);
		text-decoration: line-through;
	}
	.travel {
		animation: travel 1.1s ease-in-out forwards;
	}
	.hello {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-top: 6px;
	}
	.avatar {
		display: grid;
		place-items: center;
		width: 34px;
		height: 34px;
		flex: none;
		border-radius: 50%;
		background: var(--color-line);
		color: var(--color-muted);
		font-weight: 800;
	}
	.avatar.pic {
		background: var(--color-amber);
		color: #fff;
	}
	.skel {
		display: flex;
		flex-direction: column;
		gap: 6px;
		margin-top: 10px;
	}
	.skel i {
		height: 8px;
		border-radius: 6px;
		background: var(--color-line);
	}
	.skel i.s {
		width: 60%;
	}
	.hint {
		min-height: 1.4em;
		text-align: center;
		font-size: 12px;
		font-weight: 600;
		color: var(--color-muted);
	}
	.got {
		display: flex;
		width: 100%;
		flex-direction: column;
		gap: 3px;
		border-radius: 14px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		padding: 9px 12px;
	}
	.gtitle {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
		margin-bottom: 2px;
		font-size: 11.5px;
		font-weight: 800;
		color: var(--color-ink);
	}
	.grow {
		display: flex;
		justify-content: space-between;
		gap: 8px;
		border-radius: 6px;
		padding: 2px 6px;
		font-size: 11px;
		color: var(--color-ink);
	}
	.grow b {
		font-weight: 800;
		color: var(--color-grass);
		white-space: nowrap;
	}
	.grow.no {
		color: var(--color-faint);
	}
	.grow.no b {
		color: var(--color-faint);
	}
	.grow.risky {
		background: var(--color-amber-soft);
	}
	.grow.risky b {
		color: var(--color-amber);
	}
	.grow.safe {
		margin-top: 3px;
		background: var(--color-grass-soft);
	}
	.ghost {
		margin-top: 6px;
		align-self: center;
		border-radius: 10px;
		border: 1px solid var(--color-line);
		background: var(--color-card);
		color: var(--color-muted);
		font-size: 12px;
		font-weight: 700;
		padding: 6px 14px;
	}
	.ghost:hover {
		border-color: var(--color-danger);
		color: var(--color-danger);
	}
	.pop {
		animation: popin 0.25s ease;
	}
	@keyframes popin {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
	}
	@keyframes travel {
		from {
			transform: translateY(-70px) scale(0.8);
			opacity: 0;
		}
		30% {
			opacity: 1;
		}
		to {
			transform: translateY(40px) scale(1);
			opacity: 1;
		}
	}
	@keyframes invite {
		0%,
		100% {
			box-shadow: 0 0 0 0 rgba(46, 111, 224, 0);
		}
		50% {
			box-shadow: 0 0 0 5px rgba(46, 111, 224, 0.14);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.pop,
		.travel {
			animation-duration: 0.01s;
		}
		.gbtn,
		.pbtn {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.wrap {
			width: 440px;
			gap: 14px;
		}
		.phone {
			width: 260px;
		}
		.hint {
			font-size: 14px;
		}
		.grow {
			font-size: 12px;
		}
	}
</style>
