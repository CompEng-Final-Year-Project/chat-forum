import { Avatar, AvatarFallback } from './ui/avatar'
import { FaCrown } from 'react-icons/fa'

const Admin = ({userInitials, role}: {userInitials: string; role: string}) => {
  return (
    <div className="relative inline-block">

    <Avatar className={`w-12 h-12 ${role !== "student" ? "border-solid border-4 border-primary" : ""} `}>
      <AvatarFallback>
        {userInitials}
      </AvatarFallback>
    </Avatar>
    <span className="absolute bottom-0 right-0 bg-green-500 border-2 text-xs text-white border-white rounded-full w-5 h-5 flex items-center justify-center" >
      {role !== "student" && <FaCrown />}
    </span>
  </div>
  )
}

export default Admin