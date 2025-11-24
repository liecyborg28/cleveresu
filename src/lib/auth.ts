import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function logout(router: ReturnType<typeof useRouter>) {
  localStorage.removeItem("auth");
  router.push("/login");
}


export function usePrivateRoute() {
  const router = useRouter();

  useEffect(() => {
    // ambil token dari localStorage
    const authData = localStorage.getItem("auth");
    const token = authData ? JSON.parse(authData).token : null;

    // kalau token gak ada, redirect ke login
    if (!token) {
      router.replace("/login");
    }
  }, [router]);
}
