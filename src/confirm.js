'use strict';

import Rx from 'rx';

export default class Confirm {
  constructor(robot) {
    this.robot = robot;
    this.name = 'confirm-message-for-Hubot';
    this.pattern = {
      yes: /^y(es)?$/i,
      no: /^n(o)?$/i,
    };
    this.message = {
      confirm: 'Are you sure? (y|yes|n|no)',
      cancelled: 'Cancelled',
    };
    this._initialize();
  }

  _initialize() {
    this.subjectInput = new Rx.Subject;
    this.streamInput = this.subjectInput.asObservable().where(x => x && x.toString().length > 0).select(x => x.toString()).share();
    // 全入力をストリームに流す
    this.robot.hear(
      /^.*$/,
      (res) => {
        this.subjectInput.onNext(res.match[0].toString());
      }
    );
  }

  show(res) {
    const subject = new Rx.Subject;
    let showConfirm = (counter) => {
      // 3回再確認を行った場合キャンセル
      if (++counter > 3) {
        subject.onError(new Error());
        return;
      }
      res.send(this.message.confirm);
      // 直後の入力が y, yes であった場合: 削除実行
      this.streamInput.first().where(x => this.pattern.yes.test(x)).subscribe(
        (_) => {
          subject.onNext(true);
        }
      );
      // 直後の入力が n, no であった場合: 削除キャンセル
      this.streamInput.first().where(x => this.pattern.no.test(x)).subscribe(_ => subject.onError(new Error()));
      // 直後の入力が y, yes, n, no 以外であった場合: 再確認
      this.streamInput.first().where(x => !this.pattern.yes.test(x) && !this.pattern.no.test(x)).subscribe(_ => showConfirm(counter));
    };
    showConfirm(0);
    return subject.asObservable().catch(e => res.send(this.message.cancelled));
  }
}
