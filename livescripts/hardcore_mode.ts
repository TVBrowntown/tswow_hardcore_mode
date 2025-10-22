import { RACIAL_ICONS, MOTIVATION_MESSAGES } from "./hardcore_constants";
import { sendHardcoreRewardMail } from "./hardcore_mail";
import { insertHardcoreChallenger, removeHardcoreChallenger, banCharacter, isCharacterBanned, updateHardcoreChallengerSuccess, updateHardcoreChallengerFailure } from "./hardcore_sql";


function getRacialIcon(race: number, gender: number, iconSize: number = 16): string {
    const icon = RACIAL_ICONS[race]?.[gender];
    return icon ? `|TInterface\\Icons\\${icon}:${iconSize}:${iconSize}|t` : '';
}

// Function to get class-colored name with class icon
function getClassIconName(player: TSPlayer): string {
    const raceIcon = getRacialIcon(player.GetRace(), player.GetGender(), 18);
    return `${raceIcon} ${player.GetName()} the ${player.GetRaceAsString(0)} ${player.GetClassAsString(0)}`;
}

function isHardcore(player: TSPlayer): bool {
    return player.HasSpell(UTAG('hardcore-mode', 'hc-spell'))
}

function succeedHardcore(player: TSPlayer) {
    updateHardcoreChallengerSuccess(player)

    //  ${player.GetGUID().GetLow()}
    if (!player.HasTitle(178)) {
        player.SetKnownTitle(178)
    }

    // give items via mail
    sendHardcoreRewardMail(player)

    // forget hardcore spell
    player.RemoveSpell(UTAG('hardcore-mode', 'hc-spell'), true, false)
}

function failHardcore(player: TSPlayer) {
    const accountId = player.GetAccountID()
    const playerId = player.GetGUID().GetCounter()
    // HOW THE HECK WE GONNA BAN?
    // via SQL
    updateHardcoreChallengerFailure(player)

    banCharacter(player)
}

function randomMotivationText(): string {
    const SEED = GetCurrTime();
    // Combine current time seed with a random number
    const randomFactor = Math.floor(Math.random() * 10000);
    const combinedSeed = (SEED + randomFactor) % MOTIVATION_MESSAGES.length;
    return MOTIVATION_MESSAGES[combinedSeed];
}

function SendToChannel(string: string) {
    SendWorldMessage(string)
}

function enableHardcore(player: TSPlayer) {
    // Enable hardcore mode
    player.LearnSpell(UTAG('hardcore-mode', 'hc-spell'));
    insertHardcoreChallenger(player);

    // Notify player
    player.SendBroadcastMessage("Hardcore mode enabled! Death is now permanent.");
    player.SendBroadcastMessage("Good luck on your journey, brave adventurer!");

    player.PlayDirectSound(8666, player)
    player.CastSpell(player, 64885)
}

export function Main(events: TSEvents) {
    events.Player.OnLevelChanged((player) => {
        switch(player.GetLevel()) {
            case 10:
            case 20:
            case 30:
            case 40:
            case 50:
            case 60:
            case 70:
                if ( isHardcore(player) ) {
                    SendToChannel(`${getClassIconName(player)} has reached level ${parseInt(player.GetLevel().toString())} in Hardcore mode! ${randomMotivationText()}`)
                    return
                }
            case 80:
                if ( isHardcore(player) ) {
                    SendWorldMessage(`${getClassIconName(player)} has transcended death and reached level 80 on Hardcore mode without dying once! ${player.GetName()} shall henceforth be known as the Immortal!`)
                    succeedHardcore(player)
                }
        }
    })

    events.Player.OnPlayerKilledByCreature((killer, killed) => {
        if ( isHardcore(killed) ) {
            SendToChannel(`A tragedy has occurred. Hardcore character ${getClassIconName(killed)} has fallen to ${killer.GetName()} at level ${parseInt(killed.GetLevel().toString())} somewhere in ${killed.GetMap().GetName()}.`)
            failHardcore(killed)
        }
    })

    events.Player.OnPVPKill((killer, killed) => {
        if ( killer.GetName() != killed.GetName() && ( isHardcore(killed) )) {
            SendToChannel(`A tragedy has occurred. Hardcore character ${getClassIconName(killed)} has died in battle against ${killer.GetName()} at level ${parseInt(killed.GetLevel().toString())} somewhere in ${killed.GetMap().GetName()}.`)
            failHardcore(killed)
        }
    })

    events.Unit.OnDeath((victim, killer) => {
        if ( victim.IsPlayer() && (killer?.GetName() == victim.GetName()) ){
            const selection = ToPlayer(victim)
            if (selection && isHardcore(selection))
                {
                    SendToChannel(`A tragedy has occurred. Hardcore character ${getClassIconName(selection)} has died of natural causes at level ${parseInt(victim.GetLevel().toString())} somewhere in ${victim.GetMap().GetName()}.`)
                    failHardcore(selection)
                }
        }
    })

    events.Player.OnCreate((player) => {
        // PLAYER HAS BEEN MADE, GET SEND FLAG
    })

    events.WorldPacket.OnReceive((opcode, packet) => {
        // FLAG PLAYER FOR HARDCORE MODE
    })

    events.Player.OnLogin((player, firstLogin) => {
        //if ( firstLogin ) {
            // CHECK FOR FLAG TO BE HARDCORE
            // code to check

            // IF TRUE LEARN 
        //    player.LearnSpell(UTAG('hardcore-mode', 'hc-spell'))
            // Then the REPLACE INTO query

        //    insertHardcoreChallenger(player)
        //}
    })

    events.Player.OnDelete((guid, accountId) => {
        removeHardcoreChallenger(guid, accountId)
    })

    events.Player.OnPlayerRepop((player) => {
        const dead = player.IsDead() && isHardcore(player)
        if ( dead ) {
            player.KickPlayer();
        }
    })

    // prevent them queuing into instance or battleground to resurrect from death by kicking them upon entry.
    events.Battleground.OnAddPlayer((bg, player) => {
        if ( isCharacterBanned(player) ) {
            player.KickPlayer()
        }
    })

    events.Instance.OnPlayerEnter((instance, player) => {
        if ( isCharacterBanned(player) ) {
            player.KickPlayer()
        }
    })

    events.Player.OnCommand((player, command, found) => {
        if(command.get().toLowerCase() === 'hardcore enable') {
            // Only allow on new characters
            if(player.GetLevel() > 1) {
                player.SendBroadcastMessage("Hardcore mode can only be enabled on new characters.")
                found.set(true)
                return;
            }

            // Check if already hardcore
            if(isHardcore(player)) {
                player.SendBroadcastMessage("This character is already in hardcore mode!")
                found.set(true)
                return;
            }

            // Enable hardcore mode
            enableHardcore(player)
            found.set(true)
        }
    });
};

console.log('Hardcore module: Loaded')