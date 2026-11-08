<script lang="ts">
	import ProviderLogo from '../ProviderLogo.svelte';
	import type { LessonText, CloudServicesText } from '$lib/chapters/types';

	let {
		text,
		beat = 0,
		oncomplete,
		onstate,
		onshow,
		onlock
	}: {
		text: LessonText;
		beat?: number;
		oncomplete?: () => void;
		onstate?: (s: string) => void;
		onshow?: (v: boolean) => void;
		onlock?: (v: boolean) => void;
	} = $props();
	const tx = $derived(text as CloudServicesText);

	// The "turn on" beat is second to last; the final beat is an FYI aside that keeps the
	// catalog on screen. Show the monitor from the turn on beat, and lock Next until it is on.
	const turnOn = $derived(Math.max(0, tx.intro.length - 2));

	// Official provider service logos, bundled at build time.
	const mods = import.meta.glob('../../assets/services/*.svg', {
		eager: true,
		query: '?url',
		import: 'default'
	}) as Record<string, string>;
	const url: Record<string, string> = {};
	for (const [p, u] of Object.entries(mods)) url[p.split('/').pop()!.replace('.svg', '')] = u;

	type Item = [string, string];
	const PROVIDERS: {
		id: 'aws' | 'azure' | 'gcp';
		name: string;
		reverse: boolean;
		items: Item[];
	}[] = [
		{
			id: 'aws',
			name: 'AWS',
			reverse: false,
			items: [
				['aws_ec2', 'EC2'],
				['aws_s3', 'S3'],
				['aws_lambda', 'Lambda'],
				['aws_rds', 'RDS'],
				['aws_dynamodb', 'DynamoDB'],
				['aws_cloudfront', 'CloudFront'],
				['aws_vpc', 'VPC'],
				['aws_eks', 'EKS']
			]
		},
		{
			id: 'azure',
			name: 'Microsoft Azure',
			reverse: true,
			items: [
				['azure_vm', 'Virtual Machines'],
				['azure_storage', 'Blob Storage'],
				['azure_functions', 'Functions'],
				['azure_sql', 'Azure SQL'],
				['azure_cosmos', 'Cosmos DB'],
				['azure_app_service', 'App Service'],
				['azure_aks', 'AKS'],
				['azure_lb', 'Load Balancer']
			]
		},
		{
			id: 'gcp',
			name: 'Google Cloud',
			reverse: false,
			items: [
				['gcp_compute_engine', 'Compute Engine'],
				['gcp_cloud_storage', 'Cloud Storage'],
				['gcp_cloud_functions', 'Cloud Functions'],
				['gcp_cloud_sql', 'Cloud SQL'],
				['gcp_bigquery', 'BigQuery'],
				['gcp_cloud_run', 'Cloud Run'],
				['gcp_gke', 'GKE'],
				['gcp_cloud_cdn', 'Cloud CDN']
			]
		}
	];

	let on = $state(false);
	let done = false;

	$effect(() => {
		onshow?.(beat >= turnOn);
		onlock?.(beat === turnOn && !on);
	});

	function powerOn() {
		if (on) return;
		on = true;
		onstate?.('open');
		if (!done) {
			done = true;
			oncomplete?.();
		}
	}
</script>

<div class="wrap">
	<div class="monitor">
		<div class="bezel" class:on>
			<div class="screen">
				{#if !on}
					<button type="button" class="power" onclick={powerOn}>
						<span class="pring">
							<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
								<path d="M12 3v8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
								<path
									d="M7.5 6.4a7 7 0 1 0 9 0"
									stroke="currentColor"
									stroke-width="2.2"
									stroke-linecap="round"
									fill="none"
								/>
							</svg>
						</span>
						<span>{tx.openBtn}</span>
					</button>
				{:else}
					<div class="shead">
						<svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden="true">
							<path
								d="M7 18a4 4 0 0 1 0-8 5 5 0 0 1 9.6-1.5A3.8 3.8 0 0 1 18 18z"
								fill="#cdddf6"
								stroke="#2e6fe0"
								stroke-width="1.4"
							/>
						</svg>
						<span class="stitle">{tx.screenTitle}</span>
						<span class="ssub">{tx.screenSub}</span>
					</div>
					<div class="marquee">
						{#each PROVIDERS as prov, eachIndex3574 (eachIndex3574)}
							<div class="mrow">
								<div class="rlabel">
									<ProviderLogo id={prov.id} size={15} />
									<span>{prov.name}</span>
								</div>
								<div class="rtrack">
									<div class="rseq" class:rev={prov.reverse}>
										{#each [...prov.items, ...prov.items] as [file, label], eachIndex3845 (eachIndex3845)}
											<span class="chip">
												<img src={url[file]} alt="" width="22" height="22" />
												<span>{label}</span>
											</span>
										{/each}
									</div>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>
		</div>
		<div class="neck"></div>
		<div class="base"></div>
	</div>
</div>

<style>
	.wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		width: 100%;
		height: 100%;
	}
	.monitor {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: min(94vw, 380px);
	}
	.bezel {
		width: 100%;
		border-radius: 16px;
		background: #1c2530;
		padding: 11px;
		box-shadow: 0 18px 40px rgba(22, 40, 60, 0.22);
		transition: background 0.3s ease;
	}
	.screen {
		position: relative;
		height: 196px;
		border-radius: 8px;
		overflow: hidden;
		background: #10161e;
		display: flex;
		flex-direction: column;
		transition: background 0.4s ease;
	}
	.bezel.on .screen {
		background: #f3f6fb;
	}
	.neck {
		width: 46px;
		height: 14px;
		background: linear-gradient(#222c38, #1a232e);
	}
	.base {
		width: 116px;
		height: 9px;
		border-radius: 0 0 7px 7px;
		background: #1c2530;
	}

	.power {
		margin: auto;
		display: inline-flex;
		flex-direction: column;
		align-items: center;
		gap: 11px;
		color: #8aa0b4;
		font-size: 12.5px;
		font-weight: 700;
		cursor: pointer;
	}
	.pring {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 50px;
		height: 50px;
		border-radius: 50%;
		border: 1.5px solid #33414f;
		color: #6fd39a;
		background: #161e27;
		transition:
			transform 0.2s ease,
			border-color 0.2s ease;
	}
	.power:hover .pring {
		transform: scale(1.06);
		border-color: #6fd39a;
	}

	.shead {
		display: flex;
		align-items: center;
		gap: 7px;
		padding: 10px 13px;
		background: #fff;
		border-bottom: 1px solid #e7ebf1;
	}
	.stitle {
		font-size: 13px;
		font-weight: 800;
		color: #1c2b33;
	}
	.ssub {
		margin-left: auto;
		font-size: 10px;
		font-weight: 600;
		color: var(--color-faint);
	}
	.marquee {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: space-evenly;
		padding: 6px 0;
		gap: 2px;
		animation: fadein 0.5s ease both;
	}
	@keyframes fadein {
		from {
			opacity: 0;
		}
		to {
			opacity: 1;
		}
	}
	.mrow {
		display: flex;
		align-items: center;
		gap: 8px;
		min-width: 0;
	}
	.rlabel {
		display: inline-flex;
		align-items: center;
		gap: 5px;
		flex: none;
		padding-left: 11px;
		width: 92px;
		font-size: 9px;
		font-weight: 800;
		color: var(--color-muted);
		white-space: nowrap;
	}
	.rlabel span {
		overflow: hidden;
		text-overflow: ellipsis;
	}
	.rtrack {
		position: relative;
		flex: 1;
		overflow: hidden;
		min-width: 0;
		-webkit-mask-image: linear-gradient(90deg, transparent, #000 9%, #000 92%, transparent);
		mask-image: linear-gradient(90deg, transparent, #000 9%, #000 92%, transparent);
	}
	.rseq {
		display: inline-flex;
		gap: 8px;
		padding-right: 8px;
		width: max-content;
		animation: ml 26s linear infinite;
	}
	.rseq.rev {
		animation-name: mr;
	}
	@keyframes ml {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-50%);
		}
	}
	@keyframes mr {
		from {
			transform: translateX(-50%);
		}
		to {
			transform: translateX(0);
		}
	}
	.chip {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		flex: none;
		border-radius: 999px;
		background: #fff;
		border: 1px solid #e7ebf1;
		padding: 4px 11px 4px 5px;
		font-size: 11px;
		font-weight: 700;
		color: #3a4650;
		box-shadow: 0 2px 5px rgba(22, 40, 60, 0.05);
		white-space: nowrap;
	}
	.chip img {
		width: 22px;
		height: 22px;
		display: block;
	}
	@media (prefers-reduced-motion: reduce) {
		.rseq {
			animation: none;
		}
	}
	@media (min-width: 768px) {
		.monitor {
			width: 560px;
		}
		.screen {
			height: 250px;
		}
		.neck {
			width: 60px;
			height: 18px;
		}
		.base {
			width: 150px;
			height: 11px;
		}
		.stitle {
			font-size: 15px;
		}
		.rlabel {
			width: 116px;
			font-size: 10.5px;
		}
		.chip {
			font-size: 12.5px;
			padding: 5px 13px 5px 6px;
		}
		.chip img {
			width: 25px;
			height: 25px;
		}
		.power {
			font-size: 14px;
		}
	}

	/* ---- Dark mode ---- */
	:global(.dark) .bezel {
		background: #0f1720;
		box-shadow: 0 18px 40px rgba(0, 0, 0, 0.4);
	}
	:global(.dark) .screen {
		background: #0a0f16;
	}
	:global(.dark) .bezel.on .screen {
		background: #1b2533;
	}
	:global(.dark) .neck {
		background: linear-gradient(#141c28, #0f1720);
	}
	:global(.dark) .base {
		background: #0f1720;
	}
	:global(.dark) .power {
		color: #6b7885;
	}
	:global(.dark) .pring {
		border-color: #2c3746;
		background: #121a24;
	}
	:global(.dark) .power:hover .pring {
		border-color: #6fd39a;
	}
	:global(.dark) .shead {
		background: #141c2a;
		border-bottom-color: #2c3746;
	}
	:global(.dark) .stitle {
		color: #e0dcd4;
	}
	:global(.dark) .chip {
		background: #1b2533;
		border-color: #2c3746;
		color: #e0dcd4;
		box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
	}
</style>
