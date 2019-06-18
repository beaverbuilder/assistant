import { isUndefined } from "lodash";

export class Interceptor {
    constructor(fulfilled, rejected) {
        if(isUndefined(fulfilled)) {
            fulfilled = () => {};
        }
        if(isUndefined(rejected)) {
            rejected = () => {};
        }

        this.fulfilled = fulfilled;
        this.rejected = rejected;
    }
}

export class InterceptorManager {

    constructor() {
        this.handlers = [];
    }

    use(interceptor) {
        this.handlers.push(interceptor);
        return this.handlers.length - 1;
    }

    eject(id) {
        if (this.handlers[id]) {
            this.handlers[id] = null;
        }
    }
}
