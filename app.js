require('./functions.js')();
require('./client.js')();

fs = require('fs');

const firstline = require('firstline');

client.connect().catch(console.error);

loadQueueFromFile(queueFile)

fs.watchFile(queueFile, (curr,prev) => {

    firstline(queueFile).then(line => {

        const match = /\r|\n/.exec(line);

        if (match || line === "") {
            updateReplayList();
        }

    });
})


console.log(`Watching for file changes on ${queueFile}`);

client.on('message', (channel, tags, message, self) => {
        if(self || message[0] !== '!') return;

        checkRoles(tags);
        let additionalMessage = "";

        if(message.toLowerCase().startsWith('!replay')) {
            if (queueOpen == false) {
                sendChatMessage('A fila de replays está fechada!')
            } else {
                let replayCommand = message.split(" ");
                if (isStreamer || isMod) {
                    if (replayCommand[1] === "add") {
                        let replayId = replayCommand[2].toUpperCase();
                        let tags = {username: replayCommand[3].toLowerCase(), "display-name": replayCommand[3], subscriber: false}
                        additionalMessage = checkAdditionalMessage(message,replayCommand[4])

                        addReplay(replayId, tags, additionalMessage);
                        
                    } else if (replayCommand[1] === "order") {
                        if (checkCommand(replayCommand.length, 4)){
                            return true;
                        }

                        //changeReplayOrder(channel)
                    } else {
                        let replayId = replayCommand[1].toUpperCase();

                        additionalMessage = checkAdditionalMessage(message,replayCommand[2])

                        addReplay(replayId, tags, additionalMessage);
                    }
                }
                else if (isSub) {
                        let replayId = replayCommand[1].toUpperCase();
                        additionalMessage = checkAdditionalMessage(message,replayCommand[2])

                        addReplay(replayId, tags, additionalMessage);
                } else {
                    sendChatMessage(`@${tags.username}, você precisa ser inscrito no canal para usar este comando. Tente usar a recompensa de pontos em Revisão de Partida.`);  
                }
            }

        } else if (message.toLowerCase() === '!fila'){
            let queueString = getQueueString();
            sendChatMessage(`${queueString}`);

        } else if (message.toLowerCase() === '!abrir'){
            if (tags.badges.broadcaster == 1) {
                if(queueOpen == true) {
                    sendChatMessage(`Isso, abra a fila já aberta 4Head`); 
                } else {
                    queueOpen = true;
                    sendChatMessage(`A fila de Replays está aberta.`);
                }
            }

        } else if (message.toLowerCase() === '!fechar'){
            if (tags.badges.broadcaster == 1) {
                if(queueOpen == false) {
                    sendChatMessage(`Os portões já estão fechados.`); 
                } else {
                    queueOpen = false;
                    sendChatMessage(`A fila de replays fechou!`);
                }
            }

        } else if (message.toLowerCase() === '!prox'){
            if (tags.badges.broadcaster == 1) {
                updateReplayList();
            }

        } else if (message.toLowerCase() === '!sair'){
                if (leaveFromReplayList(tags) == 1) {
                    sendChatMessage(`@${tags.username}, você saiu da fila!`);
                } else {
                    sendChatMessage(`@${tags.username}, você está tentando sair de uma fila que não entrou Pepega!`); 
                }

        } else if (message.toLowerCase() === '!pos'){
                let userIndex = findUserOnReplayList(tags.username);
                if (userIndex >= 0) {
                    sendChatMessage(`@${tags.username}, você está na posição Nº${userIndex+1} com o replay ${replayList[userIndex].replayId}`);
                } else {
                    sendChatMessage(`@${tags.username}, você não está na fila!`)
                }
        } else if (message.toLowerCase() === '!carregar'){
            if (tags.badges.broadcaster == 1) {
                loadQueueFromFile(queueFile);
                sendChatMessage(`Carregando fila pelo arquivo.`)
            }

        } else if (message.toLowerCase() === '!limpar'){
            if (tags.badges.broadcaster == 1) {
                clearQueue();
            }
        }
});

client.on('redeem', (channel, username, rewardType, tags, message) => {
    if (rewardType == replayRewardId) {
        if (queueOpen == false) {
                sendChatMessage('A fila de replays está fechada!')
        } else {
        
        let replayCommand = message.split(" ");
        let replayId = replayCommand[0].toUpperCase();
        
        additionalMessage = checkAdditionalMessage(message,replayCommand[1])

        addReplay(replayId, tags, additionalMessage);           
    }}

})
