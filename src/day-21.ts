type TicTacToeChip = '❌' | '⭕';
type TicTacToeEndState = '❌ Won' | '⭕ Won' | 'Draw';
type TicTacToeState = TicTacToeChip | TicTacToeEndState;
type TicTacToeEmptyCell = '  '
type TicTacToeCell = TicTacToeChip | TicTacToeEmptyCell;
type TicTacToeYPositions = 'top' | 'middle' | 'bottom';
type TicTacToeXPositions = 'left' | 'center' | 'right';
type TicTacToePositions = `${TicTacToeYPositions}-${TicTacToeXPositions}`;
type TicTacToeRow = [TicTacToeCell, TicTacToeCell, TicTacToeCell];
/** Ensure a board has 3x3 cells and is not just any nested array of cells */
type TicTactToeBoard = [TicTacToeRow, TicTacToeRow, TicTacToeRow];

type TicTacToeGame = {
  board: TicTactToeBoard;
  state: TicTacToeState;
};

type EmptyBoard = [
  ['  ', '  ', '  '], 
  ['  ', '  ', '  '], 
  ['  ', '  ', '  ']
];

type NewGame = {
  board: EmptyBoard;
  state: '❌';
};

/** Fill a board one cell at a time */
type Add<
  Board extends TicTacToeCell[][],
  Cell extends TicTacToeCell
> = Board extends [
  ...infer FirstRows extends TicTacToeCell[][],
  infer LastRow extends TicTacToeCell[]
]
  ? LastRow["length"] extends 3
    ? [...FirstRows, LastRow, [Cell]]
    : [...FirstRows, [...LastRow, Cell]]
  : [[Cell]];

type MakeIndex<T extends string, Idx extends { [K in T]: 0 | 1 | 2 }> = Idx;

type TicTacToeY = MakeIndex<TicTacToeYPositions, {
  top: 0, middle: 1, bottom: 2
}>;

type TicTacToeX = MakeIndex<TicTacToeXPositions, {
  left: 0, center: 1, right: 2
}>;

/** Sample the board at position Pos */
type Sample<
  Board extends TicTactToeBoard,
  Pos extends TicTacToePositions
> = Pos extends `${infer Y extends TicTacToeYPositions}-${infer X extends TicTacToeXPositions}`
  ? Board[TicTacToeY[Y]][TicTacToeX[X]]
  : never;

type RowNamesArr = ["top", "middle", "bottom"];
type ColNamesArr = ["left", "center", "right"];

type LastRowNames = ["", ...RowNamesArr];
type NextRowNames = RowNamesArr;
type NextColNames = ColNamesArr;

/**
 * Given a partially constructed board, here would the next cell go?
 * @example [["  ", "  "]] would give us "top-right",
 *  whereas [["  ", "  ", "  "]] results in "middle-left"
 **/
type GetNextPos<Board extends TicTacToeCell[][]> = Board extends [
  ...infer _,
  infer L extends TicTacToeCell[]
]
  ? L["length"] extends 3
    ? Board["length"] extends 3
      ? "<STOP>"
      : `${NextRowNames[Board["length"]]}-left`
    : `${LastRowNames[Board["length"]]}-${NextColNames[L["length"]]}`
  : "top-left";

/**
 * Place a chip at a given position by recursively recreating
 * the board cell by cell
 **/
type PlaceChip<
  Board extends TicTactToeBoard,
  Pos extends TicTacToePositions,
  Chip extends TicTacToeChip,
  NewBoard extends TicTacToeCell[][] = []
> = GetNextPos<NewBoard> extends "<STOP>"
  ? NewBoard
  : Pos extends GetNextPos<NewBoard>
  ? PlaceChip<Board, Pos, Chip, Add<NewBoard, Chip>>
  : PlaceChip<
      Board,
      Pos,
      Chip,
      Add<NewBoard, Sample<Board, GetNextPos<NewBoard>>>
    >;

type ToggleChip<Chip extends TicTacToeChip> = Chip extends "⭕" ? "❌" : "⭕";

type WinRow<
  Board extends TicTactToeBoard,
  Pos extends TicTacToePositions,
  Chip extends TicTacToeChip
> = Pos extends `${infer Row extends TicTacToeYPositions}-${infer _}`
  ? Sample<Board, `${Row}-${TicTacToeXPositions}`> extends Chip
    ? true
    : never
  : never;

type WinCol<
  Board extends TicTactToeBoard,
  Pos extends TicTacToePositions,
  Chip extends TicTacToeChip
> = Pos extends `${infer _}-${infer Col extends TicTacToeXPositions}`
  ? Sample<Board, `${TicTacToeYPositions}-${Col}`> extends Chip
    ? true
    : never
  : never;

/** Test if incident row or column is a win (we don't handle diagonals) */
type MoveWins<
  Board extends TicTactToeBoard,
  Pos extends TicTacToePositions,
  Chip extends TicTacToeChip
> = WinCol<Board, Pos, Chip> | WinRow<Board, Pos, Chip>;

/** Are all cells filled with chips (not empty)? */
type IsFull<
  Board extends TicTactToeBoard,
  A extends TicTacToePositions = TicTacToePositions
> = TicTacToeEmptyCell extends Sample<Board, A> ? false : true;

type UpdateGame<
  NextBoard extends TicTactToeBoard,
  Move extends TicTacToePositions,
  State extends TicTacToeState
> = {
  board: NextBoard;
  state: State extends TicTacToeChip
    ? true extends MoveWins<NextBoard, Move, State>
      ? `${State} Won`
      : true extends IsFull<NextBoard>
      ? "Draw"
      : ToggleChip<State>
    : State;
};

type MakeAMove<
  Board extends TicTactToeBoard,
  Move extends TicTacToePositions,
  State extends TicTacToeState
> = Sample<Board, Move> extends TicTacToeEmptyCell
  ? State extends TicTacToeChip
    // State is a chip
    ? UpdateGame<PlaceChip<Board, Move, State>, Move, State>
    // The game has already ended
    : { board: Board; state: State }
  // We're trying to put a chip in a non-empty cell
  : { board: Board; state: State };

type TicTacToe<
  G extends TicTacToeGame,
  Move extends TicTacToePositions
> = MakeAMove<G["board"], Move, G["state"]>;


// --- TEST ---//

import { Equal, Expect } from 'type-testing';

type test_move1_actual = TicTacToe<NewGame, 'top-center'>;
//   ^?
type test_move1_expected = {
  board: [
    [ '  ', '❌', '  ' ],
    [ '  ', '  ', '  ' ],
    [ '  ', '  ', '  ' ]
  ];
  state: '⭕';
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = TicTacToe<test_move1_actual, 'top-left'>;
//   ^?
type test_move2_expected = {
  board: [
    ['⭕', '❌', '  '], 
    ['  ', '  ', '  '], 
    ['  ', '  ', '  ']];
  state: '❌';
}
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = TicTacToe<test_move2_actual, 'middle-center'>;
//   ^?
type test_move3_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '  ', '  ', '  ' ]
  ];
  state: '⭕';
};
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = TicTacToe<test_move3_actual, 'bottom-left'>;
//   ^?
type test_move4_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '⭕', '  ', '  ' ]
  ];
  state: '❌';
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;


type test_x_win_actual = TicTacToe<test_move4_actual, 'bottom-center'>;
//   ^?
type test_x_win_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '⭕', '❌', '  ' ]
  ];
  state: '❌ Won';
};
type test_x_win = Expect<Equal<test_x_win_actual, test_x_win_expected>>;

type type_move5_actual = TicTacToe<test_move4_actual, 'bottom-right'>;
//   ^?
type type_move5_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '  ', '❌', '  ' ],
    [ '⭕', '  ', '❌' ]
  ];
  state: '⭕';
};
type test_move5 = Expect<Equal<type_move5_actual, type_move5_expected>>;

type test_o_win_actual = TicTacToe<type_move5_actual, 'middle-left'>;
//   ^?
type test_o_win_expected = {
  board: [
    [ '⭕', '❌', '  ' ],
    [ '⭕', '❌', '  ' ],
    [ '⭕', '  ', '❌' ]
  ];
  state: '⭕ Won';
};

// invalid move don't change the board and state
type test_invalid_actual = TicTacToe<test_move1_actual, 'top-center'>;
//   ^?
type test_invalid_expected = {
  board: [
    [ '  ', '❌', '  ' ],
    [ '  ', '  ', '  ' ],
    [ '  ', '  ', '  ' ]
  ];
  state: '⭕';
};
type test_invalid = Expect<Equal<test_invalid_actual, test_invalid_expected>>;

type test_before_draw = {
  board: [
    ['⭕', '❌', '⭕'], 
    ['⭕', '❌', '❌'], 
    ['❌', '⭕', '  ']];
  state: '⭕';
}
type test_draw_actual = TicTacToe<test_before_draw, 'bottom-right'>;
//   ^?
type test_draw_expected = {
  board: [
    ['⭕', '❌', '⭕'], 
    ['⭕', '❌', '❌'], 
    ['❌', '⭕', '⭕']];
  state: 'Draw';
}
type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;