import { getInitials } from "@/utils/helpers";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { UserProps } from "@/types";

interface UserCardProps {
  user: UserProps;
  sharedCourses: { _id: string; name: string }[];
}

export function RecipientInfoCard({ user, sharedCourses }: UserCardProps) {
  const initials = getInitials(user?.firstName, user?.lastName);

  return (
    <div className="bg-white shadow-lg mt[-24px] rounded-lg p-4 w-full max-w-sm border">
      <div className="flex items-center">
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
            {/* <p className="text-sm font-medium text-gray-600">Major: {user?.major}</p>
            <p className="text-sm text-gray-600">Year: {user?.year}</p> */}
            <p className="text-sm text-gray-600">Courses:</p>
            <ul className="list-disc list-inside text-sm text-gray-600">
              {sharedCourses.map((course, index) => (
                <li key={index}>{course.name}</li>
              ))}
            </ul>
            {/* {user?.bio && <p className="text-sm mt-2 text-gray-600">Bio: {user?.bio}</p>}
            {user?.clubs && user?.clubs.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-600">Clubs/Organizations:</p>
                <ul className="list-disc list-inside text-sm text-gray-600">
                  {user?.clubs.map((club, index) => (
                    <li key={index}>{club}</li>
                  ))}
                </ul>
              </div>
            )} */}
          </div>
        </div>
      </div>
    </div>
  );
}
