<?php

namespace Database\Seeders;

use App\Models\PageBlock;
use App\Models\PageContent;
use Illuminate\Database\Seeder;

/**
 * Seeds the six previously static pages (Genèse, Histoire, Savio,
 * Organisation, Archidiocèse, Caritas) so the public pages render the
 * same content as before, now editable from the admin.
 */
class PageContentSeeder extends Seeder
{
    public function run(): void
    {
        $this->genese();
        $this->histoire();
        $this->savio();
        $this->organisation();
        $this->archidiocese();
        $this->caritas();
    }

    private function seedPage(string $key, string $title, string $subtitle, ?string $intro, array $extra, array $blocks): void
    {
        PageContent::updateOrCreate(
            ['key' => $key],
            ['title' => $title, 'subtitle' => $subtitle, 'intro' => $intro, 'extra' => $extra ?: null],
        );

        PageBlock::where('page_key', $key)->delete();
        foreach ($blocks as $i => $block) {
            PageBlock::create([...$block, 'page_key' => $key, 'sort_order' => $i]);
        }
    }

    // ── Genèse ────────────────────────────────────────────────────────────

    private function genese(): void
    {
        $intro = "La paroisse Saint Dominique Savio trouve ses origines en **1961**, lorsque le Père Alexis Derrien, Spiritain, acquit un terrain de **3 000 m²** dans le quartier populaire de New-Bell Bonadoumbé à Douala. Ce geste simple mais fondateur allait être le premier pas d'une communauté chrétienne appelée à rayonner dans tout le quartier et au-delà.\n\nC'est sous l'impulsion de **Monseigneur Thomas Mongo**, archevêque de Douala, et de l'Abbé Robert Lépine que naquit la vision d'implanter l'Église au cœur de ce quartier populaire. Cette démarche missionnaire reflétait l'engagement profond de l'Église catholique à rejoindre les hommes et les femmes dans leur vie quotidienne.\n\nÀ proximité immédiate du terrain acquis, les **Sœurs du Saint-Esprit** dirigeaient déjà une école primaire qui portait le nom de *Dominique Savio*. Ce voisinage n'était pas fortuit : il annonçait la vocation particulière de cette future paroisse pour l'éducation, la jeunesse et la famille, qui allait devenir une caractéristique essentielle de son identité.\n\nLes premières réunions de prière se tiennent dans des salles modestes. La Sœur Christian Nourry joue un rôle précieux dans la préparation des enfants à la première communion et à la confirmation, posant ainsi les premières pierres de la catéchèse paroissiale.";

        $this->seedPage('genese', 'Genèse de la Paroisse', "Les origines et fondements de notre communauté de foi à Douala", $intro, [
            'section_label' => 'LES ORIGINES',
            'section_title' => '1961 : La naissance d\'une communauté',
            'timeline_label' => 'SUCCESSION PASTORALE',
            'timeline_title' => 'Les curés qui nous ont précédés',
            'timeline_intro' => 'Depuis 1964, quatorze prêtres ont guidé notre communauté. Chacun a apporté sa pierre à l\'édifice spirituel de notre paroisse.',
            'quote' => "L'Église naît là où l'on annonce l'Évangile, là où on rassemble les hommes et les femmes au nom du Christ.",
            'quote_author' => '— Esprit de la fondation de la Paroisse Saint Dominique Savio, 1961',
        ], [
            ['kind' => 'timeline', 'meta' => '1961', 'title' => 'Achat du terrain fondateur', 'description' => 'Le Père Alexis Derrien, Spiritain, acquiert 3 000 m² à New-Bell Bonadoumbé. Ce terrain devient la pierre angulaire de la future paroisse.'],
            ['kind' => 'timeline', 'meta' => '1962–1963', 'title' => 'Premières célébrations', 'description' => 'Mgr Thomas Mongo et Abbé Robert Lépine établissent les premières structures liturgiques. Des messes sont célébrées dans des locaux provisoires du quartier.'],
            ['kind' => 'timeline', 'meta' => '1964', 'title' => 'Première salle de culte', 'description' => 'Construction de la première salle dédiée au culte. L\'Abbé Lépine devient le premier prêtre responsable officiel. La Sœur Christian Nourry prépare les enfants aux sacrements.'],
            ['kind' => 'timeline', 'meta' => '1966', 'title' => 'Naissance des premières communautés', 'description' => 'Les premières communautés chrétiennes de base s\'organisent dans les quartiers environnants. La vie associative paroissiale prend son essor.'],
            ['kind' => 'timeline', 'meta' => 'Septembre 1973', 'title' => 'Premier curé résident', 'description' => 'L\'Abbé Michel Lécuyer, Spiritain, devient le premier curé résident permanent de la paroisse. Cette étape marque la maturité institutionnelle de la communauté.'],
            ['kind' => 'timeline', 'meta' => '1974', 'title' => 'Érection canonique officielle', 'description' => 'Mgr Simon Tonye, archevêque de Douala, procède à l\'érection canonique officielle de la Paroisse Saint Dominique Savio. La communauté est désormais une paroisse à part entière dans l\'Archidiocèse de Douala.'],
            ['kind' => 'cure', 'meta' => '1964 – 1966', 'title' => 'Abbé Robert LÉPINE', 'description' => 'Spiritain, premier prêtre responsable de la communauté naissante. Il pose les fondements pastoraux de la paroisse et prépare les premières catéchèses.'],
            ['kind' => 'cure', 'meta' => '1966 – 1969', 'title' => 'Abbé Jean RIVAIN', 'description' => 'Spiritain, il poursuit l\'œuvre de son prédécesseur et développe les premières communautés chrétiennes dans le quartier de New-Bell.'],
            ['kind' => 'cure', 'meta' => '1969 – 1972', 'title' => 'Abbé Pierre SAURET', 'description' => 'Spiritain, il développe la structure pastorale de la paroisse et renforce les liens avec les mouvements catholiques locaux.'],
            ['kind' => 'cure', 'meta' => '1972 – 1973', 'title' => 'Abbé Pierre PAPON', 'description' => 'Spiritain, curé de transition, il prépare l\'arrivée du premier curé résident permanent de la paroisse.'],
            ['kind' => 'cure', 'meta' => '1973 – 1987', 'title' => 'Abbé Michel LÉCUYER', 'description' => 'Spiritain, premier curé résident de la paroisse depuis septembre 1973. Il préside à l\'érection canonique officielle en 1974 et construit l\'identité spirituelle de la communauté.'],
            ['kind' => 'cure', 'meta' => '1987 – 1990', 'title' => 'Abbé Antoine BABÉ', 'description' => 'Il consolide la croissance de la paroisse et développe les structures de la vie communautaire, notamment les groupes de prière.'],
            ['kind' => 'cure', 'meta' => '1990 – 1996', 'title' => 'Abbé Simon EPÉA', 'description' => 'Il approfondit l\'enracinement de la paroisse dans le tissu social et ecclésial de Douala, et dynamise la vie des CEV.'],
            ['kind' => 'cure', 'meta' => '1996 – 2003', 'title' => 'Abbé Bonaventure TAA', 'description' => 'Sous sa conduite, la paroisse connaît un essor remarquable. Il engage des travaux de rénovation et renforce la pastorale familiale.'],
            ['kind' => 'cure', 'meta' => '2003 – 2012', 'title' => 'Abbé Étienne NGUE', 'description' => 'Long mandat marqué par la structuration de la vie paroissiale, le développement de la catéchèse et l\'extension vers le quartier de Youpwè.'],
            ['kind' => 'cure', 'meta' => '2012 – 2016', 'title' => 'Prof. Abbé Oscar EONÉ EONÉ', 'description' => 'Professeur de théologie, il apporte une dimension intellectuelle et académique à la vie paroissiale, enrichissant les homélies et la formation des fidèles.'],
            ['kind' => 'cure', 'meta' => '2016 – 2018', 'title' => 'Mgr Sébastien MONGO-BEHON', 'description' => 'Évêque auxiliaire de Douala, sa présence à la tête de la paroisse fut un honneur particulier pour toute la communauté paroissiale.'],
            ['kind' => 'cure', 'meta' => '2018 – 2020', 'title' => 'Abbé Jacques Luc BAKOUBA BAKINDE', 'description' => 'Il poursuit le développement pastoral et engage la communauté dans une dynamique de renouveau liturgique et sacramentel.'],
            ['kind' => 'cure', 'meta' => '2020 – 2022', 'title' => 'Abbé Philippe Pacôme MBANDA MANDENGUE', 'description' => 'Il guide la paroisse pendant la période difficile de la pandémie de Covid-19, maintenant le lien communautaire et assurant la continuité pastorale.'],
            ['kind' => 'cure', 'meta' => '2022 – présent', 'title' => 'Abbé Jean-Robert FANKAM NGANDJUI', 'description' => 'Curé actuel de la paroisse, il conduit notre communauté avec dynamisme, renforçant la vie spirituelle, la solidarité et l\'engagement missionnaire de tous les fidèles.', 'is_highlight' => true],
        ]);
    }

    // ── Histoire ──────────────────────────────────────────────────────────

    private function histoire(): void
    {
        $this->seedPage('histoire', 'Notre Histoire', 'Plus de 60 ans de foi, de service et de communauté à Douala', null, [
            'youpwe_label' => 'EXTENSION',
            'youpwe_title' => "L'extension vers Youpwè",
            'youpwe_intro' => 'Dans les années 1990, la paroisse Saint Dominique Savio a étendu sa mission vers le quartier de Youpwè, donnant naissance à une nouvelle communauté qui deviendra une paroisse autonome en 2015.',
        ], [
            ['kind' => 'timeline', 'meta' => '4 déc. 1961', 'title' => 'Achat du terrain', 'description' => 'Père Alexis Derrien achète 3 000 m² à New-Bell Bonadoumbé.'],
            ['kind' => 'timeline', 'meta' => '~1962-63', 'title' => 'Lieu de culte établi', 'description' => 'Mgr Thomas Mongo et Abbé Robert Lépine établissent un premier lieu de culte.'],
            ['kind' => 'timeline', 'meta' => '1964-1966', 'title' => 'Premières communautés', 'description' => "Père Lépine construit l'église, lance les premières communautés chrétiennes."],
            ['kind' => 'timeline', 'meta' => '1974', 'title' => 'Érection canonique', 'description' => 'Érection canonique par Mgr Simon Tonye.'],
            ['kind' => 'timeline', 'meta' => '~1988-1996', 'title' => 'Succession de curés', 'description' => 'Abbé Babe → Abbé Epea Simon (1990) → Abbé Bonaventure Taa (1996).'],
            ['kind' => 'timeline', 'meta' => '6 mai 2000', 'title' => "Consécration de l'église", 'description' => "Consécration de l'église par le Cardinal Christian Tumi."],
            ['kind' => 'timeline', 'meta' => 'Après 2000', 'title' => 'Construction du presbytère', 'description' => 'Construction du presbytère à deux niveaux.'],
            ['kind' => 'timeline', 'meta' => 'Juillet 2015', 'title' => 'Naissance de Youpwè', 'description' => "Naissance de la paroisse de Youpwè (Saint Ignace d'Antioche)."],
            ['kind' => 'timeline', 'meta' => '2016-2018', 'title' => 'Développement', 'description' => 'Bâtiment catéchèse, salle mouvements, forage d\'eau.'],
            ['kind' => 'timeline', 'meta' => '~2019-2020', 'title' => 'Rénovations', 'description' => 'Toiture grotte mariale, rénovation sacristie.'],
            ['kind' => 'timeline', 'meta' => '8 oct. 2021', 'title' => 'Visite apostolique', 'description' => 'Visite du Nonce Apostolique Mgr Julio Murat.'],
            ['kind' => 'milestone', 'meta' => '1996', 'title' => 'Conception', 'description' => "Conception du projet d'extension par le Père EPEA."],
            ['kind' => 'milestone', 'meta' => 'Fév. 1997', 'title' => 'Opérationnel', 'description' => "Opérationnel sous l'Abbé Bonaventure TAA."],
            ['kind' => 'milestone', 'meta' => 'Carême 1998', 'title' => 'Première Eucharistie', 'description' => 'Première Eucharistie chez M. NOUNG Georges, puis grotte du patriarche MBOUCK Guillaume (mai 1998).'],
            ['kind' => 'milestone', 'meta' => 'Déc. 1998', 'title' => 'Catéchèse lancée', 'description' => 'Catéchèse lancée par Mme MBOUCK Marie Thérèse et une sœur Spiritaine.'],
            ['kind' => 'milestone', 'meta' => '1999', 'title' => 'Communauté anglophone', 'description' => 'La communauté anglophone intègre le mouvement.'],
            ['kind' => 'milestone', 'meta' => 'Août 2001', 'title' => 'Financement terrain', 'description' => 'Visite honorable DOOH Collins → financement terrain et chapelle.'],
            ['kind' => 'milestone', 'meta' => 'Janv. 2005', 'title' => 'Premières messes', 'description' => 'Premières messes dans la chapelle de Youpwè.'],
            ['kind' => 'milestone', 'meta' => '2007', 'title' => 'Communautés CEV', 'description' => '6 CEVs créées dans le secteur de Youpwè.'],
            ['kind' => 'milestone', 'meta' => '13 juillet 2015', 'title' => 'Érection en paroisse', 'description' => 'Youpwè érigée en paroisse autonome. Abbé Janvier WOPOULÉ, premier curé.'],
        ]);
    }

    // ── Savio ─────────────────────────────────────────────────────────────

    private function savio(): void
    {
        $intro = "Dominique Savio naquit le **2 avril 1842** à Riva di Chieri, en Italie. Deuxième de dix enfants, il grandit dans une famille profondément croyante qui lui apprit à prier dès son plus jeune âge.\n\nSa première communion, reçue à l'âge de **7 ans**, fut un moment décisif. Il prit alors des résolutions qui marquèrent toute sa courte vie : *\"Mes amis seront Jésus et Marie. La mort, mais pas de péchés.\"*\n\nSous la direction spirituelle de **Don Bosco**, qu'il rencontra à Turin, Dominique progressa rapidement dans la vie spirituelle. En 1854, il fonda *La Compagnie de l'Immaculée Conception*, un groupe de jeunes engagés pour la piété et l'apostolat.\n\nIl se distinguait comme artisan de paix entre ses camarades, intervenant courageusement pour réconcilier ceux qui étaient en conflit. Il rêvait de devenir prêtre, mais la Providence en décida autrement.\n\nAtteint d'une maladie pulmonaire, il mourut le **9 mars 1857**, à l'âge de 14 ans. Ses derniers mots, selon Don Bosco, témoignaient d'une joie profonde : il décrivait une belle vision qui lui était accordée.";

        $this->seedPage('savio', 'Saint Dominique Savio', 'Notre saint patron, modèle de jeunesse et de foi', $intro, [
            'bio_image' => 'https://backoffice.paroissesaintdominiquesavio.com/assets/09633277-f72b-4102-9fe8-3752e3acd3ee',
            'bio' => [
                ['Né le', '2 avril 1842'],
                ['Lieu de naissance', 'Riva di Chieri, Italie'],
                ['Décédé le', '9 mars 1857'],
                ['Âge au décès', '14 ans'],
                ['Directeur spirituel', 'Don Bosco (Saint Jean Bosco)'],
                ['Canonisé par', 'Pie XII, en 1954'],
                ['Fête', '9 mars'],
            ],
            'bio_label' => 'REPÈRES BIOGRAPHIQUES',
            'section_label' => 'NOTRE SAINT PATRON',
            'section_title' => 'La vie de Dominique Savio',
            'quote' => "L'Église met Dominique Savio sur les autels pour qu'il devienne le Patron et le modèle des jeunes.",
            'quote_author' => '— Pape Pie XII, lors de la canonisation, 1954',
            'spirituality_label' => 'SPIRITUALITÉ DE DOMINIQUE SAVIO',
            'prayer_title' => 'Prière à Saint Dominique Savio',
            'prayer' => 'Saint Dominique Savio, toi qui as su unir ta vie à Jésus et Marie dans la joie et la pureté du cœur, intercède pour nous auprès du Seigneur. Aide-nous à vivre notre foi avec la même ardeur que toi, à trouver en Dieu la source de toute joie, et à être pour ceux qui nous entourent des témoins du Christ vivant.',
        ], [
            ['kind' => 'bullet', 'title' => 'Une foi ardente vécue dans la joie quotidienne'],
            ['kind' => 'bullet', 'title' => 'La dévotion mariale comme pilier de sa vie'],
            ['kind' => 'bullet', 'title' => "L'amour de l'Eucharistie et de la confession"],
            ['kind' => 'bullet', 'title' => "L'apostolat par l'exemple et la fraternité"],
            ['kind' => 'bullet', 'title' => 'La sainteté ordinaire accessible à tous les jeunes'],
        ]);
    }

    // ── Organisation ──────────────────────────────────────────────────────

    private function organisation(): void
    {
        $this->seedPage('organisation', 'Organisation de la paroisse', 'Structure pastorale et gouvernance', null, [
            'structure_title' => 'Structure pastorale',
            'stats_title' => 'Chiffres clés',
            'chart_title' => 'Organigramme pastoral',
        ], [
            ['kind' => 'bullet', 'title' => 'Conseil pastoral paroissial'],
            ['kind' => 'bullet', 'title' => 'Conseil économique paroissial'],
            ['kind' => 'bullet', 'title' => 'Communautés Ecclésiales Vivantes (CEV)'],
            ['kind' => 'bullet', 'title' => 'Équipes pastorales spécialisées'],
            ['kind' => 'bullet', 'title' => 'Mouvements et associations de laïcs'],
            ['kind' => 'bullet', 'title' => 'Service de la catéchèse'],
            ['kind' => 'stat', 'meta' => '1961', 'title' => "Année de fondation"],
            ['kind' => 'stat', 'meta' => '65+', 'title' => "Années d'histoire"],
            ['kind' => 'stat', 'meta' => '7', 'title' => 'Paroisses du Doyenné Wouri I'],
            ['kind' => 'stat', 'meta' => '4', 'title' => 'Messes dominicales'],
            ['kind' => 'stat', 'meta' => '8', 'title' => 'Mouvements & associations'],
            ['kind' => 'stat', 'meta' => '∞', 'title' => 'Communauté ouverte à tous'],
            ['kind' => 'card', 'icon' => '⛪', 'title' => 'Le Curé', 'description' => 'Responsable pastoral et administratif de la paroisse'],
            ['kind' => 'card', 'icon' => '👨‍💼', 'title' => 'Les Vicaires', 'description' => "Assistants du curé pour les célébrations et l'accompagnement"],
            ['kind' => 'card', 'icon' => '👥', 'title' => 'Conseil pastoral', 'description' => "Représentants laïcs, examine les besoins d'évangélisation"],
            ['kind' => 'card', 'icon' => '💰', 'title' => 'Conseil économique', 'description' => 'Gestion des biens et finances paroissiaux'],
            ['kind' => 'card', 'icon' => '🏘️', 'title' => 'CEV', 'description' => 'Communautés Ecclésiales Vivantes dans les quartiers'],
            ['kind' => 'card', 'icon' => '📚', 'title' => 'Catéchèse', 'description' => 'Formation des enfants, jeunes et adultes dans la foi'],
        ]);
    }

    // ── Archidiocèse ──────────────────────────────────────────────────────

    private function archidiocese(): void
    {
        $intro = "La paroisse Saint Dominique Savio fait partie de l'**Archidiocèse de Douala**, dont le siège épiscopal est la Cathédrale Saints Pierre et Paul de Douala.\n\nNotre paroisse est rattachée au **Doyenné Wouri I**, l'un des doyennés de l'archidiocèse, regroupant plusieurs paroisses du secteur de Douala.\n\nL'Archidiocèse de Douala est l'un des diocèses catholiques les plus actifs du Cameroun, animé par une vie ecclésiale intense et un engagement fort au service de l'évangélisation et du développement humain.\n\nLa Conférence Épiscopale Nationale du Cameroun (**CENC**) regroupe tous les évêques catholiques du Cameroun et coordonne l'action de l'Église à l'échelle nationale.";

        $this->seedPage('archidiocese', "L'Archidiocèse de Douala", 'Notre ancrage diocésain', $intro, [
            'facts' => [
                ['Archidiocèse', 'Douala'],
                ['Doyenné', 'Wouri I'],
                ['Pays', 'Cameroun'],
                ['Conférence épiscopale', 'CENC'],
                ['Cathédrale', 'Saints Pierre et Paul'],
                ['Notre paroisse fondée', '4 décembre 1961'],
            ],
            'cameroon_title' => "L'Église au Cameroun",
        ], [
            ['kind' => 'card', 'icon' => '⛪', 'title' => 'Cathédrale Saints Pierre et Paul', 'description' => "Siège épiscopal de l'Archidiocèse de Douala"],
            ['kind' => 'card', 'icon' => '🌍', 'title' => 'CENC', 'description' => "Conférence Épiscopale Nationale du Cameroun - coordination nationale de l'Église"],
            ['kind' => 'card', 'icon' => '🏘️', 'title' => 'Doyenné Wouri I', 'description' => 'Notre doyenné regroupant plusieurs paroisses du secteur'],
        ]);
    }

    // ── Caritas ───────────────────────────────────────────────────────────

    private function caritas(): void
    {
        $this->seedPage('caritas', 'Caritas Paroissiale', 'Au service des plus démunis', null, [
            'section_label' => 'SOLIDARITÉ',
            'section_title' => 'Notre mission Caritas',
            'section_intro' => "La Caritas paroissiale est le bras charitable de notre communauté. Inspirée par l'amour du Christ pour les pauvres, elle coordonne les actions de solidarité et d'entraide au service des plus démunis de notre quartier.",
            'cta_title' => 'Soutenir la Caritas',
            'cta_text' => 'Votre don permet à notre Caritas de continuer à agir au service des plus pauvres. Chaque geste compte.',
        ], [
            ['kind' => 'card', 'icon' => '🏫', 'title' => 'Rentrée scolaire', 'description' => 'Distribution de fournitures scolaires aux familles défavorisées pour permettre à tous les enfants d\'aller à l\'école.'],
            ['kind' => 'card', 'icon' => '🍽️', 'title' => 'Aide alimentaire', 'description' => 'Distribution de vivres aux familles dans le besoin, particulièrement pendant les périodes de fête.'],
            ['kind' => 'card', 'icon' => '💊', 'title' => 'Santé', 'description' => 'Soutien médical et accompagnement des malades et personnes âgées isolées.'],
            ['kind' => 'card', 'icon' => '👔', 'title' => 'Vêtements', 'description' => "Collecte et distribution de vêtements et d'articles ménagers aux personnes dans le besoin."],
            ['kind' => 'card', 'icon' => '🏠', 'title' => 'Logement', 'description' => "Aide d'urgence pour les familles en situation de précarité de logement."],
            ['kind' => 'card', 'icon' => '💼', 'title' => 'Insertion professionnelle', 'description' => 'Accompagnement et orientation vers des formations professionnelles.'],
        ]);
    }
}
