import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Container from '@mui/material/Container';

import DataVisualisation from '../components/DataVisualisation';

function MainContainer() {

    const functions = [
        'ea3_func',
        'x_squared'
    ]

    const [N, setN] = React.useState<number>(100);
    const [variance, setVariance] = React.useState(0.1);
    const [f, setF] = React.useState<string>(functions[0]);
    const [showVis, setShowVis] = React.useState(false);

    const handleNChange = (event: SelectChangeEvent) => {
        setN(parseInt(event.target.value));
        setShowVis(false);
    };
    const handleVarianceChange = (event: SelectChangeEvent) => {
        setVariance(parseFloat(event.target.value));
        setShowVis(false);
    }
    const handleFChange = (event: SelectChangeEvent) => {
        setF(event.target.value);
        setShowVis(false);
    }

    const handleGenerateClick = () => {
        setShowVis(true)
    }

    return ( <>

        <h1>Generate Training Data</h1>
        <Container sx={{
            display: 'flex',
        }}>
            <Container sx={{display: 'flex', justifyContent: 'center', flexGrow: '1'}}>
                <Box sx={{ width: 120, marginTop: '130px' }}>

                    <Box>
                        <FormControl fullWidth>
                            <InputLabel id="N-label">N</InputLabel>
                            <Select
                                labelId="N-label"
                                id="n-label"
                                value={N.toString()}
                                label="N"
                                onChange={handleNChange}
                            >
                                <MenuItem value={5}>5</MenuItem>
                                <MenuItem value={10}>10</MenuItem>
                                <MenuItem value={20}>20</MenuItem>
                                <MenuItem value={50}>50</MenuItem>
                                <MenuItem value={100}>100</MenuItem>
                                <MenuItem value={1000}>1000</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>


                    <Box sx={{marginTop: '30px'}}>
                        <FormControl fullWidth>
                            <InputLabel id="variance-label">variance</InputLabel>
                            <Select
                                labelId="variance-label"
                                id="v-label"
                                value={variance.toString()}
                                label="variance-label"
                                onChange={handleVarianceChange}
                            >
                                <MenuItem value={0.1}>0.1</MenuItem>
                                <MenuItem value={0.3}>0.3</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>


                    <Box sx={{marginTop: '30px', marginBottom: '30px'}}>
                        <FormControl fullWidth>
                            <InputLabel id="function-label">function</InputLabel>
                            <Select
                                labelId="function-label"
                                id="f-label"
                                value={f}
                                label="function-label"
                                onChange={handleFChange}
                            >
                                <MenuItem value={functions[0]}>{functions[0]}</MenuItem>
                                <MenuItem value={functions[1]}>{functions[1]}</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>

                    <Button variant="contained" onClick={handleGenerateClick}>Generate</Button>

                </Box>
            </Container>

            <DataVisualisation
                show={showVis}
                N={N}
                func={f}
            />

        </Container>
    </> )
}

export default MainContainer;
