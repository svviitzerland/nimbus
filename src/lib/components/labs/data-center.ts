export type DataCenterState = {
	mains: boolean;
	generator: boolean;
	cooling: boolean;
	network: boolean;
	ups: number;
	temperature: number;
};
export const initialDataCenter = (): DataCenterState => ({
	mains: true,
	generator: false,
	cooling: true,
	network: true,
	ups: 10,
	temperature: 24
});
export const hasPower = (s: DataCenterState) => s.mains || s.generator || s.ups > 0;
export const isOnline = (s: DataCenterState) => hasPower(s) && s.network && s.temperature < 50;
/** One teaching step is five minutes, not an engineering capacity prediction. */
export function advanceDataCenter(s: DataCenterState): DataCenterState {
	const ups = s.mains || s.generator ? Math.min(10, s.ups + 5) : Math.max(0, s.ups - 5);
	const powered = s.mains || s.generator || ups > 0;
	return {
		...s,
		ups,
		temperature:
			powered && !s.cooling ? Math.min(69, s.temperature + 15) : Math.max(24, s.temperature - 15)
	};
}
