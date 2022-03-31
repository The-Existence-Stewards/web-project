const prompts = require('prompts');
function checkIfLvlCouldBeIncreased(skill) {
    while (skill.currentXP >= skill.xpNeeded) {
        skill.currentXP = skill.currentXP - skill.xpNeeded;
        skill.currentXP = Math.floor(skill.currentXP);
        skill.currentLVL++;
        skill.xpNeeded = skill.xpNeeded*skill.multiplier;
        skill.xpNeeded = Math.floor(skill.xpNeeded);
    }
}

class Skills{
    constructor(name, multiplier, xpNeeded){
        this.name = name;
        this.multiplier = multiplier;
        this.currentXP = 0;
        this.currentLVL = 0;
        this.xpNeeded = xpNeeded;
        this.lastLoggingDate = 0
    }
}
let logforday = 0
let intelligence = new Skills("Intelligence", 1.2 , 30)
let strength = new Skills("Strength", 1, 45)
let endurance = new Skills("Endurance", 1.1, 40)
let charisma = new Skills("Charisma", 0.85, 60)
let agility = new Skills("Agility", 1.3, 20)
let crafting = new Skills("Crafting", 1.5, 50)

let allSkills = [intelligence, strength, endurance, charisma, agility, crafting]


async function gameLoop() {
    let gameRunning = true;
    const initialActionChoices = [
        { title: "Intelligence", value: intelligence },
        { title: "Strength", value: strength },
        { title: "Endurance", value: endurance },
        { title: "Charisma", value: charisma },
        { title: "Agility", value: agility},
        { title: "Crafting", value: crafting },
        { title: "Exit", value: "exit" },
    ];
    
    const response = await prompts({
        type: 'select',
        name: 'value',
        message: 'What activity do you want to log?',
        choices: initialActionChoices
      });
      if (response.value === "exit") {
        gameRunning = false;
      } else { skillLoop()}
            async function skillLoop(){
            while (gameRunning) {
                if (response.value === "exit") {
                    gameRunning = false;
                } else {
                    const actionChoices = [
                        { title: "Add XP", value: "addXP" },
                        { title: "Check LVL", value: "checkLVL" },
                        { title: "Check XP", value: "checkXP" },
                        { title: "Go back", value: "goback" },
                        { title: "Exit", value: "exit" },
                    ];
                    const skillResponse = await prompts({
                        type: 'select',
                        name: 'value',
                        message: `What do you want to do with ${response.value.name} ?`,
                        choices: actionChoices
                    });
                    if (skillResponse.value === "addXP") {
                        const xpResponse = await prompts({
                            type: 'number',
                            name: 'value',
                            message: 'How much XP do you want to add?'
                        });
                        if (xpResponse.value > 1400) {
                            console.log("You can't log more than 24h of activity per day") 
                        }
                        else {
                            if (logforday + xpResponse.value > 1400) {
                                console.log("You can't log more than 24h of activity per day") 
                            }
                             else {
                                response.value.currentXP += xpResponse.value;
                                logforday += xpResponse.value;
                                checkIfLvlCouldBeIncreased(response.value);
                             }   
                            }
                    } else if (skillResponse.value === "checkLVL") {
                        console.log(`${response.value.name} is level ${response.value.currentLVL}\nYou need ${response.value.xpNeeded} XP to reach level ${response.value.currentLVL + 1}`)
                    } else if (skillResponse.value === "checkXP") {
                        console.log(`${response.value.name} has ${response.value.currentXP} XP`)}
                    else if (skillResponse.value === "exit") {
                        gameRunning = false;
                    } else if (skillResponse.value === "goback") {
                        gameLoop()
                        break;
                        }
                    }
                }
            }
}

gameLoop()
