require('./functions.js')();
require('./client.js')();
require('./routesReact.js')();

client.connect().catch(console.error);

loadQueueFromFile()

client.on('message', (channel, tags, message, self) => {
        if(self || message[0] !== '!') return;

        checkRoles(tags);
        let additionalMessage = "";

    if(message.toLowerCase().startsWith(queueAddCommand)) {
            this.addUserToQueue(message, tags);
        } else if (message.toLowerCase() === '!fila'){
            this.showQueue();
        } else if (message.toLowerCase() === '!abrir'){
            this.openQueue(tags);
        } else if (message.toLowerCase() === '!fechar'){
            this.closeQueue(tags);
        } else if (message.toLowerCase() === '!prox'){
            this.nextOnQueue(tags);
        } else if (message.toLowerCase() === '!sair'){
            this.leaveQueue(tags);
        } else if (message.toLowerCase() === '!pos'){
            this.positionOnQueue(tags);
        } else if (message.toLowerCase() === '!carregar'){
            this.loadQueue(tags);
        } else if (message.toLowerCase() === '!limpar'){
            this.deleteQueue(tags);
        }
});

client.on('redeem', (channel, username, rewardType, tags, message) => {
    if (rewardType == replayRewardId) {
        this.spendChannelPoints();
    }
})

this.addUserToQueue = function (message, tags) {
    if (queueOpen == false) {
        sendChatMessage('A fila de replays está fechada!')
    } else {
        let replayCommand = message.split(" ");
        if (isStreamer || isMod) {
            if (replayCommand[1] === "user") {
                let replayId = replayCommand[3]?.toUpperCase();
                let user = {id: 0, username: replayCommand[2]?.toLowerCase(), replayId: replayId, subscriber: false};
                addUser(user);
            } else {
                let replayId = replayCommand[1].toUpperCase();
                let user = {id: 0, username: tags.username, replayId: replayId, subscriber: true};
                addUser(user);
            }
        }
        else if (isSub) {
            let replayId = replayCommand[1].toUpperCase();
            let user = {id: 0, username: tags.username, replayId: replayId, subscriber: true};
            addUser(user);
        } else {

            let replayId = replayCommand[1].toUpperCase();
            let user = {id: 0, username: tags.username, replayId: replayId, subscriber: false};
            addUser(user);
            //sendChatMessage(`@${tags.username}, você precisa ser inscrito no canal para usar este comando. Tente usar a recompensa de pontos em Revisão de Partida.`);
        }
    }
}

this.showQueue = function () {
    let queueString = getQueueString();
    sendChatMessage(`${queueString}`);
}

this.openQueue = function (tags) {
    if (tags.badges.broadcaster == 1) {
        if(queueOpen == true) {
            sendChatMessage(`A fila já está aberta!`);
        } else {
            queueOpen = true;
            sendChatMessage(`A fila de Replays está aberta.`);
        }
    }
}

this.closeQueue = function (tags) {
    if (tags.badges.broadcaster == 1) {
        if(queueOpen == false) {
            sendChatMessage(`A fila já está fechada.`);
        } else {
            queueOpen = false;
            sendChatMessage(`A fila de replays fechou!`);
        }
    }
}

this.nextOnQueue = function (tags) {
    if (tags.badges.broadcaster == 1) {
        updateQueue();
    }
}

this.leaveQueue = function (tags) {
    if (leaveFromQueue(tags) == 1) {
        sendChatMessage(`@${tags.username}, você saiu da fila!`);
    } else {
        sendChatMessage(`@${tags.username}, você está tentando sair de uma fila que não entrou Pepega!`);
    }
}

this.positionOnQueue = function (tags) {
    let userIndex = findUserOnQueue(tags.username);
    if (userIndex >= 0) {
        sendChatMessage(`@${tags.username}, você está na posição Nº${userIndex+1} com o replay ${userQueue[userIndex].replayId}`);
    } else {
        sendChatMessage(`@${tags.username}, você não está na fila!`)
    }
}

this.loadQueue = function (tags) {
    if (tags.badges.broadcaster == 1) {
        loadQueueFromFile(queueFile);
        sendChatMessage(`Carregando fila pelo arquivo.`)
    }

}

this.deleteQueue = function (tags) {
    if (tags.badges.broadcaster == 1) {
        clearQueue();
    }
}

this.spendChannelPoints = function () {
    if (queueOpen == false) {
        sendChatMessage('A fila de replays está fechada!')
    } else {

        let replayCommand = message.split(" ");
        let replayId = replayCommand[0].toUpperCase();

        addUser(replayId, tags, additionalMessage);
    }
}

