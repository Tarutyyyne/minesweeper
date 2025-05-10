'use client';

import { useState } from 'react';
import styles from './page.module.css';

//爆弾があるかどうかをtrue,falseを引数に与えて数値に変換する関数
const isBombThere = (isthere: boolean): number => {
  return isthere === true ? 1 : 0;
};

// const initialExecute = (
//   userInputs: number[][],
//   newBombMap: number[][],
//   fn: (newBombMap: number[][]) => number[][],
// ) => {
//   if (userInputs.flat().filter((userInputs) => userInputs === isBombThere(false)).length === 0) {
//     //ここに配列にランダムに爆弾をいれる
//     const randomX: number = Math.floor(Math.random() * 9);
//     const randomY: number = Math.floor(Math.random() * 9);
//     console.log(randomX, randomY);
//     newBombMap[randomX][randomY] = isBombThere(true);
//   }
//   fn(newBombMap);
// };

const makeIndex = (x: number, y: number): number => {
  return y * 9 + x;
};

//初めてのクリックで爆弾を配置する関数
// const createBombMap = (
//   x: number,
//   y: number,
//   userInputs: number[][],
//   bombMap: number[][],
// ): number[][] => {
//   //xとyをもとにuseInput.flat()のindexを生成
//   const makeIndex = (x: number, y: number): number => {
//     return y * 9 + x;
//   };
//   const bombArray: number[] = bombMap.flat();
//   const reviveBombMap: number[][] = [];
//   //一次元のbombArrayにランダムに1を入れる
//   // const generateBombArray = (): number[][] => {
//   //   const bombArray: number[] = bombMap.flat(); //ランダムに処理
//   //   for (let i = 0; i < 10; i++) {
//   //     const randomX: number = Math.floor(Math.random() * 9);
//   //     const randomY: number = Math.floor(Math.random() * 9);
//   //     bombArray[makeIndex(randomX, randomY)] = isBombThere(true);
//   //   }
//   //   if (bombArray[makeIndex(x, y)] === isBombThere(false)) {
//   //     const reviveBombMap: number[][] = [];
//   //     for (let j = 0; j < 9; j++) {
//   //       reviveBombMap.push(bombArray.slice(j * 9, (j + 1) * 9));
//   //     }
//   //     return reviveBombMap;
//   //   } else {
//   //     return generateBombArray();
//   //   }
//   //userInputsの要素が全て0ならばそれは初回と同義
//   if (userInputs.flat().filter((userInputs) => userInputs === isBombThere(false)).length === 0) {
//   }
// };
export default function Home() {
  const [userInputs, setUserInputs] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const newUserInputs = structuredClone(userInputs);
  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const newBombMap: number[][] = structuredClone(bombMap);

  const clickCell = (
    clickX: number,
    clickY: number,
    userInputs: number[][],
    newUserInputs: number[][],
    newBombMap: number[][],
  ) => {
    //newBoardをいじるだけ
    const countInputs: number = userInputs
      .flat()
      .filter((userInputs) => userInputs === isBombThere(false)).length;
    //if文の中は一回だけ実行
    if (countInputs === 90) {
      //clickX,clickYを0とした配列をつくりたいのでこれはその差分
      const zeroMeasure: number = makeIndex(clickX, clickY);
      //randomX, randomYのリストを取得するためのプロセス
      const randomIndexArray: number[] = Array.from(
        { length: bombMap.flat().length - 1 },
        (_, index) => index + 1,
      ).filter((index) => index !== zeroMeasure);
      console.log(randomIndexArray);
      const copyRandomIndexArray: number[] = [];
      for (let j = 0; j < 80; j++) {
        const shuffleIndex = Math.floor(Math.random() * randomIndexArray.length);
        copyRandomIndexArray.push(randomIndexArray[shuffleIndex]);
        randomIndexArray.splice(shuffleIndex, 1);
      }
      const randomIndex: number[] = copyRandomIndexArray.splice(0, 10);
      // console.log(randomIndex);
      for (let k = 0; k < 10; k++) {
        const randomY = randomIndex[k] % 9;
        const randomX = Math.floor(randomIndex[k] / 9);
        console.log(randomX, randomY);
        newBombMap[randomY][randomX] = isBombThere(true);
      }
    }
    setBombMap(newBombMap);
    newUserInputs[clickY][clickX] = 1;
    setUserInputs(newUserInputs);
  };

  return (
    <div className={styles.container}>
      <div className={styles.userInputs}>
        {bombMap.map((row, clickY) =>
          row.map((column, clickX) => (
            <div
              className={styles.cell}
              style={{ backgroundPosition: '-420px' }}
              key={`${clickX}-${clickY}`}
              onClick={() => clickCell(clickX, clickY, userInputs, newUserInputs, newBombMap)}
            >
              {column === isBombThere(true) ? isBombThere(true) : isBombThere(false)}
            </div>
          )),
        )}
      </div>
    </div>
  );
}

//#TODOとりあえずonclickで実装いづれはmouseDownとmouseUpで動作を分ける
