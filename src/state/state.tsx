import { Atom, swap, deref } from "@dbeining/react-atom";

interface layerInterface {
    useBias: boolean,
    unitCount: number,
    id: string,
    editable: boolean,
}

// STATE

export const appState = Atom.of({
    shouldUpdateData: false
});

export const modelState = Atom.of({
    activationFunction: 'sigmoid',
    optimizer: 'adam',
    layers: [
        { useBias: true, editable: false, unitCount: 1, id: 'input' },
        { useBias: true, editable: false, unitCount: 1, id: 'output' },
    ],
    learningRate: 1,
    layerCount: 2,
    uCount: 2,
    epochs: 35,
});

export const dataGenerationState = Atom.of({
    N: 100,
    dataFunction: 'ea3_func',
    variance: 0.3,
});

export const trainingDataState = Atom.of({
    data: []
});


// ACTIONS


export const updateTrainingDataState = (data: any)=>
    swap(trainingDataState, state => ({
       ...state,
        data: data
    }));

// model State
export const addLayer = (layer: layerInterface)=>
    swap(modelState, (state:any) => {
        let x = state.layers;
        let outputLayer = x.splice(x.length - 1);
        x.push(layer);
        x.push(outputLayer[0]);
       return ({
           ...state,
           layers: x
       })
    })


export const deleteLayer = (id: string)=>
    swap(modelState, (state:any) => {
        let x = state.layers.map((lay: any) =>{
            if(lay.id !== id){return lay;}
        })
        const indexUndefined = x.indexOf(undefined);
        if (indexUndefined > -1) {
            x.splice(indexUndefined, 1);
        }
       return ({
           ...state,
           layers: x
       })
    })

export const updateLayer = (layer: layerInterface) =>
    swap(modelState, (state:any) => {
        if(isNaN(layer.unitCount)){layer.unitCount = 0}
        let x = state.layers.map((lay:any)=>{
            if(lay.id === layer.id){
                lay.useBias = layer.useBias;
                lay.unitCount = layer.unitCount;
            }
            return lay;
        });

       return ({
           ...state,
           layers: x
       })
    })


export const updateActivationFunction = (func: any)=>
    swap(modelState, state => ({
       ...state,
        activationFunction: func
    }));

export const updateLayerCount = (inc: number)=>
    swap(modelState, state => ({
       ...state,
        layerCount: state.layerCount + inc
    }));


export const updateUCount = (inc: number)=>
    swap(modelState, state => ({
       ...state,
        uCount: 3,
    }));

export const updateOptimizer = (func: string)=>
    swap(modelState, state => ({
       ...state,
        optimizer: func
    }));

export const updateLearningRate = (val: number)=>
    swap(modelState, state => ({
       ...state,
        learningRate: val
    }));

export const updateEpochCount = (val: number)=>
    swap(modelState, state => ({
       ...state,
        epochs: val
    }));
// model State

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

export const clearDataGenerationState = () =>
    swap(dataGenerationState, state => ({
        N: 100,
        dataFunction: 'ea3_func',
        variance: 0.3
    }));
// data generationstate ------


// appState
export const updateShouldUpdate = (val: any) =>
    swap(appState, state => ({
        ...state,
        shouldUpdateData: val
    }));
// appState
