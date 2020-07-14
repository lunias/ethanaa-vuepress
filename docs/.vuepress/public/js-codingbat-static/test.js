var TEST = (function() {

  var test = {};

  var numTests = 0;

  ////////////////////// Support Code //////////////////////

  test.Test = function(args, expected) {
    this.args = args;
    this.expected = expected;
  };

  test.test = async function(func, testArgs) {

    var funcName = func.name;
    var funcString = func.toString();

    var panel = document.createElement('div');
    panel.classList.add('panel');

    var panelHeading = document.createElement('div');
    panelHeading.classList.add('panel-heading');
    panelHeading.textContent = 'Excercise ' + numTests + ' (' + funcName + ')';

    var panelBody = document.createElement('div');
    panelBody.classList.add('panel-body');

    var results = document.createElement('ol');
    results.id = 'results-' + funcName;
    results.classList.add('list-group');

    panel.appendChild(panelHeading);
    panel.appendChild(panelBody);
    panelBody.appendChild(results);

    document.getElementById('results').appendChild(panel);

    var header = document.createElement('li');
    header.innerHTML = '<pre class="prettyprint lang-javascript">' + funcString + '</pre>';
    header.classList.add('list-group-item');
    results.appendChild(header);

    var failCount = 0;
    var hadSuccess = false;

    for (var i = 0; i < testArgs.length; i++) {

      var li = document.createElement('li');
      li.classList.add('list-group-item');

      try {

        var args = testArgs[i].args;
        var result = func.apply(this, args);
        var jsonResult = JSON.stringify(result);
        var jsonExpected = JSON.stringify(testArgs[i].expected);

        let argsPrint = '';
        for (let i = 0; i < args.length; i++) {
          argsPrint += JSON.stringify(args[i]);
          if (i < args.length - 1) argsPrint += ', ';
        }

        var resultHtml = funcName + '(' + argsPrint + ') { ... } ';

        if (jsonExpected === jsonResult) {

          resultHtml += '<span class="badge badge-success">' + jsonResult + '&nbsp;&nbsp;\u2714</span>';
          if (failCount == 0 && !hadSuccess) {
            panel.classList.add('panel-info');
            hadSuccess = true;
          }

        } else {

          resultHtml += '<span class="badge badge-error">' + jsonResult +
            ' ( Expected: ' + jsonExpected + ' )&nbsp;&nbsp;\u2718</span>';
          if (++failCount == 1) {
            panel.classList.add('panel-danger');
            if (hadSuccess) {
              panel.classList.remove('panel-info');
            }
          }
          li.classList.add('list-group-item-danger');
        }

        li.innerHTML = resultHtml;

      } catch (error) {
        if (++failCount == 1) {
          panel.classList.add('panel-danger');
          if (hadSuccess) {
            panel.classList.remove('panel-info');
          }
        }
        li.classList.add('list-group-item-danger');
        li.innerHTML = '<pre>' + error.stack + '</pre>';
      }

      results.appendChild(li);
    }

    if (failCount > 0 ) {
      panelHeading.textContent += ' - ' + failCount + ' Test Failure(s)';
    }

    await sleep((numTests++) * 10);
    panel.classList.add('fade');
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  return test;

}());
