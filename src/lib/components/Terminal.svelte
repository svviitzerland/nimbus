<script lang="ts">
	// Reusable terminal window, shared by the CLI lesson and the SSH lesson.
	// Lines are passed in and styled by tone. `cmd` lines get the prompt prefix.
	// `caret` blinks a cursor at the end of a line (used for the typing effect).
	type Line = { text: string; tone?: 'cmd' | 'out' | 'ok' | 'muted'; caret?: boolean };
	// `bare` drops the window bar; `fill` makes the terminal fill its container and stick the
	// newest line to the bottom (a full screen terminal, used inside a monitor).
	let {
		host = '',
		prompt = '',
		lines = [],
		cursor = false,
		bare = false,
		fill = false
	}: {
		host?: string;
		prompt?: string;
		lines?: Line[];
		cursor?: boolean;
		bare?: boolean;
		fill?: boolean;
	} = $props();
</script>

<div class="term" class:fill>
	{#if !bare}
		<div class="bar">
			<span class="dots"><i></i><i></i><i></i></span>
			{#if host}<span class="host">{host}</span>{/if}
		</div>
	{/if}
	<div class="body">
		{#each lines as l, eachIndex953 (eachIndex953)}
			<div class="ln {l.tone ?? 'out'}">
				{#if l.tone === 'cmd' && prompt}<span class="pr">{prompt}</span>
				{/if}{l.text}{#if l.caret}<span class="cur"></span>{/if}
			</div>
		{/each}
		{#if cursor}
			<div class="ln cmd">
				{#if prompt}<span class="pr">{prompt}</span>
				{/if}<span class="cur"></span>
			</div>
		{/if}
	</div>
</div>

<style>
	.term.fill {
		height: 100%;
		display: flex;
		flex-direction: column;
		border-radius: 0;
	}
	.term.fill .body {
		flex: 1;
		min-height: 0;
		justify-content: flex-end;
		overflow: hidden;
	}
	.term {
		width: 100%;
		border-radius: 12px;
		overflow: hidden;
		background: #10212f;
		border: 1px solid #1d3547;
		box-shadow: 0 10px 26px rgba(16, 33, 47, 0.28);
		font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
		text-align: left;
	}
	.bar {
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 7px 11px;
		background: #16293a;
		border-bottom: 1px solid #1d3547;
	}
	.dots {
		display: inline-flex;
		gap: 5px;
	}
	.dots i {
		width: 9px;
		height: 9px;
		border-radius: 50%;
		background: #2f4a5e;
	}
	.dots i:nth-child(1) {
		background: #e06a5b;
	}
	.dots i:nth-child(2) {
		background: #e0b65b;
	}
	.dots i:nth-child(3) {
		background: #5bbd84;
	}
	.host {
		font-size: 11px;
		font-weight: 600;
		color: #8aa2b3;
		letter-spacing: 0.02em;
	}
	.body {
		padding: 14px 15px;
		display: flex;
		flex-direction: column;
		gap: 5px;
		min-height: 120px;
		font-size: 13.5px;
		line-height: 1.55;
	}
	.ln {
		color: #93a7b6;
		white-space: pre-wrap;
		word-break: break-word;
		animation: tin 0.18s ease both;
	}
	.ln.cmd {
		color: #eaf1f6;
	}
	.ln.out {
		color: #93a7b6;
	}
	.ln.ok {
		color: #6fd39a;
	}
	.ln.muted {
		color: #5c7384;
	}
	.pr {
		color: #5bbd84;
		font-weight: 600;
		margin-right: 0.6ch;
	}
	.cur {
		display: inline-block;
		width: 8px;
		height: 14px;
		vertical-align: -2px;
		background: #6fd39a;
		animation: blink 1s steps(1) infinite;
	}
	@keyframes tin {
		from {
			opacity: 0;
			transform: translateY(2px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	@keyframes blink {
		50% {
			opacity: 0;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ln,
		.cur {
			animation-duration: 0.01s;
		}
	}
	@media (min-width: 768px) {
		.body {
			font-size: 15px;
			min-height: 136px;
		}
	}
</style>
