/** Make an array of `Count` tokens */
type MakeArray<
	Count extends number,
	Token extends string,
	Acc extends string[] = [],
> = Acc extends {
	length: Count;
}
	? Acc
	: MakeArray<Count, Token, [Token, ...Acc]>;

type BoxToys<Name extends string, Count extends number> = {
	[K in Count]: MakeArray<K, Name>;
}[Count];


// --- TEST ---//

import { Expect, Equal } from 'type-testing';

type test_doll_actual = BoxToys<'doll', 1>;
//   ^?
type test_doll_expected = ['doll'];
type test_doll = Expect<Equal<test_doll_expected, test_doll_actual>>;

type test_nutcracker_actual = BoxToys<'nutcracker', 3 | 4>;
//   ^?
type test_nutcracker_expected =
  | ['nutcracker', 'nutcracker', 'nutcracker']
  | ['nutcracker', 'nutcracker', 'nutcracker', 'nutcracker'];
type test_nutcracker = Expect<Equal<test_nutcracker_expected, test_nutcracker_actual>>;
