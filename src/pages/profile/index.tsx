import ChainSummaryCard from "@app-src/modules/chain/components/ChainSummaryCard"
import ProfileHeader from "@app-src/modules/profile/components/ProfileHeader"

const ProfilePage = () => {
  return (
    <div className="flex flex-col gap-y-24">
      <ProfileHeader />
      <div className="w-full flex flex-col items-center">
        <ChainSummaryCard />
      </div>
    </div>
  )
}

export default ProfilePage