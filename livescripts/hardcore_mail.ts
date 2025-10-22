const REWARDS_FOR_HARDCORE_SUCCESS = [
    52000,
    54811, // celestial steed
    51809 // portable hole
]

export function sendHardcoreRewardMail(player: TSPlayer) {
    // Create array for the items
    let items: TSArray<TSItem> = [];
    
    // Create each reward item
    REWARDS_FOR_HARDCORE_SUCCESS.forEach((itemId) => {
        const itemInstance = CreateItem(itemId, 1);
        if (itemInstance !== undefined) {
            items.push(itemInstance);
        }
    });

    // Mail information
    const mailSubject = "Congratulations on Completing Hardcore Mode!";
    const mailBody = "You have achieved something truly remarkable. Here are your rewards for completing the challenge in Hardcore mode!";
    const money = 100000; // 10 gold as example, adjust as needed
    
    // Send the mail with all items
    player.SendMail(
        0,              // sender GUID (0 for system)
        1,              // stationery (1 for default)
        mailSubject,    // subject
        mailBody,       // body
        money,          // money
        0,              // COD amount
        0,              // delay
        items           // array of TSItems
    );
}