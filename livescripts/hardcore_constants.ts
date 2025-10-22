const RACE = {
    HUMAN: 1,
    ORC: 2,
    DWARF: 3,
    NIGHT_ELF: 4,
    UNDEAD: 5,
    TAUREN: 6,
    GNOME: 7,
    TROLL: 8,
    BLOOD_ELF: 10,
    DRAENEI: 11,
    // GOBLIN: 9 // Uncomment if your server supports it
};

const GENDER = {
    MALE: 0,
    FEMALE: 1
};

export const RACIAL_ICONS = {
    [RACE.HUMAN]: {
        [GENDER.MALE]: "Achievement_Character_Human_Male",
        [GENDER.FEMALE]: "Achievement_Character_Human_Female"
    },
    [RACE.ORC]: {
        [GENDER.MALE]: "Achievement_Character_Orc_Male",
        [GENDER.FEMALE]: "Achievement_Character_Orc_Female"
    },
    [RACE.DWARF]: {
        [GENDER.MALE]: "Achievement_Character_Dwarf_Male",
        [GENDER.FEMALE]: "Achievement_Character_Dwarf_Female"
    },
    [RACE.NIGHT_ELF]: {
        [GENDER.MALE]: "Achievement_Character_Nightelf_Male",
        [GENDER.FEMALE]: "Achievement_Character_Nightelf_Female"
    },
    [RACE.UNDEAD]: {
        [GENDER.MALE]: "Achievement_Character_Undead_Male",
        [GENDER.FEMALE]: "Achievement_Character_Undead_Female"
    },
    [RACE.TAUREN]: {
        [GENDER.MALE]: "Achievement_Character_Tauren_Male",
        [GENDER.FEMALE]: "Achievement_Character_Tauren_Female"
    },
    [RACE.GNOME]: {
        [GENDER.MALE]: "Achievement_Character_Gnome_Male",
        [GENDER.FEMALE]: "Achievement_Character_Gnome_Female"
    },
    [RACE.TROLL]: {
        [GENDER.MALE]: "Achievement_Character_Troll_Male",
        [GENDER.FEMALE]: "Achievement_Character_Troll_Female"
    },
    [RACE.BLOOD_ELF]: {
        [GENDER.MALE]: "Achievement_Character_Bloodelf_Male",
        [GENDER.FEMALE]: "Achievement_Character_Bloodelf_Female"
    },
    [RACE.DRAENEI]: {
        [GENDER.MALE]: "Achievement_Character_Draenei_Male",
        [GENDER.FEMALE]: "Achievement_Character_Draenei_Female"
    },
    // [9]: {
    //     [GENDER.MALE]: "Achievement_Character_Goblin_Male",
    //     [GENDER.FEMALE]: "Achievement_Character_Goblin_Female"
    // } // Uncomment if your server supports Goblins
}

export const MOTIVATION_MESSAGES = [
    "The path ahead is challenging, but their strength knows no bounds!",
    "Each level gained is another step towards legendary status!",
    "Their journey is an inspiration to others who wish to push their limits!",
    "The dangers are great, but their courage is greater!",
    "Victory favors the bold - and they continue to assert their boldness!",
    "Their name is whispered in taverns across Azeroth!",
    "Few dare to climb so high - fewer still succeed!",
    "Their determination lights the way for others!",
    "The realm watches on as they grow in power!"
];