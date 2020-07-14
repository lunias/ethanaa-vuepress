# js-codingbat

This is a very simple project for checking your answers to codingbat exercises implemented in JavaScript

Screenshot:

![ScreenShot](https://raw.github.com/lunias/js-codingbat/master/screenshot.png)

Example of how to write answers to the exercises and test them:

```javascript
(function(Test, test) {

  // Warmup-1 > sleepIn

  var sleepInTests = [
    new Test([false, false], true),
    new Test([true, false], false),
    new Test([false, true], true)
  ];

  function sleepIn(weekday, vacation) {
    return !weekday || vacation;
  }

  test(sleepIn, sleepInTests);

  // Warmup-1 > monkeyTrouble

  var monkeyTroubleTests = [
    new Test([true, true], true),
    new Test([false, false], true),
    new Test([true, false], false)
  ];

  function monkeyTrouble(aSmile, bSmile) {
    return aSmile && bSmile || !aSmile && !bSmile;
  }

  test(monkeyTrouble, monkeyTroubleTests);

})(TEST.Test, TEST.test);
```

### Stuff used to make this:

 * [codingbat.com (java)](http://codingbat.com/java) for excercises
 * [getbootstrap.com](http://getbootstrap.com/) for styling
