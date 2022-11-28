export class ProtocolData<T> {
  #data: T[][] = [];
  #lookupMapArr: Record<string, number>[] = [];
  #hashFunc?: (arg0: T) => string = undefined;
  #collateFunc?: (arg0: T, arg1: T) => void = undefined;

  constructor(len: number, hashFunc: (arg0: T) => string, collateFunc: (arg0: T, arg1: T) => void) {
    for (let i = 0; i < len; i++) {
      this.#data.push([]);
      this.#lookupMapArr.push({});
    }

    this.#hashFunc = hashFunc;
    this.#collateFunc = collateFunc;
  }

  collate(arr: T[][]) {
    arr.forEach((data, index) => {
      data.forEach((item) => {
        if (!this.#hashFunc || !this.#collateFunc) return;

        const hash = this.#hashFunc(item);
        const pos = this.#lookupMapArr[index][hash];

        if (pos === undefined) {
          this.#data[index].push(item);

          this.#lookupMapArr[index][hash] = this.#data[index].length - 1;
        } else {
          this.#collateFunc(this.#data[index][pos], item);
        }
      });
    });
  }

  get data() {
    return this.#data;
  }
}
