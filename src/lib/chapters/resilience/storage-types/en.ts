import type { StorageTypesText } from '../types';

export const en: StorageTypesText = {
	title: 'Three shapes of storage',
	intro: [
		'Time to store data. The cloud offers three shapes of storage, and each works differently and shines at different things.',
		'<b>Object storage</b> is like a giant bucket. Files are tossed in whole, every file gets a key (a unique name) to fetch it back later, and the bucket never seems to fill up.',
		'<b>Block storage</b> is a raw disk attached to a single machine, sliced into small blocks that read and write blazingly fast. <b>File storage</b> is a shared folder, one filing cabinet opened by many machines at once.',
		'All three are lined up waiting to be opened. Peek at how each one stores things, and note when you would reach for it.'
	],
	reactions: {
		object:
			'That is object storage. Files go into the bucket whole, each one fetched by its key. Photos, videos, archives, just toss them in, the capacity is practically endless.',
		block:
			'That is block storage. A raw disk glued to one machine, read and written incredibly fast. This is where operating systems and databases keep their data.',
		file: 'That is file storage. The same folder opened by many machines at once, all seeing the same files. Made for working together.'
	},
	objectTitle: 'Object',
	objectSub: 'a bucket of named files',
	objectNote: 'Every whole file is stored under a key',
	objectWhen: ['User photos & videos', 'Download files', 'Old archives'],
	objectFiles: ['photo.jpg', 'video.mp4', 'archive.zip'],
	blockTitle: 'Block',
	blockSub: 'one machine’s disk',
	blockNote: 'A disk sliced into blocks, attached to one machine',
	blockWhen: ['A server’s main disk', 'Where a database runs'],
	blockMachine: 'Server',
	fileTitle: 'File',
	fileSub: 'a shared folder',
	fileNote: 'One folder opened by many machines at once',
	fileWhen: ['Team documents', 'Many servers reading the same files'],
	fileMachines: ['Machine 1', 'Machine 2', 'Machine 3'],
	fileDocs: ['report.doc', 'data.csv'],
	whenTitle: 'When to use it',
	seenAll: 'You have met all three',
	hint: 'There is still a shape you have not opened'
};
