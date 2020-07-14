(function(Test, test) {

  // Warmup-1 > sleepIn

  function sleepIn(weekday, vacation) {
    return !weekday || vacation;
  }

  test(sleepIn, [
    new Test([false, false], true),
    new Test([true, false], false),
    new Test([false, true], true)
  ]);

  // Warmup-1 > monkeyTrouble

  function monkeyTrouble(aSmile, bSmile) {
    return aSmile && bSmile || !aSmile && !bSmile;
  }

  test(monkeyTrouble, [
    new Test([true, true], true),
    new Test([false, false], true),
    new Test([true, false], false)
  ]);

  // Warmup-1 > sumDouble

  function sumDouble(a, b) {
    return a === b ? (a + b) * 2 : a + b;
  }

  test(sumDouble, [
    new Test([1, 2], 3),
    new Test([3, 2], 5),
    new Test([2, 2], 8)
  ]);

  // Warmup-1 > diff21

  function diff21(n) {
    const av = Math.abs(n - 21);
    return n > 21 ? 2 * av : av;
  }

  test(diff21, [
    new Test([19], 2),
    new Test([10], 11),
    new Test([21], 0),
    new Test([25], 8)
  ]);

  // Warmup-1 > parrotTrouble

  function parrotTrouble(talking, hour) {
    return talking && (hour < 7 || hour > 20);
  }

  test(parrotTrouble, [
    new Test([true, 6], true),
    new Test([true, 7], false),
    new Test([false, 6], false)
  ]);

  // Warmup-1 > makes10

  function makes10(a, b) {
    return a == 10 || b == 10 || a + b == 10;
  }

  test(makes10, [
    new Test([9, 10], true),
    new Test([9, 9], false),
    new Test([1, 9], true)
  ]);

  // Warmup-1 > nearHundred

  function nearHundred(n) {
    return Math.abs(100 - n) <= 10
      || Math.abs(200 - n) <= 10;
  }

  test(nearHundred, [
    new Test([93], true),
    new Test([90], true),
    new Test([89], false),
    new Test([200], true),
    new Test([211], false)
  ]);

  // Warmup-1 > posNeg

  function posNeg(a, b, negative) {
    return negative ? a < 0 && b < 0
      : a < 0 != b < 0;
  }

  test(posNeg, [
    new Test([1, -1, false], true),
    new Test([-1, 1, false], true),
    new Test([-4, -5, true], true)
  ]);

  // Warmup-1 > notString

  function notString(str) {
    return str.match(/^not/) ? str
      : 'not ' + str;
  }

  test(notString, [
    new Test(['candy'], 'not candy'),
    new Test(['x'], 'not x'),
    new Test(['not bad'], 'not bad')
  ]);

  // Warmup-1 > missingChar

  function missingChar(str, n) {
    return str.slice(0, n) + str.slice(n + 1, str.length);
  }

  test(missingChar, [
    new Test(['kitten', 1], 'ktten'),
    new Test(['kitten', 0], 'itten'),
    new Test(['kitten', 4], 'kittn')
  ]);

  // Warmup-1 > frontBack

  function frontBack(str) {
    return str.length < 2 ? str
      : str[str.length - 1] + str.slice(1, str.length - 1) + str[0];
  }

  test(frontBack, [
    new Test(['code'], 'eodc'),
    new Test(['a'], 'a'),
    new Test(['ab'], 'ba')
  ]);

  // Warmup-1 > front3

  function front3(str) {
    return str.slice(0, 3).repeat(3);
  }

  test(front3, [
    new Test(['Java'], 'JavJavJav'),
    new Test(['Chocolate'], 'ChoChoCho'),
    new Test(['abc'], 'abcabcabc'),
    new Test(['ab'], 'ababab')
  ]);

  // Warmup-1 > backAround

  function backAround(str) {
    const c = str[str.length - 1];
    return c + str + c;
  }

  test(backAround, [
    new Test(['cat'], 'tcatt'),
    new Test(['Hello'], 'oHelloo'),
    new Test(['a'], 'aaa')
  ]);

  // Warmup-1 > or35

  function or35(n) {
    return n % 3 === 0 || n % 5 === 0;
  }

  test(or35, [
    new Test([3], true),
    new Test([10], true),
    new Test([8], false)
  ]);

  // Warmup-1 > front22

  function front22(str) {
    const s = str.slice(0, 2);
    return s + str + s;
  }

  test(front22, [
    new Test(['kitten'], 'kikittenki'),
    new Test(['Ha'], 'HaHaHa'),
    new Test(['abc'], 'ababcab')
  ]);

  // Warmup-1 > startHi

  function startHi(str) {
    return (str.match(/^hi/) || []).length === 1;
  }

  test(startHi, [
    new Test(['hi there'], true),
    new Test(['hi'], true),
    new Test(['hello hi'], false)
  ]);

  // Warmup-1 > icyHot

  function icyHot(t1, t2) {
    return (t1 > 100 && t2 < 0)
      || (t1 < 0 && t2 > 100);
  }

  test(icyHot, [
    new Test([120, -1], true),
    new Test([-1, 120], true),
    new Test([2, 120], false)
  ]);

  // Warmup-1 > in1020

  function in1020(a, b) {
    return (a >= 10 && a <= 20)
      || (b >= 10 && b <= 20);
  }

  test(in1020, [
    new Test([12, 99], true),
    new Test([21, 12], true),
    new Test([8, 99], false)
  ]);

  // Warmup-1 > hasTeen

  function hasTeen(a, b, c) {
    for (i of [a, b, c])
      if (i >= 13 && i <= 19) return true;
    return false;
  }

  test(hasTeen, [
    new Test([13, 20, 10], true),
    new Test([20, 19, 10], true),
    new Test([20, 10, 13], true),
    new Test([0, 0, 0], false)
  ]);

})(TEST.Test, TEST.test);
