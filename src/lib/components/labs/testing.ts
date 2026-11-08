export type Comparison = '>' | '>=' | '===';
export const checkoutCases = [
	{ input: 99, expected: 99 },
	{ input: 100, expected: 90 },
	{ input: 150, expected: 140 }
];
export function checkout(amount: number, operator: Comparison): number {
	const eligible =
		operator === '>' ? amount > 100 : operator === '>=' ? amount >= 100 : amount === 100;
	return eligible ? amount - 10 : amount;
}
