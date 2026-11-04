import type { GitRemoteText } from '../../types';

export const id: GitRemoteText = {
	title: 'Git bukan GitHub',
	intro: [
		'Banyak yang ngira Git dan GitHub itu sama. Padahal beda. <b>Git</b> itu alat yang jalan di laptopmu, dialah yang tadi bikin snapshot. <b>GitHub</b> itu tempat online buat menaruh dan membagikan hasilnya.',
		'Selama commit cuma ada di laptopmu, dia aman tapi sendirian. Kalau laptopmu hilang, ikut hilang juga. Makanya kamu <b>push</b>, mengirim commit tadi ke GitHub, biar ada salinannya online dan orang lain bisa ikut lihat.',
		'Coba alurnya. Commit dulu di laptop, lalu push ke GitHub, terakhir biarkan temanmu <b>clone</b> salinannya. Rasakan mana yang lokal dan mana yang sudah online.'
	],
	reactions: {
		committed:
			'Commit dibuat oleh Git, di laptopmu. Ini masih lokal, cuma ada di mesinmu, belum ke mana mana.',
		pushed:
			'Kamu push ke GitHub. Sekarang commit kamu punya salinan online, aman walau laptopmu kenapa napa, dan siap dibagi.',
		cloned:
			'Temanmu clone dari GitHub. Dia menarik seluruh repo plus riwayatnya ke laptopnya sendiri. Begini tim kerja bareng di satu proyek.'
	},
	laptopLabel: 'Laptopmu',
	gitChip: 'Git',
	remoteLabel: 'GitHub',
	remoteSub: 'tempat online',
	mateLabel: 'Laptop teman',
	commitBtn: 'Commit di laptop',
	pushBtn: 'Push ke GitHub',
	cloneBtn: 'Teman clone',
	again: 'Ulangi',
	localChip: 'cuma di laptopmu',
	onlineChip: 'online, bisa dibagi'
};
