/** because "dashing" implies speed */
type Dasher = '💨';

/** representing dancing or grace */
type Dancer = '💃';

/** a deer, prancing */
type Prancer = '🦌';

/** a star for the dazzling, slightly mischievous Vixen */
type Vixen = '🌟';

/** for the celestial body that shares its name */
type Comet = '☄️';

/** symbolizing love, as Cupid is the god of love */
type Cupid = '❤️';

/** representing thunder, as "Donner" means thunder in German */
type Donner = '🌩️';

/** meaning lightning in German, hence the lightning bolt */
type Blitzen = '⚡';

/** for his famous red nose */
type Rudolph = '🔴';

type Reindeer = Dasher | Dancer | Prancer | Vixen | Comet | Cupid | Donner | Blitzen | Rudolph;

type Triad<ItemType> = [ItemType, ItemType, ItemType];

type SudokuRow = Triad<Triad<Reindeer>>;

type SudokuBoard = [
  ...Triad<SudokuRow>,
  ...Triad<SudokuRow>,
  ...Triad<SudokuRow>
];

type AllRows = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;
type AllColumns = AllRows;

type TriadMap = [
  [0, 0], [0, 1], [0, 2],
  [1, 0], [1, 1], [1, 2],
  [2, 0], [2, 1], [2, 2]
];

type TriadMapInv = [
    0 | 1 | 2,
    3 | 4 | 5,
    6 | 7 | 8
];

type TriadIdx = 0 | 1 | 2;

type GetRowElement<Row extends SudokuRow, Idx extends AllColumns> =
    Row[TriadMap[Idx][0]][TriadMap[Idx][1]];

type GetColumn<Board extends SudokuBoard, Idx extends AllColumns> =
    GetRowElement<Board[number], Idx>;

type GetBlock<
  Board extends SudokuBoard,
  RowIdx extends TriadIdx,
  ColIdx extends TriadIdx
> = Board[TriadMapInv[RowIdx]][ColIdx][number];

type HasInvalid<Items extends Reindeer> = Reindeer extends Items ? 0 : 1;

type HasInvalidRows<
  Board extends SudokuBoard,
  Row extends AllRows = AllRows
> = Row extends any ? HasInvalid<Board[Row][number][number]> : never;

type HasInvalidColumns<
  Board extends SudokuBoard,
  Col extends AllColumns = AllColumns
> = Col extends any ? HasInvalid<GetColumn<Board, Col>> : never;

/** Included for completeness. May not be necessary. */
type HasInvalidBlocks<
  Board extends SudokuBoard,
  RowIdx extends TriadIdx = TriadIdx,
  ColIdx extends TriadIdx = TriadIdx
> = RowIdx extends any
  ? ColIdx extends any
    ? HasInvalid<GetBlock<Board, RowIdx, ColIdx>>
    : never
  : never;

type Validate<Board extends SudokuBoard> = (
    HasInvalidRows<Board>
    | HasInvalidColumns<Board>
    | HasInvalidBlocks<Board>
 ) extends 0 ? true : false;


//--- TEST ---//

import { Equal, Expect } from 'type-testing';

type test_sudoku_1_actual = Validate<[
//   ^?
  [['💨', '💃', '🦌'], ['☄️', '❤️', '🌩️'], ['🌟', '⚡', '🔴']],
  [['🌟', '⚡', '🔴'], ['💨', '💃', '🦌'], ['☄️', '❤️', '🌩️']],
  [['☄️', '❤️', '🌩️'], ['🌟', '⚡', '🔴'], ['💨', '💃', '🦌']],
  [['🦌', '💨', '💃'], ['⚡', '☄️', '❤️'], ['🔴', '🌩️', '🌟']],
  [['🌩️', '🔴', '🌟'], ['🦌', '💨', '💃'], ['⚡', '☄️', '❤️']],
  [['⚡', '☄️', '❤️'], ['🌩️', '🔴', '🌟'], ['🦌', '💨', '💃']],
  [['💃', '🦌', '💨'], ['❤️', '🌟', '☄️'], ['🌩️', '🔴', '⚡']],
  [['🔴', '🌩️', '⚡'], ['💃', '🦌', '💨'], ['❤️', '🌟', '☄️']],
  [['❤️', '🌟', '☄️'], ['🔴', '🌩️', '⚡'], ['💃', '🦌', '💨']]
]>;
type test_sudoku_1 = Expect<Equal<test_sudoku_1_actual, true>>;

type test_sudoku_2_actual = Validate<[
//   ^?
  [['🌩️', '💨', '☄️'], ['🌟', '🦌', '⚡'], ['❤️', '🔴', '💃']],
  [['🌟', '⚡', '❤️'], ['🔴', '💃', '☄️'], ['🌩️', '💨', '🦌']],
  [['🔴', '🦌', '💃'], ['💨', '❤️', '🌩️'], ['🌟', '⚡', '☄️']],
  [['❤️', '☄️', '🌩️'], ['💃', '⚡', '🔴'], ['💨', '🦌', '🌟']],
  [['🦌', '💃', '⚡'], ['🌩️', '🌟', '💨'], ['🔴', '☄️', '❤️']],
  [['💨', '🌟', '🔴'], ['🦌', '☄️', '❤️'], ['⚡', '💃', '🌩️']],
  [['☄️', '🔴', '💨'], ['❤️', '🌩️', '🦌'], ['💃', '🌟', '⚡']],
  [['💃', '❤️', '🦌'], ['⚡', '🔴', '🌟'], ['☄️', '🌩️', '💨']],
  [['⚡', '🌩️', '🌟'], ['☄️', '💨', '💃'], ['🦌', '❤️', '🔴']]
]>;
type test_sudoku_2 = Expect<Equal<test_sudoku_2_actual, true>>;

type test_sudoku_3_actual = Validate<[
//   ^?
  [['🦌', '🔴', '💃'], ['🌩️', '☄️', '💨'], ['⚡', '❤️', '🌟']],
  [['🌟', '⚡', '💨'], ['❤️', '💃', '🔴'], ['☄️', '🌩️', '🦌']],
  [['☄️', '🌩️', '❤️'], ['⚡', '🌟', '🦌'], ['💃', '🔴', '💨']],
  [['🌩️', '💃', '🔴'], ['🦌', '💨', '⚡'], ['🌟', '☄️', '❤️']],
  [['❤️', '☄️', '⚡'], ['💃', '🌩️', '🌟'], ['🦌', '💨', '🔴']],
  [['💨', '🌟', '🦌'], ['☄️', '🔴', '❤️'], ['🌩️', '💃', '⚡']],
  [['💃', '💨', '🌟'], ['🔴', '🦌', '☄️'], ['❤️', '⚡', '🌩️']],
  [['🔴', '❤️', '☄️'], ['🌟', '⚡', '🌩️'], ['💨', '🦌', '💃']],
  [['⚡', '🦌', '🌩️'], ['💨', '❤️', '💃'], ['🔴', '🌟', '☄️']]
]>;
type test_sudoku_3 = Expect<Equal<test_sudoku_3_actual, true>>;

type test_sudoku_4_actual = Validate<[
//   ^?
  [['💨', '💃', '🦌'], ['☄️', '❤️', '🌩️'], ['🌟', '⚡', '🔴']],
  [['🌟', '⚡', '🔴'], ['💨', '💃', '🦌'], ['☄️', '❤️', '🌩️']],
  [['☄️', '❤️', '🌩️'], ['🌟', '⚡', '🔴'], ['💨', '💃', '🦌']],
  [['🦌', '💨', '💃'], ['⚡', '☄️', '❤️'], ['🔴', '🌩️', '🌟']],
  [['🌩️', '🔴', '🌟'], ['🦌', '💨', '💃'], ['⚡', '☄️', '❤️']],
  [['⚡', '☄️', '❤️'], ['🌩️', '🔴', '🌟'], ['🦌', '💨', '💃']],
  [['💃', '🦌', '💨'], ['❤️', '🌟', '☄️'], ['⚡', '🔴', '🌟']],
  [['🔴', '🌩️', '⚡'], ['💃', '🦌', '💨'], ['❤️', '🌟', '☄️']],
  [['❤️', '🌟', '☄️'], ['🔴', '🌩️', '⚡'], ['💃', '🦌', '💨']]
]>;
type test_sudoku_4 = Expect<Equal<test_sudoku_4_actual, false>>;

type test_sudoku_5_actual = Validate<[
//   ^?
  [['🌩️', '💨', '☄️'], ['🌟', '🦌', '⚡'], ['❤️', '🔴', '💃']],
  [['🌟', '⚡', '❤️'], ['🔴', '💃', '☄️'], ['🌩️', '💨', '🦌']],
  [['🔴', '🦌', '💃'], ['💨', '❤️', '🌩️'], ['🌟', '⚡', '☄️']],
  [['❤️', '☄️', '🌩️'], ['💃', '⚡', '🔴'], ['💨', '🦌', '🌟']],
  [['🦌', '💃', '⚡'], ['🌩️', '🌟', '💨'], ['🔴', '☄️', '❤️']],
  [['💨', '🌟', '🔴'], ['🦌', '☄️', '❤️'], ['⚡', '💃', '🌩️']],
  [['☄️', '🔴', '💨'], ['❤️', '💃', '🦌'], ['💃', '🌟', '⚡']],
  [['💃', '❤️', '🦌'], ['⚡', '🔴', '🌟'], ['☄️', '🌩️', '💨']],
  [['⚡', '🌩️', '🌟'], ['☄️', '💨', '💃'], ['🦌', '❤️', '🔴']]
]>;
type test_sudoku_5 = Expect<Equal<test_sudoku_5_actual, false>>;

type test_sudoku_6_actual = Validate<[
//   ^?
  [['⚡', '🔴', '🌩️'], ['🦌', '❤️', '💨'], ['💨', '🌟', '☄️']],
  [['❤️', '🦌', '🌟'], ['💨', '🌟', '🔴'], ['💃', '⚡', '🌩️']],
  [['💨', '💃', '🌟'], ['☄️', '⚡', '🌩️'], ['🔴', '❤️', '🦌']],
  [['🦌', '⚡', '🔴'], ['❤️', '💃', '💨'], ['☄️', '🌩️', '🌟']],
  [['🌟', '🌩️', '💃'], ['⚡', '🔴', '☄️'], ['❤️', '🦌', '💨']],
  [['☄️', '💨', '❤️'], ['🌟', '🌩️', '🦌'], ['⚡', '💃', '🔴']],
  [['🌩️', '☄️', '💨'], ['💃', '🦌', '⚡'], ['🌟', '🔴', '❤️']],
  [['🔴', '❤️', '⚡'], ['🌩️', '☄️', '🌟'], ['🦌', '💨', '💃']],
  [['💃', '🌟', '🦌'], ['🔴', '💨', '❤️'], ['🌩️', '☄️', '⚡']]
]>;
type test_sudoku_6 = Expect<Equal<test_sudoku_6_actual, false>>;

type test_bad_column_0_board = [
  [['💨', '💃', '🦌'], ['☄️', '❤️', '🌩️'], ['🌟', '⚡', '🔴']],
  [['🌟', '⚡', '🔴'], ['💨', '💃', '🦌'], ['☄️', '❤️', '🌩️']],
  [['☄️', '❤️', '🌩️'], ['🌟', '⚡', '🔴'], ['💨', '💃', '🦌']],
  [['🦌', '💨', '💃'], ['⚡', '☄️', '❤️'], ['🔴', '🌩️', '🌟']],
  [['🌩️', '🔴', '🌟'], ['🦌', '💨', '💃'], ['⚡', '☄️', '❤️']],
  [['⚡', '☄️', '❤️'], ['🌩️', '🔴', '🌟'], ['🦌', '💨', '💃']],
  [['💃', '🦌', '💨'], ['❤️', '🌟', '☄️'], ['🌩️', '🔴', '⚡']],
  [['🔴', '🌩️', '⚡'], ['💃', '🦌', '💨'], ['❤️', '🌟', '☄️']],
  [['💨', '🌟', '☄️'], ['🔴', '🌩️', '⚡'], ['💃', '🦌', '❤️']]
];
type test_sudoku_7_actual = Validate<test_bad_column_0_board>;
type test_sudoku_7 = Expect<Equal<test_sudoku_7_actual, false>>;

/**
 * @note Only a stub!!!
 * Could quickly come up with a case where a block is bad while
 * all colums and rows are correct. Not sure if it is possible (?)
 */
type test_sudoku_bad_block_board = [
  [['💨', '💃', '🦌'], ['☄️', '❤️', '🌩️'], ['🌟', '⚡', '🔴']],
  [['🌟', '⚡', '🔴'], ['💨', '💃', '🦌'], ['☄️', '❤️', '🌩️']],
  [['☄️', '❤️', '🌩️'], ['🌟', '⚡', '🔴'], ['💨', '💃', '🦌']],
  [['🦌', '💨', '💃'], ['⚡', '☄️', '❤️'], ['🔴', '🌩️', '🌟']],
  [['🌩️', '🔴', '🌟'], ['🦌', '💨', '💃'], ['⚡', '☄️', '❤️']],
  [['⚡', '☄️', '❤️'], ['🌩️', '🔴', '🌟'], ['🦌', '💨', '💃']],
  [['💃', '🦌', '💨'], ['❤️', '🌟', '☄️'], ['🌩️', '🔴', '⚡']],
  [['🔴', '🌩️', '⚡'], ['💃', '🦌', '💨'], ['❤️', '🌟', '☄️']],
  [['❤️', '🌟', '☄️'], ['🔴', '🌩️', '⚡'], ['💃', '🦌', '💨']]
];

type test_sudoku_8_actual = Validate<test_sudoku_bad_block_board>;
// type test_sudoku_8 = Expect<Equal<test_sudoku_8_actual, false>>;
