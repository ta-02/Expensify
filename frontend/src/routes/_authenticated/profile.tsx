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
    <div className="p-2">
      <div className="flex items-center gap-2">
        <Avatar>
          {data.user.picture && (
            <AvatarImage src={user.picture} alt={user.given_name} />
          )}
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <p>Hello {user.name}</p>
        <div>
          <Button asChild>
            <a href="/api/logout">Logout!</a>
          </Button>
        </div>
      </div>
    </div>
  );
}
