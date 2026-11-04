import type { ApiStyleText } from '../../types';

export const id: ApiStyleText = {
	title: 'WebSocket',
	intro: [
		'WebSocket beda lagi. Saluran antara frontend dan backend dibuka sekali, lalu dibiarkan terbuka, dan pesan bisa lewat dua arah.',
		'Karena terus terbuka, server bisa mendorong kabar kapan saja tanpa diminta, dan kamu juga bisa mengirim kapan saja. Lihat pesannya mengalir bolak balik.',
		'Pakai WebSocket kalau butuh update langsung dua arah, seperti chat, notifikasi, atau pemain di game yang sama.',
		'[fyi] Sebelum WebSocket, biar layar kelihatan update, aplikasi harus nanya ke server berulang ulang tiap beberapa detik, namanya polling. Boros dan telat. WebSocket bikin server bisa dorong sendiri pas ada yang baru, jadi hemat dan langsung.'
	],
	reactions: {},
	style: 'websocket',
	clientLabel: 'Frontend',
	serverLabel: 'Backend',
	replayBtn: 'Putar ulang'
};
