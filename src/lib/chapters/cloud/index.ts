import { dataCenter } from './data-center';
import type { Chapter } from '../types';
import { cloud } from './cloud';
import { remoteAccess } from './remote-access';
import { services } from './services';
import { cable } from './cable';
import { region } from './region';

export const cloudChapter: Chapter = {
	id: 'cloud',
	number: 2,
	title: { id: 'Cloud', en: 'The Cloud' },
	lessons: [dataCenter, cloud, remoteAccess, services, cable, region],
	summary: {
		id: {
			title: 'Bab 2 selesai',
			sub: 'Kamu sudah mengenal rumah fisik dan layanan cloud',
			items: [
				'<b>Pusat data</b> menjaga server dengan rak, listrik, pendingin, jaringan, dan pengamanan fisik',
				'<b>Cloud</b> itu server di data center penyedia yang biasanya kamu sewa dan bayar sesuai pakai, bukan sesuatu yang ajaib di langit. Perusahaan besar bahkan bisa punya sendiri, namanya <b>private cloud</b>',
				'Server cloud diakses dari jauh, lewat <b>SSH</b> (terminal untuk Linux) atau <b>RDP</b> (desktop untuk Windows)',
				'Cloud itu katalog layanan. Yang paling dasar server virtual yang kamu sewa (<b>VPS</b>, di AWS namanya EC2), selain itu ada storage, database, jaringan, dan banyak lagi',
				'Sebagian besar lalu lintas internet antarbenua melewati <b>kabel serat optik di dasar laut</b>',
				'<b>Region</b> itu kawasan geografis berisi infrastruktur pusat data, dan kamu pilih yang terdekat ke pengguna supaya <b>latensinya</b> kecil'
			],
			nextNote:
				'Berikutnya kita mempelajari <b>Ketahanan & Data</b>. Gedung data center bisa tumbang, jadi kita belajar menyebar server, failover, lalu cara menyimpan data dan memilih database.',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Chapter 2 complete',
			sub: 'You have explored cloud services and their physical home',
			items: [
				'<b>Data centers</b> support servers with racks, power, cooling, networking, and physical security',
				'<b>Cloud</b> is servers in a provider’s data center that you usually rent and pay as you go, not something magical in the sky. Big companies can even run their own, a <b>private cloud</b>',
				'You reach a cloud server remotely, through <b>SSH</b> (a terminal for Linux) or <b>RDP</b> (a desktop for Windows)',
				'The cloud is a catalog of services. The most basic is a virtual server you rent (a <b>VPS</b>, called EC2 on AWS), plus storage, databases, networking, and much more',
				'Much intercontinental internet traffic travels through <b>undersea fiber optic cables</b>',
				'A <b>region</b> is a geographic area containing data center infrastructure, and you pick the nearest one to your users to keep <b>latency</b> low'
			],
			nextNote:
				'Next we explore <b>Resilience & Data</b>. Data center buildings can fail, so we learn to spread servers, fail over, then store data and pick the right database.',
			restart: 'Start over'
		}
	}
};
