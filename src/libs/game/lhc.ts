const config = [
  {
    title: "特码玩法",
    list: [
      {
        name: "特码投注",
        router: ["lhc", "tema"],
        lx: 1,
        type: "1",
      },
      {
        name: "特码A版",
        router: ["lhc", "tema"],
        lx: 1,
        type: "2",
      },
      {
        name: "特码B版",
        router: ["lhc_b", "tema", { id: 16 }],
        lx: 1,
        type: "3",
      },
      {
        name: "生肖投注",
        router: ["lhc", "tema"],
        lx: 2,
      },
      {
        name: "特码双面",
        router: ["lhc", "tema"],
        type: "tm",
        lx: 55,
      },
      {
        name: "总肖投注",
        router: ["lhc", "tema"],
        lx: 46,
      },
      {
        name: "半波投注",
        router: ["lhc", "ptxw"],
        lx: 41,
      },
      {
        name: "半半波色",
        router: ["lhc", "ptxw"],
        lx: 42,
      },
      {
        name: "波色投注",
        router: ["lhc", "tema"],
        lx: 3,
      },
      {
        name: "七色波投注",
        router: ["lhc", "tema"],
        lx: 54,
      },
      {
        name: "特码头数",
        router: ["lhc", "tema"],
        lx: 12,
      },
      {
        name: "特码尾数",
        router: ["lhc", "tema"],
        lx: 11,
      },
      {
        name: "四肖中特",
        router: ["lhc", "tema"],
        type: "4",
        lx: 48,
      },
      {
        name: "五肖中特",
        router: ["lhc", "tema"],
        type: "5",
        lx: 48,
      },
      {
        name: "六肖中特",
        router: ["lhc", "tema"],
        type: "6",
        lx: 48,
      },
      {
        name: "特串投注",
        router: ["lhc", "tema"],
        lx: 43,
      },
      {
        name: "五行投注",
        router: ["lhc", "tema"],
        lx: 6,
      },
      {
        name: "五门投注",
        router: ["lhc", "tema"],
        lx: 8,
      },
      {
        name: "家禽野兽",
        router: ["lhc", "tema"],
        lx: 55,
      },
      {
        name: "尾数双面",
        router: ["lhc", "tema"],
        type: "ws",
        lx: 55,
      },
      {
        name: "合数双面",
        router: ["lhc", "tema"],
        type: "hs",
        lx: 55,
      },
      {
        name: "总分双面",
        router: ["lhc", "tema"],
        type: "zf",
        lx: 55,
      },
      {
        name: "龙虎庄",
        router: ["lhc", "tema"],
        lx: 56,
      },
    ],
  },
  {
    title: "正码玩法",
    list: [
      {
        name: "正一特",
        router: ["lhc", "pingma"],
        lx: 51,
        type: "1",
      },
      {
        name: "正二特",
        router: ["lhc", "pingma"],
        lx: 51,
        type: "2",
      },
      {
        name: "正三特",
        router: ["lhc", "pingma"],
        lx: 51,
        type: "3",
      },
      {
        name: "正四特",
        router: ["lhc", "pingma"],
        lx: 51,
        type: "4",
      },
      {
        name: "正五特",
        router: ["lhc", "pingma"],
        lx: 51,
        type: "5",
      },
      {
        name: "正六特",
        router: ["lhc", "pingma"],
        lx: 51,
        type: "6",
      },
      {
        name: "正一混合",
        router: ["lhc", "pingma"],
        lx: 52,
        type: "1",
      },
      {
        name: "正二混合",
        router: ["lhc", "pingma"],
        lx: 52,
        type: "2",
      },
      {
        name: "正三混合",
        router: ["lhc", "pingma"],
        lx: 52,
        type: "3",
      },
      {
        name: "正四混合",
        router: ["lhc", "pingma"],
        lx: 52,
        type: "4",
      },
      {
        name: "正五混合",
        router: ["lhc", "pingma"],
        lx: 52,
        type: "5",
      },
      {
        name: "正六混合",
        router: ["lhc", "pingma"],
        lx: 52,
        type: "6",
      },
      {
        name: "正肖投注",
        router: ["lhc", "pingma"],
        lx: 53,
      },
      {
        name: "二中特平",
        router: ["lhc", "pingma"],
        lx: 45,
      },
      {
        name: "平一中一",
        router: ["lhc", "pingma"],
        type: "1",
        lx: 15,
      },
      {
        name: "平二中二",
        router: ["lhc", "pingma"],
        type: "2",
        lx: 16,
      },
      {
        name: "平三中二",
        router: ["lhc", "pingma"],
        type: "32",
        lx: 18,
      },
      {
        name: "平三中三",
        router: ["lhc", "pingma"],
        type: "3",
        lx: 17,
      },
      {
        name: "平四中四",
        router: ["lhc", "pingma"],
        type: "4",
        lx: 29,
      },
    ],
  },
  {
    title: "平特肖尾玩法",
    list: [
      {
        name: "平特一肖",
        router: ["lhc", "ptxw"],
        type: "1",
        lx: 19,
      },
      {
        name: "平特二肖",
        router: ["lhc", "ptxw"],
        type: "2",
        lx: 20,
      },
      {
        name: "平特三肖",
        router: ["lhc", "ptxw"],
        type: "3",
        lx: 21,
      },
      {
        name: "平特四肖",
        router: ["lhc", "ptxw"],
        type: "4",
        lx: 22,
      },
      {
        name: "平特五肖",
        router: ["lhc", "ptxw"],
        type: "5",
        lx: 28,
      },
      {
        name: "平特一尾",
        router: ["lhc", "ptxw"],
        type: "1",
        lx: 23,
      },
      {
        name: "平特二尾",
        router: ["lhc", "ptxw"],
        type: "2",
        lx: 24,
      },
      {
        name: "平特三尾",
        router: ["lhc", "ptxw"],
        type: "3",
        lx: 25,
      },
      {
        name: "平特四尾",
        router: ["lhc", "ptxw"],
        type: "4",
        lx: 26,
      },
      {
        name: "平特五尾",
        router: ["lhc", "ptxw"],
        type: "5",
        lx: 27,
      },
    ],
  },
  {
    title: "自选不中玩法",
    list: [
      {
        name: "买五不中",
        router: ["lhc", "zxbz"],
        type: "5",
        lx: 30,
      },
      {
        name: "买六不中",
        router: ["lhc", "zxbz"],
        type: "6",
        lx: 31,
      },
      {
        name: "买七不中",
        router: ["lhc", "zxbz"],
        type: "7",
        lx: 32,
      },
      {
        name: "买八不中",
        router: ["lhc", "zxbz"],
        type: "8",
        lx: 33,
      },
      {
        name: "买九不中",
        router: ["lhc", "zxbz"],
        type: "9",
        lx: 34,
      },
      {
        name: "买十不中",
        router: ["lhc", "zxbz"],
        type: "10",
        lx: 35,
      },
      {
        name: "十一不中",
        router: ["lhc", "zxbz"],
        type: "11",
        lx: 36,
      },
      {
        name: "十二不中",
        router: ["lhc", "zxbz"],
        type: "12",
        lx: 37,
      },
      {
        name: "十五不中",
        router: ["lhc", "zxbz"],
        type: "15",
        lx: 38,
      },
    ],
  },
]
export default config

const red = [1, 2, 7, 8, 12, 13, 18, 19, 23, 24, 29, 30, 34, 35, 40, 45, 46]
const blue = [3, 4, 9, 10, 14, 15, 20, 25, 26, 31, 36, 37, 41, 42, 47, 48]
const green = [5, 6, 11, 16, 17, 21, 22, 27, 28, 32, 33, 38, 39, 43, 44, 49]

export { red, blue, green }

