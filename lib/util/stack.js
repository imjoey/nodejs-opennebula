// nodejs-oca
// a Stack class representor
// (C) Joey Ma (majunjiev@gmail.com) 2012, Licened under the MIT-LICENSE

(function () {

  /**
   * an Stack object
   * @constructor
   */
  var Stack = function (array) {
    this.data = array || [];
  };

  Stack.prototype.push = function (value) {
    this.data.push(value);
  };

  Stack.prototype.pop = function () {
    return this.data.pop();
  };

  Stack.prototype.getLength = function () {
    return this.data.length;
  };

  Stack.prototype.indexOf = function (value) {
    if (typeof value === 'string' || typeof value === 'number') {
      for (var i in this.data) {
        if (this.data[i] === value) {
          return i;
        }
      }
    }
    return -1;
  };

}());