const SQL_TABLE_NAME = '`character_hardcore_mode`'
const SQL_TIME_TAKEN_COMPLETED = '`timeCompleted`'
const SQL_ACCOUNT_ID = '`accountId`'
const SQL_PLAYER_ID = '`playerId`'
const SQL_PLAYER_NAME = '`playerName`'
const SQL_RACE = '`race`'
const SQL_CLASS = '`class`'
const SQL_GUILD = '`guild`'
const SQL_TIME_STARTED = '`started`'
const SQL_TIME_AND_DATE_FINISHED = '`time_and_date_finished`'
const SQL_COMPLETED = '`completed`'

let _ = QueryCharacters(`
    CREATE TABLE IF NOT EXISTS ${SQL_TABLE_NAME}
    (
        ${SQL_PLAYER_ID} INT,
        ${SQL_ACCOUNT_ID} INT,
        ${SQL_PLAYER_NAME} VARCHAR(255),
        ${SQL_RACE} INT,
        ${SQL_CLASS} INT,
        ${SQL_GUILD} VARCHAR(255),
        ${SQL_TIME_TAKEN_COMPLETED} BIGINT,
        ${SQL_TIME_STARTED} BIGINT,
        ${SQL_TIME_AND_DATE_FINISHED} BIGINT,
        ${SQL_COMPLETED} BOOLEAN,
        PRIMARY KEY (${SQL_PLAYER_ID})
    );
`)

function getTimeStart(player: TSPlayer) {
    let startTime = 0;
    const result = QueryCharacters(`
        SELECT ${SQL_TIME_STARTED} 
        FROM ${SQL_TABLE_NAME}
        WHERE ${SQL_PLAYER_ID} = ${player.GetGUID().GetCounter()}
        AND ${SQL_ACCOUNT_ID} = ${player.GetAccountID()}
        LIMIT 1;
    `);

    if(result.GetRow()) {  // Changed from GetRows() > 0 to GetRow()
        startTime = result.GetInt64(0); // Get value from first row, first column
    }
    return startTime
}

export function insertHardcoreChallenger(player: TSPlayer) {
    let _ = QueryCharacters(`
        REPLACE INTO ${SQL_TABLE_NAME}
        (
            ${SQL_PLAYER_ID},
            ${SQL_ACCOUNT_ID},
            ${SQL_PLAYER_NAME},
            ${SQL_RACE},
            ${SQL_CLASS},
            ${SQL_GUILD},
            ${SQL_TIME_TAKEN_COMPLETED},
            ${SQL_TIME_STARTED},
            ${SQL_TIME_AND_DATE_FINISHED},
            ${SQL_COMPLETED}
        )
        VALUES (
            ${player.GetGUID().GetCounter()},
            ${player.GetAccountID()},
            '${player.GetName()}',
            ${player.GetRace()},
            ${player.GetClass()},
            '${player.GetGuild()?.GetName() ?? ""}',
            ${0},
            ${GetUnixTime()},
            ${0},
            ${0}
        );
    `)
    console.log(`${player.GetGUID().GetCounter()}, ${player.GetAccountID()}, ${player.GetName()}, ${player.GetRace()}, ${player.GetClass()}, ${player.GetGuild()?.GetName() ?? null}, 0, ${GetCurrTime()}, 0, 0)`)
}

export function removeHardcoreChallenger(guid: number, accountId: number) {
    let _ = QueryCharacters(`
        DELETE FROM ${SQL_TABLE_NAME}
        WHERE ${SQL_PLAYER_ID} = ${guid}
        AND ${SQL_ACCOUNT_ID} = ${accountId}
        AND ${SQL_COMPLETED} = 0;
    `)
}

export function banCharacter(player: TSPlayer, banReason: string = "Died in Hardcore Mode.", permanent: boolean = true) {
    const characterGuid = player.GetGUID().GetCounter();
    const characterName = player.GetName();
    
    // First check if already banned
    const checkBan = QueryCharacters(`
        SELECT guid FROM character_banned 
        WHERE guid = ${characterGuid} 
        AND active = 1 
        AND unbandate > UNIX_TIMESTAMP();
    `);

    if(checkBan.GetRow()) {
        console.log(`Character ${characterName} is already banned.`);
        return false;
    }

    // If not banned, proceed with ban
    // 2147483647 is max Unix timestamp (Year 2038)
    QueryCharacters(`
        INSERT INTO character_banned 
        (guid, bandate, unbandate, bannedby, banreason, active) 
        VALUES (
            ${characterGuid},
            UNIX_TIMESTAMP(),
            ${permanent ? '2147483647' : 'UNIX_TIMESTAMP() + (86400 * 30)'}, /* 30 days if not permanent */
            'System',
            '${banReason}',
            1
        );
    `);

    // Kick the player if they're online
    // player.LogoutPlayer(true);
    
    console.log(`Character ${characterName} has been ${permanent ? 'permanently' : 'temporarily'} banned. Reason: ${banReason}`);
    return true;
}

export function isCharacterBanned(player: TSPlayer): boolean {
    const characterGuid = player.GetGUID().GetCounter();
    
    const result = QueryCharacters(`
        SELECT guid 
        FROM character_banned 
        WHERE guid = ${characterGuid} 
        AND active = 1 
        AND unbandate > UNIX_TIMESTAMP();
    `);

    return result.GetRow();
}

export function updateHardcoreChallengerSuccess(player: TSPlayer) {
    const timeStart = getTimeStart(player)
    let _ = QueryCharacters(`
        REPLACE INTO ${SQL_TABLE_NAME}
        (
            ${SQL_PLAYER_ID},
            ${SQL_ACCOUNT_ID},
            ${SQL_PLAYER_NAME},
            ${SQL_RACE},
            ${SQL_CLASS},
            ${SQL_GUILD},
            ${SQL_TIME_TAKEN_COMPLETED},
            ${SQL_TIME_AND_DATE_FINISHED},
            ${SQL_COMPLETED}
        )
        VALUES (
            ${player.GetGUID().GetCounter()},
            ${player.GetAccountID()},
            '${player.GetName()}',
            ${player.GetRace()},
            ${player.GetClass()},
            '${player.GetGuild()?.GetName() ?? ""}',
            ${GetUnixTime() - timeStart},
            ${GetUnixTime()},
            ${1}
        );
    `);
}

export function updateHardcoreChallengerFailure(player: TSPlayer) {
    const timeStart = getTimeStart(player)
    // FINALISE THEIR DB DATA
    let _ = QueryCharacters(`
        REPLACE INTO ${SQL_TABLE_NAME}
        (
            ${SQL_PLAYER_ID},
            ${SQL_ACCOUNT_ID},
            ${SQL_PLAYER_NAME},
            ${SQL_RACE},
            ${SQL_CLASS},
            ${SQL_GUILD},
            ${SQL_TIME_TAKEN_COMPLETED},
            ${SQL_TIME_AND_DATE_FINISHED},
            ${SQL_COMPLETED}
        )
        VALUES (
            ${player.GetGUID().GetCounter()},
            ${player.GetAccountID()},
            '${player.GetName()}',
            ${player.GetRace()},
            ${player.GetClass()},
            '${player.GetGuild()?.GetName() ?? ""}',
            ${GetUnixTime() - timeStart},
            ${GetUnixTime()},
            ${0}
        );
    `)
}