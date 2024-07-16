import { getInitials } from "@/utils/helpers";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { UserGroupChatWithId, UserProps } from "@/types";
import { UserList } from "./UserList";

interface UserCardProps {
  user: UserProps;
  sharedCourses: { _id: string; name: string }[];
  type: "direct" | "course";
  channel: UserGroupChatWithId;
}

export function RecipientInfoCard({
  user,
  sharedCourses,
  type,
  channel,
}: UserCardProps) {
  const initials = getInitials(user?.firstName, user?.lastName);
  console.log(channel);

  return (
    <div className="bg-white shadow-lg mt[-24px] rounded-lg p-4 w-full max-w-sm border">
      <div className="flex items-center">
        {type === "direct" ? (
          <>
            <Avatar className="w-16 h-16">
              {/* <AvatarImage
            src={user?.avatar}
            alt={`${user?.firstName} ${user?.lastName}`}
            /> */}
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">{`${user?.firstName} ${user?.lastName}`}</h2>
              <p className="text-sm text-gray-500">{user?.email}</p>
              <p className="text-sm text-gray-500">Active 2 mins ago</p>
              <div className="mt-2">
               
                <p className="text-sm text-gray-600">Courses:</p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {sharedCourses.map((course, index) => (
                    <li key={index}>{course.name}</li>
                  ))}
                </ul>
              
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="ml-4">
              <h2 className="text-lg font-semibold">{channel.name}</h2>

              <div className="mt-2">

                <div className="mt-2">
                  <UserList users={channel.users} />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
