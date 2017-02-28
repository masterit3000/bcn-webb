
import { extendObservable, computed } from 'mobx';

class ListDevicesStores {
  constructor() {
    extendObservable(this, {
      sms: [],
      currentIndex: 1
    });
  }

  add() {
    var increaseIndex = this.currentIndex + 1;
    this.sms.push({ id: increaseIndex, phoneNo: "09022", name: "ten" });
  }

}

export default ListDevicesStores;