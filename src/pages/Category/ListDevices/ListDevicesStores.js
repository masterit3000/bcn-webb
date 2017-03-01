
import { extendObservable, computed } from 'mobx';
import mobx from 'mobx';
import _ from 'lodash';

class ListDevicesStores {
  constructor() {
    extendObservable(this, {
      sms: [],
      currentIndex: 1
    });
  }

  add() {
    var clone = mobx.toJS(this.sms);
    clone.push({ id: this.currentIndex, phoneNo: "", name: "" });
    this.sms.replace(clone);
    this.currentIndex++;
  }

  update(row, cellName, cellValue) {
    var clone = mobx.toJS(this.sms);
    _.forEach(clone, function (value) {
      if (_.isEqual(value.id, row.id)) {
        value[cellName] = cellValue;
      }
    });
    this.sms.replace(clone);
  }

  reset(){
    this.sms.replace([]);
    this.currentIndex = 1;
  }

}

export default ListDevicesStores;