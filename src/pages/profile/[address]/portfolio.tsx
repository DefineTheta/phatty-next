import { useAppDispatch } from '@app-src/common/hooks/useAppDispatch';
import { useAppSelector } from '@app-src/common/hooks/useAppSelector';
import ChainSummaryCard from '@app-src/modules/chain/components/ChainSummaryCard';
import HexTableGroup from '@app-src/modules/portfolio/components/hex/HexTableGroup';
import PancakeTableGroup from '@app-src/modules/portfolio/components/pancake/PancakeTableGroup';
import PhiatTableGroup from '@app-src/modules/portfolio/components/phiat/PhiatTableGroup';
import PulsexTableGroup from '@app-src/modules/portfolio/components/pulsex/PulsexTableGroup';
import SushiTableGroup from '@app-src/modules/portfolio/components/sushi/SushiTableGroup';
import UniV2TableGroup from '@app-src/modules/portfolio/components/univ2/UniV2TableGroup';
import UniV3TableGroup from '@app-src/modules/portfolio/components/univ3/UniV3TableGroup';
import WalletTableGroup from '@app-src/modules/portfolio/components/wallet/WalletTableGroup';
import ProfileHeader from '@app-src/modules/profile/components/ProfileHeader';
import {
  fetchHexData,
  fetchPancakeData,
  fetchPhiatData,
  fetchPulsexData,
  fetchSushiData,
  fetchUniV2Data,
  fetchUniV3Data,
  fetchWalletData,
  setProfileHasFetched
} from '@app-src/store/protocol/protocolSlice';
import { selectProfileHasFetched } from '@app-src/store/protocol/selectors';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';

const ProfilePortfolioPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();

  const address = String(router.query.address || '');
  const hasFetched = useAppSelector(useCallback(selectProfileHasFetched, []));

  useEffect(() => {
    if (hasFetched || !address) return;
    console.log('Address', address);

    Promise.all([
      dispatch(fetchWalletData(address)),
      dispatch(fetchHexData(address)),
      dispatch(fetchPhiatData(address)),
      dispatch(fetchPulsexData(address)),
      dispatch(fetchPancakeData(address)),
      dispatch(fetchSushiData(address)),
      dispatch(fetchUniV2Data(address)),
      dispatch(fetchUniV3Data(address))
    ]).then(() => dispatch(setProfileHasFetched(true)));
  }, [hasFetched, address]);

  return (
    <div className="flex flex-col gap-y-24">
      <ProfileHeader address={address} />
      <div className="w-full flex flex-col items-center gap-y-30">
        <ChainSummaryCard page="profile" />
        <WalletTableGroup page="profile" />
        <HexTableGroup page="profile" />
        <PhiatTableGroup page="profile" />
        <PulsexTableGroup page="profile" />
        <PancakeTableGroup page="profile" />
        <SushiTableGroup page="profile" />
        <UniV2TableGroup page="profile" />
        <UniV3TableGroup page="profile" />
      </div>
    </div>
  );
};

export default ProfilePortfolioPage;
