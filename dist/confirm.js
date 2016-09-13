'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _rx = require('rx');

var _rx2 = _interopRequireDefault(_rx);

var Confirm = (function () {
  function Confirm(robot) {
    _classCallCheck(this, Confirm);

    this.robot = robot;
    this.name = 'confirm-message-for-Hubot';
    this.pattern = {
      yes: /^y(es)?$/i,
      no: /^n(o)?$/i
    };
    this.message = {
      confirm: 'Are you sure? (y|yes|n|no)',
      cancelled: 'Cancelled'
    };
    this._initialize();
  }

  _createClass(Confirm, [{
    key: '_initialize',
    value: function _initialize() {
      var _this = this;

      this.subjectInput = new _rx2['default'].Subject();
      this.streamInput = this.subjectInput.asObservable().where(function (x) {
        return x && x.toString().length > 0;
      }).select(function (x) {
        return x.toString();
      }).share();
      // 全入力をストリームに流す
      this.robot.hear(/^.*$/, function (res) {
        _this.subjectInput.onNext(res.match[0].toString());
      });
    }
  }, {
    key: 'show',
    value: function show(res) {
      var _this2 = this;

      var subject = new _rx2['default'].Subject();
      var showConfirm = function showConfirm(counter) {
        // 3回再確認を行った場合キャンセル
        if (++counter > 3) {
          subject.onError(new Error());
          return;
        }
        res.send(_this2.message.confirm);
        // 直後の入力が y, yes であった場合: 削除実行
        _this2.streamInput.first().where(function (x) {
          return _this2.pattern.yes.test(x);
        }).subscribe(function (_) {
          subject.onNext(true);
        });
        // 直後の入力が n, no であった場合: 削除キャンセル
        _this2.streamInput.first().where(function (x) {
          return _this2.pattern.no.test(x);
        }).subscribe(function (_) {
          return subject.onError(new Error());
        });
        // 直後の入力が y, yes, n, no 以外であった場合: 再確認
        _this2.streamInput.first().where(function (x) {
          return !_this2.pattern.yes.test(x) && !_this2.pattern.no.test(x);
        }).subscribe(function (_) {
          return showConfirm(counter);
        });
      };
      showConfirm(0);
      return subject.asObservable()['catch'](function (e) {
        return res.send(_this2.message.cancelled);
      });
    }
  }]);

  return Confirm;
})();

exports['default'] = Confirm;
module.exports = exports['default'];