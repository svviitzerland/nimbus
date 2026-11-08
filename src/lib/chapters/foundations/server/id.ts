import type { ServerText } from '../../types';

export const id: ServerText = {
	title: 'Apa itu client dan server?',
	intro: [
		'Setiap kali kamu membuka sebuah situs, sebenarnya ada dua pihak yang lagi ngobrol. Yang satu <b>meminta</b>, yang satu <b>melayani</b>.',
		'Pihak yang meminta namanya <b>client</b>. Itu HP atau laptopmu, lewat browser yang lagi kamu pakai sekarang. Tugasnya minta halaman, lalu menampilkannya ke layarmu.',
		'Pihak yang melayani namanya <b>server</b>. Komputer di suatu tempat yang menyala 24 jam, kerjanya menunggu permintaan datang lalu menjawabnya.',
		'Di sini sudah ada dua pelakunya, HP kamu dan sebuah server yang siaga. Buka situsnya dan perhatikan obrolan mereka berdua.',
		'[ingat] Browser meminta, server melayani. Keduanya program yang berjalan di komputer.'
	],
	reactions: {
		served:
			'Nah, itu dia. Client <b>minta</b> halaman, server <b>mengirimnya</b> balik. Obrolan sesederhana itu terjadi tiap kali kamu buka situs apa pun.'
	},
	you: 'Browser kamu',
	server: 'Server',
	open: 'Buka website',
	request: 'minta halaman',
	response: 'kirim halaman',
	count: '{n} request dilayani'
};
