import logger from 'redux-logger'
import { createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware, { END } from 'redux-saga'
import rootReducer from './reducers'
import rootSaga from './sagas'

const configureStore = () => {

    const sagaMiddleware = createSagaMiddleware();

    let middleware = [
        applyMiddleware(sagaMiddleware)
    ];

    if(process.env.NODE_ENV === 'development'){
        middleware = [
            applyMiddleware(sagaMiddleware, logger)
        ]
    }

    const store = createStore(
        rootReducer,
        compose(...middleware)
    );

    sagaMiddleware.run(rootSaga);
    store.close = () => store.dispatch(END);

    return store

};

export default configureStore