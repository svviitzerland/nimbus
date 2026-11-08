import type { StorageTypesText } from '../types';

export const id: StorageTypesText = {
	title: 'Tiga bentuk penyimpanan',
	intro: [
		'Sekarang kita simpan data. Di cloud ada tiga bentuk penyimpanan, dan masing masing punya cara kerja serta jagoannya sendiri.',
		'<b>Object storage</b> itu seperti ember raksasa. File dilempar masuk utuh utuh, tiap file dapat sebuah kunci (nama unik) untuk mengambilnya lagi, dan embernya seolah tidak pernah penuh.',
		'<b>Block storage</b> itu disk mentah yang ditempel ke satu mesin, dipotong potong jadi blok kecil yang cepat banget dibaca tulis. <b>File storage</b> itu folder bersama, satu lemari berkas yang dibuka banyak mesin sekaligus.',
		'Ketiganya sudah berjajar menunggu dibuka. Intip satu satu cara mereka menyimpan, dan ingat ingat kapan kamu bakal memakainya.',
		'[ingat] Object menyimpan data sebagai objek, block menyediakan blok penyimpanan, file mengatur berkas dalam folder.'
	],
	reactions: {
		object:
			'Itu object storage. File masuk utuh utuh ke ember, tiap file dipanggil lewat kuncinya. Foto, video, arsip, lempar saja ke sini, kapasitasnya nyaris tanpa batas.',
		block:
			'Itu block storage. Disk mentah yang nempel ke satu mesin dan dibaca tulis super cepat. Di sinilah sistem operasi dan database menaruh datanya.',
		file: 'Itu file storage. Satu folder yang sama dibuka banyak mesin sekaligus, semuanya melihat berkas yang sama. Pas buat kerja bareng.'
	},
	objectTitle: 'Object',
	objectSub: 'Data disimpan sebagai objek',
	objectNote: 'Tiap file utuh disimpan dengan sebuah kunci',
	objectWhen: ['Foto & video pengguna', 'File unduhan', 'Arsip lama'],
	objectFiles: ['foto.jpg', 'video.mp4', 'arsip.zip'],
	blockTitle: 'Block',
	blockSub: 'Penyimpanan dalam blok',
	blockNote: 'Server mengakses penyimpanan sebagai perangkat disk',
	blockWhen: ['Disk utama server', 'Tempat database jalan'],
	blockMachine: 'Server',
	fileTitle: 'File',
	fileSub: 'folder bersama',
	fileNote: 'Satu folder dibuka banyak mesin sekaligus',
	fileWhen: ['Dokumen tim', 'Banyak server baca berkas sama'],
	fileMachines: ['Mesin 1', 'Mesin 2', 'Mesin 3'],
	fileDocs: ['laporan.doc', 'data.csv'],
	whenTitle: 'Kapan dipakai',
	seenAll: 'Ketiganya sudah kamu kenal',
	hint: 'Masih ada bentuk yang belum kamu buka'
};
