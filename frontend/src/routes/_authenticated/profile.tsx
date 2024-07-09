import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { userQueryOptions } from "@/lib/api";

export const Route = createFileRoute("/_authenticated/profile")({
  component: Profile,
});

function Profile() {
  const { isPending, error, data } = useQuery(userQueryOptions);

  if (isPending) return "Loading";
  if (error) return "Not Logged in";

  return (
    <div className="p-2">
      Welcome To Your Profile
      <p>Hello {data.user.name}</p>
      <a href="/api/logout">Logout!</a>
    </div>
  );
}
