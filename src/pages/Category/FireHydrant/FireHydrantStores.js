
import { extendObservable, computed } from 'mobx';
import mobx from 'mobx';

class FireHydrantStores {
    constructor() {
        extendObservable(this, {
           fireHydrantTableData: []
        });
    }

    updateFireHydrantTableData(data){
        this.fireHydrantTableData.replace(data);
    }

}

export default FireHydrantStores;
