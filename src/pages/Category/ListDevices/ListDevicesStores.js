
import { extendObservable, computed } from 'mobx';
import mobx from 'mobx';
import _ from 'lodash';

class ListDevicesStores {
  constructor() {
    extendObservable(this, {
      sms: [
        { id: 1, phoneNo: "", name: "" },
        { id: 2, phoneNo: "", name: "" },
        { id: 3, phoneNo: "", name: "" },
        { id: 4, phoneNo: "", name: "" },
        { id: 5, phoneNo: "", name: "" },
        { id: 6, phoneNo: "", name: "" },
        { id: 7, phoneNo: "", name: "" },
        { id: 8, phoneNo: "", name: "" },
        { id: 9, phoneNo: "", name: "" },
        { id: 10, phoneNo: "", name: "" }
      ],
      currentIndex: 11
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

  reset() {
    this.sms.replace([
      { id: 1, phoneNo: "", name: "" },
      { id: 2, phoneNo: "", name: "" },
      { id: 3, phoneNo: "", name: "" },
      { id: 4, phoneNo: "", name: "" },
      { id: 5, phoneNo: "", name: "" },
      { id: 6, phoneNo: "", name: "" },
      { id: 7, phoneNo: "", name: "" },
      { id: 8, phoneNo: "", name: "" },
      { id: 9, phoneNo: "", name: "" },
      { id: 10, phoneNo: "", name: "" }

    ]);
    this.currentIndex = 11;
  }

}

export default ListDevicesStores;