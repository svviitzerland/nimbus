<script lang="ts">
	import type { LayersText } from '$lib/chapters/networking/types';

	// One consistent stage (you on the left, server on the right, the wire between) where every layer
	// plays its actual mechanism, so the learner watches the process happen instead of reading a label.
	// The packet keeps its identity across beats; the wrap row underneath shows the layers added so far.
	let { tx, beat }: { tx: LayersText; beat: number } = $props();

	const arrived = $derived(beat === 7);
	const cipher = '9f3a 2c8e 1b4d';
	const req = $derived(tx.layers[0].chip);
</script>

<div class="play">
	<div class="stage">
		<div class="ep phone" class:on={beat <= 6}>
			<svg viewBox="0 0 24 24" aria-hidden="true">
				<rect
					x="6"
					y="2"
					width="12"
					height="20"
					rx="2.6"
					fill="#fff"
					stroke="#2b3640"
					stroke-width="1.7"
				/>
				<rect x="8" y="5" width="8" height="11" rx="1" fill="#dbe8fb" />
				<circle cx="12" cy="19" r="1.1" fill="#2b3640" />
			</svg>
			<span>{tx.senderLabel}</span>
		</div>

		<div class="field">
			<div class="wire" class:live={beat >= 2}></div>
			<span class="node n1"></span>
			<span class="node n2"></span>

			{#key beat}
				{#if beat === 0}
					<div class="pkt appear col">
						<span class="req">{req}</span>
						<span class="ptag">{tx.startTag}</span>
					</div>
				{:else if beat === 1}
					<div class="pkt seal">
						<svg class="lk" viewBox="0 0 24 24" aria-hidden="true">
							<rect x="5" y="10.5" width="14" height="9.5" rx="2" fill="#e8a13c" />
							<path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" fill="none" stroke="#b9802a" stroke-width="2" />
						</svg>
						<span class="cipher scram">{cipher}</span>
					</div>
				{:else if beat === 2}
					<div class="beam"></div>
					<span class="ping"></span>
					<div class="pkt small"><span class="cipher">{cipher}</span></div>
					<span class="livetag">{tx.layers[2].chip}</span>
				{:else if beat === 3}
					<div class="split">
						{#each [1, 2, 3, 4] as n, i (n)}
							<span class="mini" style="--i:{i}">{n}<i>443</i></span>
						{/each}
					</div>
				{:else if beat === 4}
					<span class="rundot"></span>
					<div class="pkt">
						<span class="cipher">{cipher}</span>
						<span class="iptag">{tx.layers[4].chip}</span>
					</div>
				{:else if beat === 5}
					<span class="dev d1" aria-hidden="true">
						<svg class="dvi" viewBox="0 0 34 24">
							<line
								x1="11"
								y1="12"
								x2="7"
								y2="4"
								stroke="#9aa7b5"
								stroke-width="1.6"
								stroke-linecap="round"
							/>
							<line
								x1="23"
								y1="12"
								x2="27"
								y2="4"
								stroke="#9aa7b5"
								stroke-width="1.6"
								stroke-linecap="round"
							/>
							<circle cx="7" cy="4" r="1.7" fill="#9aa7b5" />
							<circle cx="27" cy="4" r="1.7" fill="#9aa7b5" />
							<rect
								x="5"
								y="12"
								width="24"
								height="8.5"
								rx="2"
								fill="#fff"
								stroke="#7c8a99"
								stroke-width="1.6"
							/>
							<circle cx="10" cy="16.2" r="1.2" fill="#2f8a57" />
							<circle cx="14" cy="16.2" r="1.2" fill="#cbd5df" />
						</svg>
					</span>
					<span class="dev d2" aria-hidden="true">
						<svg class="dvi" viewBox="0 0 34 24">
							<rect
								x="4"
								y="7"
								width="26"
								height="11"
								rx="2"
								fill="#fff"
								stroke="#7c8a99"
								stroke-width="1.6"
							/>
							<rect x="7" y="13" width="3.4" height="3" rx="0.6" fill="#cbd5df" />
							<rect x="12" y="13" width="3.4" height="3" rx="0.6" fill="#cbd5df" />
							<rect x="17" y="13" width="3.4" height="3" rx="0.6" fill="#cbd5df" />
							<circle cx="25" cy="10.5" r="1.3" fill="#2f8a57" />
						</svg>
					</span>
					<div class="pkt chip hopper">
						<svg class="clk" viewBox="0 0 24 24" aria-hidden="true">
							<rect x="5" y="10.5" width="14" height="9.5" rx="2" fill="#e8a13c" />
							<path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" fill="none" stroke="#b9802a" stroke-width="2" />
						</svg>
					</div>
				{:else if beat === 6}
					<div class="pulses">
						{#each [0, 1, 2, 3, 4, 5] as i (i)}
							<i style="--i:{i}"></i>
						{/each}
					</div>
				{:else}
					<div class="pkt landed">
						<span class="req">{req}</span>
						<span class="tick">✓</span>
					</div>
				{/if}
			{/key}
		</div>

		<div class="ep server" class:on={beat >= 6 || beat === 2}>
			<span class="rack" aria-hidden="true"><i></i><i></i><i></i></span>
			<span>{tx.receiverLabel}</span>
		</div>
	</div>

	<div class="wraprow">
		{#each tx.layers as L, i (L.name)}
			{#if i >= 1 && i <= (arrived ? 6 : beat)}
				<span class="wc" class:active={i === beat && !arrived} class:shed={arrived}>
					<b>{tx.layers.length - i}</b>{L.chip}
				</span>
			{/if}
		{/each}
	</div>
</div>

<style>
	.play {
		display: flex;
		width: 100%;
		flex-direction: column;
		align-items: center;
		gap: 9px;
	}
	.stage {
		display: flex;
		width: 100%;
		height: 150px;
		align-items: center;
		justify-content: space-between;
		gap: 6px;
		padding: 4px 2px;
	}

	/* endpoints */
	.ep {
		display: flex;
		width: 46px;
		flex: none;
		flex-direction: column;
		align-items: center;
		gap: 3px;
		border-radius: 10px;
		border: 1px solid #e6e0d6;
		background: #fff;
		padding: 7px 4px;
		transition:
			border-color 0.25s,
			box-shadow 0.25s,
			opacity 0.25s;
		opacity: 0.55;
	}
	.ep.on {
		opacity: 1;
	}
	.ep span {
		font-size: 9px;
		font-weight: 800;
		color: #5b6675;
	}
	.ep svg {
		width: 19px;
		height: 19px;
	}
	.phone.on {
		border-color: #cadcf7;
		box-shadow: 0 0 0 3px rgba(46, 111, 224, 0.12);
	}
	.server.on {
		border-color: #b9e0c8;
		box-shadow: 0 0 0 3px rgba(47, 138, 87, 0.14);
	}
	.rack {
		display: flex;
		width: 19px;
		flex-direction: column;
		gap: 2.5px;
	}
	.rack i {
		height: 3.5px;
		border-radius: 1px;
		background: #cbd5df;
	}
	.server.on .rack i {
		background: #8fcfa8;
	}

	/* the field between the endpoints, where the action plays */
	.field {
		position: relative;
		display: flex;
		height: 100%;
		flex: 1;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}
	.wire {
		position: absolute;
		top: 50%;
		right: 4px;
		left: 4px;
		height: 2px;
		transform: translateY(-50%);
		border-radius: 2px;
		background: repeating-linear-gradient(90deg, #d7dde6 0 7px, transparent 7px 13px);
		opacity: 0.7;
	}
	.wire.live {
		background: repeating-linear-gradient(90deg, #bcd2f4 0 7px, transparent 7px 13px);
	}
	.node {
		position: absolute;
		top: 50%;
		height: 7px;
		width: 7px;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		background: #cfd9e6;
	}
	.n1 {
		left: 40%;
	}
	.n2 {
		left: 66%;
	}

	/* the packet, kept consistent across beats */
	.pkt {
		position: relative;
		z-index: 2;
		display: inline-flex;
		align-items: center;
		gap: 6px;
		border-radius: 10px;
		border: 1.5px solid #cadcf7;
		background: #fff;
		padding: 8px 13px;
		box-shadow: 0 5px 14px rgba(46, 111, 224, 0.13);
	}
	.pkt.seal {
		border-color: #ecc793;
		background: #fffaf0;
	}
	.pkt.landed {
		border-color: #b9e0c8;
		background: #f3fbf6;
	}
	.pkt.small {
		padding: 6px 10px;
	}
	.pkt.col {
		flex-direction: column;
		gap: 3px;
	}
	.ptag {
		font-size: 8.5px;
		font-weight: 800;
		letter-spacing: 0.07em;
		text-transform: uppercase;
		color: #9aa3ae;
	}
	.req {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 13px;
		font-weight: 700;
		color: #1f2a37;
	}
	.cipher {
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 12.5px;
		font-weight: 600;
		letter-spacing: 0.08em;
		color: #b9802a;
	}
	.lk {
		width: 18px;
		height: 18px;
	}
	.tick {
		font-size: 13px;
		font-weight: 900;
		color: #2f8a57;
	}

	/* beat 0, the request arrives on screen */
	.appear {
		animation: appin 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	@keyframes appin {
		from {
			opacity: 0;
			transform: translateY(10px) scale(0.85);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	/* beat 1, the padlock swings shut and the text scrambles into cipher */
	.lk {
		transform-origin: 50% 72%;
		animation: lockshut 0.6s cubic-bezier(0.3, 1.5, 0.5, 1) both;
	}
	@keyframes lockshut {
		0% {
			opacity: 0;
			transform: translateY(-4px) rotate(-22deg) scale(0.8);
		}
		60% {
			opacity: 1;
		}
		100% {
			transform: none;
		}
	}
	.scram {
		animation: scram 0.7s ease both;
	}
	@keyframes scram {
		0% {
			opacity: 0.15;
			letter-spacing: 0.3em;
			filter: blur(1.5px);
		}
		100% {
			opacity: 1;
			letter-spacing: 0.08em;
			filter: none;
		}
	}

	/* beat 2, a line is drawn to the server and a ping runs there and back */
	.beam {
		position: absolute;
		top: 50%;
		right: 6px;
		left: 6px;
		z-index: 1;
		height: 2px;
		transform: translateY(-50%) scaleX(0);
		transform-origin: left center;
		border-radius: 2px;
		background: #2e6fe0;
		animation: draw 0.5s ease forwards;
	}
	@keyframes draw {
		to {
			transform: translateY(-50%) scaleX(1);
		}
	}
	.ping {
		position: absolute;
		top: 50%;
		left: 8%;
		z-index: 3;
		height: 9px;
		width: 9px;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		background: #2e6fe0;
		box-shadow: 0 0 0 4px rgba(46, 111, 224, 0.16);
		animation: pingtrip 1.3s 0.4s ease-in-out infinite;
	}
	@keyframes pingtrip {
		0%,
		8% {
			left: 8%;
		}
		46% {
			left: 92%;
		}
		54% {
			left: 92%;
		}
		92%,
		100% {
			left: 8%;
		}
	}
	.livetag {
		position: absolute;
		top: 12%;
		left: 50%;
		z-index: 3;
		transform: translateX(-50%);
		border-radius: 999px;
		background: #eaf2fe;
		padding: 2px 9px;
		font-size: 10px;
		font-weight: 800;
		color: #2563c4;
		white-space: nowrap;
		animation: appin 0.5s ease both;
	}

	/* beat 3, the block splits into numbered parcels one by one */
	.split {
		position: relative;
		z-index: 2;
		display: flex;
		gap: 6px;
	}
	.mini {
		display: inline-flex;
		height: 34px;
		width: 30px;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		gap: 1px;
		border-radius: 8px;
		border: 1.5px solid #cadcf7;
		background: #fff;
		font-size: 12px;
		font-weight: 800;
		color: #1f4fa3;
		box-shadow: 0 4px 10px rgba(46, 111, 224, 0.14);
		animation: fan 0.45s cubic-bezier(0.2, 0.8, 0.2, 1) both;
		animation-delay: calc(var(--i) * 0.12s);
	}
	.mini i {
		font-size: 8px;
		font-weight: 800;
		font-style: normal;
		color: #93a0b2;
	}
	@keyframes fan {
		from {
			opacity: 0;
			transform: translateY(-10px) scale(0.5);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	/* beat 4, an address is stamped on and a dot routes through the hops */
	.iptag {
		border-radius: 6px;
		background: #eef7f1;
		padding: 2px 7px;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 11px;
		font-weight: 700;
		color: #2f7d54;
		animation: tagin 0.45s ease both;
	}
	@keyframes tagin {
		from {
			opacity: 0;
			transform: translateX(8px);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}
	.rundot {
		position: absolute;
		top: 50%;
		left: 12%;
		z-index: 1;
		height: 8px;
		width: 8px;
		transform: translate(-50%, -50%);
		border-radius: 50%;
		background: #2f8a57;
		box-shadow: 0 0 0 4px rgba(47, 138, 87, 0.15);
		animation: runroute 1.5s ease-in-out infinite;
	}
	@keyframes runroute {
		0% {
			left: 12%;
			opacity: 0;
		}
		12% {
			opacity: 1;
		}
		40% {
			left: 40%;
		}
		70% {
			left: 66%;
		}
		92% {
			opacity: 1;
		}
		100% {
			left: 94%;
			opacity: 0;
		}
	}

	/* beat 5, the parcel is handed device to device. d1 is your WiFi router, d2 the next network box;
	   the sealed parcel rides above the wire and dips onto each one, which lights up as it catches it. */
	.dev {
		position: absolute;
		top: 50%;
		z-index: 1;
		display: flex;
		transform: translate(-50%, -50%);
	}
	.dvi {
		display: block;
		width: 31px;
		height: 22px;
	}
	.d1 {
		left: 38%;
		animation: devhit1 2.6s ease-in-out infinite;
	}
	.d2 {
		left: 70%;
		animation: devhit2 2.6s ease-in-out infinite;
	}
	@keyframes devhit1 {
		0%,
		30% {
			transform: translate(-50%, -50%) scale(1);
			filter: none;
		}
		38% {
			transform: translate(-50%, -50%) scale(1.14);
			filter: drop-shadow(0 0 5px rgba(46, 111, 224, 0.55));
		}
		52%,
		100% {
			transform: translate(-50%, -50%) scale(1);
			filter: none;
		}
	}
	@keyframes devhit2 {
		0%,
		60% {
			transform: translate(-50%, -50%) scale(1);
			filter: none;
		}
		70% {
			transform: translate(-50%, -50%) scale(1.14);
			filter: drop-shadow(0 0 5px rgba(46, 111, 224, 0.55));
		}
		84%,
		100% {
			transform: translate(-50%, -50%) scale(1);
			filter: none;
		}
	}
	.pkt.chip {
		padding: 5px 6px;
	}
	.clk {
		display: block;
		height: 16px;
		width: 16px;
	}
	.pkt.hopper {
		position: absolute;
		left: 8%;
		top: 44%;
		z-index: 3;
		transform: translate(-50%, -50%);
		animation: hopsteps 2.6s ease-in-out infinite;
	}
	@keyframes hopsteps {
		0%,
		12% {
			left: 8%;
			top: 44%;
		}
		24% {
			left: 23%;
			top: 22%;
		}
		34%,
		46% {
			left: 38%;
			top: 35%;
		}
		58% {
			left: 54%;
			top: 22%;
		}
		68%,
		100% {
			left: 70%;
			top: 35%;
		}
	}

	/* beat 6, the data becomes a train of pulses racing down the wire */
	.pulses {
		position: absolute;
		top: 50%;
		right: 0;
		left: 0;
		z-index: 2;
		height: 9px;
		transform: translateY(-50%);
	}
	.pulses i {
		position: absolute;
		top: 0;
		left: 8%;
		height: 9px;
		width: 9px;
		transform: translate(-50%, 0);
		border-radius: 50%;
		background: #2e6fe0;
		animation: race 1.1s linear infinite;
		animation-delay: calc(var(--i) * 0.15s);
	}
	@keyframes race {
		0% {
			left: 8%;
			opacity: 0;
		}
		12% {
			opacity: 1;
		}
		88% {
			opacity: 1;
		}
		100% {
			left: 94%;
			opacity: 0;
		}
	}

	/* beat 7, the request lands and is read */
	.landed {
		animation: appin 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}

	/* the wrappers added so far, growing under the stage */
	.wraprow {
		display: flex;
		min-height: 24px;
		flex-wrap: wrap;
		align-items: center;
		justify-content: center;
		gap: 5px;
	}
	.wc {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		border-radius: 999px;
		border: 1px solid #d3e6da;
		background: #f4faf6;
		padding: 3px 9px 3px 4px;
		font-family: ui-monospace, 'SF Mono', Menlo, monospace;
		font-size: 10.5px;
		font-weight: 600;
		color: #3a6b50;
		transition:
			background 0.3s,
			border-color 0.3s,
			opacity 0.3s;
	}
	.wc b {
		display: inline-flex;
		height: 15px;
		width: 15px;
		align-items: center;
		justify-content: center;
		border-radius: 50%;
		background: #cdead9;
		font-size: 9px;
		color: #2f7d54;
	}
	.wc.active {
		border-color: #cadcf7;
		background: #eef4fc;
		color: #1f4fa3;
		animation: pop 0.34s cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	.wc.active b {
		background: #2e6fe0;
		color: #fff;
	}
	.wc.shed {
		border-style: solid;
		opacity: 0.5;
	}
	.wc.shed b {
		background: #e3ddd2;
		color: #9aa3ae;
	}
	@keyframes pop {
		from {
			opacity: 0;
			transform: translateY(-6px) scale(0.9);
		}
		to {
			opacity: 1;
			transform: none;
		}
	}

	@media (min-width: 700px) {
		.stage {
			height: 178px;
		}
		.ep {
			width: 56px;
		}
	}
	@media (prefers-reduced-motion: reduce) {
		.ping,
		.rundot,
		.hopper,
		.d1,
		.d2,
		.pulses i {
			animation-iteration-count: 1;
		}
	}
</style>
