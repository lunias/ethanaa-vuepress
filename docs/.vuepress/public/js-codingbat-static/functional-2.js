(function(Test, test) {

  // Functional-2 > noNeg

  function noNeg(nums) {
    return nums.filter((n) => n >= 0);
  }

  test(noNeg, [
    new Test([[1, -2]], [1]),
    new Test([[-3, -3, 3, 3]], [3, 3]),
    new Test([[-1, -1, -1]], [])
  ]);

  // Functional-2 > no9

  function no9(nums) {
    return nums.filter((n) => !n.toString().endsWith('9'));
  }

  test(no9, [
    new Test([[1, 2, 19]], [1, 2]),
    new Test([[9, 19, 29, 3]], [3]),
    new Test([[1, 2, 3]], [1, 2, 3])
  ]);

  // Functional-2 > noTeen

  function noTeen(nums) {
    return nums.filter((n) => n < 13 || n > 19);
  }

  test(noTeen, [
    new Test([[12, 13, 19, 20]], [12, 20]),
    new Test([[1, 14, 1]], [1, 1]),
    new Test([[15]], [])
  ]);

  // Functional-2 > noZ

  function noZ(strings) {
    return strings.filter((s) => !s.includes('z'));
  }

  test(noZ, [
    new Test([["aaa", "bbb", "aza"]], ["aaa", "bbb"]),
    new Test([["hziz", "hzello", "hi"]], ["hi"]),
    new Test([["hello", "howz", "are", "youz"]], ["hello", "are"])
  ]);

  // Functional-2 > noLong

  function noLong(strings) {
    return strings.filter((s) => s.length < 4);
  }

  test(noLong, [
    new Test([["this", "not", "too", "long"]], ["not", "too"]),
    new Test([["a", "bbb", "cccc"]], ["a", "bbb"]),
    new Test([["cccc", "cccc", "cccc"]], [])
  ]);

  // Functional-2 > noYY

  function noYY(strings) {
    return strings.map((s) => s + 'y')
      .filter((s) => !s.includes('yy'));
  }

  test(noYY, [
    new Test([["a", "b", "c"]], ["ay", "by", "cy"]),
    new Test([["a", "b", "cy"]], ["ay", "by"]),
    new Test([["xx", "ya", "zz"]], ["xxy", "yay", "zzy"])
  ]);

  // Functional-2 > two2

  function two2(nums) {
    return nums.map((n) => n * 2)
      .filter((s) => !s.toString().endsWith('2'));
  }

  test(two2, [
    new Test([[1, 2, 3]], [4, 6]),
    new Test([[2, 6, 11]], [4]),
    new Test([[0]], [0])
  ]);

})(TEST.Test, TEST.test);
