const COLUMN = {
  RESULT: 0,
  ASTERISK: 1,
  UNDER_SCORE: 2,
  TILDE: 3,
  BACKTICK: 4,
  OTHER: 5,
  SPACE: 6,
  NON_SPACE_CHAR: [0, 1, 2, 5, 6],
};

export const TYPE = {
  NONE: -1,
  BOLD: 28,
  UNDERLINE: 29,
  ITALIC: 30,
  STRIKE_TRHOUGH: 31,
  INLINE_CODE: 32,
  BLOCK_CODE: 33,
};

// Table Googlesheet: https://docs.google.com/spreadsheets/d/1tkLfkqbRNECsnSylZpozwkA_ivJAB_Cq0Fd44j1vHaM/edit?usp=sharing
export const table: number[][] = [
  /*                        TYPE                    *                    _                    ~                    `                OTHER                SPACE */
  /*  0 */ [-1, 1, 6, 15, 20, -1, -1],
  /*  1 */ [-1, 2, 11, 11, 11, 11, -1],
  /*  2 */ [-1, 3, 3, 3, 3, 3, -1],
  /*  3 */ [-1, 4, 3, 3, 3, 3, -1],
  /*  4 */ [-1, 5, -1, -1, -1, -1, -1],
  /*  5 */ [
    -1,
    TYPE.BOLD,
    TYPE.BOLD,
    TYPE.BOLD,
    TYPE.BOLD,
    TYPE.BOLD,
    TYPE.BOLD,
  ],
  /*  6 */ [-1, 13, 7, 13, 13, 13, -1],
  /*  7 */ [-1, 8, 8, 8, 8, 8, -1],
  /*  8 */ [-1, 8, 9, 8, 8, 8, -1],
  /*  9 */ [-1, -1, 10, -1, -1, -1, -1],
  /* 10 */ [
    -1,
    TYPE.UNDERLINE,
    TYPE.UNDERLINE,
    TYPE.UNDERLINE,
    TYPE.UNDERLINE,
    TYPE.UNDERLINE,
    TYPE.UNDERLINE,
  ],
  /* 11 */ [-1, 12, 11, 11, 11, 11, -1],
  /* 12 */ [
    -1,
    -1,
    TYPE.ITALIC,
    TYPE.ITALIC,
    TYPE.ITALIC,
    TYPE.ITALIC,
    TYPE.ITALIC,
  ],
  /* 13 */ [-1, 13, 14, 13, 13, 13, -1],
  /* 14 */ [
    -1,
    TYPE.ITALIC,
    -1,
    TYPE.ITALIC,
    TYPE.ITALIC,
    TYPE.ITALIC,
    TYPE.ITALIC,
  ],
  /* 15 */ [-1, -1, -1, 16, -1, -1, -1],
  /* 16 */ [-1, 17, 17, 17, 17, 17, -1],
  /* 17 */ [-1, 17, 17, 18, 17, 17, -1],
  /* 18 */ [-1, -1, -1, 19, -1, -1, -1],
  /* 19 */ [
    -1,
    TYPE.STRIKE_TRHOUGH,
    TYPE.STRIKE_TRHOUGH,
    TYPE.STRIKE_TRHOUGH,
    TYPE.STRIKE_TRHOUGH,
    TYPE.STRIKE_TRHOUGH,
    TYPE.STRIKE_TRHOUGH,
  ],
  /* 20 */ [-1, 21, 21, 21, 23, 21, -1],
  /* 21 */ [-1, 21, 21, 21, 22, 21, -1],
  /* 22 */ [
    -1,
    TYPE.INLINE_CODE,
    TYPE.INLINE_CODE,
    TYPE.INLINE_CODE,
    -1,
    TYPE.INLINE_CODE,
    TYPE.INLINE_CODE,
  ],
  /* 23 */ [-1, 25, 25, 25, 24, 25, -1],
  /* 24 */ [
    -1,
    TYPE.BLOCK_CODE,
    TYPE.BLOCK_CODE,
    TYPE.BLOCK_CODE,
    TYPE.BLOCK_CODE,
    TYPE.BLOCK_CODE,
    TYPE.BLOCK_CODE,
  ],
  /* 25 */ [-1, 25, 25, 25, 26, 25, -1],
  /* 26 */ [-1, -1, -1, -1, 27, -1, -1],
  /* 27 */ [
    -1,
    TYPE.INLINE_CODE,
    TYPE.INLINE_CODE,
    TYPE.INLINE_CODE,
    TYPE.INLINE_CODE,
    TYPE.INLINE_CODE,
    TYPE.INLINE_CODE,
  ],
  /* 28 */ [TYPE.BOLD, -1, -1, -1, -1, -1, -1],
  /* 29 */ [TYPE.UNDERLINE, -1, -1, -1, -1, -1, -1],
  /* 30 */ [TYPE.ITALIC, -1, -1, -1, -1, -1, -1],
  /* 31 */ [TYPE.STRIKE_TRHOUGH, -1, -1, -1, -1, -1, -1],
  /* 32 */ [TYPE.INLINE_CODE, -1, -1, -1, -1, -1, -1],
  /* 33 */ [TYPE.BLOCK_CODE, -1, -1, -1, -1, -1, -1],
];

export const typeOf = (char: string) => {
  switch (char) {
    case "*":
      return COLUMN.ASTERISK;
    case "_":
      return COLUMN.UNDER_SCORE;
    case "~":
      return COLUMN.TILDE;
    case "`":
      return COLUMN.BACKTICK;
    case " ":
      return COLUMN.SPACE;
    default:
      return COLUMN.OTHER;
  }
};

export const getToken = (
  buffer: string
): {
  type: number;
  token: string;
  start: number;
} => {
  if (buffer.length === 0)
    return { type: TYPE.NONE, token: "", start: buffer.length - 1 };
  let index = buffer.length - 1; // buffer index, reading backwards one by one
  let char = typeOf(buffer[index]); // type of current reading character
  let token = "";
  if (char === COLUMN.OTHER || char === COLUMN.SPACE) token = buffer[index];
  let state = table[0][char];
  if (state === -1)
    return { type: TYPE.NONE, token: token.slice(1), start: index + 1 };
  let type = table[state][0];
  if (type !== -1)
    return { type: type, token: token.slice(1), start: index + 1 };
  console.log(
    `index: ${index}, char: ${char}, token: ${token}, type: ${type}, state: ${state}`
  );

  while (index > 0) {
    index--;
    char = typeOf(buffer[index]);
    if (char === COLUMN.OTHER || char === COLUMN.SPACE)
      token = buffer[index] + token;
    state = table[state][char];
    if (state === -1)
      return { type: type, token: token.slice(1), start: index + 1 };
    type = table[state][0];
    if (type !== -1)
      return { type: type, token: token.slice(1), start: index + 1 };

    console.log(
      `index: ${index}, char: ${char}, token: ${token}, type: ${type}, state: ${state}`
    );
  }
  state = table[state][COLUMN.OTHER];
  if (state === -1) return { type: type, token: token, start: index };
  type = table[state][0];
  if (type !== -1) return { type: type, token: token, start: index };
  else return { type: TYPE.NONE, token: "", start: buffer.length - 1 };
};
