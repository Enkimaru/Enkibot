const crypto = require('crypto');
const fs = require('fs');

module.exports = function() {
    this.userQueue = [];
    this.subscriberSpotSkip = 0;
    this.isStreamer = false;
    this.isMod = false;
    this.isSub = false;

    this.addUser = function (user) {
        user.replayId = this.replaceZeros(user.replayId);
        if (this.replayCheck(user.replayId) === true){
            this.addUserToList(user);
        };
    }

    this.addUserToList = function (user){
        const queueUser = this.userQueue.find(result => result.username === user.username);
        let queuePosition = 0;
        console.log(user);

        if (!!queueUser) {
            queueUser.replayId = user.replayId;
            this.sendChatMessage(`@${user.username}, replay com ID: ${user.replayId} atualizado.`);
        } else {
            user.id = crypto.randomUUID();

            if (user?.subscriber == true && queueSubscriberPriority >= 0) {

            let position = this.findLastSubscriberPosition();
                if (position == -1) {
                    this.userQueue.splice(subscriberSpotSkip, 0, user);
                } else {
                    this.userQueue.splice(position + queueSubscriberPriority + 1, 0, user);
                }
                queuePosition = this.findUserOnQueue(user);
            } else {
                queuePosition = this.userQueue.push(user);
            }
            this.sendChatMessage(`@${user.username}, replay com ID: ${user.replayId} adicionado na fila na posição ${queuePosition}.`);
        }

        this.updateQueueFile();


    }


    this.updateQueueFile = function () {
        fs.writeFile(queueFile, JSON.stringify(this.userQueue, null, 2), function (err) {
            if (err) return console.log(err);
                console.log('Lista atualizada');
        });
    }

    this.findUserOnQueue = function(user) {
        const userListMap = this.userQueue.map(el => el.username);
        return userListMap.lastIndexOf(user.username)+1;
    }

    this.findUserIdOnQueue = function(id) {
        const userListMap = this.userQueue.map(el => el.id);
        return userListMap.lastIndexOf(id);
    }

    this.leaveFromQueue = function (tags){
        let userIndex = this.findUserOnQueue(tags.username);

        if (userIndex >= 0) {
            this.userQueue.splice(userIndex, 1);
            this.updateQueueFile();
            return 1
        }
        return 0

    }

    this.replayCheck = function (replayString) {
        if (replayString.length != 9) {
          return this.sendChatMessage("O replay deve conter 9 caracteres! Verifique a ID e tente novamente.")
        }

        if (replayString[0] == 0) {
          return this.sendChatMessage("O replay não pode começar com 0! Verifique a ID e tente novamente.")
        }
        let replayHex = parseInt(replayString,16);

        if (replayHex.toString(16) != replayString.toLowerCase()){
           return this.sendChatMessage("O Replay possui caracteres inválidos! Verifique a ID e tente novamente.")
        }

        return true
    }

    this.replaceZeros = function (replayString) {
        return replayString.replace(/o|O/g, "0");
    }

    this.findLastSubscriberPosition = function() {
        const userListSubscriberMap = this.userQueue.map(el => el.subscriber);
        return userListSubscriberMap.lastIndexOf(true);
    }

    this.getQueueString = function () {
        let stringQueue = '════Fila de Replays════ ';
        this.userQueue.forEach((element, index) => {
            stringQueue = stringQueue.concat(' — ' + (index+1) + ':•' + element.username + '' )
        });
        return stringQueue
    }

    this.updateQueue = function () {
        if (this.userQueue.length > 0) {
            let nextOnQueue = userQueue[0];
            sendChatMessage(`O próximo da fila é o @${nextOnQueue.username}, com o replay:
            ${nextOnQueue.replayId}`);

            if (nextOnQueue.subscriber == true) {
                if (this.queueSubscriberPriority > 0) {
                    this.subscriberSpotSkip = this.queueSubscriberPriority;
                }
            } else if (this.subscriberSpotSkip > 0) {
                this.subscriberSpotSkip--;
            }
            this.removeFromList(0);

        } else {
            sendChatMessage(`A fila está vazia!`);
        }
    }

    this.removeFromList = function (position) {
        this.userQueue.splice(position, 1);
        updateQueueFile();
    }

    this.removeUserFromQueue = function (id) {
        let position = this.findUserIdOnQueue(id);
        if (position >= 0) {
            this.removeFromList(position);
        }
    }

    this.loadQueueFromFile = function () {
        let rawdata = fs.readFileSync('./react/dashboard/public/data.json');
        this.userQueue = JSON.parse(rawdata);
    }

    this.clearQueue = function () {
        this.userQueue = [];
        fs.writeFile(queueFile, "[]", function (err) {
                if (err) return console.log(err);
                console.log('Lista atualizada');
        });
    }

    this.checkRoles = function (tags) {
        if(tags.badges) {
            this.isSub = 'subscriber' in tags.badges || 'founder' in tags.badges;
            this.isStreamer = 'broadcaster' in tags.badges;
            this.isMod = 'moderator' in tags.badges;
        } else {
            this.isSub = null;
            this.isStreamer = null
            this.isMod = null;
        }
    }
    this.checkCommand = function (length, paramNumber) {
       if (length != paramNumber) {
           this.sendChatMessage(`Comando com número de parâmetros errados!`);
        return true;
       }
       return false;
    }

    this.sendChatMessage = function (message) {
        this.client.say("#" + channel, message);
    }

}
