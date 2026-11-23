"use client";

import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth-client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const CHECK_EVERY_MS = 5 * 60 * 1000;

// Tells the user when this device was signed out from elsewhere (password change,
// logout on another device, deleted account). A server-rendered page cannot know it
// by itself, so it asks the server when the tab becomes visible and every few minutes.
export function SessionWatcher() {
  const [ended, setEnded] = useState(false);
  const checking = useRef(false);

  useEffect(() => {
    const check = async () => {
      if (checking.current || document.visibilityState !== "visible") return;
      checking.current = true;
      try {
        const { data, error } = await authClient.getSession({
          query: { disableCookieCache: true },
        });
        // A network error is NOT a sign-out: only an answer that says "no session" is
        if (!data && (!error || error.status === 401)) setEnded(true);
      } catch {
        // Network problem: try again on the next check
      } finally {
        checking.current = false;
      }
    };

    const onVisible = () => void check();
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", onVisible);
    const timer = setInterval(() => void check(), CHECK_EVERY_MS);

    return () => {
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", onVisible);
      clearInterval(timer);
    };
  }, []);

  return (
    // No onOpenChange: the dialog cannot be dismissed, the only way out is the button
    <AlertDialog open={ended}>
      <AlertDialogContent dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle>انتهت الجلسة</AlertDialogTitle>
          <AlertDialogDescription>
            تم تسجيل خروجك من هذا الجهاز، وقد يكون ذلك بسبب تغيير كلمة المرور أو
            تسجيل الخروج من جهاز آخر. سجّل الدخول مرة أخرى للمتابعة.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={() => window.location.assign("/login")}>
            تسجيل الدخول
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}