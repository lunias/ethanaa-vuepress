(function(Test, test) {

  // String-3 > countYZ

  function countYZ(str) {
    return str.split(/[^a-z]/i).reduce(
      (count, word) => {
        let matches = word.match(/(?:y|z)$/i);
        return matches ? count + matches.length : count;
      }, 0);
  }

  test(countYZ, [
    new Test(['fez day'], 2),
    new Test(['day fez'], 2),
    new Test(['day fyyyz'], 2),
    new Test(['DAY abc XYZ'], 2),
    new Test(['zxyx'], 0),
    new Test(['day:yak'], 1),
    new Test(['yak'], 0),
    new Test(['zzz yyy:asdf zb yvY'], 3),
    new Test(['y2bz'], 2)
  ]);

  // String-3 > withoutString

  function withoutString(base, remove) {
    return base.replace(new RegExp(remove, 'g'), '');
  }

  test(withoutString, [
    new Test(['Hello there', 'llo'], 'He there'),
    new Test(['Hello there', 'e'], 'Hllo thr'),
    new Test(['Hello there', 'x'], 'Hello there')
  ]);

  // String-3 > equalIsNot

  function equalsIsNot(str) {
    return str.match(/is/g).length
      === str.match(/not/g).length;
  }

  test(equalsIsNot, [
    new Test(['This is not'], false),
    new Test(['This is notnot'], true),
    new Test(['noisxxnotyynotxisi'], true)
  ]);

  // String-3 > gHappy

  function gHappy(str) {
    for (let i = 0; i < str.length; i++) {
      if (str[i] === 'g'
          && str[i - 1] !== 'g'
          && str[i + 1] !== 'g') return false;
    }
    return true;
  }

  test(gHappy, [
    new Test(['xxggxx'], true),
    new Test(['xxgxx'], false),
    new Test(['xxggyygxx'], false)
  ]);

  // String-3 > countTriple

  function countTriple(str) {
    return [...str].reduce((count, c, i, str) => {
      if (str[i - 1] === c && str[i + 1] === c)
        return count + 1;
      return count;
    }, 0);
  }

  test(countTriple, [
    new Test(['abcXXXabc'], 1),
    new Test(['xxxabyyyycd'], 3),
    new Test(['a'], 0)
  ]);

  // String-3 > sumDigits

  function sumDigits(str) {
    return (str.match(/[0-9]/g) || [])
      .reduce((a, b) => +a + +b, 0);
  }

  test(sumDigits, [
    new Test(['aa1bc2d3'], 6),
    new Test(['aa11b33'], 8),
    new Test(['Chocolate'], 0)
  ]);

  // String-3 > sameEnds

  function sameEnds(str) {
    let same = '', j = 0;
    for (let i = Math.ceil(str.length / 2); i < str.length; i++) {
      if (str[i] === str[j]) {
        same += str[j++];
      } else if (j > 0) {
        j = 0;
        same = '';
      }
    }
    return same;
  }

  test(sameEnds, [
    new Test(['abXYab'], 'ab'),
    new Test(['xx'], 'x'),
    new Test(['xxx'], 'x'),
    new Test(['xxxx'], 'xx'),
    new Test([''], ''),
    new Test(['x'], '')
  ]);

  // String-3 > mirrorEnds

  function mirrorEnds(str) {
    let mirror = '';
    for (let i = 0; i < str.length; i++) {
      if (str[i] !== str[str.length - i - 1]) return mirror;
      mirror += str[i];
    }
    return mirror;
  }

  test(mirrorEnds, [
    new Test(['abXYZba'], 'ab'),
    new Test(['abca'], 'a'),
    new Test(['aba'], 'aba'),
    new Test(['x'], 'x')
  ]);

  // String-3 > maxBlock

  function maxBlock(str) {
    let max = 0, count = 0;
    for (let i = 0; i < str.length; i++) {
      str[i] === str[i - 1] ? max = Math.max(++count, max)
        : count = 1;
    }
    return max;
  }

  test(maxBlock, [
    new Test(['hoopla'], 2),
    new Test(['abbCCCddBBBxx'], 3),
    new Test([''], 0)
  ]);

  // String-3 > sumNumbers

  function sumNumbers(str) {
    return (str.match(/[0-9]+/g) || [])
      .reduce((a, b) => +a + +b, 0);
  }

  test(sumNumbers, [
    new Test(['abc123xyz'], 123),
    new Test(['aa11b33'], 44),
    new Test(['7 11'], 18),
    new Test([''], 0),
    new Test(['Chocolate'], 0)
  ]);

  // String-3 > notReplace

  function notReplace(str) {
    return str.replace(/\bis\b/g, 'is not');
  }

  test(notReplace, [
    new Test(['is test'], 'is not test'),
    new Test(['is-is'], 'is not-is not'),
    new Test(['This is right'], 'This is not right'),
    new Test(['crisis'], 'crisis')
  ]);

  // String-? > countChars

  function countChars(str) {
    return [...str].reduce((counts, c) => {
      counts[c] = (counts[c] || 0) + 1;
      return counts;
    }, {});
  }

  test(countChars, [
    new Test(['ethan'], {'e': 1, 't': 1, 'h': 1, 'a': 1, 'n': 1}),
    new Test(['abba'], {'a': 2, 'b': 2}),
    new Test(['possessionlessness'], {'p': 1, 'o': 2, 's': 8, 'e': 3, 'i': 1, 'n': 2, 'l': 1})
  ]);

})(TEST.Test, TEST.test);
