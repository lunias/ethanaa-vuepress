(function(Test, test) {

  // Functional-1 > doubling

  function doubling(nums) {
    return nums.map((num) => num * 2);
  }

  test(doubling, [
    new Test([[1, 2, 3]], [2, 4, 6]),
    new Test([[6, 8, 6, 8, -1]], [12, 16, 12, 16, -2]),
    new Test([[]], [])
  ]);

  // Functional-1 > square

  function square(nums) {
    return nums.map((num) => num * num);
  }

  test(square, [
    new Test([[1, 2, 3]], [1, 4, 9]),
    new Test([[6, 8, -6, -8, 1]], [36, 64, 36, 64, 1]),
    new Test([[]], [])
  ]);

  // Functional-1 > addStar

  function addStar(strings) {
    return strings.map((s) => s + '*');
  }

  test(addStar, [
    new Test([["a", "bb", "ccc"]], ["a*", "bb*", "ccc*"]),
    new Test([["hello", "there"]], ["hello*", "there*"]),
    new Test([["*"]], ["**"])
  ]);

  // Functional-1 > copies3

  function copies3(strings) {
    return strings.map((s) => s.repeat(3));
  }

  test(copies3, [
    new Test([["a", "bb", "ccc"]], ["aaa", "bbbbbb", "ccccccccc"]),
    new Test([["24", "a", ""]], ["242424", "aaa", ""]),
    new Test([["hello", "there"]], ["hellohellohello", "theretherethere"])
  ]);

  // Functional-1 > moreY

  function moreY(strings) {
    return strings.map((s) => 'y' + s + 'y');
  }

  test(moreY, [
    new Test([["a", "b", "c"]], ["yay", "yby", "ycy"]),
    new Test([["hello", "there"]], ["yhelloy", "ytherey"]),
    new Test([["yay"]], ["yyayy"])
  ]);

  // Functional-1 > math1

  function math1(nums) {
    return nums.map((n) => (n + 1) * 10);
  }

  test(math1, [
    new Test([[1, 2, 3]], [20, 30, 40]),
    new Test([[6, 8, 6, 8, 1]], [70, 90, 70, 90, 20]),
    new Test([[10]], [110])
  ]);

  // Functional-1 > rightDigit

  function rightDigit(nums) {
    return nums.map((n) => {
      let nString = n.toString();
      let len = nString.length;
      if (len === 1) return n;
      return n % +(nString.slice(0, len - 1) + 0);
    });
  }

  test(rightDigit, [
    new Test([[1, 22, 93]], [1, 2, 3]),
    new Test([[16, 8, 886, 8, 1]], [6, 8, 6, 8, 1]),
    new Test([[10, 0]], [0, 0])
  ]);

  // Functional-1 > lower

  function lower(strings) {
    return strings.map((s) => s.toLowerCase());
  }

  test(lower, [
    new Test([["Hello", "Hi"]], ["hello", "hi"]),
    new Test([["AAA", "BBB", "ccc"]], ["aaa", "bbb", "ccc"]),
    new Test([["KitteN", "ChocolaTE"]], ["kitten", "chocolate"])
  ]);

  // Functional-1 > noX

  function noX(strings) {
    return strings.map((s) => s.replace(/x/g, ''));
  }

  test(noX, [
    new Test([["ax", "bb", "cx"]], ["a", "bb", "c"]),
    new Test([["xxax", "xbxbx", "xxcx"]], ["a", "bb", "c"]),
    new Test([["x"]], [""])
  ]);

})(TEST.Test, TEST.test);
