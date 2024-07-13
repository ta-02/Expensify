import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserType } from "@kinde-oss/kinde-typescript-sdk";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions);

  if (isPending) return "Loading";
  if (error) return "Not Logged in";

  const user: UserType = data.user;

  return (
    <div className="p-2 mt-4">
      <div className="flex items-center justify-center flex-col md:flex-row md:items-start gap-4">
        <div className="flex-shrink-0">
          {data.user.picture ? (
            <Avatar>
              <AvatarImage src={user.picture} alt={user.given_name} />
            </Avatar>
          ) : (
            <Avatar>
              <AvatarFallback>{user.given_name[0]}</AvatarFallback>
            </Avatar>
          )}
        </div>
        <div className="text-lg">
          <p>Hello {user.name}</p>
          <Button>
            <a href="/api/logout">Logout!</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
