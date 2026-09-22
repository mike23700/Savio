import { RouterProvider } from "react-router";
import { router } from "./routes";
import { AuthProvider } from "@/lib/auth";
import { SettingsProvider } from "@/lib/settings";

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <RouterProvider router={router} />
      </SettingsProvider>
    </AuthProvider>
  );
}
