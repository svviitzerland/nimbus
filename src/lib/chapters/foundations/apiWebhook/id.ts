import type { ApiStyleText } from '../../types';

export const id: ApiStyleText = {
	title: 'Webhook',
	intro: [
		'Webhook itu kebalikan dari biasanya. Bukan kamu yang menanya ke server, tapi server yang menghubungi kamu pas ada kejadian.',
		'Kamu kasih satu alamat ke server, lalu tinggal menunggu. Begitu ada kejadian, misalnya pembayaran masuk, server mengirim pesan ke alamat itu. Lihat server mengabari duluan.',
		'Pakai Webhook kalau kamu mau diberi tahu pas ada kejadian tanpa harus menanya terus, seperti konfirmasi pembayaran atau pesan masuk.',
		'[fyi] Karena server yang menghubungi kamu, kamu harus punya satu alamat publik yang bisa dia jangkau. Ini beda dari polling yang nanya terus, di sini kamu cukup menunggu dikabari.',
		'[ingat] Webhook itu kabar balik saat kejadian. Aplikasi mengirim ke alamat yang sudah didaftarkan.'
	],
	reactions: {},
	style: 'webhook',
	clientLabel: 'Client',
	serverLabel: 'Server',
	replayBtn: 'Putar ulang'
};
