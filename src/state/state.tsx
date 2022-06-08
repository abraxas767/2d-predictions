import { Atom, swap, deref } from "@dbeining/react-atom";


// STATE

export const appState = Atom.of({
    shouldUpdateData: false
});

export const modelState = Atom.of({
    activationFunction: 'sigmoid',
    layers: [],
    learningRate: 1,
    epochs: 35,
});

export const dataGenerationState = Atom.of({
    N: 100,
    dataFunction: 'ea3_func',
    variance: 0.3,
});

const trainingDataState = Atom.of({
    data: []
});


// ACTIONS
export const updateActivationFunction = (func: any)=>
    swap(modelState, state => ({
       ...state,
        activationFunction: func
    }));


// data generationstate ------
export const updateVariance = (variance: any)=>
    swap(dataGenerationState, state => ({
       ...state,
        variance: variance
    }));

export const updateN = (N: any)=>
    swap(dataGenerationState, state => ({
       ...state,
        N: N
    }));

export const updateDataFunction = (func: any) =>
    swap(dataGenerationState, state => ({
        ...state,
        dataFunction: func
    }));
// data generationstate ------

export const updateShouldUpdate = (val: any) =>
    swap(appState, state => ({
        ...state,
        shouldUpdateData: val
    }));
