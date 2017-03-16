
import { extendObservable, computed } from 'mobx';
import mobx from 'mobx';

class AreaStores {
    constructor() {
        extendObservable(this, {
            updateId: '',
            updateName: '',
            updateLatitude: '',
            updateLongitude: '',
            updateShortName: ''
        });
    }

    update(updateId, updateName, updateLatitude, updateLongitude) {
        this.updateId = updateId;
        this.updateName = updateName;
        this.updateLatitude = updateLatitude;
        this.updateLongitude = updateLongitude;
    }

    doUpdateName(updateName) {
        this.updateName = updateName;
    }

    doUpdateLat(updateLat) {
        this.updateLatitude = updateLat;
    }

    doUpdateLong(updateLong) {
        this.updateLongitude = updateLong;
    }

    doUpdateShortName(shortName) {
        this.updateShortName = shortName;
    }
}

export default AreaStores;
