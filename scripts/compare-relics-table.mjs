/**
 * Compare workshopRelics.generated.json against reference table (TSV).
 * Usage: node scripts/compare-relics-table.mjs [path-to-tsv]
 */
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const relics = JSON.parse(
  readFileSync(join(root, 'src/data/workshopRelics.generated.json'), 'utf8'),
)

const BONUS_TO_PHRASE = {
  Damage: 'tower damage',
  Coins: 'coins',
  'Lab Speed': 'lab speed',
  'Crit Factor': 'crit factor',
  Health: 'health',
  'Damage / Meter': 'damage/meter',
  'Defense Absolute': 'defense absolute',
  'Crit Chance': 'crit chance',
  'Free Attack Upgrade': 'free attack upgrade',
  'Free Defense Upgrade': 'free defense upgrade',
  'Free Utility Upgrade': 'free utility upgrade',
  'Wall Rebuild': 'wall rebuild',
  'Recovery Amount': 'recovery amount',
  'Bot Range': 'bot range',
  Cash: 'cash',
  'Attack Speed': 'attack speed',
  'Health Regen': 'health regen',
  'Ultimate Damage': 'ultimate damage',
  'Knockback Force': 'knockback force',
  Thorns: 'thorns',
  'Orb Speed': 'orb speed',
  'Defense %': 'defense',
  'Super Critical Chance': 'super critical chance',
  'Super Critical Mult': 'super critical mult',
  'Enemy Attack Level Skip': 'enemy attack level skip',
  'Enemy Health Level Skip': 'enemy health',
  'Rend Armor Mult': 'rend armor mult',
}

const RARITY_MAP = {
  '1-Rare': 'rare',
  '2-Epic': 'epic',
  '3-Legendary': 'legendary',
}

function normName(s) {
  return s
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .replace(/\[1\]/g, '')
    .trim()
}

function slugName(s) {
  return normName(s)
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_|_$/g, '')
}

function parseValue(bonusType, valueStr) {
  const v = valueStr.trim()
  if (v.endsWith('s') && bonusType === 'Wall Rebuild') return { num: parseFloat(v), unit: 's' }
  if (v.endsWith('m') || bonusType === 'Bot Range') {
    return { num: parseFloat(v), unit: 'm' }
  }
  return { num: parseFloat(v.replace('%', '')), unit: '%' }
}

function expectedDescription(bonusType, valueStr) {
  const phrase = BONUS_TO_PHRASE[bonusType]
  if (!phrase) return null
  const { num, unit } = parseValue(bonusType, valueStr)
  if (bonusType === 'Wall Rebuild') {
    return `decrease wall rebuild time by ${num}s`
  }
  if (unit === 'm') {
    return `increase ${phrase} by ${num}m`
  }
  return `increase ${phrase} by ${num}%`
}

function normDesc(s) {
  return s
    .toLowerCase()
    .replace(/\s*\/\s*/g, '/')
    .replace(/tower /g, '')
    .replace(/earned /g, '')
    .replace(/bonus /g, '')
    .replace(/percent/g, '')
    .replace(/defence/g, 'defense')
    .replace(/\s+/g, ' ')
    .trim()
}

function descMatches(expected, actual) {
  if (!expected) return { ok: false, reason: 'unknown bonus type' }
  const e = normDesc(expected)
  const a = normDesc(actual)
  if (e === a) return { ok: true }
  // allow "health" vs "tower health"
  if (e.replace('increase health', 'increase health') === a) return { ok: true }
  const eNum = e.match(/([\d.]+)(%|m|s)/)
  const aNum = a.match(/([\d.]+)(%|m|s)/)
  if (eNum && aNum && eNum[1] === aNum[1] && eNum[2] === aNum[2]) {
    const ePhrase = e.replace(/increase |decrease | by [\d.]+%?m?s?/g, '').trim()
    const aPhrase = a.replace(/increase |decrease | by [\d.]+%?m?s?/g, '').trim()
    if (ePhrase === aPhrase || ePhrase.includes(aPhrase) || aPhrase.includes(ePhrase)) {
      return { ok: true }
    }
  }
  return { ok: false, reason: `desc: expected "${expected}", got "${actual}"` }
}

function typeToUnlockGroup(type, unlockedBy) {
  const t = type.trim().toLowerCase()
  if (t === 'tournament') return 'tournament'
  if (t === 'milestone') return 'milestone'
  if (t === 'anniversary') return 'birthday'
  if (t === 'guild') return 'guild'
  return 'event'
}

function isPremium(type, unlockedBy) {
  return type.trim().toLowerCase() === 'premium' || /premium/i.test(unlockedBy)
}

function medalFromUnlockedBy(unlockedBy, rarity) {
  const m = unlockedBy.match(/(\d+)\s*Medals?/i)
  if (m) return Number(m[1])
  if (/guild season/i.test(unlockedBy)) {
    return rarity === 'epic' ? 150 : 75
  }
  return null
}

// Reference rows embedded from user table (name, rarity, bonus, value, type, unlockedBy)
const REF_TSV = `1-Rare	1	Copper Badge	Damage	3%	Tournament	Finish P4 in Copper
1-Rare	2	Silver Badge	Coins	5%	Tournament	Finish P4 in Silver
1-Rare	3	T:I Flux	Coins	2%	Milestone	Beat w4500 in T1
1-Rare	4	T:II Lumin	Lab Speed	1.5%	Milestone	Beat w4500 in T2
1-Rare	5	T:III Pulse	Crit Factor	2%	Milestone	Beat w4500 in T3
1-Rare	6	T:IV Harmonic	Damage	2%	Milestone	Beat w4500 in T4
1-Rare	7	T:V Ether	Health	2%	Milestone	Beat w4500 in T5
1-Rare	8	1st Tower Birthday	Damage	2%	Anniversary	Play for 1 year
1-Rare	9	2nd Tower Birthday	Crit Factor	2%	Anniversary	Play for 2 year
1-Rare	10	3rd Tower Birthday	Damage / Meter	2%	Anniversary	Play for 3 year
1-Rare	11	4th Tower Birthday	Health	2%	Anniversary	Play for 4 year
1-Rare	12	5th Tower Birthday	Crit Factor	2%	Anniversary	Play for 5 year
1-Rare	13	6th Tower Birthday	Damage / Meter	2%	Anniversary	Play for 6 year
1-Rare	14	No Spoon	Defense Absolute	2%	Standard	Into the Matrix - Earn 350 Medals
1-Rare	15	Bacteriophage	Damage	2%	Standard	Viral Outbreak event - Earn 350 Medals
1-Rare	16	Dreamcatcher	Coins	2%	Standard	Full Moon event - Earn 350 Medals
1-Rare	17	Ionized Plasma	Defense Absolute	2%	Standard	Plasma Returns (II) event - Earn 350 Medals
1-Rare	18	Ancient Tome	Lab Speed	1.5%	Standard	Sands of Time event - Earn 350 Medals
1-Rare	19	Tower Latte	Damage / Meter	2%	Standard	Autumn event - Earn 350 Medals
1-Rare	20	Spooky Bat	Crit Factor	2%	Standard	Halloween event - Earn 350 Medals
1-Rare	21	Cherry	Defense Absolute	2%	Standard	Cherry Blossom (II) event - Earn 350 Medals
1-Rare	22	Game Joystick	Damage	2%	Standard	Retro Arcade event - Earn 350 Medals
1-Rare	23	Honey Drop	Damage	2%	Standard	Honey (II) event - Earn 350 Medals
1-Rare	24	Firework	Health	2%	Standard	New Year event - Earn 350 Medals
1-Rare	25	Aurora Vortex	Health	2%	Standard	Aurora (II) event - Earn 350 Medals
1-Rare	26	Dark Sight	Damage / Meter	2%	Standard	Dark Strands event - Earn 350 Medals
1-Rare	27	Palm Tree	Lab Speed	2%	Standard	Retrowave (II) event - Earn 350 Medals
1-Rare	28	Submarine	Crit Factor	2%	Standard	Deep Blue Sea event - Earn 350 Medals
1-Rare	29	Alien Head	Coins	2%	Standard	Aliens (II) event - Earn 350 Medals
1-Rare	30	Warp Gate	Coins	2%	Standard	Faster Than Light event - Earn 350 Medals
1-Rare	31	Barnacle	Health	2%	Standard	Ocean Night (II) event - Earn 350 Medals
1-Rare	32	Pizza	Damage	2%	Standard	Invaders event - Earn 350 Medals
1-Rare	33	Refraction Array	Coins	2%	Standard	Prismatic Lines (II) event - Earn 350 Medals
1-Rare	34	Hook	Damage / Meter	2%	Standard	Sunset Fishing event - Earn 350 Medals
1-Rare	35	Cobweb	Health	2%	Standard	Cobweb (II) event - Earn 350 Medals
1-Rare	36	Gale Winds	Coins	2%	Standard	Into the Storm event - Earn 350 Medals
1-Rare	37	Clip Ons	Crit Factor	2%	Standard	Into the Matrix (II) event - Earn 350 Medals
1-Rare	38	Rain Jacket	Health	2%	Standard	Rainfall event - Earn 350 Medals
1-Rare	39	Rabies	Lab Speed	2%	Standard	Viral Outbreak (II) event - Earn 350 Medals
1-Rare	40	Comet	Damage	2%	Standard	Interstellar (III) event - Earn 350 Medals
1-Rare	41	Remote Control	Damage / Meter	2%	Standard	Tower's Channel event - Earn 350 Medals
1-Rare	42	Anubis	Coins	2%	Standard	Sands of Time (II) event - Earn 350 Medals
1-Rare	43	Lava Flow	Health	2%	Standard	Volcano (III) event - Earn 350 Medals
1-Rare	44	Abduction Room	Health	2%	Standard	Abduction event - Earn 350 Medals
1-Rare	45	Acorn	Damage / Meter	2%	Standard	Autumn (II) event - Earn 350 Medals
1-Rare	46	Cauldron	Lab Speed	2%	Standard	Halloween (II) event - Earn 350 Medals
1-Rare	47	Icicle	Damage	2%	Standard	Snowstorm event - Earn 350 Medals
1-Rare	48	Koi Fish	Lab Speed	2%	Standard	Cherry Blossom (III) event - Earn 350 Medals
1-Rare	49	Tea Ceremony	Health	2%	Standard	Cherry Blossom (III) event - Earn 200 Medals
1-Rare	50	Lunar Cat Paw	Crit Chance	1%	Standard	Meowy Night event - Earn 350 Medals
1-Rare	51	Confetti Ball	Free Attack Upgrade	1%	Standard	New Year (II) event - Earn 350 Medals
1-Rare	52	Summit Starlight	Lab Speed	2%	Standard	Full Moon (II) event - Earn 350 Medals
1-Rare	53	Falling Apple	Free Defense Upgrade	1%	Standard	Gravity event - Earn 350 Medals
1-Rare	54	Power Glove	Damage	2%	Standard	Retro Arcade (II) event - Earn 350 Medals
1-Rare	55	Coral Crown	Health Regen	2%	Standard	Deep Blue Sea (II) event - Earn 350 Medals
1-Rare	56	Throne	Health	2%	Guild	Guild Season 1 - Spend 75 guild tokens
1-Rare	57	Temporal Rift	Cash	2%	Standard	What Time Is It? event - Earn 350 Medals
1-Rare	58	Hourglass	Coins	2%	Premium	What Time Is It? event - Premium 550 Medals
1-Rare	59	Haunted Mirror	Wall Rebuild	2s	Standard	Dark Strands (II) event - Earn 350 Medals
1-Rare	60	Whispering Web	Free Defense Upgrade	1%	Premium	Dark Strands (II) event - Premium 550 Medals
1-Rare	61	Pulsar Core	Recovery Amount	2%	Standard	Faster Than Light (II) event - Earn 350 Medals
1-Rare	62	Quantum Drive	Bot Range	1m	Premium	Faster Than Light (II) event - Premium 550 Medals
1-Rare	63	Bloom Burst	Cash	2%	Standard	Easter (II) event - Earn 350 Medals
1-Rare	64	Mystic Bunny	Coins	2%	Premium	Easter (II) event - Premium 550 Medals
1-Rare	65	Fancy Wires	Health Regen	2%	Guild	Guild Season 2 - Spend 75 guild tokens
1-Rare	66	Infinite Ruler	Free Utility Upgrade	1%	Standard	Pi event - Earn 350 Medals
1-Rare	67	Pi Seal	Lab Speed	2%	Premium	Pi event - Premium 550 Medals
1-Rare	68	UFO Beam	Knockback Force	2%	Standard	Invaders (II) event - Earn 350 Medals
1-Rare	69	Abduction Signal	Crit Factor	2%	Premium	Invaders (II) event - Premium 550 Medals
1-Rare	70	Honey Jar	Attack Speed	1%	Standard	Honey (III) event - Earn 350 Medals
1-Rare	71	Heavenly Sweet	Health	2%	Premium	Honey (III) event - Premium 550 Medals
1-Rare	72	Duck	Ultimate Damage	2%	Standard	Koi Pond event - Earn 350 Medals
1-Rare	73	Grass	Free Defense Upgrade	1%	Premium	Koi Pond event - Premium 550 Medals
1-Rare	74	Let's Mix	Coins	2%	Guild	Guild Season 3 - Spend 75 guild tokens
1-Rare	75	Plasma Globe	Bot Range	1m	Standard	Plasma Returns (III) event - Earn 350 Medals
1-Rare	76	Plasma Vortex	Damage	2%	Premium	Plasma Returns (III) event - Premium 550 Medals
1-Rare	77	Floppy Disk	Free Utility Upgrade	1%	Standard	Retrowave (III) event - Earn 350 Medals
1-Rare	78	Magic Cube	Crit Factor	2%	Premium	Retrowave (III) event - Premium 550 Medals
1-Rare	79	Safe Path	Damage	2%	Standard	Camping event - Earn 350 Medals
1-Rare	80	Shining Light	Crit Chance	1%	Premium	Camping event - Premium 550 Medals
1-Rare	81	Fisherman Set	Defense Absolute	2%	Standard	Sunset Fishing (II) event - Earn 350 Medals
1-Rare	82	Sunset Boat	Attack Speed	1%	Premium	Sunset Fishing (II) event - Premium 550 Medals
1-Rare	83	World Domination	Health	2%	Guild	Guild Season 4 - Spend 75 guild tokens
1-Rare	84	Model Training	Orb Speed	2%	Standard	Into the Matrix (III) event - Earn 350 Medals
1-Rare	85	Gnosis 	Free Defense Upgrade	1%	Premium	Into the Matrix (III) event - Premium 550 Medals
1-Rare	86	Rlyeh	Free Attack Upgrade	1%	Standard	Cthulhu event - Earn 350 Medals
1-Rare	87	Madness Induced	Crit Factor	2%	Premium	Cthulhu event - Premium 550 Medals
1-Rare	88	Breaking News	Bot Range	1m	Standard	Tower's Channel (II) event - Earn 350 Medals
1-Rare	89	Globalization	Damage	2%	Premium	Tower's Channel (II) event - Premium 550 Medals
1-Rare	90	Brunch	Knockback Force	2%	Standard	Autumn (III) event - Earn 350 Medals
1-Rare	91	Dry leaves	Free Attack Upgrade	1%	Premium	Autumn (III) event - Premium 550 Medals
1-Rare	92	Blood Monster	Defense %	1%	Guild	Guild Season 5 - Spend 75 guild tokens
1-Rare	93	Vr	Thorns	1%	Standard	Cyberpunk  event - Earn 350 Medals
1-Rare	94	Holographic Ads	Lab Speed	2%	Premium	Cyberpunk event - Premium 550 Medals
1-Rare	95	Good Hunting	Cash	2%	Standard	Cobweb (III) event - Earn 350 Medals
1-Rare	96	Spider Vision	Orb Speed	2%	Premium	Cobweb (III) event - Premium 550 Medals
1-Rare	97	Pinball	Defense Absolute	2%	Standard	Retro Arcade (III) event - Earn 350 Medals
1-Rare	98	To Infinity	Health Regen	2%	Premium	Retro Arcade (III) event - Premium 550 Medals
1-Rare	99	Explorer's Helmet	Health	2%	Standard	Crystal Cave event - Earn 350 Medals
1-Rare	100	Miner's Tool	Defense %	1%	Premium	Crystal Cave event - Premium 550 Medals
1-Rare	101	Star Path	Free Attack Upgrade	2%	Guild	Guild Season 6 - Spend 75 guild tokens
1-Rare	102	Snow Globe	Recovery Amount	2%	Standard	Snowstorm (II) event - Earn 350 Medals
1-Rare	103	Winter Gloves	Thorns	1%	Premium	Snowstorm (II) event - Premium 550 Medals
1-Rare	104	Party Popper	Free Attack Upgrade	1%	Standard	New Year (III) event - Earn 350 Medals
1-Rare	105	Champagne	Attack Speed	1%	Premium	New Year (III) event - Premium 550 Medals
1-Rare	106	Happiness Balloons	Defense Absolute	2%	Standard	Amusement Park event - Earn 350 Medals
1-Rare	107	Delicious Food	Cash	2%	Premium	Amusement Park event - Premium 550 Medals
1-Rare	108	Sky's Curtain	Free Defense Upgrade	1%	Standard	Aurora (III) event - Earn 350 Medals
1-Rare	109	Solar Flare	Crit Chance	1%	Premium	Aurora (III) event - Premium 550 Medals
1-Rare	110	Elemental Explosion	Rend Armor Mult	2%	Guild	Guild Season 7 - Spend 75 guild tokens
1-Rare	111	Sudden Attack	Health Regen	2%	Standard	Aliens (III) event - Earn 350 Medals
1-Rare	112	Alien Experiment	Bot Range	1m	Premium	Aliens (III) event - Premium 550 Medals
1-Rare	113	Bouquet	Health	2%	Standard	Valentine event - Earn 350 Medals
1-Rare	114	Love Letter	Damage / Meter	2%	Premium	Valentine event - Premium 550 Medals
1-Rare	115	Lighthouse	Recovery Amount	2%	Standard	Ocean Night (III) event - Earn 350 Medals
1-Rare	116	Night Shark	Cash	2%	Premium	Ocean Night (III) event - Premium 550 Medals
1-Rare	117	Festival Lanterns	Knockback Force	2%	Standard	Cherry Blossom (IV) event - Earn 350 Medals
1-Rare	118	Ramen	Free Utility Upgrade	1%	Premium	Cherry Blossom (IV) event - Premium 550 Medals
1-Rare	119	Perfect Catch	Free Utility Upgrade	1%	Guild	Guild Season 8 - Spend 75 guild tokens
1-Rare	120	Broken Security	Health Regen	2%	Standard	Glitch event - Earn 350 Medals
1-Rare	121	Research Object	Damage	2%	Premium	Glitch event - Premium 550 Medals
1-Rare	122	Ancient Times	Defense Absolute	2%	Standard	What time is it? (II) event - Earn 350 Medals
1-Rare	123	Space Distortion	Attack Speed	1%	Premium	What time is it? (II) event - Premium 550 Medals
1-Rare	124	Nature's Fury	Defense %	1%	Standard	Into the Storm event (II) - Earn 350 Medals
1-Rare	125	Big Tornado	Damage / Meter	2%	Premium	Into the Storm event (II) - Premium 550 Medals
1-Rare	126	Synapse	Knockback Force	2%	Standard	Neuron - Earn 350 Medals
1-Rare	127	Neural Network	Coins	2%	Premium	Neuron - Premium 550 Medals
2-Epic	1	Gold Badge	Crit Factor	5%	Tournament	Finish P4 in Gold
2-Epic	2	Platinum Badge	Lab Speed	4%	Tournament	Finish P4 in Platinum
2-Epic	3	T: VI Nova	Defense Absolute	5%	Milestone	Beat w4500 in T6
2-Epic	4	T: VII Aether	Coins	5%	Milestone	Beat w4500 in T7
2-Epic	5	T: VIII Graviton	Damage / Meter	5%	Milestone	Beat w4500 in T8
2-Epic	6	T: IX Fusion	Health	5%	Milestone	Beat w4500 in T9
2-Epic	7	T: X Plasma	Damage / Meter	5%	Milestone	Beat w4500 in T10
2-Epic	8	Red Pill	Health	5%	Standard	Into the Matrix - Earn 700 Medals
2-Epic	9	Neuron	Health	5%	Standard	Viral Outbreak event - Earn 700 Medals
2-Epic	10	Spirit Wolf	Crit Factor	5%	Standard	Full Moon event - Earn 700 Medals
2-Epic	11	Plasma Arc	Lab Speed	4%	Standard	Plasma Returns (II) event - Earn 700 Medals
2-Epic	12	Space Sundial	Damage	5%	Standard	Sands of Time event - Earn 700 Medals
2-Epic	13	Pumpkin	Lab Speed	4%	Standard	Autumn event - Earn 700 Medals
2-Epic	14	Man Skull	Health	5%	Standard	Halloween event - Earn 700 Medals
2-Epic	15	Sakura Lantern	Coins	5%	Standard	Cherry Blossom (II) event - Earn 700 Medals
2-Epic	16	Controller	Crit Factor	5%	Standard	Retro Arcade event - Earn 700 Medals
2-Epic	17	Stinger	Crit Factor	5%	Standard	Honey (II) event - Earn 700 Medals
2-Epic	18	Cheers	Defense Absolute	5%	Standard	New Year event - Earn 700 Medals
2-Epic	19	Contained Ions	Defense Absolute	5%	Standard	Aurora (II) event - Earn 700 Medals
2-Epic	20	Creepy Smile	Damage	5%	Standard	Dark Strands event - Earn 700 Medals
2-Epic	21	Pixel Cube Heart	Health	5%	Standard	Retrowave (II) event - Earn 700 Medals
2-Epic	22	The Kraken	Defense Absolute	5%	Standard	Deep Blue Sea event - Earn 700 Medals
2-Epic	23	Alien Warp Drive	Damage / Meter	5%	Standard	Aliens (II) event - Earn 700 Medals
2-Epic	24	Star Ship	Lab Speed	4%	Standard	Faster Than Light event - Earn 700 Medals
2-Epic	25	Wave	Crit Factor	5%	Standard	Ocean Night (II) event - Earn 700 Medals
2-Epic	26	Illuminati	Defense Absolute	5%	Standard	Invaders event - Earn 700 Medals
2-Epic	27	Prismatic Shard	Damage / Meter	5%	Standard	Prismatic Lines (II) event - Earn 700 Medals
2-Epic	28	Fish	Defense Absolute	5%	Standard	Sunset Fishing event - Earn 700 Medals
2-Epic	29	The Fly	Defense Absolute	5%	Standard	Cobweb (II) event - Earn 700 Medals
2-Epic	30	Flying House	Damage	5%	Standard	Into the Storm event - Earn 700 Medals
2-Epic	31	Code Stream	Damage	5%	Standard	Into the Matrix (II) event - Earn 700 Medals
2-Epic	32	Cloud Lightning	Crit Factor	5%	Standard	Rainfall event - Earn 700 Medals
2-Epic	33	Ebola	Defense Absolute	5%	Standard	Viral Outbreak (II) event - Earn 700 Medals
2-Epic	34	Planetary Rings	Crit Factor	5%	Standard	Interstellar (III) event - Earn 700 Medals
2-Epic	35	Cathode Ray Tube	Coins	5%	Standard	Tower's Channel event - Earn 700 Medals
2-Epic	36	Sphinx	Damage	5%	Standard	Sands of Time (II) event - Earn 700 Medals
2-Epic	37	Ash Cloud	Defense Absolute	5%	Standard	Volcano (III) Event - Earn 700 Medals
2-Epic	38	Crop Circle	Crit Factor	5%	Standard	Abduction Event - Earn 700 Medals
2-Epic	39	Scarf	Defense Absolute	5%	Standard	Autumn (II) event - Earn 700 Medals
2-Epic	40	Witch Hat	Damage	5%	Standard	Halloween (II) event - Earn 700 Medals
2-Epic	41	Sleigh Bell	Health	5%	Standard	Snowstorm event - Earn 700 Medals
2-Epic	42	Bonsai Tree	Coins	5%	Standard	Cherry Blossom (III) event - Earn 700 Medals
2-Epic	43	Kimono	Coins	5%	Standard	Cherry Blossom (III) event - Earn 500 Medals
2-Epic	44	Pet Cat	Attack Speed	2%	Standard	Meowy Night event - Earn 700 Medals
2-Epic	45	Party Mask	Ultimate Damage	5%	Standard	New Year (II) event - Earn 700 Medals
2-Epic	46	Mountain Goat	Health	5%	Standard	Full Moon (II) event - Earn 700 Medals
2-Epic	47	3 Body Solution	Super Critical Chance	2%	Standard	Gravity event - Earn 700 Medals
2-Epic	48	Arcade Token	Bot Range	2m	Standard	Retro Arcade (II) event - Earn 700 Medals
2-Epic	49	Angler Fish	Thorns	2%	Standard	Deep Blue Sea (II) event - Earn 700 Medals
2-Epic	50	Crown	Crit Factor	5%	Guild	Guild Season 1 - Spend 150 Tokens
2-Epic	51	Dream Clock	Orb Speed	5%	Standard	What Time Is It? event - Earn 700 Medals
2-Epic	52	Time Compass	Attack Speed	2%	Premium	What Time Is It? event - Premium 1100 Medals
2-Epic	53	Shadow Puppet	Super Critical Mult	5%	Standard	Dark Strands (II) event - Earn 700 Medals
2-Epic	54	Cursed Candle	Super Critical Chance	2%	Premium	Dark Strands (II) event - Premium 1100 Medals
2-Epic	55	Light Speedometer	Enemy Attack Level Skip	2%	Standard	Faster Than Light (II) event - Earn 700 Medals
2-Epic	56	Photon Blade	Damage	5%	Premium	Faster Than Light (II) event - Premium 1100 Medals
2-Epic	57	Candy Core	Damage	5%	Standard	Easter (II) event - Earn 700 Medals
2-Epic	58	Magic Egg	Free Attack Upgrade	2%	Premium	Easter (II) event - Premium 1100 Medals
2-Epic	59	Mech Head	Bot Range	2m	Guild	Guild Season 2 - Spend 150 Tokens
2-Epic	60	Do While True	Orb Speed	5%	Standard	Pi event - Earn 700 Medals
2-Epic	61	Psychohistorian Brain	Super Critical Chance	2%	Premium	Pi event - Premium 1100 Medals
2-Epic	62	Alien Egg	Enemy Health Level Skip	2%	Standard	Invaders (II) event - Earn 700 Medals
2-Epic	63	Monolith	Ultimate Damage	5%	Premium	Invaders (II) event - Premium 1100 Medals
2-Epic	64	Honey Society	Knockback Force	5%	Standard	Honey (III) event - Earn 700 Medals
2-Epic	65	The Queen	Coins	5%	Premium	Honey (III) event - Premium 1100 Medals
2-Epic	66	Wind	Damage / Meter	5%	Standard	Koi Pond event - Earn 700 Medals
2-Epic	67	Lilies	Recovery Amount	5%	Premium	Koi Pond event - Premium 1100 Medals
2-Epic	68	Night Life	Attack Speed	2%	Guild	Guild Season 3 - Spend 150 Tokens
2-Epic	69	Plasma Cell	Crit Chance	2%	Standard	Plasma Returns (III) event - Earn 700 Medals
2-Epic	70	Plasma Chamber	Health	5%	Premium	Plasma Returns (III) event - Premium 1100 Medals
2-Epic	71	Retro Camera	Health Regen	5%	Standard	Retrowave (III) event - Earn 700 Medals
2-Epic	72	Night City	Cash	5%	Premium	Retrowave (III) event - Premium 1100 Medals
2-Epic	73	Eternal Quest	Health	5%	Standard	Camping event - Earn 700 Medals
2-Epic	74	Nature's Wrath	Orb Speed	5%	Premium	Camping event - Premium 1100 Medals
2-Epic	75	Good Catch	Thorns	2%	Standard	Sunset Fishing (II) event - Earn 700 Medals
2-Epic	76	River Of Plenty	Coins	5%	Premium	Sunset Fishing (II) event - Premium 1100 Medals
2-Epic	77	Brave Heroes	Crit Factor	5%	Guild	Guild Season 4 - Spend 150 Tokens
2-Epic	78	Tower Agent	Damage / Meter	5%	Standard	Into the Matrix (III) event - Earn 700 Medals
2-Epic	79	Fake Reality	Ultimate Damage	5%	Premium	Into the Matrix (III) event - Premium 1100 Medals
2-Epic	80	Cosmic Freedom	Health Regen	5%	Standard	Cthulhu event - Earn 700 Medals
2-Epic	81	Omniscience	Cash	5%	Premium	Cthulhu event - Premium 1100 Medals
2-Epic	82	No Signal	Crit Chance	2%	Standard	Tower's Channel (II) event - Earn 700 Medals
2-Epic	83	Antenna	Health	5%	Premium	Tower's Channel (II) event - Premium 1100 Medals
2-Epic	84	Glowing Mushrooms	Thorns	2%	Standard	Autumn (III) event - Earn 700 Medals
2-Epic	85	Warm Clothes	Lab Speed	4%	Premium	Autumn (III) event - Premium 1100 Medals
2-Epic	86	Glimpse of Despair	Crit Factor	5%	Guild	Guild Season 5 - Spend 150 Tokens
2-Epic	87	Tech Weapon	Recovery Amount	5%	Standard	Cyberpunk  event - Earn 700 Medals
2-Epic	88	Cybernetics	Crit Chance	2%	Premium	Cyberpunk event - Premium 1100 Medals
2-Epic	89	Spider Poison	Ultimate Damage	5%	Standard	Cobweb (III) event - Earn 700 Medals
2-Epic	90	Spider Forest	Crit Factor	5%	Premium	Cobweb (III) event - Premium 1100 Medals
2-Epic	91	Let's Play	Damage	5%	Standard	Retro Arcade (III) event - Earn 700 Medals
2-Epic	92	Enemies	Coins	5%	Premium	Retro Arcade (III) event - Premium 1100 Medals
2-Epic	93	Crystals Bag	Knockback Force	5%	Standard	Crystal Cave event - Earn 700 Medals
2-Epic	94	Full Minecart	Bot Range	2m	Premium	Crystal Cave event - Premium 1100 Medals
2-Epic	95	Star Planet	Health Regen	5%	Guild	Guild Season 6 - Spend 150 Tokens
2-Epic	96	Snowflake	Damage / Meter	5%	Standard	Snowstorm (II) event - Earn 700 Medals
2-Epic	97	Wreath	Damage	5%	Premium	Snowstorm (II) event - Premium 1100 Medals
2-Epic	98	Firework Rocket	Free Utility Upgrade	2%	Standard	New Year (III) event - Earn 700 Medals
2-Epic	99	Gift box	Lab Speed	4%	Premium	New Year (III) event - Premium 1100 Medals
2-Epic	100	Amazing Prizes	Thorns	2%	Standard	Amusement Park event - Earn 700 Medals
2-Epic	101	Carousel Of Joy	Coins	5%	Premium	Amusement Park event - Premium 1100 Medals
2-Epic	102	Northern Mountains	Defense %	2%	Standard	Aurora (III) event - Earn 700 Medals
2-Epic	103	Cosmic Impact	Orb Speed	5%	Premium	Aurora (III) event - Premium 1100 Medals
2-Epic	104	Quasar	Health	5%	Guild	Guild Season 7 - Spend 150 Tokens
2-Epic	105	Crop Circles	Knockback Force	5%	Standard	Aliens (III) event - Earn 700 Medals
2-Epic	106	Alien Implants	Ultimate Damage	5%	Premium	Aliens (III) event - Premium 1100 Medals
2-Epic	107	Lovely Gift	Knockback Force	5%	Standard	Valentine event - Earn 700 Medals
2-Epic	108	Pierced Heart	Ultimate Damage	5%	Premium	Valentine event - Premium 1100 Medals
2-Epic	109	Sailing At Night	Health	5%	Standard	Ocean Night (III) event - Earn 700 Medals
2-Epic	110	Moonlight	Crit Factor	5%	Premium	Ocean Night (III) event - Premium 1100 Medals
2-Epic	111	Forest Temple	Thorns	2%	Standard	Cherry Blossom (IV) event - Earn 700 Medals
2-Epic	112	Tori	Orb Speed	5%	Premium	Cherry Blossom (IV) event - Premium 1100 Medals
2-Epic	113	Collector's Spirit	Damage	5%	Guild	Guild Season 8 - Spend 150 Tokens
2-Epic	114	Digital Disaster	Free Defense Upgrade	2%	Standard	Glitch event - Earn 700 Medals
2-Epic	115	Instability	Damage / Meter	5%	Premium	Glitch event - Premium 1100 Medals
2-Epic	116	Clock Tower	Cash	5%	Standard	What Time Is It? (II) event - Earn 700 Medals
2-Epic	117	Time Travel	Crit Chance	2%	Premium	What Time Is It? (II) event - Premium 1100 Medals
2-Epic	118	Natural Fire	Health Regen	5%	Standard	Into the Storm (II) event - Earn 700 Medals
2-Epic	119	Storm Planet	Lab Speed	4%	Premium	Into the Storm (II) event - Premium 1100 Medals
2-Epic	120	Brain Net	Free Utility Upgrade	2%	Standard	Neuron event - Earn 700 Medals
2-Epic	121	Body Control	Ultimate Damage	5%	Premium	Neuron event - Premium 1100 Medals
3-Legendary	1	Champion Badge	Damage / Meter	10%	Tournament	Finish P4 in Champion
3-Legendary	2	Tower Master	Health	10%	Tournament	Finish P4 in Legend
3-Legendary	3	T: XI Resonance	Defense Absolute	10%	Milestone	Beat w4500 in T11
3-Legendary	4	T: XII Chrono	Lab Speed	10%	Milestone	Beat w4500 in T12
3-Legendary	5	T: XIII Hyper	Coins	10%	Milestone	Beat w4500 in T13
3-Legendary	6	T: XIV Arcane	Damage	10%	Milestone	Beat w4500 in T14
3-Legendary	7	T: XV Celestial	Crit Factor	10%	Milestone	Beat w4500 in T15
3-Legendary	8	T: XVI Quantum	Health	10%	Milestone	Beat w4500 in T16
3-Legendary	9	T: XVII Nebula	Damage / Meter	10%	Milestone	Beat w4500 in T17
3-Legendary	10	T: XVIII Singularity	Lab Speed	10%	Milestone	Beat w4500 in T18
3-Legendary	11	T: XIX Atomic	Damage	10%	Milestone	Beat w4500 in T19
3-Legendary	12	T: XX Cyber	Ultimate Damage	8%	Milestone	Beat w4500 in T20
3-Legendary	13	T: XXI Eclipse	Lab Speed	10%	Milestone	Beat w4500 in T21
3-Legendary	14	Legend Badge	Crit Factor	10%	Tournament	Win Legend`

const refRows = REF_TSV.split('\n')
  .map((line) => line.trim())
  .filter(Boolean)
  .map((line) => {
    const [rarity, , name, bonus, value, type, unlockedBy] = line.split('\t')
    return {
      rarity: RARITY_MAP[rarity],
      name: name.trim(),
      bonus: bonus.trim(),
      value: value.trim(),
      type: type.trim(),
      unlockedBy: unlockedBy.trim(),
    }
  })

const byName = new Map()
for (const r of relics) {
  byName.set(normName(r.name), r)
}

const missingInApp = []
const extraInApp = []
const mismatches = []

for (const ref of refRows) {
  const key = normName(ref.name)
  const app = byName.get(key)
  if (!app) {
    missingInApp.push(ref)
    continue
  }
  byName.delete(key)

  const issues = []
  if (app.rarity !== ref.rarity) {
    issues.push(`rarity: app=${app.rarity} ref=${ref.rarity}`)
  }
  const expDesc = expectedDescription(ref.bonus, ref.value)
  const dm = descMatches(expDesc, app.description)
  if (!dm.ok) issues.push(dm.reason)

  const expGroup = typeToUnlockGroup(ref.type, ref.unlockedBy)
  if (app.unlockGroup !== expGroup) {
    issues.push(`unlockGroup: app=${app.unlockGroup} ref=${expGroup}`)
  }

  const premium = isPremium(ref.type, ref.unlockedBy)
  const appPremium = /premium/i.test(app.unlock)
  if (premium !== appPremium) {
    issues.push(`premium flag: app=${appPremium} ref=${premium}`)
  }

  const medals = medalFromUnlockedBy(ref.unlockedBy, ref.rarity)
  if (medals != null) {
    const appMedals = app.unlock.match(/(\d+)\s*medals?/i)
    const appNum = appMedals ? Number(appMedals[1]) : null
    if (appNum !== medals) {
      issues.push(`medals: app=${appNum} ref=${medals}`)
    }
  }

  if (issues.length) {
    mismatches.push({ name: ref.name, id: app.id, issues })
  }
}

for (const [, app] of byName) {
  extraInApp.push({ name: app.name, id: app.id })
}

console.log('=== RELIC TABLE vs APP ===')
console.log(`Reference: ${refRows.length} | App: ${relics.length}`)
console.log(`Missing in app: ${missingInApp.length}`)
console.log(`Extra in app (not in table): ${extraInApp.length}`)
console.log(`Field mismatches: ${mismatches.length}`)
console.log()

if (missingInApp.length) {
  console.log('--- MISSING IN APP ---')
  for (const r of missingInApp) {
    console.log(`  [${r.rarity}] ${r.name} — ${r.bonus} ${r.value} | ${r.unlockedBy}`)
  }
  console.log()
}

if (extraInApp.length) {
  console.log('--- EXTRA IN APP (name not in table) ---')
  for (const r of extraInApp.sort((a, b) => a.name.localeCompare(b.name))) {
    console.log(`  ${r.name} (${r.id})`)
  }
  console.log()
}

if (mismatches.length) {
  console.log('--- MISMATCHES ---')
  for (const m of mismatches) {
    console.log(`  ${m.name} [${m.id}]`)
    for (const i of m.issues) console.log(`    - ${i}`)
  }
}
