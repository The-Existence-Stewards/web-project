const db = require('../config/database');
const bcrypt = require('bcrypt');


const saltRounds = 10;
const stats = `insert into skills (user_id, skillName, multiplier, xpToNextLvl) values
($1,'Strength',1, 45),
($1,'Intelligence',1.2, 30),
($1,'Agility',1.3, 20),
($1,'Crafting',1.5, 50),
($1,'Charisma',0.85, 60),
($1,'Endurance',1.1, 40);`;

const models = {

    register: async (username, password) => {
        try {
            const client = await db.connect();
            const result = await client.query('SELECT user_id, username, password FROM users WHERE username = $1;', [username]);
            const results = { 'results': (result) ? result.rows : null};
            client.release();
            if (results.results.length === 0) {
                console.log(password);
                console.log(saltRounds);
                const hash = await bcrypt.hash(password, saltRounds);
                const result = await client.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING user_id, username; ', [username, hash]);
                const results = { 'results': (result) ? result.rows : null};
                await client.query(stats, [results.results[0].user_id]);
                return { 'user_id': results.results[0].user_id, 'username': results.results[0].username };
            } else {
                return { 'error': 'User already exists' };
            }
        } catch (err) {
            console.error(err);
            return { 'error': err };
        }
    },
    

    login: async (username, password) => {
        try {
            const client = await db.connect();
            const result = await client.query('SELECT user_id, username, password FROM users WHERE username = $1;', [username]);
            const results = { 'results': (result) ? result.rows : null};
            client.release();
            if (results.results.length === 0) {
                return { 'error': 'User not found' };
            } else {
                const user = results.results[0];
                const match = await bcrypt.compare(password, user.password);
                if (match) {
                    return { 'user_id': user.user_id, 'username': user.username };
                } else {
                    return { 'error': 'Incorrect password' };
                }
            }
        } catch (err) {
            console.error(err);
            return { 'error': err };
        }
    },

    getUser: async (id) => {
        try {
            const client = await db.connect();
            const result = await client.query('SELECT user_id, username, password FROM users WHERE user_id = $1;', [id]);
            const results = { 'results': (result) ? result.rows : null};
            client.release();
            if (results.results.length === 0) {
                return { 'error': 'User not found' };
            } else {
                return results.results[0];
            }
        } catch (err) {
            console.error(err);
            return { 'error': err };
        }
    },

    getSkills: async (id) => {
        try {
            const client = await db.connect();
            const result = await client.query('SELECT * FROM skills WHERE user_id = $1 order by skill_id;', [id]);
            console.log(result);
            const results = { 'results': (result) ? result.rows : null};
            client.release();
            if (results.results.length === 0) {
                return { 'error': 'User not found' };
            } else {
                return results.results;
            }
        } catch (err) {
            console.error(err);
            return { 'error': err };
        }
    },

    updateStats: async (minutes, skillName, id) => {
        // 960 min = 16 hours.
        const min = Number(minutes);
        const Limit = 960;
        const levelupMultiplier = 1.15;
        let todaysDate = new Date().toISOString().slice(0,10);
        try {
            // receive minutes, (user_id/skill_id), skillName, calculatedXp, currentXp, currentLVL, xpForLvlUp
            // check for limit
                // if good calculate new values and send success back
                // if bad send back failure
            const client = await db.connect();
            const getSkillID = await client.query('SELECT skill_id from skills where user_id = $1 and skillName = $2;', [id, skillName]);
            const skillID = getSkillID.rows[0].skill_id;
            const getMinutes = await client.query('SELECT SUM(minutes) from logs where date = $2;', [todaysDate]);
            const loggedMinutes = getMinutes.rows[0].sum;
            if ((Number(min) + Number(loggedMinutes)) < Limit) {
                const getSkill = await client.query('SELECT xpToNextLvl, currentXp, totalXp, lvl, multiplier from skills where user_id = $1 and skillName = $2;', [id, skillName]);
                const skill = getSkill.rows[0];
                const multiplier = skill.multiplier;
                const currentXp = skill.currentxp;
                const totalXp = skill.totalxp;
                let xpToNextLvl = skill.xptonextlvl;
                let lvl = skill.lvl;
                

                let newXp = currentXp + Math.round(min * multiplier);
                let newTotalXp = totalXp + Math.round(min * multiplier);
                let addingLevel = true;
                while (addingLevel) {
                    console.log(currentXp);
                    if (newXp >= xpToNextLvl && xpToNextLvl !== 0) {
                        newXp = newXp - xpToNextLvl;
                        lvl++;
                        xpToNextLvl = Math.round(xpToNextLvl * levelupMultiplier);
                    } else {
                        addingLevel = false;
                    }
                };


                await client.query('UPDATE skills SET currentXp = $1, totalXp = $2, lvl = $3, xpToNextLvl = $4 WHERE user_id = $5 and skill_id = $6;', [newXp, newTotalXp, lvl, xpToNextLvl, id, skillID]);
                await client.query('INSERT INTO logs (skill_id, minutes) VALUES ($1, $2);', [skillID, min]);
                client.release();
                return { 'success': 'success' }; 
            } else {
                client.release();
                return { 'error': 'Limit exceeded' };
            }
        } catch (err) {
            console.error(err);
            return { 'error': err };
        }
    }
};

module.exports = models;