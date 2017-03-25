
import { extendObservable, computed } from 'mobx';
import mobx from 'mobx';

class FireHydrantStores {
    constructor() {
        extendObservable(this, {
            isShowInsertModal: false,
            isShowUpdateModal: false,
            fireHydrantTableData: [],
            updateData: {}
        });
    }

    updateFireHydrantTableData(data) {
        this.fireHydrantTableData.replace(data);
    }

}

export default FireHydrantStores;
