# Random Encounter Generator
> **Minimum Viable Product:** Randomly create combat encounters for D&D 5e based on a party size and level

## Stretch Goals
- [x] choose single, group or horde of monsters
> group = 2/3 number of party, horde = 1.5 number of party ??
- [ ] choose easy, medium, hard or deadly
> option for higher levels, either maximum recommended (1/3 of daily) or daily budget
- [ ] choose 'skew' to easier or deadlier
> easier skew would choose the highest difficulty below the suggested XP, deadlier would choose the lowest difficulty above the suggested XP
- [ ] combine players at different levels
- [ ] filter monsters by creature type
- [ ] filter monsters by environment

## Reuqired Math Data
- (Adjusted) XP per player by level, for Easy to Deady
- [ (Adjusted) Adventuring Day XP per player by level ]
- Mulitplier of number of monsters (+/- for large/small parties)
> <3 players: +1 multiplier, >5 players: -1 multiplier
- Monster XP by CR

## Pseudocode
### All
- [ ] Get numbers of players *(Note change in multiplier if <3 or >5)*
- [ ] Get level of players
- [ ] Get single/group/horder choice
- [ ] *Get preferred encounter difficulty*
- [ ] Calculate Adjusted XP at preferred/all difficulty level(s)
> e.g. 4x Level 3 players, hard encounter: 225 x 4 = 900

### Single
**per difficulty level**
> (?) Check D&D API for CR value type!
- [ ] Get CR closest to adjusted XP for encounter *(take higher if no more than 10% above?)*
> e.g. 900 * 1.1 = 990 (max), CR4 = 1100, CR3 = 700; choose CR3
- [ ] Request to D&D API for creatures of selected CR
- [ ] Choose one creature at random from that collection
- [ ] Display to page *(with link to data)*

### Group/Horde
**per difficulty level**
- [ ] calculate size of group or horde
> e.g. 4 players: horde is 4 x 1.5 = 6 creatures
- [ ] find multiplier, inc. for small/large party
> e.g. 4 players: no change to multipler: 6 creatures = x2 multiplier
- [ ] calculate unadjusted XP value per monster
> e.g. hard encounter = 900; 900 / 2 = 450; 450 / 6 = 75 per monster

*as per single monster*
- [ ] Get CR closest to adjusted XP for encounter *(take higher if no more than 10% above?)*
> e.g. 75 * 1.1 = 82.5 (max), CR1/2 = 100, CR1/4 = 50; choose CR1/4
- [ ] Request to D&D API for creatures of selected CR
- [ ] Choose one creature at random from that collection
- [ ] Display to page with count (e.g.: 6) *(with link to data)*