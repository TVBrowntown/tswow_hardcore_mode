import { std } from "wow/wotlk";

const HARDCORE_SPELL = std.Spells.create('hardcore-mode', 'hardcore-spell')
    .Name.enGB.set("Challenge: Hardcore")
    .Icon.set(std.Spells.load(48743).Icon.get())
    .Description.enGB.set('Your very existence is a testament to your willpower. Death is permanent. The weight of true mortality rests upon your shoulders.')
    .Effects.clearAll()
    .PreventionType.NONE.set()
    .Attributes.IS_PASSIVE.set(true)
    .Attributes.IS_ABILITY.set(true)
    .Attributes.SHEATHE_UNCHANGED.set(true)
    .Tags.addUnique('hardcore-mode', 'hc-spell');

const HARDCORE_TITLE = std.Titles.create('hardcore-mode', 'hardcore-title')
    .Text.Female.enGB.set('the Immortal')
    .Text.Male.enGB.set('the Immortal')

console.log(HARDCORE_TITLE.ID)

    