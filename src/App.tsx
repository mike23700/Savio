import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "@/lib/auth";
import { SettingsProvider } from "@/lib/settings";
import { LangProvider } from "@/lib/i18n";

export default function App() {
  return (
    <LangProvider>
      <AuthProvider>
        <SettingsProvider>
          <RouterProvider router={router} />
        </SettingsProvider>
      </AuthProvider>
    </LangProvider>
  );
}
