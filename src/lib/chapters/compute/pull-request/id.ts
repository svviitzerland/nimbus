import type { PullRequestText } from './types';

export const id: PullRequestText = {
	title: 'Pull request dan code review',
	intro: [
		'Di tim, nggak ada yang merge ke main sendirian diam diam. Citra sudah bikin tombol Kontak di branch <b>citra</b>, tapi sebelum masuk ke main, dia mau temannya lihat dulu. Di GitHub caranya pakai <b>pull request</b>.',
		'Citra push branchnya ke GitHub, lalu membuka pull request (sering disingkat <b>PR</b>). Isinya kira kira begini, ini branch citra, tolong dicek, lalu gabungkan ke main ya. Sebuah PR itu usulan, belum perubahan resmi.',
		'PR menunjukkan persis apa yang berubah. Baris yang ditambah diberi warna hijau dan tanda plus, baris yang dihapus warna merah. Jadi temannya nggak perlu menebak, cukup baca bagian yang beda.',
		'Adi membaca perubahannya dan meninggalkan komentar di baris tombol, katanya tombolnya kekecilan di HP. Inilah <b>code review</b>, teman satu tim saling memeriksa kode sebelum masuk ke main. Bukan buat menghakimi, empat mata memang melihat lebih banyak daripada dua.',
		'Citra memperbesar tombolnya, commit, lalu push lagi ke branch yang sama. PR langsung ikut terbarui sendiri, nggak perlu bikin PR baru. Obrolan dan perbaikannya tersimpan rapi di satu halaman.',
		'Sementara itu, ada pemeriksaan otomatis yang jalan sendiri di tiap PR, namanya <b>checks</b>. Mesin membangun situsnya dan menjalankan tesnya, lalu memberi centang hijau atau silang merah. Nanti kamu kenalan dengan mesin ini di [[CI/CD|compute/cicd]].',
		'Kodenya sudah oke dan checksnya hijau, jadi Adi menekan <b>Approve</b>, tanda dia setuju. Banyak tim memasang aturan, PR baru boleh digabung kalau sudah ada yang approve dan semua checks lolos.',
		'Citra menekan tombol <b>Merge</b>. Branch citra menyatu ke main, PR ditandai selesai, dan tombol Kontak yang lebih besar ikut tayang di nimbus.com. Jejak diskusinya tetap bisa dibaca kapan saja.',
		'[ingat] PR itu seperti menyerahkan karanganmu ke teman sebelum dikumpulkan. Dia mencoret pakai pulpen merah (review), mesin pengecek ejaan ikut memeriksa (checks), kamu perbaiki, dia tanda tangan (approve), baru karangannya masuk (merge).',
		'[fyi] Di GitLab namanya <b>merge request</b>, tapi idenya sama persis. Biasanya main juga dikunci, jadi siapa pun, bahkan pemilik repo, harus lewat PR dulu.'
	],
	reactions: {},
	steps: [
		{
			tag: 'Sebelum PR',
			title: 'Branch yang menunggu',
			body: 'Perubahan Citra masih di branch <b>citra</b>. Main dan situsnya belum tahu apa apa.'
		},
		{
			tag: 'Pull request',
			title: 'Sebuah usulan',
			body: 'PR bilang, tolong gabungkan <b>citra</b> ke <b>main</b>. Belum ada yang berubah sampai PR digabung.'
		},
		{
			tag: 'Diff',
			title: 'Apa yang berubah',
			body: 'Hijau dengan <b>+</b> berarti baris baru, merah dengan <b>&minus;</b> berarti baris dihapus. Sisanya cuma konteks.'
		},
		{
			tag: 'Code review',
			title: 'Teman ikut membaca',
			body: 'Komentar bisa ditaruh tepat di baris yang dimaksud, jadi jelas bagian mana yang dibahas.'
		},
		{
			tag: 'Perbaikan',
			title: 'Push lagi, PR ikut berubah',
			body: 'Commit baru di branch yang sama langsung muncul di PR. Satu PR, satu obrolan.'
		},
		{
			tag: 'Checks',
			title: 'Pemeriksa otomatis',
			body: 'Mesin membangun dan mengetes tiap PR. Centang hijau berarti aman, silang merah berarti ada yang rusak.'
		},
		{
			tag: 'Approve',
			title: 'Tanda setuju',
			body: 'Reviewer menekan <b>Approve</b>. Dengan approve dan checks hijau, PR siap digabung.'
		},
		{
			tag: 'Merge',
			title: 'Masuk ke main',
			body: 'Tombol <b>Merge</b> menyatukan branch ke main. Situsnya ikut berubah, PR ditutup sebagai selesai.'
		},
		{
			tag: 'Cara ingat',
			title: 'Review sebelum merge',
			body: 'Review itu pulpen merah, checks itu pengecek ejaan, approve itu tanda tangan, merge itu dikumpulkan.'
		},
		{
			tag: 'Nama lain',
			title: 'Merge request',
			body: 'GitLab menyebutnya <b>merge request</b>. Main yang dikunci memaksa semua perubahan lewat jalur ini.'
		}
	],
	prTitle: 'Tambah tombol Kontak',
	openBadge: 'Terbuka',
	mergedBadge: 'Digabung',
	notMerged: 'belum masuk main',
	opened: 'Citra ingin menggabungkan citra ke main',
	pageTitle: 'Cloud itu gampang',
	oldBtn: 'Daftar',
	newBtn: 'Kontak',
	reviewer: 'Adi',
	comment: 'Tombolnya kekecilan di HP, bisa dibesarkan?',
	fixCommit: 'Perbesar tombol',
	checksLabel: 'Checks',
	checkNames: ['Build', 'Test'],
	running: 'jalan',
	passed: 'lolos',
	approved: 'Adi menyetujui perubahan ini',
	mergeBtn: 'Merge',
	mergedText: 'citra sudah menyatu ke main',
	liveText: 'tayang di nimbus.com',
	lockNote: 'main dikunci, semua lewat PR',
	timeline: ['Dibuka', 'Review', 'Checks', 'Approve', 'Merge']
};
