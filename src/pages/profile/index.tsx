import SideBar from "@app-src/common/components/layout/SideBar"
import ProfileHeader from "@app-src/modules/profile/components/ProfileHeader"

const ProfilePage = () => {
  return (
    <div className="w-full flex flex-row bg-background-1">
      <SideBar />
      <div className="w-full flex flex-col">
        <ProfileHeader />
      </div>
    </div>
  )
}

export default ProfilePage