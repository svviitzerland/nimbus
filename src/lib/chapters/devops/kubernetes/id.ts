import type { KubernetesText } from './types';

export const id: KubernetesText = {
	title: 'Apa itu Kubernetes',
	intro: [
		'Kamu udah ngebungkus nimbus.com ke dalam [[container|compute/container]], kotak kecil rapi yang isinya aplikasi plus semua kebutuhannya. Mungkin malah udah kamu pecah jadi [[microservices|compute/microservices]]. Sekarang containernya banyak, tersebar di beberapa mesin.',
		'Harus ada yang mutusin container mana jalan di mesin mana, dan sadar kalau ada yang crash jam tiga pagi. Kalau dikerjain pakai tangan, artinya nggak pernah tidur.',
		'<b>Kubernetes</b> (sering ditulis K8s, huruf K, delapan huruf, lalu s) yang ngerjain itu. Kamu nggak nyuruh dia langkah demi langkah. Kamu cukup tulis apa yang kamu <b>mau</b>, misalnya jaga lima salinan nimbus.com tetap jalan.',
		'Otaknya namanya <b>control plane</b>. Mesin yang dia jaga namanya <b>node</b>, dan tiap salinan aplikasimu yang jalan ada di dalam <b>pod</b>, bungkus kecil buat container. Control plane terus ngebandingin apa yang kamu mau sama apa yang beneran jalan.',
		'Lihat. Satu pod crash, jadi yang jalan tinggal empat. Control plane langsung lihat ada yang kurang dan nyalain pod baru. Balik jadi lima, dan nggak ada yang perlu bangun.',
		'Satu node utuh pun bisa mati. Kubernetes mindahin podnya ke node yang masih sehat, dan pas node itu nyala lagi, dia tinggal gabung lagi.',
		'[ingat] Kubernetes itu bahasa Yunani buat juru mudi kapal, <b>kapten yang pegang kemudi</b>. Makanya logonya kemudi kapal. Kamu bilang lima container, kaptennya jaga tetap lima, mau ombaknya segede apa pun.',
		'[fyi] Di jaringan, node artinya perangkat apa aja yang ada di jaringan. Di Kubernetes, node itu satu mesin yang ngejalanin pod kamu. Kata sama, dunia beda. Kubernetes lahir di Google, terinspirasi sistem internal mereka yang namanya Borg, dan dibagikan ke semua orang tahun 2014. Dia bahkan bisa nambah jumlahnya sendiri pas trafik naik, mirip [[auto scaling|traffic/auto-scaling]].',
		'Mau jadi badainya? Pencet pod mana aja buat ngejatuhin dia, terus lihat kaptennya ngegantiin. Atau nikmatin aja lautnya yang tenang.'
	],
	reactions: {
		healed:
			'Kamu jatuhin satu, dan pod baru udah nyala sebelum kamu sempat kedip. Maunya lima, jalannya lima, janji ditepati.'
	},
	steps: [
		{
			tag: 'Kondisinya',
			title: 'Container di mesin',
			body: 'Lima salinan nimbus.com, masing masing di kotaknya sendiri, tersebar di tiga mesin.'
		},
		{
			tag: 'Masalahnya',
			title: 'Siapa yang jaga',
			body: 'Satu container crash dan nggak ada yang sadar. Tanpa bantuan, dia mati terus sampai ada orang bangun.'
		},
		{
			tag: 'Idenya',
			title: 'Bilang maumu',
			body: 'Kamu tulis <code>replicas: 5</code>, udah. Kubernetes yang mikirin langkahnya sendiri.'
		},
		{
			tag: 'Bagiannya',
			title: 'Control plane, node, pod',
			body: '<b>Control plane</b> itu kemudi di atas. <b>Node</b> itu mesinnya. <b>Pod</b> itu kotak kotak di atasnya.'
		},
		{
			tag: 'Nyembuhin sendiri',
			title: 'Satu pod mati',
			body: 'Yang jalan turun jadi 4, control plane sadar, dan muncul pod baru. Balik ke 5.'
		},
		{
			tag: 'Masalah lebih gede',
			title: 'Satu node mati',
			body: 'Podnya dibikin ulang di node yang sehat. Jumlahnya nggak bakal salah lama lama.'
		},
		{
			tag: 'Cara gampang',
			title: 'Sang kapten',
			body: 'Kubernetes itu kapten kapal. Dia jaga jumlah container sesuai yang kamu minta.'
		},
		{
			tag: 'Perlu tahu',
			title: 'Lahir di Google',
			body: 'Open source sejak 2014, dan sekarang jalan di semua cloud besar dan banyak ruang server.'
		},
		{
			tag: 'Opsional',
			title: 'Jatuhin satu',
			body: 'Pencet satu pod. Lihat angkanya turun terus langsung balik lagi.'
		}
	],
	planeLabel: 'Control plane',
	nodeLabel: 'node {n}',
	readout: 'Maunya {w}, jalan {r}',
	night: 'Jam 3 pagi',
	rule: 'Bilang 5, dijaga 5',
	tapHint: 'Pencet satu pod',
	podLabel: 'Pod'
};
