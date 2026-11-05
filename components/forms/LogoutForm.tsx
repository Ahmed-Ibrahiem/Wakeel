"use client";
import { toast } from "sonner";
import { Button } from "../ui/button";
import { authClient } from "@/lib/auth-client";
import { MdLogout } from "react-icons/md";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { TbLoader2 } from "react-icons/tb";

const LogoutForm = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const handleSignout = async () => {
    setLoading(true);
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/login");
            router.refresh();
          },
        },
      });
    } catch (e) {
      const error = e as Error;
      console.error("Signout Error: ", error);
      toast.error(error.message || "Unknown Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button className="flex-center gap-2.5 w-25" onClick={handleSignout}>
      {loading ? (
        <TbLoader2 className="animate-spin" />
      ) : (
        <>
          <span>Logout</span>
          <MdLogout />
        </>
      )}
    </Button>
  );
};

export default LogoutForm;
