import type { GitHostsText } from '../../types';

export const id: GitHostsText = {
	title: 'Layanan hosting Git',
	intro: [
		'GitHub memang paling terkenal, tapi dia bukan satu satunya. Git itu alatnya, dan tempat menaruh kodenya online bisa macam macam. Ada <b>GitLab</b>, <b>Bitbucket</b>, sampai <b>Gitea</b> yang bisa kamu pasang di servermu sendiri.',
		'Yang penting, semuanya ngomong Git yang sama. Repo yang sama bisa kamu pindah dari satu ke lainnya tanpa mengubah caramu commit atau push. Ketuk tiap layanan buat lihat gayanya masing masing.',
		'Lalu satu pertanyaan, kalau semua bisa dipakai, kenapa kebanyakan orang tetap milih GitHub? Buka jawabannya.',
		'[ingat] Git tetap Git meskipun tempat hosting repository berganti.'
	],
	reactions: {
		github:
			'GitHub, yang paling ramai. Rumahnya sebagian besar proyek open source, dan punya Actions buat otomasi bawaan.',
		gitlab:
			'GitLab kuat di pipeline CI/CD bawaan dan sering dipakai perusahaan yang mau host sendiri.',
		bitbucket:
			'Bitbucket dekat dengan alat Atlassian seperti Jira dan Trello, jadi enak buat tim yang sudah pakai itu.',
		gitea: 'Gitea itu ringan dan kamu pasang di servermu sendiri, jadi datanya penuh di tanganmu.',
		why: 'Intinya begini. Yang bikin menang bukan soal Git, tapi soal keramaian. Makin banyak orang dan proyek di GitHub, makin gampang ketemu, belajar, dan direkrut dari situ.'
	},
	sameGitChip: 'Semua pakai Git yang sama',
	exploreHint: 'Ketuk tiap layanan buat membandingkan',
	hosts: [
		{
			id: 'github',
			name: 'GitHub',
			tagline:
				'Tempat menaruh kode paling ramai, rumahnya banyak proyek open source dan komunitas terbesar.',
			traits: ['Komunitas terbesar', 'Actions bawaan', 'Gratis buat repo publik']
		},
		{
			id: 'gitlab',
			name: 'GitLab',
			tagline: 'Lengkap dengan CI/CD bawaan, favorit tim yang mau mengelola semuanya sendiri.',
			traits: ['CI/CD kuat', 'Bisa host sendiri', 'Fokus perusahaan']
		},
		{
			id: 'bitbucket',
			name: 'Bitbucket',
			tagline: 'Rapat dengan alat Atlassian, nyaman buat tim yang sudah hidup di Jira.',
			traits: ['Nempel ke Jira', 'Cocok tim kecil', 'Punya Atlassian']
		},
		{
			id: 'gitea',
			name: 'Gitea',
			tagline: 'Ringan dan kamu pasang di servermu sendiri, kontrol penuh di tanganmu.',
			traits: ['Ringan', 'Host sendiri', 'Open source']
		}
	],
	whyBtn: 'Kenapa kebanyakan GitHub?',
	whyLabel: 'Kenapa kebanyakan pilih GitHub',
	whyPoints: [
		'<b>Efek jaringan</b>. Paling banyak orang dan proyek ada di sini, jadi teman dan calon rekanmu kemungkinan besar juga di sini.',
		'<b>Open source</b>. Sebagian besar proyek terbuka dunia hidup di GitHub, jadi belajar dan ikut kontribusi paling gampang.',
		'<b>Portofolio</b>. Profil GitHub sering jadi CV teknismu, dan banyak perusahaan melihat ke situ.',
		'<b>Otomasi bawaan</b>. Actions bikin build dan deploy jalan tanpa alat tambahan.'
	]
};
