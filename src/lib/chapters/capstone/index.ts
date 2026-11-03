import type { Chapter } from '../types';
import { build } from './build';
import { crossroads } from './crossroads';

export const capstone: Chapter = {
	id: 'capstone',
	number: 8,
	unnumbered: true,
	title: { id: 'Persimpangan', en: 'Crossroads' },
	lessons: [crossroads, build],
	summary: {
		id: {
			title: 'Dari Nol selesai',
			sub: 'Kamu sudah mencicipi semua dasar teknologi yang dibutuhkan',
			items: [
				'Cara <b>komputer</b> dan <b>kode</b> bekerja, sampai client dan server',
				'Cara <b>web</b> dibangun dan cara <b>jaringan</b> mengantar datanya',
				'Cara <b>cloud</b> melayani banyak orang, tahan gangguan, dan tetap hemat',
				'Cara <b>mengamankan</b> sistem, dan dasar <b>AI</b> serta machine learning'
			],
			nextNote:
				'Berikutnya, pilih <b>cabang</b> yang mau kamu dalami. Jaringan, Web, Cloud & DevOps, Keamanan, atau AI & ML.',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'From Zero complete',
			sub: 'You have tasted every tech basic you need',
			items: [
				'How <b>computers</b> and <b>code</b> work, up to clients and servers',
				'How the <b>web</b> is built and how the <b>network</b> carries its data',
				'How the <b>cloud</b> serves many people, survives trouble, and stays on budget',
				'How to <b>secure</b> a system, and the basics of <b>AI</b> and machine learning'
			],
			nextNote:
				'Next up, pick the <b>branch</b> you want to go deeper in. Network, Web, Cloud & DevOps, Security, or AI & ML.',
			restart: 'Start over'
		}
	}
};
