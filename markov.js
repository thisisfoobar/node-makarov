/** Textual markov chain generator */

class MarkovMachine {
  /** build markov machine; read in text.*/

  constructor(text) {
    let words = text.split(/[ \r\n]+/);
    this.words = words.filter((c) => c !== "");
    this.makeChains(words);
  }

  /** set markov chains:
   *
   *  for text of "the cat in the hat", chains will be
   *  {"the": ["cat", "hat"], "cat": ["in"], "in": ["the"], "hat": [null]} */

  makeChains(words) {
    let chain = new Map();
    let keyWord;
    let valueWord;
    for (let i = 0; i < this.words.length; i++) {
      keyWord = this.words[i];
      valueWord = this.words[i + 1] || null;
      if (chain.has(keyWord)) chain.get(keyWord).push(valueWord);
      else chain.set(keyWord, [valueWord]);
    }
    this.chain = chain;
  }

  static choice(ar) {
    return ar[Math.floor(Math.random() * ar.length)];
  }

  /** return random text from chains */

  makeText(numWords = 100) {
    let keys = Array.from(this.chain.keys());
    let key = MarkovMachine.choice(keys);
    let result = [];

    while (result.length < numWords && key !== null) {
      result.push(key);
      key = MarkovMachine.choice(this.chain.get(key));
    }

    return result.join(" ");
  }
}

module.exports = {
  MarkovMachine,
};
