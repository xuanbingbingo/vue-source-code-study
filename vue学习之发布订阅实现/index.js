// 先写一个发布订阅系统
class EventHub {
  constructor(){
    this.hub = Object.create(null);
  }
  on(event,handler){
    if(!this.hub[event]) this.hub[event] = [];
    this.hub[event].push(handler);
  }
  emit(event,message){
    (this.hub[event] || []).forEach(handler => handler(message));
  }
  off(event,handler){
      const index = (this.hub[event] || []).findIndex(h => h === handler);
      if(index > -1) this.hub[event].splice(i,1);
      if(this.hub[event].length === 0) delete this.hub[event];
  }
}

// 编写Observer
class Observer{
  constructor(data){
    this.data = data;
    this.walk(data);
    this.eventHub = new EventHub();
  }
  walk(data){
    let val;
    for(let key in data){
      if(data.hasOwnProperty(key)){
        val = data[key];
        if(data[key] instanceof Object){
          new Observer(data[key]);
        }
        this.convert(key,val);
      }
    }
  }
  convert(key,val){
    let _this = this;
    Object.defineProperty(_this.data,key,{
      enumerable: true,
      configurable: true,
      get(){
        console.log("访问了",key);
        return val;
      },
      set(newVal){
        console.log("你设置了",key);
        console.log("新的值是",newVal);
        _this.eventHub.emit(key,newVal);
        val = newVal;
      }
    })
  }
  watch(key,callback){
    this.eventHub.on(key,callback);
  }
}

//使用
let data = {
  name:"lib",
  obj:{
    key:"1",
    value:"2"
  }
}
let app = new Observer(data);
app.watch("obj",(val) => {console.log("新值是",val)});

app.data.obj.key = "2";