import type { ApiStyleText } from '../../types';

export const id: ApiStyleText = {
	title: 'GraphQL',
	intro: [
		'GraphQL beda dari REST. Kalau REST punya banyak alamat (endpoint), GraphQL cukup satu, biasanya /graphql. Ke endpoint itu kamu yang menyebut persis data apa yang kamu mau.',
		'Kamu kirim satu query yang menyebut field, misalnya minta name dan price. Lihat query-nya pergi dan server balas tepat itu, name dan harganya saja.',
		'Pakai GraphQL kalau satu layar butuh banyak potongan data sekaligus dan kamu mau hemat, ambil yang perlu saja dalam sekali jalan.',
		'[fyi] GraphQL dibuat di Facebook tahun 2012 dan dirilis ke umum 2015. Aplikasi HP mereka ribet pakai REST, satu layar butuh banyak permintaan dan sering kebanyakan data, jadi mereka bikin cara minta yang pas.',
		'[ingat] Query GraphQL menyebut data dan field yang ingin diterima.'
	],
	reactions: {},
	style: 'graphql',
	clientLabel: 'Frontend',
	serverLabel: 'Backend',
	replayBtn: 'Putar ulang'
};
