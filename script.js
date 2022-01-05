const app = {}

app.init = () => {
  console.log('app loaded!');
  app.formSetup();
}

app.formSetup = () => {
  //  grab the form 
  app.submitForm = document.querySelector('.searchData');
  
  // create an event to listen for click
  app.submitForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // get the values from the form
    const searchCriteria = {}
    searchCriteria.noOfPlayers = document.getElementById('noOfPlayers').value,
    searchCriteria.playerLevel = document.getElementById('playerLevel').value,
    searchCriteria.difficulty = document.getElementById('difficulty').value,

    // run the CR calculator with those settings
    app.calculateXP(searchCriteria)
  })
}

app.calculateXP = (criteria) => {
  const { difficulty, noOfPlayers, playerLevel } = criteria;
  
  // calculate total party XP
  const partyXP = noOfPlayers * app.gamedata.xpByLevel[difficulty][playerLevel];
  
  // determine group & horde size
  const group = Math.ceil(noOfPlayers * 0.5);
  const horde = Math.floor(noOfPlayers * 1.5);
  
  // calculate XP for single/group/horde
  const monsterXP = {
    single: partyXP
  }

  // determine multipliers and calculate individual XP for groups
  app.caclulateGroupsXP = (sizeName, size) => {
    app.gamedata.monsterMultiplier.forEach((category, index) => {
      if ( size >= category.min && size <= category.max) {
        if (noOfPlayers < 3) {
          const higherIndex = index + 1;
          const incMult = app.gamedata.monsterMultiplier[higherIndex].multiplier;
          monsterXP[sizeName] = Math.floor(partyXP / incMult / size);
        }
        else if (noOfPlayers > 5) {
          const lowerIndex = index - 1;
          const decMult = app.gamedata.monsterMultiplier[lowerIndex].multiplier;
          monsterXP[sizeName] = Math.floor(partyXP / decMult / size);
        }
        else if (app.partySize = 'normal') {
          monsterXP[sizeName] = Math.floor(partyXP / category.multiplier / group);
        }
      }  
    })
  }
  app.caclulateGroupsXP('group', group);
  app.caclulateGroupsXP('horde', horde);

  // calculate CR for individual monster categories
  app.calculateCR(monsterXP);
}

app.calculateCR = (monsterXP) => {
  const monsterCR = {}
  // calculate XP per monster based on settings for single, group, horde
  for (const size in monsterXP) {
    // calculate best CR for required monster XP value
    for (const xp in app.gamedata.xpByCR) {
      if ( +xp <= monsterXP[size] ) {
        monsterCR[size] = app.gamedata.xpByCR[xp];
      }
    }
  }
  app.getMonsterList(monsterCR);
}

app.getMonsterList = async (monsterCR) => {
  const monsterLists = {}
  // call API for each CR by group
  for (const size in monsterCR) {
    const url = new URL('https://www.dnd5eapi.co/api/monsters');
    url.search = new URLSearchParams({
      reqUrl: url,
      challenge_rating: monsterCR[size]
    })
    // add a list of monsters to each size category
    const promiseObject = await fetch(url);
    const monsterData = await promiseObject.json()
    monsterLists[size] = monsterData.results;
  }
  app.selectRandom(monsterLists)
}

app.selectRandom = (monsterLists) => {
  const randomMonsters = {}
  for (const category in monsterLists) {
    // console.log(category, monsterLists[category]);
    const arrayLength = monsterLists[category].length;
    const randomIndex = Math.floor(Math.random() * arrayLength);
    // console.log(monsterLists[category][randomIndex]);
    randomMonsters[category] = monsterLists[category][randomIndex];
  }
  // console.log(randomMonsters);
  app.displayMonsters(randomMonsters);
}

app.displayMonsters = (randomMonsters) => {
  console.log('ready to show some creatures!', randomMonsters);
}

app.gamedata = {
  xpByLevel: {
    easy: [
      0,
      25,
      50,
      75,
      125,
      250,
      300,
      350,
      450,
      550,
      600,
      800,
      1000,
      1100,
      1250,
      1400,
      1600,
      2000,
      2100,
      2400,
      2800
    ],
    medium: [
      0,
      50,
      100,
      150,
      250,
      500,
      600,
      750,
      900,
      1100,
      1200,
      1600,
      2000,
      2200,
      2500,
      2800,
      3200,
      3900,
      4200,
      4900,
      5700
    ],
    hard: [
      0,
      75,
      150,
      225,
      375,
      750,
      900,
      1100,
      1400,
      1600,
      1900,
      2400,
      3000,
      3400,
      3800,
      4300,
      4800,
      5900,
      6300,
      7300,
      8500
    ],
    deadly: [
      0,
      100,
      200,
      400,
      500,
      1100,
      1400,
      1700,
      2100,
      2400,
      2800,
      3600,
      4500,
      5100,
      5700,
      6400,
      7200,
      8800,
      9500,
      10900,
      12700
    ],
    daily: [
      0,
      300,
      600,
      1200,
      1700,
      3500,
      4000,
      5000,
      6000,
      7500,
      9000,
      10500,
      11500,
      13500,
      15000,
      18000,
      20000,
      25000,
      27000,
      30000,
      40000
    ]
  },
  monsterMultiplier: [
    {
      min: 0,
      max: 1,
      multiplier: 1
    },
    {
      min: 2,
      max: 2,
      multiplier: 1.5
    },
    {
      min: 3,
      max: 6,
      multiplier: 2
    },
    {
      min: 7,
      max: 10,
      multiplier: 2.5
    },
    {
      min: 11,
      max: 14,
      multiplier: 3
    },
    {
      min: 15,
      max: 100,
      multiplier: 4
    }
  ],
  xpByCR: {
    10: 0,
    25: 0.125,
    50: 0.25,
    100: 0.5,
    200: 1,
    450: 2,
    700: 3,
    1100: 4,
    1800: 5,
    2300: 6,
    2900: 7,
    3900: 8,
    5000: 9,
    5900: 10,
    7200: 11,
    8400: 12,
    10000: 13,
    11500: 14,
    13000: 15,
    15000: 16,
    18000: 17,
    20000: 18,
    22000: 19,
    25000: 20,
    33000: 21,
    41000: 22,
    50000: 23,
    62000: 24,
    75000: 25,
    90000: 26,
    105000: 27,
    120000: 28,
    135000: 29,
    155000: 30,
  }
}

app.init();