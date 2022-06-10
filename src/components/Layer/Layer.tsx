import * as React from 'react';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import InputLabel from '@mui/material/InputLabel';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import { updateLayer, deleteLayer } from '../../state/state';


function Layer(props: any) {

    const layerStyle = {
        width: '100%',
        background: '#4dabf5',
        margin: '10px 0 10px 0',
        borderRadius: '6px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '8px',
        color: '#fff',
    }

    const updateUnitHandler = (event: any) => {
        //if(isNaN(parseInt(event.target.value))){return;}
        if(props.editable){
            updateLayer({
                id: props.id,
                unitCount: parseInt(event.target.value),
                useBias: props.useBias,
                editable: props.editable,
            });
        }
    }

    const updateUseBiasHandler = (event: any) => {
        let val = null;
        if(event.target.value === 'on'){
            val = true;
        } else {
            val = false;
        }
        updateLayer({
            id: props.id,
            unitCount: props.unitCount,
            useBias: val,
            editable: props.editable,
        });
    }

    let delIcon = (
        <div style={{cursor: 'pointer'}}>
            <DeleteIcon onClick={()=>deleteLayer(props.id)} sx={{color: '#fff'}} />
        </div>);
    if(!props.editable){delIcon = (<></>);}


    return (<Box sx={layerStyle}>


        Layer: {props.id}

        <Box sx={{display: 'flex', alignItems: 'center'}}>
            Units:
            <TextField
                disabled={!props.editable}
                onChange={updateUnitHandler}
                value={props.unitCount}
                sx={{marginLeft: '10px'}}
                size='small'
                inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }} />
        </Box>
        {delIcon}
    </Box>)
}

export default Layer;
