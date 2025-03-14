import { InternalPlayerAchievement } from 'typings/portalApi';

export const PlayerAwards = ({
  playerAwards,
}: {
  playerAwards: InternalPlayerAchievement[];
}) => {
  const uniqueAwardsNames = playerAwards
    .map((playerAward) => playerAward.achievementName)
    .filter((value, index, self) => self.indexOf(value) === index);

  return (
    <div className="flex flex-col items-center justify-center space-y-5">
      <div className="text-center font-mont text-lg uppercase">Awards</div>
      <div className="flex flex-col items-center justify-center space-y-2">
        {playerAwards.map((playerAward) => (
          <div
            key={playerAward.achievementName}
            className="flex flex-col items-center justify-center space-y-2"
          >
            <div className="text-center font-mont text-lg uppercase">
              {playerAward.achievementName}
            </div>
            <div> TeamID {playerAward.teamID}</div>

            <div className="text-center font-mont">
              {playerAward.won ? 'Won' : 'Lost'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
