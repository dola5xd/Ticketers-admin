import { useState, FormEvent } from "react";
import { useAuth } from "@/context/AuthContext";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useLogin } from "@/hooks/useQueries";
import { TicketIcon } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("previewUser@gmail.com");
  const [password, setPassword] = useState("preview123");
  const { setUser } = useAuth();
  const { mutate: loginMutate, isPending } = useLogin();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    loginMutate(
      { email, password },
      {
        onSuccess: (userData) => {
          setUser({ email: userData?.username, role: userData?.role });
        },
        onError: (error) => {
          throw new Error(
            error instanceof Error ? error.message : "Something went wrong"
          );
        },
      }
    );
  };
  return (
    <div className="w-full h-screen flex flex-col gap-y-8 items-center justify-center bg-tuna-1000 px-10 py-10">
      <div className={"text-center flex flex-col items-center text-3xl"}>
        <TicketIcon size={50} color="#4f39f6" />
        Ticketers
      </div>
      <form
        onSubmit={handleSubmit}
        className="bg-tuna-950 px-8 py-10 flex flex-col rounded-xl shadow-md space-y-8 w-1/3"
      >
        <div className="flex flex-col space-y-4">
          <Label htmlFor="email" className="text-base">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={email || "previewUser@gmail.com"}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter Email"
            className="py-5 "
          />
        </div>
        <div className="flex flex-col space-y-4">
          <Label htmlFor="password" className="text-base">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            value={password || "preview123"}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="py-5 "
          />
        </div>
        <Button type="submit" className="py-5">
          {isPending ? "Log in..." : "Log In"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
