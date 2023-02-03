class RefrenceObj {
  name: string;
  constructor(name: string) {
    this.name = name;
  }
}
class TransObject {
  name: string = '';
  names: RefrenceObj[] = [];
  clone(): TransObject {
    const newLocal = new TransObject();
    newLocal.name = this.name;
    return newLocal;
  }
}
class TransObj {
  original: any;
  clone: any;
  constructor(original: any, preview: any) {
    this.original = original;
    this.clone = preview;
  }
}
class TransactionScope {
  rollback() {
    if (this.transList == undefined) {
      throw new Error('事务已经结束。');
    }
    this.transList.forEach((t) => {
      Object.assign(t.clone, t.original);
    });
    this.transList = undefined;
  }
  transList: TransObj[] | undefined = [];
  commit() {
    if (this.transList == undefined) {
      throw new Error('事务已经结束。');
    }
    this.transList.forEach((t) => {
      Object.assign(t.original, t.clone);
    });
    this.transList = undefined;
  }
  update(
    data: TransObject,
    arg1: (cloneObj: TransObject) => void
  ): TransObject {
    if (this.transList == undefined) {
      throw new Error('事务已经结束。');
    }
    const clone: TransObject = data.clone();
    arg1(clone);
    this.transList.push(new TransObj(data, clone));
    return clone;
  }
}
class TransactionObjectManager {
  beginTransaction() {
    return new TransactionScope();
  }
  transactionManager: TransactionManager = new TransactionManager();
}

class TransactionManager {}

const transObjManager = new TransactionObjectManager();

//业务代码开始
const scope = transObjManager.beginTransaction();

let data: TransObject = new TransObject();
data.name = '测试';
data.names.push(new RefrenceObj('d'));
const dataArr: TransObject[] = [];
dataArr.push(data);

const data1 = scope.update(dataArr[0], (cloneObj) => {
  cloneObj.name = '测试2';
  cloneObj.names.push(new RefrenceObj('a'));
  cloneObj.names.push(new RefrenceObj('b'));
  cloneObj.names.push(new RefrenceObj('b'));
});
console.log(data1);
//业务代码结束
scope.rollback();
console.log(data1);
console.log(dataArr);
