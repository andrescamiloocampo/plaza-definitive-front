import { redirect } from "next/navigation";

export default function Home() {
  redirect("/auth/login");  
  return (
    <div>
      Default page
    </div>
  );
}
