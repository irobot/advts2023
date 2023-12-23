type Connect4Chips = '🔴' | '🟡';
type Connect4Cell = Connect4Chips | '  ';
type Connect4State = '🔴' | '🟡' | '🔴 Won' | '🟡 Won' | 'Draw';
type Red = '🔴';
type Gul = '🟡';
type Empty = '  ';

type AllColumns = 0 | 1 | 2 | 3 | 4 | 5 | 6;
type AllRows = Exclude<AllColumns, 6>;
type Connect4Row = [
    Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell, Connect4Cell
];
type Connect4Board = [
  Connect4Row,
  Connect4Row,
  Connect4Row,
  Connect4Row,
  Connect4Row,
  Connect4Row
];

type Connect4Game = { board: Connect4Board, state: Connect4Chips };

type EmptyBoard = [
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
  ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
];

type NewGame = {
  board: EmptyBoard;
  state: "🟡";
};

type ToggleChip<Chip extends Connect4Chips> = Chip extends Red ? Gul : Red;

type Replace<
  CellType,
  ValueType extends CellType,
  SrcType extends CellType[],
  Src extends SrcType,
  Idx extends number,
  Value extends ValueType,
  Acc extends CellType[] = []
> = Acc["length"] extends infer CurIdx extends number
  ? CurIdx extends Src["length"]
    ? Acc
    : Replace<
        CellType,
        ValueType,
        SrcType,
        Src,
        Idx,
        Value,
        [...Acc, CurIdx extends Idx ? Value : Src[CurIdx]]
      >
  : never;

type ReplaceChip<
  Row extends Connect4Row,
  Idx extends AllColumns,
  Chip extends Connect4Chips
> = Replace<Connect4Cell, Connect4Chips, Connect4Row, Row, Idx, Chip>;

type ReplaceRow<
  Board extends Connect4Board,
  Idx extends AllColumns,
  Row extends Connect4Row
> = Replace<Connect4Cell[], Connect4Cell[], Connect4Board, Board, Idx, Row>;

type PlaceChip<
  Board extends Connect4Board,
  Row extends AllRows,
  Col extends AllColumns,
  Chip extends Connect4Chips
> = ReplaceChip<Board[Row], Col, Chip> extends infer NewRow extends Connect4Row
  ? ReplaceRow<Board, Row, NewRow>
  : never;

type FindFreeRow<
  Board extends Connect4Row[],
  Col extends AllColumns
> = Board extends [
  ...infer StartRows extends Connect4Row[],
  infer LastRow extends Connect4Row
]
  ? LastRow[Col] extends Empty
    ? StartRows["length"]
    : FindFreeRow<StartRows, Col>
  : never;

type DropChip<
  Board extends Connect4Board,
  Col extends AllColumns,
  Chip extends Connect4Chips
> = FindFreeRow<Board, Col> extends infer Row extends AllRows
  ? PlaceChip<Board, Row, Col, Chip>
  : never;

type ScanRow<
  Row extends Connect4Cell[],
  Chip extends Connect4Chips,
  Found extends Connect4Chips[] = []
> = Found["length"] extends 4
  ? "win"
  : Row extends [
      infer Cell extends Connect4Cell,
      ...infer Rest extends Connect4Cell[]
    ]
  ? Cell extends Chip
    ? ScanRow<Rest, Chip, [...Found, Cell]>
    : ScanRow<Rest, Chip, []>
  : "";

type RowRollLeft<Arr extends unknown[]> = Arr extends [
  infer Head,
  ...infer Rest
]
  ? [...Rest, Head]
  : Arr;

type RowRollRight<Arr extends unknown[]> = Arr extends [
  ...infer Start,
  infer End
]
  ? [End, ...Start]
  : Arr;

type RollLeft<
  Arr extends unknown[][],
  Acc extends unknown[][] = []
> = Arr extends [
  infer Head extends unknown[],
  ...infer Tail extends unknown[][]
]
  ? RollLeft<Tail, [...Acc, RowRollLeft<Head>]>
  : Acc;

type RollRight<
  Arr extends unknown[][],
  Acc extends unknown[][] = []
> = Arr extends [
  infer Head extends unknown[],
  ...infer Tail extends unknown[][]
]
  ? RollRight<Tail, [...Acc, RowRollRight<Head>]>
  : Acc;

type TiltLeft<
  Arr extends unknown[][],
  Acc extends unknown[][] = []
> = Arr extends [
  ...infer Start extends unknown[][],
  infer End extends unknown[]
]
  ? TiltLeft<RollLeft<Start>, [End, ...Acc]>
  : Acc;

type TiltRight<
  Arr extends unknown[][],
  Acc extends unknown[][] = []
> = Arr extends [
  ...infer Start extends unknown[][],
  infer End extends unknown[]
]
  ? TiltRight<RollRight<Start>, [End, ...Acc]>
  : Acc;

type SampleColumn<
  Arr extends unknown[][],
  Col extends number,
  Acc extends unknown[] = []
> = Arr extends [
  infer Head extends unknown[],
  ...infer Tail extends unknown[][]
]
  ? SampleColumn<Tail, Col, [...Acc, Head[Col]]>
  : Acc;

type CheckRows<
  Board extends Connect4Board,
  Chip extends Connect4Chips
> = ScanRow<Board[AllRows], Chip>;

type CheckColumns<
  Board extends Connect4Board,
  Chip extends Connect4Chips
> = ScanRow<SampleColumn<Board, AllColumns>, Chip>;

type CheckLeftDiagonal<
  Board extends Connect4Board,
  Chip extends Connect4Chips
> = CheckColumns<TiltLeft<Board>, Chip>;

type CheckRightDiagonal<
  Board extends Connect4Board,
  Chip extends Connect4Chips
> = CheckColumns<TiltRight<Board>, Chip>;

type CheckDraw<Board extends Connect4Board> =
  Empty extends Board[number][number] ? 0 : 1;

type Connect4<
  Game extends Connect4Game,
  Col extends AllColumns
> = Game["state"] extends infer State
  ? State extends infer Chip extends Connect4Chips
    ? DropChip<
        Game["board"],
        Col,
        Chip
      > extends infer NewBoard extends Connect4Board
      ? {
          board: NewBoard;
          state: CheckDraw<NewBoard> extends 1
            ? "Draw"
            : "win" extends
                | CheckRows<NewBoard, State>
                | CheckColumns<NewBoard, State>
                | CheckLeftDiagonal<NewBoard, State>
                | CheckRightDiagonal<NewBoard, State>
            ? `${Chip} Won`
            : ToggleChip<Chip>;
        }
      : never
    : never
  : never;

//--- TEST ---//

import { Expect, Equal } from "type-testing";

type test_move1_actual = Connect4<NewGame, 0>;
//   ^?
type test_move1_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
  ];
  state: "🔴";
};
type test_move1 = Expect<Equal<test_move1_actual, test_move1_expected>>;

type test_move2_actual = Connect4<test_move1_actual, 0>
//   ^?
type test_move2_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
  ];
  state: "🟡";
};
type test_move2 = Expect<Equal<test_move2_actual, test_move2_expected>>;

type test_move3_actual = Connect4<test_move2_actual, 0>;
//   ^?
type test_move3_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
  ];
  state: "🔴";
};
type test_move3 = Expect<Equal<test_move3_actual, test_move3_expected>>;

type test_move4_actual = Connect4<test_move3_actual, 1>;
//   ^?
type test_move4_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "🔴", "  ", "  ", "  ", "  ", "  "],
  ];
  state: "🟡";
};
type test_move4 = Expect<Equal<test_move4_actual, test_move4_expected>>;

type test_move5_actual = Connect4<test_move4_actual, 2>;
//   ^?
type test_move5_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "🔴", "🟡", "  ", "  ", "  ", "  "],
  ];
  state: "🔴";
};
type test_move5 = Expect<Equal<test_move5_actual, test_move5_expected>>;

type test_move6_actual = Connect4<test_move5_actual, 1>;
//   ^?
type test_move6_expected = {
  board: [
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["  ", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "  ", "  ", "  ", "  ", "  ", "  "],
    ["🔴", "🔴", "  ", "  ", "  ", "  ", "  "],
    ["🟡", "🔴", "🟡", "  ", "  ", "  ", "  "],
  ];
  state: "🟡";
};
type test_move6 = Expect<Equal<test_move6_actual, test_move6_expected>>;

type test_red_win_actual = Connect4<
  {
    board: [
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🔴', '🔴', '🔴', '  ', '  ', '  ', '  '],
      ['🟡', '🔴', '🟡', '🟡', '  ', '  ', '  ']
    ];
    state: '🔴';
  },
  3
>;

type test_red_win_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '🔴', '🔴', '🔴', '  ', '  ', '  '],
    ['🟡', '🔴', '🟡', '🟡', '  ', '  ', '  ']
  ];
  state: '🔴 Won';
};

type test_red_win = Expect<Equal<test_red_win_actual, test_red_win_expected>>;

type test_yellow_win_actual = Connect4<
  {
    board: [
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🔴', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
      ['🔴', '  ', '🔴', '🔴', '  ', '  ', '  '],
      ['🟡', '  ', '🟡', '🟡', '  ', '  ', '  ']
    ];
    state: '🟡';
  },
  1
>;

type test_yellow_win_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🟡', '  ', '  ', '  ', '  ', '  ', '  '],
    ['🔴', '  ', '🔴', '🔴', '  ', '  ', '  '],
    ['🟡', '🟡', '🟡', '🟡', '  ', '  ', '  ']
  ];
  state: '🟡 Won';
};

type test_yellow_win = Expect<
  Equal<test_yellow_win_actual, test_yellow_win_expected>
>;

type test_diagonal_yellow_win_actual = Connect4<
  {
    board: [
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
      ['  ', '  ', '🟡', '🔴', '  ', '  ', '  '],
      ['🔴', '🟡', '🔴', '🔴', '  ', '  ', '  '],
      ['🟡', '🔴', '🟡', '🟡', '  ', '  ', '  ']
    ];
    state: '🟡';
  },
  3
>;

type test_diagonal_yellow_win_expected = {
  board: [
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '  ', '  ', '  ', '  '],
    ['  ', '  ', '  ', '🟡', '  ', '  ', '  '],
    ['  ', '  ', '🟡', '🔴', '  ', '  ', '  '],
    ['🔴', '🟡', '🔴', '🔴', '  ', '  ', '  '],
    ['🟡', '🔴', '🟡', '🟡', '  ', '  ', '  ']
  ];
  state: '🟡 Won';
};

type test_diagonal_yellow_win = Expect<
  Equal<test_diagonal_yellow_win_actual, test_diagonal_yellow_win_expected>
>;

type test_draw_actual = Connect4<
  {
    board: [
      ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '  '],
      ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
      ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
      ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
      ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
      ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴']
    ];
    state: '🟡';
  },
  6
>;

type test_draw_expected = {
  board: [
    ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
    ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
    ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
    ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴'],
    ['🟡', '🔴', '🔴', '🟡', '🟡', '🔴', '🟡'],
    ['🔴', '🟡', '🟡', '🔴', '🔴', '🟡', '🔴']
  ];
  state: 'Draw';
};

type test_draw = Expect<Equal<test_draw_actual, test_draw_expected>>;