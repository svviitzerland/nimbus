import type { VirtualMachineText } from '../../types';

export const en: VirtualMachineText = {
	title: 'What is a virtual machine?',
	intro: [
		'Look at this laptop. Inside is one set of hardware, a CPU, RAM, and a disk. Usually one machine runs one operating system for one user.',
		'Yet a powerful machine sits idle most of the time, only a sliver of its power gets used. The trick is to slice one machine into several virtual computers. The slicing technique is called <b>virtualization</b>, and each slice it produces is a <b>virtual machine</b> (VM).',
		'Every VM runs its own operating system and feels like a whole computer, even though they all share one set of hardware. Like an apartment building, one structure, many units, every resident with their own door. Hold on to this idea, very soon it turns out to be how the cloud works.',
		'The machine is waiting, an 8 core CPU and 16 GB of RAM mostly sitting idle. Add VMs one by one until it is full, and watch the CPU and RAM get divided up.',
		'[ingat] Several VMs can run on one physical computer and share its resources.'
	],
	reactions: {
		first:
			'One cut, and VM 1 instantly got its own share, 2 vCPUs (virtual CPU cores) and 4 GB of RAM, complete with its own operating system. It believes it is a whole computer, yet it is only a slice.',
		more: 'Keep going. Every VM gets an equal slice of the power and none of them can peek at the others, exactly like neighboring apartment units.',
		full: 'Full. One physical machine now holds 4 computers standing on their own, and the power that used to sit idle is all put to work. This is the trick used everywhere.'
	},
	hostLabel: 'One physical machine',
	hostCpu: '8 CPU cores',
	hostRam: '16 GB RAM',
	virtLayer: 'Virtualization',
	virtSub: 'splits one physical machine into many VMs',
	singleLabel: 'One system',
	singleSub: 'All resources for one system',
	addVm: 'Add a VM',
	vmName: 'VM {n}',
	vmSub: 'own OS',
	perVm: 'Each VM 2 vCPU, 4 GB',
	usedLabel: 'CPU allocated {n}%',
	fullLabel: '4 computers in 1 machine',
	prompt: 'Add VMs while resources are available'
};
