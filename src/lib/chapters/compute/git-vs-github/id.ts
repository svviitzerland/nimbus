import type { GitSecretsText } from '../types';

export const id: GitSecretsText = {
	title: 'Git bukan GitHub',
	intro: [
		'Banyak yang ngira Git dan GitHub itu sama. Padahal beda. <b>Git</b> itu alat yang jalan di laptopmu, dialah yang tadi bikin snapshot. <b>GitHub</b> itu tempat online buat menaruh dan membagikan hasilnya.',
		'Selama commit cuma ada di laptopmu, dia aman tapi sendirian. Kalau laptopmu hilang, ikut hilang juga. Makanya kamu <b>push</b>, mengirim commit tadi ke GitHub, biar ada salinannya online dan orang lain bisa ikut lihat.',
		'Aturan penting sebelum push, jangan pernah commit rahasia seperti password atau <b>API key</b> (kunci layanan atas namamu). Tulis nama filenya di <b>.gitignore</b>, daftar file yang tidak ikut disimpan Git. Repo publik itu publik selamanya, dan bot menyisir GitHub mencari kunci bocor dalam hitungan menit.',
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
	onlineChip: 'online, bisa dibagi',
	folderLabel: 'Folder proyek',
	secretNote: 'password, API key',
	ignoredTag: 'tetap di laptop',
	publicTag: 'publik, selamanya',
	botLabel: 'bot pencari kunci bocor'
};
