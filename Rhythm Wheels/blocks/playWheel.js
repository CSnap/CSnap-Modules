(function () {
    return function (wheelName, repeatNumber) {
        // if repeatNumber is 0, don't play anything
        if(repeatNumber < 1){
            return;
        }

        // check if there is an instanced wheel in WheelMap
        if (!(wheelMap.hasOwnProperty(wheelName))){
        console.log("Wheel not found/not instantiated");
        throw new Error("Wheel not found/not instantiated");
        }

        if(wheelMap[wheelName].buffer.length == 0){
            console.log("Wheel is empty!");
            throw new Error("Wheel is empty!");
        }

        let wheelDuration = wheelMap[wheelName].duration;
        let numberOfBuffers = wheelMap[wheelName].buffer;
        let amountOfBufs = numberOfBuffers.length;
        let buffersToRead = []; 

        for (let i=0; i<repeatNumber; ++i){
            for(let buff=0; buff<amountOfBufs; ++buff){
                buffersToRead.push(numberOfBuffers[buff]);
            }
        }

        // wheelDuration = long it takes to play every sound in the wheel (audio array) in seconds
        let wheelToPlay = makeAudioContext.createBuffer(1, 48000*(wheelDuration*repeatNumber), 48000);
        let durationSoFar = 0

        for(let i =0; i < buffersToRead.length; ++i){
            let setWheelBuff = wheelToPlay.getChannelData(0);
            let dataToSet = buffersToRead[i];
            let bufferToSet = dataToSet.buffer;

            // from Rhythm Wheels GUI, we need to place the slice of audio into amound of time in seconds IN new buffer * 48000
            setWheelBuff.set(bufferToSet, 48000 * durationSoFar);
            durationSoFar += dataToSet.duration;
        }
        let playNode = makeAudioContext.createBufferSource();
        playNode.buffer = wheelToPlay;
        playNode.connect(makeAudioContext.destination);
        this.activeWheels[wheelName] = playNode;
        // play audio
        playNode.start();
        return;
	};
}());

//# sourceURL=playWheel.js