(function(Test, test) {

  // Array-3 > maxSpan

  function maxSpan(nums) {
    let spanMap = nums.reduce((spans, num, i) => {
      num in spans ? spans[num].end = i
        : spans[num] = {start: i, end: i};
      return spans;
    }, {});

    return Object.values(spanMap).reduce((maxSpan, span) => {
      return Math.max(maxSpan, span.end - span.start + 1);
    }, 0);
  }

  test(maxSpan, [
    new Test([[1, 2, 1, 1, 3]], 4),
    new Test([[1, 4, 2, 1, 4, 1, 4]], 6),
    new Test([[3, 9]], 1),
    new Test([[]], 0),
    new Test([[1]], 1),
    new Test([[3, 3, 3]], 3)
  ]);

  // fixNums Helper

  function fixNums(nums, num1, num2) {
    let nonNums = nums.reduce((nonNums, num) => {
      if (num != num1 && num != num2) {
        nonNums.push(num);
      }
      return nonNums;
    }, []);

    let idx = 0;
    return nums.reduce((fixed, num, i, nums) => {
      fixed.push(num == num1 ? num1
                 : nums[i-1] == num1 ? num2
                 : nonNums[idx++]);
      return fixed;
    }, []);
  }

  // Array-3 > fix34

  function fix34(nums) {
    return fixNums(nums, 3, 4);
  }

  test(fix34, [
    new Test([[1, 3, 1, 4]], [1, 3, 4, 1]),
    new Test([[1, 3, 1, 4, 4, 3, 1]], [1, 3, 4, 1, 1, 3, 4]),
    new Test([[3, 2, 2, 4]], [3, 4, 2, 2])
  ]);

  // Array-3 > fix45

  function fix45(nums) {
    return fixNums(nums, 4, 5);
  }

  test(fix45, [
    new Test([[5, 4, 9, 4, 9, 5]], [9, 4, 5, 4, 5, 9]),
    new Test([[1, 4, 1, 5]], [1, 4, 5, 1]),
    new Test([[1, 4, 1, 5, 5, 4, 1]], [1, 4, 5, 1, 1, 4, 5])
  ]);

  // Array-3 > canBalance

  function canBalance(nums) {
    const sum = (a, b) => a + b;
    for (let i = 0; i < nums.length; i++) {
      let leftSum = nums.slice(0, i + 1).reduce(sum, 0);
      let rightSum =  nums.slice(i + 1, nums.length).reduce(sum, 0);
      if (leftSum === rightSum) return true;
    }
    return false;
  }

  test(canBalance, [
    new Test([[1, 1, 1, 2, 1]], true),
    new Test([[2, 1, 1, 2, 1]], false),
    new Test([[10, 10]], true),
    new Test([[1]], false)
  ]);

  // Array-3 > linearIn

  function linearIn(outer, inner) {
    for (let i = 0; i < inner.length; i++) {
      for (let j = i; j < outer.length; j++) {
        if (inner[i] < outer[j]) return false;
        if (inner[i] == outer[j]) break;
      }
    }
    return true;
  }

  test(linearIn, [
    new Test([[1, 2, 4, 6], [2, 4]], true),
    new Test([[1, 2, 4, 6], [2, 3, 4]], false),
    new Test([[1, 2, 4, 4, 6], [2, 4]], true),
    new Test([[-1, 0, 3, 3, 3, 10, 12], [-1, 10, 11]], false)
  ]);

  // Array-3 > squareUp

  function squareUp(n) {
    let result = [];
    for (let i = 0; i < n; i++) {
      a = new Array(n).fill(0);
      for (let j = n - 1; j >= n - i - 1; j--) {
        a[j] = n-j;
      }
      result.push(a);
    }
    return [].concat.apply([], result);
  }

  test(squareUp, [
    new Test([3], [0, 0, 1, 0, 2, 1, 3, 2, 1]),
    new Test([2], [0, 1, 2, 1]),
    new Test([4], [0, 0, 0, 1, 0, 0, 2, 1, 0, 3, 2, 1, 4, 3, 2, 1])
  ]);

  // Array-3 > seriesUp

  function seriesUp(n) {
    let a = [];
    for (let i = 0; i < n + 1; i++) {
      for (let j = 1; j < i + 1; j++) {
        a.push(j);
      }
    }
    return a;
  }

  test(seriesUp, [
    new Test([3], [1, 1, 2, 1, 2, 3]),
    new Test([4], [1, 1, 2, 1, 2, 3, 1, 2, 3, 4]),
    new Test([2], [1, 1, 2]),
    new Test([5], [1, 1, 2, 1, 2, 3, 1, 2, 3, 4, 1, 2, 3, 4, 5]),
    new Test([1], [1]),
    new Test([0], [])
  ]);

  // Array-3 > maxMirror

  function maxMirror(nums) {
    let slices = [];
    slices.push([]);
    for (let i = 1; i < nums.length + 1; i++) {
      slices.push([]);
      for (let j = 0; i + j <= nums.length; j++) {
        slices[i][j] = nums.slice(j, i + j);
      }
    }

    let hitCount = 0;
    for (let i = slices.length - 1; i > 0; i--) {
      for (let j = 0; j < slices[i].length; j++) {
        for (let k = nums.length - 1; k >= 0; k--) {
          if (nums[k] === slices[i][j][hitCount]) {
            if (++hitCount === i) return i;
          } else {
            hitCount = 0;
          }
        }
      }
    }

    return 0;
  }

  test(maxMirror, [
    new Test([[1, 2, 3, 8, 9, 3, 2, 1]], 3),
    new Test([[1, 2, 1, 4]], 3),
    new Test([[7, 1, 2, 9, 7, 2, 1]], 2),
    new Test([[2, 2]], 2),
    new Test([[1]], 1),
    new Test([[]], 0)
  ]);

  // Array-3 > countClumps

  function countClumps(nums) {
    let inClump = false;
    return nums.reduce((numClumps, num, i, nums) => {
      if (num === nums[i - 1]) {
        inClump = true;
      } else if (inClump) {
        inClump = false;
        return numClumps + 1;
      }
      return i === nums.length - 1 && inClump ? numClumps + 1
        : numClumps;
    }, 0);
  }

  test(countClumps, [
    new Test([[1, 2, 2, 3, 4, 4]], 2),
    new Test([[1, 1, 2, 1, 1]], 2),
    new Test([[1, 1, 1, 1, 1]], 1)
  ]);

})(TEST.Test, TEST.test);
