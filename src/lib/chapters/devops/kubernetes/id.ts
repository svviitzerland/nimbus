import type { KubernetesText } from './types';

export const id: KubernetesText = {
	title: 'Apa itu Kubernetes',
	intro: [
		'Kamu sudah membungkus nimbus.com jadi [[container|compute/container]]. Mungkin malah sudah kamu pecah jadi [[microservices|compute/microservices]]. Sekarang containernya ada puluhan, tersebar di beberapa mesin.',
		'Harus ada yang menentukan mesin mana menjalankan container mana, sadar kalau ada yang crash jam tiga pagi, lalu menyalakan yang baru. Kalau dikerjakan manual, ya kamu nggak bakal bisa tidur.',
		'<b>Kubernetes</b> (sering ditulis K8s, huruf K, delapan huruf, lalu s) yang mengurus semua itu. Kamu nggak menyuruhnya langkah demi langkah. Kamu cukup bilang apa yang kamu <b>mau</b>, misalnya "jaga supaya selalu ada lima salinan nimbus.com yang jalan".',
		'<b>Control plane</b> mengatur kondisi cluster agar mendekati konfigurasi yang diminta. Mesin yang menjalankan workload disebut <b>node</b>. Container dijalankan dalam <b>pod</b>.',
		'[fyi] Kata "node" artinya lain di dunia jaringan, di sana setiap perangkat di jaringan disebut node. Di Kubernetes, node itu satu mesin yang menjalankan pod pod kamu. Kubernetes sendiri lahir di Google, terinspirasi sistem internal mereka bernama Borg, lalu dibagikan ke dunia tahun 2014.',
		'[ingat] Kubernetes berusaha menyesuaikan kondisi workload dengan konfigurasi yang diminta. Kapasitas dan kesehatan cluster tetap membatasi hasilnya.',
		'Lima salinan berjalan pada tiga node. Matikan pod, hentikan satu node, atau ubah jumlah replika. Amati bagaimana controller menyesuaikan jumlah pod.'
	],
	reactions: {
		healed:
			'Kamu mematikan satu pod, control plane sadar ada satu salinan yang hilang, lalu menyalakan yang baru. Nggak ada yang perlu bangun tengah malam.',
		healed2:
			'Lagi, dan sembuh lagi. Itulah ide besarnya. Kamu menyatakan apa yang kamu mau, dan Kubernetes terus membetulkan kenyataan sampai cocok.',
		scaledUp:
			'Kamu minta lebih banyak, jadi Kubernetes menaruh pod baru di node yang masih lega. Lagi ramai? Tinggal naikkan angkanya, mirip [[auto scaling|traffic/auto-scaling]].',
		scaledDown:
			'Kamu minta lebih sedikit, jadi Kubernetes pelan pelan mematikan pod yang berlebih.',
		nodeDown:
			'Satu mesin mati total, pod di dalamnya ikut hilang. Kubernetes memindahkan mereka ke node yang masih hidup. Penggunamu nggak melihat ada yang bolong.',
		nodeBack: 'Nodenya kembali, siap menampung pod baru kapan pun dibutuhkan.'
	},
	youDeclare: 'Kamu mau',
	replicasLabel: 'salinan',
	runningLabel: '{n} dari {d} jalan',
	planeLabel: 'Control plane',
	planeWatching: 'memantau, semua aman',
	planeFixing: 'menyalakan {n} baru',
	planePending: '{n} menunggu tempat',
	nodeLabel: 'node {n}',
	nodeDownTag: 'mati',
	podHint: 'Ketuk pod untuk mematikannya',
	unplugBtn: 'Cabut node {n}',
	plugBtn: 'Colok lagi node {n}',
	pendingLabel: 'menunggu'
};
