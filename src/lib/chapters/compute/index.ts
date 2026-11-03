import type { Chapter } from '../types';
import { container } from './container';
import { microservices } from './microservices';
import { serverless } from './serverless';
import { monitoring } from './monitoring';
import { cost } from './cost';
import { versionControl } from './version-control';
import { gitVsGithub } from './git-vs-github';
import { gitHosts } from './git-hosts';
import { cicd } from './cicd';

export const compute: Chapter = {
	id: 'compute',
	number: 7,
	title: { id: 'Komputasi & Operasi', en: 'Compute & Operations' },
	lessons: [
		container,
		microservices,
		serverless,
		monitoring,
		cost,
		versionControl,
		gitVsGithub,
		gitHosts,
		cicd
	],
	summary: {
		id: {
			title: 'Bab 7 selesai',
			sub: 'Kamu sudah paham cara menjalankan dan mengelola aplikasi:',
			items: [
				'Sebuah <b>container</b> adalah paket ringan dan portabel yang jalan sama persis di mana saja',
				'Aplikasi bisa berbentuk <b>monolith</b> (satu blok) atau <b>microservices</b> (banyak service kecil yang ngobrol lewat API), supaya tiap bagian bisa di-scale dan gagal sendiri sendiri',
				'<b>Serverless</b> menjalankan fungsimu saat dipanggil dan turun ke nol saat sepi, jadi kamu bayar per panggilan',
				'Pantau lewat <b>metrik</b>, <b>dashboard</b>, dan <b>alarm</b>, supaya kamu tahu masalah sebelum pengunjung merasakannya',
				'Cloud itu <b>bayar sesuai pakai</b>, jadi <b>right sizing</b> menghemat uang, sementara resource nganggur membuang uang',
				'Sebuah pipeline <b>CI/CD</b> otomatis build, test, lalu deploy tiap perubahan, dan menghentikan yang rusak sebelum sampai ke pengguna',
				'<b>Git</b> menyimpan tiap versi kodemu jadi snapshot (commit), dan itu beda dari <b>GitHub</b> yang cuma satu tempat online buat menyimpan dan membagikannya, sama seperti <b>GitLab</b> atau <b>Bitbucket</b>'
			],
			nextNote:
				'Berikutnya, kita kumpulkan semuanya, lalu kamu pilih <b>cabang</b> yang mau kamu dalami.',
			restart: 'Ulangi dari awal'
		},
		en: {
			title: 'Chapter 7 complete',
			sub: 'You now know how to run and operate an app:',
			items: [
				'A <b>container</b> is a light, portable package that runs the same anywhere',
				'An app can be a <b>monolith</b> (one block) or <b>microservices</b> (many small services talking over APIs), so each part can scale and fail on its own',
				'<b>Serverless</b> runs your function on demand and scales to zero when idle, so you pay per call',
				'Watch through <b>metrics</b>, <b>dashboards</b>, and <b>alarms</b>, so you know about trouble before visitors feel it',
				'The cloud is <b>pay as you go</b>, so <b>right sizing</b> saves money while idle resources waste it',
				'A <b>CI/CD</b> pipeline automatically builds, tests, then deploys every change, and stops a broken one before it reaches users',
				'<b>Git</b> saves every version of your code as a snapshot (a commit), and that is different from <b>GitHub</b>, just one online place to store and share it, like <b>GitLab</b> or <b>Bitbucket</b>'
			],
			nextNote:
				'Next up, we bring it all together, then you pick the <b>branch</b> you want to go deeper in.',
			restart: 'Start over'
		}
	}
};
