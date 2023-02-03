class FileObject {}
class BaseClass {}
// class Clazz<T extends FileObject> extends BaseClass {
// }
interface Deserializer<T extends FileObject> {
  deserialize(arg0: string): T;
}

class SerializerManager {
  private serializers: Map<BaseClass, any> = new Map();
  getDeserializer<T extends FileObject>(arg0: { new (): T }): Deserializer<T> {
    return this.serializers.get(arg0);
  }

  register<T extends FileObject>(arg0: { new (): T }, arg1: Deserializer<T>) {
    this.serializers.set(arg0, arg1);
  }
}

class TestObject extends FileObject {
  private name: string = '';
  public getName(): string {
    return this.name;
  }
}
class TestObject2 extends FileObject {
  private age: number = 16;
  public getAge(): number {
    return this.age;
  }
}
class TestSerializer implements Deserializer<TestObject> {
  deserialize(arg0: string): TestObject {
    return new TestObject();
  }
}
class TestSerializer2 implements Deserializer<TestObject2> {
  deserialize(arg0: string): TestObject2 {
    return new TestObject2();
  }
}

const test = () => {
  const manager = new SerializerManager();
  manager.register(TestObject, new TestSerializer());
  manager.register(TestObject2, new TestSerializer2());
  const serializer = manager.getDeserializer(TestObject);
  console.log(serializer);
  const obj: TestObject = serializer.deserialize('');
};
test();
