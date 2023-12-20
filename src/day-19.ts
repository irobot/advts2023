type Repeat<What, Count extends number, Acc extends unknown[] = []> = Acc["length"] extends Count
	? Acc
	: Repeat<What, Count, [What, ...Acc]>;

type Produce<Items extends string[], Counts extends number[], Acc extends unknown[] = []> = [] extends Counts
	? Acc
	: Items extends [infer Item extends string, ...infer OtherItems extends string[]]
		? Counts extends [infer Count extends number, ...infer TodoNext extends number[]]
			? Produce<[...OtherItems, Item], TodoNext, [...Acc, ...Repeat<Item, Count>]>
			: Acc
		: Acc;

type Toys = ["🛹", "🚲", "🛴", "🏄"];
type Rebuild<Order extends number[]> = Produce<Toys, Order>;


//--- TEST ---//

import { Expect, Equal } from 'type-testing';

type test_0_actual = Rebuild<[2, 1, 3, 3, 1, 1, 2]>;
//   ^?
type test_0_expected =  [
  '🛹', '🛹',
	'🚲',
	'🛴', '🛴', '🛴',
	'🏄', '🏄', '🏄',
	'🛹',
	'🚲',
	'🛴', '🛴',
];
type test_0 = Expect<Equal<test_0_expected, test_0_actual>>;

type test_1_actual = Rebuild<[3, 3, 2, 1, 2, 1, 2]>;
//   ^?
type test_1_expected = [
	'🛹', '🛹', '🛹',
	'🚲', '🚲', '🚲',
	'🛴', '🛴',
	'🏄',
	'🛹', '🛹',
	'🚲',
	'🛴', '🛴'
];
type test_1 = Expect<Equal<test_1_expected, test_1_actual>>;

type test_2_actual = Rebuild<[2, 3, 3, 5, 1, 1, 2]>;
//   ^?
type test_2_expected = [
	'🛹', '🛹',
	'🚲', '🚲', '🚲',
	'🛴', '🛴', '🛴',
	'🏄', '🏄', '🏄', '🏄', '🏄',
	'🛹',
	'🚲',
	'🛴', '🛴',
];
type test_2 = Expect<Equal<test_2_expected, test_2_actual>>;