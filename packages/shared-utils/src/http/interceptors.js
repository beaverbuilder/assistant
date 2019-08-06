export class InterceptorManager {

    constructor() {
        this.handlers = [];
    }

    use(fulfilled, rejected) {
        this.handlers.push({
            fulfilled,
            rejected
        });

        return this.handlers.length - 1;
    }

    eject(id) {
        if (this.handlers[id]) {
            this.handlers[id] = null;
        }
    }
}
