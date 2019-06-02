import {Interceptor, InterceptorManager } from "../interceptors";

describe('Interceptor', () => {
    test('can create', () => {
        const i = new Interceptor((response) => {}, (error)=> {});
        expect(i).toBeDefined();
        expect(i.fulfilled).toBeInstanceOf(Function)
        expect(i.rejected).toBeInstanceOf(Function)
    })
})

describe('InterceptorManager', () => {

    test('can create', () => {
        const manager = new InterceptorManager();
        expect(manager).toBeDefined();
        expect(manager.handlers).toBeInstanceOf(Array);
        expect(manager.handlers.length).toBe(0);
    })

    test('can add Interceptor', () => {
        const manager = new InterceptorManager();
        const i = new Interceptor((response) => {}, (error)=> {});
        const interceptorId = manager.use(i);

        console.log(interceptorId, 'interceptor id');

        expect(interceptorId).toBe(0);
        expect(manager.handlers.length).toBe(1);

        console.log(manager.handlers, 'handlers');
    })

    test('can eject Interceptor', () => {

        const manager = new InterceptorManager();
        const i1 = new Interceptor((response) => {}, (error)=> {});
        const i2 = new Interceptor((response) => {}, (error)=> {});
        const i1_id = manager.use(i1);
        const i2_id = manager.use(i2);

        expect(manager.handlers.length).toBe(2);

        manager.eject(i1_id);

        expect(manager.handlers[i1_id]).toBe(null);
        expect(manager.handlers[i2_id]).toBeInstanceOf(Interceptor);
    });
});
