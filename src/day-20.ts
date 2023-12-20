type Letters = {
	A: [
    "█▀█ ",
    "█▀█ ",
    "▀ ▀ "
  ];
	B: [
    "█▀▄ ", 
    "█▀▄ ", 
    "▀▀  "
    ];
	C: [
    "█▀▀ ", 
    "█ ░░", 
    "▀▀▀ "
    ];
	E: [
    "█▀▀ ", 
    "█▀▀ ", 
    "▀▀▀ "
    ];
	H: [
    "█ █ ", 
    "█▀█ ", 
    "▀ ▀ "
    ];
	I: [
    "█ ", 
    "█ ", 
    "▀ "
    ];
	M: [
    "█▄░▄█ ", 
    "█ ▀ █ ", 
    "▀ ░░▀ "
    ];
	N: [
    "█▄░█ ", 
    "█ ▀█ ", 
    "▀ ░▀ "
    ];
	P: [
    "█▀█ ", 
    "█▀▀ ", 
    "▀ ░░"
    ];
	R: [
    "█▀█ ", 
    "██▀ ", 
    "▀ ▀ "
    ];
	S: [
    "█▀▀ ", 
    "▀▀█ ", 
    "▀▀▀ "
    ];
	T: [
    "▀█▀ ", 
    "░█ ░", 
    "░▀ ░"
    ];
	Y: [
    "█ █ ", 
    "▀█▀ ", 
    "░▀ ░"
    ];
	W: [
    "█ ░░█ ", 
    "█▄▀▄█ ", 
    "▀ ░ ▀ "]
    ;
	" ": [
    "░", 
    "░", 
    "░"];
	":": [
    "#", 
    "░", 
    "#"];
	"*": [
    "░", 
    "#", 
    "░"];
};

type Split<
	T extends string,
	Delim extends string,
	Acc extends string[] = [],
> = T extends `${infer Prefix}${Delim}${infer Suffix}`
	? Split<Suffix, Delim, [...Acc, Prefix]>
	: [...Acc, T];

type KnownLetters = keyof Letters;
type SubRows = 0 | 1 | 2;
type PrintLetter<Code extends keyof Letters, SubRow extends SubRows> = Letters[Code][SubRow];

type PrintSubRow<
  Text extends string,
  SubRow extends SubRows,
  Acc extends string = "",
> = Uppercase<Text> extends `${infer First extends KnownLetters}${infer Rest}`
  ? PrintSubRow<Rest, SubRow, `${Acc}${PrintLetter<First, SubRow>}`>
  : Acc;

/**
 * Not sure if inferring the sub-row indices directly from `Letters`
 * is worth the added complexity.
 */
type PrintRow<Text extends string> = [
  PrintSubRow<Text, 0>,
  PrintSubRow<Text, 1>,
  PrintSubRow<Text, 2>,
];

type PrintRows<Text extends string[], Acc extends string[] = []> =
  Text extends [infer First extends string, ...infer Rest extends string[]]
    ? PrintRows<Rest, [...Acc, ...PrintRow<First>]>
    : Acc;

type ToAsciiArt<Text extends string> = PrintRows<Split<Text, "\n">>;


//--- TEST ---//

import { Equal, Expect } from "type-testing";

type test_0_actual = ToAsciiArt<"   * : * Merry * : *   \n  Christmas  ">;
//   ^?
type test_0_expected = [
  "░░░░░#░░░█▄░▄█ █▀▀ █▀█ █▀█ █ █ ░░░#░░░░░",
  "░░░#░░░#░█ ▀ █ █▀▀ ██▀ ██▀ ▀█▀ ░#░░░#░░░",
  "░░░░░#░░░▀ ░░▀ ▀▀▀ ▀ ▀ ▀ ▀ ░▀ ░░░░#░░░░░",
  "░░█▀▀ █ █ █▀█ █ █▀▀ ▀█▀ █▄░▄█ █▀█ █▀▀ ░░",
  "░░█ ░░█▀█ ██▀ █ ▀▀█ ░█ ░█ ▀ █ █▀█ ▀▀█ ░░",
  "░░▀▀▀ ▀ ▀ ▀ ▀ ▀ ▀▀▀ ░▀ ░▀ ░░▀ ▀ ▀ ▀▀▀ ░░",
];
type test_0 = Expect<Equal<test_0_actual, test_0_expected>>;

type test_1_actual = ToAsciiArt<"  Happy new  \n  * : * : * Year * : * : *  ">;
//   ^?
type test_1_expected = [
        "░░█ █ █▀█ █▀█ █▀█ █ █ ░█▄░█ █▀▀ █ ░░█ ░░",
        "░░█▀█ █▀█ █▀▀ █▀▀ ▀█▀ ░█ ▀█ █▀▀ █▄▀▄█ ░░",
        "░░▀ ▀ ▀ ▀ ▀ ░░▀ ░░░▀ ░░▀ ░▀ ▀▀▀ ▀ ░ ▀ ░░",
        "░░░░#░░░#░░░█ █ █▀▀ █▀█ █▀█ ░░░#░░░#░░░░",
        "░░#░░░#░░░#░▀█▀ █▀▀ █▀█ ██▀ ░#░░░#░░░#░░",
        "░░░░#░░░#░░░░▀ ░▀▀▀ ▀ ▀ ▀ ▀ ░░░#░░░#░░░░",
];
type test_1 = Expect<Equal<test_1_actual, test_1_expected>>;

type test_2_actual = ToAsciiArt<"  * : * : * : * : * : * \n  Trash  \n  * : * : * : * : * : * ">;
//   ^?
type test_2_expected = [
  "░░░░#░░░#░░░#░░░#░░░#░░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░░░#░░░#░░░#░░░#░░░#░░░",
  "░░▀█▀ █▀█ █▀█ █▀▀ █ █ ░░",
  "░░░█ ░██▀ █▀█ ▀▀█ █▀█ ░░",
  "░░░▀ ░▀ ▀ ▀ ▀ ▀▀▀ ▀ ▀ ░░",
  "░░░░#░░░#░░░#░░░#░░░#░░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░░░#░░░#░░░#░░░#░░░#░░░",
];
type test_2 = Expect<Equal<test_2_actual, test_2_expected>>;

type test_3_actual = ToAsciiArt<"  : * : * : * : * : * : * : \n  Ecyrbe  \n  : * : * : * : * : * : * : ">;
//   ^?
type test_3_expected = [
  "░░#░░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░░░#░░░#░░░#░░░#░░░#░░░#░░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░█▀▀ █▀▀ █ █ █▀█ █▀▄ █▀▀ ░░",
  "░░█▀▀ █ ░░▀█▀ ██▀ █▀▄ █▀▀ ░░",
  "░░▀▀▀ ▀▀▀ ░▀ ░▀ ▀ ▀▀  ▀▀▀ ░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░░░#░",
  "░░░░#░░░#░░░#░░░#░░░#░░░#░░░",
  "░░#░░░#░░░#░░░#░░░#░░░#░░░#░",
];
type test_3 = Expect<Equal<test_3_actual, test_3_expected>>;
