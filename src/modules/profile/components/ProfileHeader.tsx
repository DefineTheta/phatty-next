import { CalendarIcon, DocumentDuplicateIcon, TrophyIcon } from '@heroicons/react/24/outline';
import { useMemo, useState } from 'react';

const ProfileHeader = () => {
  const [currentTab, setCurrentTab] = useState('portfolio');

  const tabs = useMemo(
    () => [
      {
        displayName: 'Portfolio',
        name: 'portfolio'
      },
      {
        displayName: 'NFT',
        name: 'nft'
      },
      {
        displayName: 'History',
        name: 'history'
      }
    ],
    []
  );

  return (
    <div className="pt-36 flex flex-row justify-center bg-background-200">
      <div className="w-full max-w-96 flex flex-col gap-y-30">
        <div className="flex flex-col gap-y-30">
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-y-12 items-start">
              <div className="flex flex-row items-center gap-x-6">
                <span className="text-lg font-semibold text-text-200">Hiii</span>
                <button className="w-20 h-20 flex justify-center items-center cursor-pointer bg-gray-100 rounded-full">
                  <DocumentDuplicateIcon className="w-12 h-12" />
                </button>
              </div>
              <div className="flex flex-row gap-x-18 items-center">
                <button className="py-6 px-12 flex flex-row items-center gap-x-6 bg-purple-button rounded-full cursor-pointer drop-shadow-md">
                  <TrophyIcon className="w-14 h-14 text-white" />
                  <span className="text-sm text-white">Early Supporter</span>
                </button>
                <button className="py-6 px-12 flex flex-row items-center gap-x-6 bg-bluegray-button rounded-full cursor-pointer drop-shadow-md">
                  <CalendarIcon className="w-14 h-14 text-white" />
                  <span className="text-sm text-white">Refresh Data</span>
                </button>
              </div>
            </div>
            <span className="text-2xl font-black text-text-100">$0</span>
          </div>
        </div>
        <div className="flex flex-row justify-between items-center">
          <div className="flex flex-row items-center gap-x-30">
            {tabs.map((tab) => (
              <div
                key={tab.name}
                className={`px-10 pb-6 text-base font-bold cursor-pointer ${
                  tab.name === currentTab
                    ? 'text-text-900 border-b-4 border-text-900'
                    : 'text-text-200'
                }`}
              >
                {tab.displayName}
              </div>
            ))}
          </div>
          <span className="text-sm text-text-200">Data updated now</span>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
