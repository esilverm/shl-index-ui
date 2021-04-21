# SHL Index

## Getting Started

### Installation

1. On linux debian based systems, run to install npm

```bash
sudo apt install npm
```

**Note: There may be other dependancies that need installed with nmp**

2. Clone the repository to your local environment

```bash
git clone https://github.com/esilverm/shl-index-ui
```

**Note: when making changes, it is best to fork the repository and submit pull requests**

3. Navigate to the directory

```bash
cd shl-index-ui
```

4. Install all libraries

```bash
npm install
```

5. Get the .env.local file from one of the head developers and place it in the top level directory.

### Run The Development Server

1. SSH tunnel into the production server to get access to the database

```bash
# run the ssh tunnel in a detached process
ssh -N -L 3306:127.0.0.1:3306 <username>@<server> -p <port> &
```

2. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://127.0.0.1:3000](http://127.0.0.1:3000) with your browser to see the result.

**Note: Only the localhost ip address will work for the development server. (http://127.0.0.1:3000)**

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

## Architecture

As the overall system is setup using Next.js, the entire project is a set of pages, libraries, components, and static content.

### Pages

The physical number of defined pages is very limited, depending mostly on the league, season, and various ids.  
Each of these pages calls to a compenent that then calls into the api to get its data.

#### Tree

```bash
pages/
├── api (directory)
├── _app.tsx
├── _document.tsx
├── index.tsx
├── [league]
│   ├── index.tsx
│   ├── leaders.tsx
│   ├── players.tsx
│   ├── schedule.tsx
│   ├── [season]
│   │   └── game
│   │       └── [gameid].tsx
│   ├── standings.tsx
│   └── team
│       ├── index.tsx
│       └── [teamid].tsx
├── player
│   └── [id].tsx
└── vhl.tsx
```

### API

The API is where the interface with the database takes place. It allows anyone to get whatever information they need to access in the SHL database.
The SHL API can be accessed right on the main [site](https://index.simulationhockey.com/api).

#### Tree

```bash
api/
├── index.ts
└── v1
    ├── conferences
    │   ├── [id].ts
    │   └── index.ts
    ├── divisions
    │   ├── [id].ts
    │   └── index.ts
    ├── goalies
    │   ├── index.ts
    │   ├── ratings.ts
    │   └── stats.ts
    ├── leaders
    │   ├── goalies
    │   │   ├── gaa.ts
    │   │   ├── gamesplayed.ts
    │   │   ├── ga.ts
    │   │   ├── gsaa.ts
    │   │   ├── losses.ts
    │   │   ├── otl.ts
    │   │   ├── savepct.ts
    │   │   ├── saves.ts
    │   │   ├── shutouts.ts
    │   │   └── wins.ts
    │   └── skaters
    │       ├── assists.ts
    │       ├── goals.ts
    │       ├── penaltyminutes.ts
    │       ├── plusminus.ts
    │       ├── points.ts
    │       ├── ppg.ts
    │       ├── shg.ts
    │       ├── shotpct.ts
    │       ├── shotsblocked.ts
    │       └── shots.ts
    ├── leagues
    │   ├── index.ts
    │   └── seasons.ts
    ├── players
    │   ├── index.ts
    │   ├── ratings.ts
    │   └── stats.ts
    ├── schedule
    │   ├── game
    │   │   └── [gameId].ts
    │   ├── header.ts
    │   └── index.ts
    ├── standings
    │   ├── index.ts
    │   ├── playoffs.ts
    │   └── preseason.ts
    └── teams
        ├── [id]
        │   ├── index.ts
        │   ├── roster
        │   │   ├── index.ts
        │   │   └── stats.ts
        │   └── schedule.ts
        └── index.ts
```

### Libraries

There are only two files in the library.

1. db.js - used as the interface with the SQL database
2. middleware.ts - provides a helper method to wait for middleware to execute before continuing

#### Tree

```bash
lib/
├── db.js
└── middleware.ts
```

### Components

This is where all the work on the pages themselves happen. The components are doing all the interacting with the API and filled based on the results.

#### Tree

```bash
components/
├── Footer.tsx
├── GameDaySchedule.tsx
├── Header.tsx
├── HomepageLeaders.tsx
├── LinkWithSeason.tsx
├── Livestream.tsx
├── PlayoffsBracket.tsx
├── RatingsTable
│   ├── GoalieRatingsTable.tsx
│   ├── index.tsx
│   └── SkaterRatingsTable.tsx
├── ScheduleTable.tsx
├── ScoreBarItem.tsx
├── ScoreBar.tsx
├── ScoreTable
│   ├── GoalieScoreTable.tsx
│   ├── index.tsx
│   ├── SkaterAdvStatsTable.tsx
│   └── SkaterScoreTable.tsx
├── Selector
│   ├── SeasonSelector.tsx
│   ├── SeasonTypeSelector.tsx
│   ├── styles.ts
│   └── TeamSelector.tsx
└── StandingsTable.tsx
```

### Static Content

All static content is held in the public directory, per Next.js standards.
This is the location of all of the different images that apppear throughout the site.

#### Tree

public/
├── 404.mp4
├── 404.webm
├── back.svg
├── ChallengeCup.png
├── docs.html
├── favicon.ico
├── favicon.svg
├── league_logos
│ ├── IIHF.svg
│ ├── SHL.svg
│ ├── SMJHL.svg
│ └── WJC.svg
├── swagger.json
├── swagger.yaml
├── team_logos
│ ├── IIHF
│ ├── index.js
│ ├── SHL
│ ├── SMJHL
│ └── WJC
└── vercel.svg

### Hooks

Hooks is a directory that contains helper functions for the players page.

#### Tree

```bash
hooks/
├── useGoalieRatings.ts
├── useGoalieStats.ts
├── useLeaders.ts
├── useRatings.ts
├── useSchedule.ts
├── useSkaterStats.ts
├── useStandings.ts
└── useTeamRosterStats.ts
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/import?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
