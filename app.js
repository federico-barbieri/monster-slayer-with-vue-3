function getRandomValue(min, max){
    return Math.floor(Math.random() * (max-min)) + min;
}

const app = Vue.createApp({
    data(){
        return {
            playerHealth: 100,
            monsterHealth: 100,
            currentRound: 0,
            winner: null,
            logMessages: [],
        }
    },
    computed:{
        monsterBarStyles(){
            if (this.monsterHealth < 0){
                return {width: "0%"};
            }
            return {width: this.monsterHealth + '%'};
        },
        playerBarStyles(){
            if(this.playerHealth < 0 ){
                return {width: "0%"}
            }
            return {width: this.playerHealth + '%'};
        },
        mayUseSpecialAttack(){
            return this.currentRound % 3 !== 0;
        }
    },
    watch:{
        playerHealth(value){
            if (value <= 0 && this.monsterHealth <= 0){
                // it is a draw
                this.winner = "draw";
            } else if (value <= 0){
                // player lose
                this.winner = "monster";

            } 
        },
        monsterHealth(value){
            if (value <= 0 && this.playerHealth <=0){
                // a draw
                this.winner = "draw";

            } else if (value <= 0){
            // monster lose
            this.winner = "player";

        } 
        },
    },
    methods:{
        startGame(){
            this.playerHealth = 100;
            this.monsterHealth = 100;
            this.winner = null;
            this.currentRound = 0;
            this.logMessages = [];
        },
        attackMonster(){
            this.currentRound++;
            const attackValue = getRandomValue(5, 12)
            if (this.monsterHealth - attackValue < 0){
                this.monsterHealth = 0;
            } else {
                this.monsterHealth = this.monsterHealth - attackValue;
            }
            this.addLogMessage("player", "attack", attackValue);
            this.attackPlayer();
        },
        attackPlayer(){
            const attackValue = getRandomValue(8, 15)
            this.playerHealth = this.playerHealth - attackValue;
            this.addLogMessage("monster", "attack", attackValue)

        },
        specialAttackMonster(){
            this.currentRound++;
            const attackValue = getRandomValue(10, 25)
            this.monsterHealth = this.monsterHealth - attackValue;
            this.addLogMessage("player", "special-attack", attackValue)

            this.attackPlayer();
        },
        healPlayer(){
            this.currentRound++;
            const healthValue = getRandomValue(8, 20);
            if(this.playerHealth + healthValue > 100){
                this.playerHealth = 100;
            } else{
                this.playerHealth += healthValue;

            }
            this.addLogMessage("player", "heal", healthValue);

            this.attackPlayer();
        },
        surrender(){
            this.playerHealth = 0;
            this.winner = "monster"
        },
        addLogMessage(who, what, value){
            this.logMessages.unshift({
                actionBy: who,
                actionType: what,
                actionValue: value,
            });
        },
    }
});

app.mount("#game");