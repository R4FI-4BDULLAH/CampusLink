import { useEffect, useState } from "react";
import { supabase } from "../supabase";

export default function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    async function loadSession() {
      const { data: sessionData } = await supabase.auth.getSession();
      const currentUser = sessionData.session?.user || null;
      setUser(currentUser);
      if (currentUser?.email) {
        const { data } = await supabase
          .from("users")
          .select("role, is_active")
          .eq("email", currentUser.email)
          .maybeSingle();
        setProfile(data || null);
      } else {
        setProfile(null);
      }
      setLoading(false);
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user || null;
      setUser(currentUser);
      if (!currentUser) setProfile(null);
      else {
        supabase.from("users").select("role, is_active").eq("email", currentUser.email).maybeSingle()
          .then(({ data }) => setProfile(data || null));
      }
    });

    return () => subscription.unsubscribe();

  }, []);

  return { user, profile, loading };
}
