import { createBrowserRouter } from "react-router";
import Layout from "@/components/Layout";
import { RequireAdmin, RequireAuth } from "@/lib/auth";
import AdminLayout from "@/pages/admin/AdminLayout";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminSettings from "@/pages/admin/Settings";
import AdminMassSchedule from "@/pages/admin/MassSchedule";
import AdminSacrements from "@/pages/admin/Sacrements";
import AdminCatechese from "@/pages/admin/Catechese";
import AdminPriere from "@/pages/admin/Priere";
import AdminIntentions from "@/pages/admin/Intentions";
import AdminHomelies from "@/pages/admin/Homelies";
import AdminMouvements from "@/pages/admin/Mouvements";
import AdminProjets from "@/pages/admin/Projets";
import AdminRegistre from "@/pages/admin/Registre";
import AdminProduits from "@/pages/admin/Produits";
import AdminCommandes from "@/pages/admin/Commandes";
import AdminDonations from "@/pages/admin/Donations";
import AdminJournalAbonnements from "@/pages/admin/JournalAbonnements";
import AdminJournalNumeros from "@/pages/admin/JournalNumeros";
import AdminJournalTarifs from "@/pages/admin/JournalTarifs";
import Home from "@/pages/Home";
import LaParoisse from "@/pages/LaParoisse";
import VieParoissiale from "@/pages/VieParoissiale";
import MouvementDetail from "@/pages/vie-paroissiale/MouvementDetail";
import ProjetDetail from "@/pages/vie-paroissiale/ProjetDetail";
import Celebrer from "@/pages/Celebrer";
import SacrementDetail from "@/pages/celebrer/SacrementDetail";
import SeNourrir from "@/pages/SeNourrir";
import Actualites, { ActualiteDetail } from "@/pages/Actualites";
import Agenda from "@/pages/Agenda";
import Homelies from "@/pages/Homelies";
import Mediatheque from "@/pages/Mediatheque";
import Contact from "@/pages/Contact";
import Don from "@/pages/Don";
import Boutique from "@/pages/Boutique";
import BoutiqueDetail from "@/pages/BoutiqueDetail";
import EspaceMembre from "@/pages/EspaceMembre";

// Paroisse sub-pages
import Genese from "@/pages/paroisse/Genese";
import Histoire from "@/pages/paroisse/Histoire";
import Savio from "@/pages/paroisse/Savio";
import Equipe from "@/pages/paroisse/Equipe";
import EquipeDetail from "@/pages/paroisse/EquipeDetail";
import Organisation from "@/pages/paroisse/Organisation";
import Archidiocese from "@/pages/paroisse/Archidiocese";
import ParoisseMediatheque from "@/pages/paroisse/Mediatheque";

// Vie paroissiale sub-pages
import Mouvements from "@/pages/vie-paroissiale/Mouvements";
import Caritas from "@/pages/vie-paroissiale/Caritas";
import Projets from "@/pages/vie-paroissiale/Projets";
import Registre from "@/pages/vie-paroissiale/Registre";

// Celebrer sub-pages
import Messes from "@/pages/celebrer/Messes";
import Sacrements from "@/pages/celebrer/Sacrements";
import Intention from "@/pages/celebrer/Intention";
import Bans from "@/pages/celebrer/Bans";

// Se nourrir sub-pages
import Catechese from "@/pages/se-nourrir/Catechese";
import Priere from "@/pages/se-nourrir/Priere";
import Journal from "@/pages/se-nourrir/Journal";

function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center flex-col text-center px-6">
      <div className="text-7xl mb-6">⛪</div>
      <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2rem", fontWeight: 700, color: "#1c2340" }}>Page introuvable</h1>
      <p style={{ fontFamily: "Montserrat, sans-serif", fontSize: "0.9rem", color: "#6b7280", marginTop: 8 }}>
        La page que vous cherchez n'existe pas ou a été déplacée.
      </p>
      <a href="/" style={{ background: "#0B3D91", fontFamily: "Montserrat, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
        className="inline-flex items-center gap-2 text-white px-6 py-3 rounded-full mt-8 hover:opacity-90 transition-opacity">
        Retour à l'accueil
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },

      // La Paroisse
      { path: "paroisse", Component: LaParoisse },
      { path: "paroisse/genese", Component: Genese },
      { path: "paroisse/histoire", Component: Histoire },
      { path: "paroisse/savio", Component: Savio },
      { path: "paroisse/equipe", Component: Equipe },
      { path: "paroisse/equipe/:id", Component: EquipeDetail },
      { path: "paroisse/organisation", Component: Organisation },
      { path: "paroisse/archidiocese", Component: Archidiocese },
      { path: "paroisse/mediatheque", Component: ParoisseMediatheque },

      // Vie Paroissiale
      { path: "vie-paroissiale", Component: VieParoissiale },
      { path: "vie-paroissiale/mouvements", Component: Mouvements },
      { path: "vie-paroissiale/mouvements/:id", Component: MouvementDetail },
      { path: "vie-paroissiale/caritas", Component: Caritas },
      { path: "vie-paroissiale/projets", Component: Projets },
      { path: "vie-paroissiale/projets/:id", Component: ProjetDetail },
      { path: "vie-paroissiale/registre", Component: Registre },

      // Célébrer
      { path: "celebrer", Component: Celebrer },
      { path: "celebrer/messes", Component: Messes },
      { path: "celebrer/sacrements", Component: Sacrements },
      { path: "celebrer/sacrements/:id", Component: SacrementDetail },
      { path: "celebrer/intention", Component: Intention },
      { path: "celebrer/bans", Component: Bans },

      // Se Nourrir
      { path: "se-nourrir", Component: SeNourrir },
      { path: "se-nourrir/catechese", Component: Catechese },
      { path: "se-nourrir/priere", Component: Priere },
      { path: "se-nourrir/journal", Component: Journal },

      // Top-level pages
      { path: "actualites", Component: Actualites },
      { path: "actualites/:id", Component: ActualiteDetail },
      { path: "agenda", Component: Agenda },
      { path: "homelies", Component: Homelies },
      { path: "mediatheque", Component: Mediatheque },
      { path: "contact", Component: Contact },
      {
        path: "don",
        Component: () => (
          <RequireAuth>
            <Don />
          </RequireAuth>
        ),
      },
      { path: "boutique", Component: Boutique },
      { path: "boutique/:id", Component: BoutiqueDetail },
      { path: "espace-paroissien", Component: EspaceMembre },

      { path: "*", Component: NotFound },
    ],
  },
  { path: "admin/login", Component: AdminLogin },
  {
    path: "admin",
    Component: () => (
      <RequireAdmin>
        <AdminLayout />
      </RequireAdmin>
    ),
    children: [
      { index: true, Component: AdminDashboard },
      { path: "parametres", Component: AdminSettings },
      { path: "horaires-messes", Component: AdminMassSchedule },
      { path: "sacrements", Component: AdminSacrements },
      { path: "catechese", Component: AdminCatechese },
      { path: "priere", Component: AdminPriere },
      { path: "intentions", Component: AdminIntentions },
      { path: "homelies", Component: AdminHomelies },
      { path: "mouvements", Component: AdminMouvements },
      { path: "projets", Component: AdminProjets },
      { path: "registre", Component: AdminRegistre },
      { path: "produits", Component: AdminProduits },
      { path: "commandes", Component: AdminCommandes },
      { path: "dons", Component: AdminDonations },
      { path: "journal/abonnements", Component: AdminJournalAbonnements },
      { path: "journal/numeros", Component: AdminJournalNumeros },
      { path: "journal/tarifs", Component: AdminJournalTarifs },
    ],
  },
]);
