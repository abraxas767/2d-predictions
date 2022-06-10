import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import * as tfvis from '@tensorflow/tfjs-vis';
import * as tf from '@tensorflow/tfjs';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Layer from '../components/Layer/Layer';
import Modal from '@mui/material/Modal';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import {
    updateShouldUpdate,
    updateActivationFunction,
    updateDataFunction,
    updateOptimizer,
    updateVariance,
    addLayer,
    updateUCount,
    updateLayerCount,
    updateEpochCount,
    updateTrainingDataState,
    updateLearningRate,
    updateN } from '../state/state';
import { useAtom } from '@dbeining/react-atom';
import {
    modelState,
    dataGenerationState,
    appState,
    trainingDataState } from '../state/state';


function y(x: any) {return (x + 0.8) * (x + 0.2) * (x - 0.3) * (x - 0.6);}
function y2(x: any) {return x**2}
function noise(val: any) {return parseFloat(val + (randn_bm(-0.3, 0.3, 1)));}

function randn_bm(min: any, max: any, skew: any) {
  let u = 0, v = 0;
  while(u === 0) u = Math.random() //Converting [0,1) to (0,1)
  while(v === 0) v = Math.random()
  let num = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v )
  num = num / 10.0 + 0.5 // Translate to 0 -> 1
  if (num > 1 || num < 0)
    num = randn_bm(min, max, skew) // resample between 0 and 1 if out of range
  else{
    num = Math.pow(num, skew) // Skew
    num *= max - min // Stretch to fill range
    num += min // offset to min
  }
  return num
}


function generateUID() {
    // I generate the UID from two parts here
    // to ensure the random number provide enough bits.
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    let x = ("000" + firstPart.toString(36)).slice(-3);
    let y = ("000" + secondPart.toString(36)).slice(-3);
    return x + y;
}

function createTrainingSamples(N = 5, range = {max: 1, min: -1}, func: any, noiseFunc: any) {
    // create array with lenght N and initialize it with
    // N values in given range evenly.
    return Array.apply(null, Array(N)).map(function(x, i){
    const frac = (range.max - range.min) / N;
    const xVal  = parseFloat((range.min + ((frac * i) + frac / 2)).toFixed(3));
    const yVal = noise(parseFloat(func(xVal).toFixed(3)));
    return {x: xVal, y: yVal};
  });
}


function createModel(layers: any, activation: string) {

    // Create a sequential model
    const model = tf.sequential();

    // remove input layer
    let inputLayer = layers.shift();
    model.add(tf.layers.dense({
        inputShape: [1],
        units: inputLayer.unitCount,
        useBias: inputLayer.useBias
    }));


    layers.forEach((layer: any) => {
        const lay = {
            units: layer.unitCount,
            useBias: layer.useBias,
        }
        model.add(tf.layers.dense(lay));
    });

    return model;
}

function convertToTensor(data: any) {
    return tf.tidy(() => {
        // Step 1. Shuffle the data
        tf.util.shuffle(data);

        // Step 2. Convert data to Tensor
        const inputs = data.map((d: any) => d.x);
        const labels = data.map((d: any) => d.y);

        const inputTensor = tf.tensor2d(inputs, [inputs.length, 1]);
        const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

        //Step 3. Normalize the data to the range 0 - 1 using min-max scaling
        const inputMax = inputTensor.max();
        const inputMin = inputTensor.min();
        const labelMax = labelTensor.max();
        const labelMin = labelTensor.min();

        const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin));
        const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin));

        return {
            inputs: normalizedInputs,
            labels: normalizedLabels,
            // Return the min/max bounds so we can use them later.
            inputMax,
            inputMin,
            labelMax,
            labelMin,
        }
    });
}

interface TrainingArgs {
    model: any,
    inputs: any,
    labels: any,
    optimizer: string,
    epochs: number,
}

async function trainModel(args: TrainingArgs, container: any){
    // Prepare the model for training.
    args.model.compile({
        optimizer: tf.train.adam(),
        loss: tf.losses.meanSquaredError,
        metrics: ['mse'],
    });

    const batchSize = 32;
    const epochs = args.epochs;

    const res = await args.model.fit(args.inputs, args.labels, {
        batchSize,
        epochs,
        shuffle: true,
        callbacks: tfvis.show.fitCallbacks(
        container,
        ['mse'],
        )
    });
    console.log(res)
    return res;
}


function DataVisualisation(props: any) {

    const functions: any = {
        'ea3_func': y,
        'x_squared' : y2,
    };

    const divRef = React.useRef<HTMLDivElement>(null);
    const div2Ref = React.useRef<HTMLDivElement>(null);

    const {
        activationFunction,
        optimizer,
        layers,
        learningRate,
        epochs,
        layerCount,
        uCount } = useAtom(modelState);

    const { data } = useAtom(trainingDataState);

    const { N, dataFunction, variance } = useAtom(dataGenerationState);
    const { shouldUpdateData } = useAtom(appState);
    const f: any = functions[dataFunction];
    const addLayerHandler = () => {
        updateLayerCount(1);
        updateUCount(3);
        addLayer({ id: generateUID(), unitCount: 3, useBias: true, editable: true });
    }


    const setupModel = () => {
        // define architecture
        const model = createModel(layers, 'relu');
        // prepare data
        const tensorData = convertToTensor(data);
        const {inputs, labels} = tensorData;
        //train model
        const args: TrainingArgs = {
            model: model,
            inputs: inputs,
            labels: labels,
            optimizer: 'not implemented',
            epochs: epochs,
        }
        trainModel(args, div2Ref.current);
        console.log("trained");
    }


    const layerDisplay = layers.map((layer) => {
        return <Layer key={layer.id} editable={layer.editable} useBias={layer.useBias} unitCount={layer.unitCount} id={layer.id}/>
    });

    // MODAL
    const [ modalOpen, setModalOpen ] = React.useState(false);
    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        minHeight: 400,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
    };
    // MODAL

    const handleActivationFunctionChange = (event: SelectChangeEvent) => {
        updateActivationFunction(event.target.value);
    }

    React.useEffect(()=> {
        // GENERATE TRAINING SAMPLES
        const samples = createTrainingSamples(N, {max:1,min:-1}, f, noise);
        // VISUALISATION
        const data = { values: samples, series: ['x > label'] };
        const opts = { width: 500, height: 300 };
        if(divRef.current && shouldUpdateData){
            tfvis.render.scatterplot(divRef.current, data, opts);
            updateTrainingDataState(samples);
            updateShouldUpdate(false);
        }
    });


    let display = 'flex';
    if(!props.show) {display = 'none';}


    return (<div>
        <Container sx={{ display: display, width: '1000px' }}>
            <Box sx={{marginTop: '80px', boxShadow: '3px 3px 7px 7px rgba(0,0,0,0.05)'}}>
                <h3>Training Data</h3>
                <div ref={divRef} className="plot1"></div>
                <div ref={div2Ref} className="plot2"></div>
            </Box>




            <Container sx={{width: '400px', boxShadow: '3px 3px 7px 7px rgba(0,0,0,0.05)'}}>
                <h3>model setup</h3>

                <Box>
                    <FormControl fullWidth>
                        <InputLabel id="activation-label">Activation Function</InputLabel>
                        <Select
                            labelId="activation-label"
                            id="af-label"
                            value={activationFunction}
                            label="Activation Function"
                            onChange={handleActivationFunctionChange}
                        >
                            <MenuItem value={'ReLU'}>ReLU</MenuItem>
                            <MenuItem value={'sigmoid'}>sigmoid</MenuItem>
                            <MenuItem value={'tanh'}>tanh</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ marginTop: '10px' }}>
                    <FormControl fullWidth>
                        <InputLabel id="optimizer-label">Optimizer</InputLabel>
                        <Select
                            labelId="optimizer-label"
                            id="op-label"
                            value={optimizer}
                            label="optimizer"
                            onChange={(event: SelectChangeEvent) => updateOptimizer(event.target.value)}
                        >
                            <MenuItem value={'adam'}>adam</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{ marginTop: '15px', display: 'flex', justifyContent: 'space-around'}}>
                    <FormControl variant="standard" sx={{marginRight: '10px'}}>
                        <InputLabel sx={{marginLeft: '16px', top: '-8px'}} htmlFor="component-outlined">learningrate</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            value={learningRate}
                            onChange={(event: any) => updateLearningRate(event.target.value)}
                            label="learningrate"
                        />
                    </FormControl>

                    <FormControl variant="standard">
                        <InputLabel sx={{marginLeft: '16px', top: '-8px'}} htmlFor="component-outlined">epochs</InputLabel>
                        <OutlinedInput
                            id="component-outlined"
                            value={epochs}
                            onChange={(event: any) => updateEpochCount(event.target.value)}
                            label="epochs"
                        />
                    </FormControl>
                </Box>
                <Box sx={{marginTop: '15px', display: 'flex'}}>
                    <Button variant="outlined" onClick={()=>setModalOpen(true)}>edit architecture</Button>
                </Box>
                <Box sx={{marginTop: '53px'}}>
                    <Button variant="contained" onClick={() => setupModel()}>TRAIN MODEL</Button>
                </Box>
            </Container>




        </Container>
        <Modal
            open={modalOpen}
            onClose={()=>setModalOpen(false)}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={modalStyle}>
                <h2>ADD LAYERS</h2>

                <Container>
                    <Container sx={{padding: '20px', maxHeight: '400px', overflow: 'scroll'}}>
                        {layerDisplay}
                    </Container>
                    <Box sx={{marginTop:'20px', display: 'flex', justifyContent: 'space-between'}}>
                        <Button variant="outlined" onClick={addLayerHandler}>add</Button>
                        Layercount: {layerCount},
                        Unitcount: {uCount}
                    </Box>
                </Container>
            </Box>
      </Modal>
    </div>);
}

export default DataVisualisation;
