export const initialState = {
  version: 1,
  createdAt: Date.now(),
  lastSavedAt: Date.now(),
  gameMinutes: 360,
  speed: 1,
  resources: { silver: 120, food: 86, medicine: 18, timber: 42, stone: 35 },
  company: { name: "Salt Stone Wardens", members: 3, morale: 72, reputation: 8 },
  facilities: [
    { id:"barracks", name:"Barracks", icon:"⌂", level:1, description:"Houses the company and its recruits." },
    { id:"infirmary", name:"Infirmary", icon:"✚", level:1, description:"A place for the wounded to recover." },
    { id:"workshop", name:"Workshop", icon:"⚒", level:0, description:"Repairs gear and prepares equipment." },
    { id:"library", name:"Library", icon:"▤", level:0, description:"Preserves knowledge and research." }
  ],
  characters: [
    { id:"serik", name:"Serik Vale", role:"Company Commander", archetype:"Disciplined · Defensive", level:2, xp:35, health:92, morale:81, strength:13, agility:9, intellect:12, resolve:15, trait:"Steadfast", bio:"A measured commander who values preparation over glory. Serik distrusts unnecessary risks and expects orders to be followed." },
    { id:"mirelle", name:"Mirelle Voss", role:"Occult Scholar", archetype:"Intelligent · Secretive", level:2, xp:18, health:76, morale:68, strength:7, agility:10, intellect:16, resolve:12, trait:"Curious", bio:"A scholar of forbidden histories. Mirelle is brilliant, ambitious, and drawn to knowledge others would leave buried." },
    { id:"harlan", name:"Harlan Pike", role:"Quartermaster", archetype:"Pragmatic · Opportunistic", level:1, xp:8, health:88, morale:74, strength:10, agility:11, intellect:13, resolve:10, trait:"Shrewd", bio:"Harlan keeps the stores, bargains with merchants, and always notices who stands to profit." }
  ],
  factions: [
    { name:"The Ivory Compact", symbol:"◇", description:"Merchant houses and coastal interests.", status:"WATCHFUL" },
    { name:"The Drowned Court", symbol:"♜", description:"An old power stirring beneath the tide.", status:"UNKNOWN" },
    { name:"The Chapel of Tides", symbol:"✧", description:"Keepers of the coastal faith and its rites.", status:"DISTANT" }
  ],
  chronicle: [
    { day:1,time:"06:00",title:"The Wardens endure",body:"The company takes stock of Stonewake Bastion. The walls stand, though the salt has found every crack." },
    { day:1,time:"06:00",title:"A troubling report",body:"Scouts speak of pale lights moving through the salt marsh after nightfall." },
    { day:1,time:"06:00",title:"A company assembled",body:"Serik Vale, Mirelle Voss, and Harlan Pike remain in service to the Wardens." }
  ]
};
