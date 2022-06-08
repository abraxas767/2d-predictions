import * as React from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import * as tfvis from '@tensorflow/tfjs-vis';


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


function DataVisualisation(props: any) {

    const functions: any = {
        'ea3_func': y,
        'x_squared' : y2,
    };

    const divRef = React.useRef<HTMLDivElement>(null);

    const f: any = functions[props.func]

    React.useEffect(()=> {
        // GENERATE TRAINING SAMPLES
        const samples = createTrainingSamples(props.N, {max:1,min:-1}, f, noise);
        // VISUALISATION
        const data = { values: samples, series: ['x'] };
        const meta = {name:'Training Data', tab: 'Training'};
        const opts = { width: 500};
        //let plot: Element = (<div></div>);
        //const plot = tfvis.visor().surface({ name: 'scatter', tab: 'Charts' });
        //let plot = document.getElementById('plot1');
        if(divRef.current){
            tfvis.render.scatterplot(divRef.current, data, opts);
        }
    });


    let display = 'relative';
    if(!props.show) {display = 'none';}

    return (<div>
        <Container sx={{display: 'flex', flexGrow: '4', justifyContent: 'flex-start'}}>
            <Box>
                <div ref={divRef} className="plot1"></div>
            </Box>
        </Container>
    </div>);
}

export default DataVisualisation;
