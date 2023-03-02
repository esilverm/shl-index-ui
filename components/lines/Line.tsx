import { useRef } from 'react';

import { TeamLines } from '../../pages/api/v1/teams/[id]/lines';

import { LinePlayer } from './LinePlayer';

const LinePlayers = ({
  lineup,
}: {
  lineup: Partial<TeamLines['ES']['5on5']['L1']>;
}) => {
  return (
    <div className="mx-auto mb-5 flex w-full flex-col items-center justify-center">
      <div className="mb-5 flex w-full flex-row items-center justify-center">
        {lineup.LW && <LinePlayer player={lineup.LW} position="LW" />}
        {lineup.C && <LinePlayer player={lineup.C} position="C" />}
        {lineup.RW && <LinePlayer player={lineup.RW} position="RW" />}
      </div>
      <div className="mb-5 flex w-full flex-row items-center justify-center">
        {lineup.LD && <LinePlayer player={lineup.LD} position="LD" />}
        {lineup.RD && <LinePlayer player={lineup.RD} position="RD" />}
      </div>
    </div>
  );
};

export const Line = ({
  type,
  lines,
  columns = 3,
}: {
  type: string;
  lines:
    | TeamLines['ES'][Keys<TeamLines['ES']>]
    | TeamLines['PP'][Keys<TeamLines['PP']>]
    | TeamLines['PK'][Keys<TeamLines['PK']>];
  columns: 3 | 4;
}) => {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <div className="m-auto w-2/5 border-b border-b-grey900 py-5 text-center font-mont text-3xl font-semibold">
        {type.split('on').join(' on ')}
      </div>
      <div className="m-auto flex w-full items-center justify-between px-2.5">
        <div
          className="m-5 cursor-pointer font-mont text-5xl"
          onClick={() => {
            if (!ref.current) return;

            ref.current.scrollLeft -= ref.current.clientWidth;
          }}
        >
          &lt;
        </div>
        <div
          className="no-scrollbar mx-auto grid w-full snap-x snap-mandatory grid-flow-col overflow-y-hidden overflow-x-scroll scroll-smooth py-5"
          style={{
            gridTemplateColumns: `repeat(${columns}, 100%)`,
            overscrollBehaviorX: 'contain',
          }}
          ref={ref}
        >
          {Object.values(lines).map((currLine, i) => {
            if (i === columns) return null;
            return (
              <div
                key={i}
                className="flex w-full snap-center flex-col items-center justify-center"
              >
                <h4 className="mb-2.5 font-mont text-xl font-normal">
                  {i + 1}
                  {['st', 'nd', 'rd', 'th'][i]} Line
                </h4>
                <LinePlayers lineup={currLine} />
              </div>
            );
          })}
        </div>
        <div
          className="m-5 cursor-pointer font-mont text-5xl"
          onClick={() => {
            if (!ref.current) return;

            ref.current.scrollLeft += ref.current.clientWidth;
          }}
        >
          &gt;
        </div>
      </div>
    </>
  );
};
