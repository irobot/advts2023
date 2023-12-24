type Alley = "  ";
type Tree = "🎄";
type Santa = "🎅";
type MazeItem = "🎄" | "🎅" | Alley;
type DELICIOUS_COOKIES = "🍪";
type MazeMatrix = MazeItem[][];
type Directions = "up" | "down" | "left" | "right";

/** [row, column] */
type Position = [number, number];

type IndexOf<Arr extends unknown[], SearchTerm> = {
  [K in keyof Arr]: Arr[K] extends SearchTerm
    ? K extends `${infer N extends number}`
      ? N
      : never
    : never;
}[number];

type ParseNumber<S> = S extends `${infer N extends number}` ? N : never;

type FindIndex<Grid extends unknown[][], SearchTerm> = {
  [K in keyof Grid]: IndexOf<Grid[K], SearchTerm> extends infer N
    ? N extends number
      ? [ParseNumber<K>, N]
      : never
    : never;
}[number];

type WhereIsSanta<Maze extends MazeMatrix> = FindIndex<Maze, Santa>;

/** Make an array of `End` `unknown`s */
type MakeArray<
  End extends number,
  What extends unknown = unknown,
  Acc extends unknown[] = []
> = Acc extends { length: End } ? Acc : MakeArray<End, What, [What, ...Acc]>;

type Inc<N extends number> = [...MakeArray<N>, unknown]["length"];
type Dec<N extends number> = MakeArray<N> extends [infer _, ...infer Rest]
  ? Rest["length"]
  : never;

type MovePosition<Pos extends Position, Dir extends Directions> = Pos extends [
  infer Row extends number,
  infer Col extends number
]
  ? [
      Dir extends "up" ? Dec<Row> : Dir extends "down" ? Inc<Row> : Row,
      Dir extends "left" ? Dec<Col> : Dir extends "right" ? Inc<Col> : Col
    ]
  : Pos;

type IsWin<
  Maze extends MazeMatrix,
  Pos extends Position,
  Dir extends Directions
> = Pos extends [infer Row extends number, infer Col extends number]
  ? [Row, Dir] extends [0, "up"] | [Dec<Maze["length"]>, "down"]
    ? true
    : [Col, Dir] extends [0, "left"] | [Dec<Maze[0]["length"]>, "right"]
    ? true
    : false
  : never;

type MakeCookies<Maze extends MazeMatrix> =
  Maze["length"] extends infer Rows extends number
    ? Maze[0]["length"] extends infer Cols extends number
      ? MakeArray<Rows, MakeArray<Cols, DELICIOUS_COOKIES>>
      : Maze
    : Maze;

type Replace<
  Src extends unknown[],
  Idx extends number,
  Value extends unknown,
  Acc extends unknown[] = []
> = Acc["length"] extends infer CurIdx extends number
  ? CurIdx extends Src["length"]
    ? Acc
    : Replace<
        Src,
        Idx,
        Value,
        [...Acc, CurIdx extends Idx ? Value : Src[CurIdx]]
      >
  : never;

type Put<
  Maze extends MazeMatrix,
  Pos extends Position,
  Item extends MazeItem
> = Pos extends [infer Row extends number, infer Col extends number]
  ? Replace<Maze[Row], Col, Item> extends infer NewRow extends MazeItem[]
    ? Replace<Maze, Row, NewRow>
    : never
  : never;

type Sample<
  Arr extends unknown[][],
  Pos extends Position
> = Arr[Pos[0]][Pos[1]];

type Move<
  Maze extends MazeMatrix,
  Dir extends Directions
> = WhereIsSanta<Maze> extends infer Pos extends Position
  ? MovePosition<Pos, Dir> extends infer NewPos extends Position
    ? Sample<Maze, NewPos> extends Tree
      ? Maze
      : true extends IsWin<Maze, Pos, Dir>
      ? MakeCookies<Maze>
      : Put<Put<Maze, Pos, "  ">, NewPos, Santa>
    : never
  : never;


//--- TEST ---//

import { Expect, Equal } from "type-testing";

type Maze0 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎅", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];

// can't move up!
type test_maze0_up_actual = Move<Maze0, 'up'>;
//   ^?
type test_maze0_up = Expect<Equal<test_maze0_up_actual, Maze0>>;


// but Santa can move down!
type test_maze0_down_actual = Move<Maze0, 'down'>;
//   ^?
type Maze1 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎅", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze0_down = Expect<Equal<test_maze0_down_actual, Maze1>>;


// Santa can move down again!
type test_maze1_down_actual = Move<Maze1, 'down'>;
type Maze2 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎅", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze1_down = Expect<Equal<test_maze1_down_actual, Maze2>>;


// can't move left!
type test_maze2_left_actual = Move<Maze2, 'left'>;
//   ^?
type test_maze2_left = Expect<Equal<test_maze2_left_actual, Maze2>>;


// if Santa moves up, it's back to Maze1!
type test_maze2_up_actual = Move<Maze2, 'up'>;
//   ^?
type test_maze2_up = Expect<Equal<test_maze2_up_actual, Maze1>>;


// can't move right!
type test_maze2_right_actual = Move<Maze2, 'right'>;
//   ^?
type test_maze2_right = Expect<Equal<test_maze2_right_actual, Maze2>>;


// we exhausted all other options! guess we gotta go down!
type test_maze2_down_actual = Move<Maze2, 'down'>;
//   ^?
type Maze3 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "🎅", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze2_down = Expect<Equal<test_maze2_down_actual, Maze3>>;


// maybe we just gotta go down all the time?
type test_maze3_down_actual = Move<Maze3, 'down'>;
//   ^?
type Maze4 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "🎅", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze3_down = Expect<Equal<test_maze3_down_actual, Maze4>>;


// let's go left this time just to change it up?
type test_maze4_left_actual = Move<Maze4, 'left'>;
//   ^?
type Maze5 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "🎅", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
// it worked!
type test_maze4_left = Expect<Equal<test_maze4_left_actual, Maze5>>;


// couldn't hurt to try left again?
type test_maze5_left_actual = Move<Maze5, 'left'>;
//   ^?
type Maze6 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "🎅", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze5_left = Expect<Equal<test_maze5_left_actual, Maze6>>;


// three time's a charm?
type test_maze6_left_actual = Move<Maze6, 'left'>;
//   ^?
// lol, nope.
type test_maze6_left = Expect<Equal<test_maze6_left_actual, Maze6>>;


// we haven't tried up yet (?)
type test_maze6_up_actual = Move<Maze6, 'up'>;
//   ^?
type Maze7 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "🎅", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
// NOICE.
type test_maze6_up = Expect<Equal<test_maze6_up_actual, Maze7>>;


// maybe another left??
type test_maze7_left_actual = Move<Maze7, 'left'>;
//   ^?
type Maze8 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "🎅", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze7_left = Expect<Equal<test_maze7_left_actual, Maze8>>;


// haven't tried a right yet.. let's give it a go!
type test_maze7_right_actual = Move<Maze8, 'right'>;
//   ^?
// not this time...
type test_maze7_right = Expect<Equal<test_maze7_right_actual, Maze7>>;


// probably just need to stick with left then
type test_maze8_left_actual = Move<Maze8, 'left'>;
//   ^?
type Maze9 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "🎅", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze8_left = Expect<Equal<test_maze8_left_actual, Maze9>>;


// why fix what's not broken?
type test_maze9_left_actual = Move<Maze9, 'left'>;
//   ^?
type Maze10 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "🎅", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze9_left = Expect<Equal<test_maze9_left_actual, Maze10>>;


// do you smell cookies?? it's coming from down..
type test_maze10_down_actual = Move<Maze10, 'down'>;
//   ^?
type Maze11 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["  ", "🎅", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze10_down = Expect<Equal<test_maze10_down_actual, Maze11>>;


// the cookies must be freshly baked.  I hope there's also the customary glass of milk!
type test_maze11_left_actual = Move<Maze11, 'left'>;
//   ^?
type Maze12 = [
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "  ", "  ", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "  ", "🎄"],
  ["🎅", "  ", "🎄", "🎄", "  ", "  ", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "🎄", "🎄", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "  ", "  ", "  ", "  ", "🎄", "  ", "🎄", "🎄", "🎄"],
  ["🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄", "🎄"],
];
type test_maze11_left = Expect<Equal<test_maze11_left_actual, Maze12>>;


// COOKIES!!!!!
type test_maze12_left_actual = Move<Maze12, 'left'>;
//   ^?
type MazeWin = [
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
  ["🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪", "🍪"],
];
type test_maze12_left = Expect<Equal<test_maze12_left_actual, MazeWin>>;
