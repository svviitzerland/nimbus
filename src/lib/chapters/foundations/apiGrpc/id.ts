import type { ApiStyleText } from '../../types';

export const id: ApiStyleText = {
	title: 'gRPC',
	intro: [
		'gRPC bikin kamu memanggil fungsi (sepotong perintah yang punya nama) di server lain, seolah fungsi itu ada di kodemu sendiri, lengkap dengan data titipannya.',
		'Misalnya kamu panggil getProduct(2). Lihat panggilannya melesat ke server dan balasannya pulang. Datanya dikirim ringkas dalam bentuk biner, jadi kecil dan kencang.',
		'Pakai gRPC buat komunikasi antar server di belakang layar yang butuh cepat dan irit, bukan buat dipanggil langsung dari browser.',
		'[fyi] gRPC dibuat Google, penerus sistem internal mereka bernama Stubby, dan pakai format biner Protocol Buffers. Karena itu dia kecil dan kencang, cocok buat ratusan layanan yang saling ngobrol.'
	],
	reactions: {},
	style: 'grpc',
	clientLabel: 'Service',
	serverLabel: 'Service',
	replayBtn: 'Putar ulang'
};
