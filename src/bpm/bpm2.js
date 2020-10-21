import React, { useState, useEffect, Fragment } from 'react';
import Analyzer from './Analizer2';

const Bpm2 = () => {
    const [audio, setAudio] = useState(null);
    useEffect(() => {
        console.log(audio);
    }, [audio]);

    const getMic = async () => {
        const tempAudio = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: false,
        });
        setAudio(tempAudio);
    };

    return (
        <Fragment>
            {audio ? <Analyzer audio={audio}></Analyzer> : ''}
            <button onClick={getMic}>{audio ? 'Detener' : 'Grabar'}</button>
        </Fragment>
    );
};

export default Bpm2;
