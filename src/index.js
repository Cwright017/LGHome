const express = require('express');
const lgtv = require("lgtv2")({
    url: 'ws://lgwebostv:3000'
});
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const HDMI_MAP = {
    playstation: 'HDMI_1',
    xbox: 'HDMI_2'
};

const MEDIA_CONTROL_MAP = {
    play: 'play',
    pause: 'pause',
    stop: 'stop',
    fastforward: 'fastForward',
    'fast forward': 'fastForward',
    rewind: 'rewind'
};

app.post('/audio/mute', (req, res) => {
    const { mute = false } = req.body;

    lgtv.request('ssap://audio/setMute', {mute}, (lgErr, lgRes) => {
        res.send(`Setting mute to ${mute}`);        
    });
});

app.post('/audio/volume', (req, res) => {
    const { volume = 20 } = req.body;

    lgtv.request('ssap://audio/setVolume', {volume}, (lgErr, lgRes) => {
        res.send(`Setting volume to ${volume}`);        
    });
});

app.post('/media', (req, res) => {
    const { action = '' } = req.body;
    const MEDIA_CONTROL = MEDIA_CONTROL_MAP[action.toLowerCase()];

    if (MEDIA_CONTROL) {
        lgtv.request(`ssap://media.controls/${MEDIA_CONTROL}`, (lgErr, lgRes) => {
            res.send(`${MEDIA_CONTROL}ing TV`);        
        });
    } else {
        res.send(`Error - no MEDIA CONTROL mapped for ${action}`) 
        console.error(`Can't find mapping for action '${action}'`);        
    }
});

app.post('/hdmi', (req, res) => {
    const { device = '' } = req.body;
    const HDMI_ID = HDMI_MAP[device.toLowerCase()];

    if (HDMI_ID) {
        lgtv.request('ssap://tv/switchInput', { inputId: HDMI_ID }, (lgErr, lgRes) => {
            res.send(`Switched to ${device}`)        
        });
    } else {
        res.send(`Error - no HDMI mapped for ${device}`)
        console.error(`Can't find mapping for device '${device}'`);
    }
});

app.listen(3000, () => console.log('LGHome app listening on port 3000!'))
