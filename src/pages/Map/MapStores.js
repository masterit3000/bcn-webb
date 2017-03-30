
import { extendObservable, computed } from 'mobx';
import mobx from 'mobx';

class MapStores {
    constructor() {
        extendObservable(this, {
           fireHydrantLat: 0,
           fireHydrantLong: 0
        });
    }


}

export default MapStores;
