<!DOCTYPE html>
<html lang="fr">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Fiche du registre paroissial</title>
    <style>
        @page { margin: 14mm 14mm 16mm 14mm; }
        * { box-sizing: border-box; }
        body {
            font-family: "DejaVu Sans", sans-serif;
            color: #1c2340;
            font-size: 10px;
            margin: 0;
        }
        .header { border-bottom: 3px solid #0B3D91; padding-bottom: 10px; margin-bottom: 16px; }
        .header .parish { font-size: 18px; font-weight: bold; color: #0B3D91; }
        .header .meta { font-size: 9px; color: #6b7280; margin-top: 2px; }
        .header .title {
            margin-top: 10px;
            font-size: 13px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #1c2340;
        }
        .title-row { width: 100%; }
        .title-row td { vertical-align: bottom; }
        .ref { text-align: right; font-size: 9px; color: #6b7280; }
        h2 {
            font-size: 11px;
            color: #0B3D91;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            border-bottom: 1px solid #d1d5db;
            padding-bottom: 4px;
            margin: 18px 0 8px;
        }
        table.grid { width: 100%; border-collapse: collapse; }
        table.grid td { padding: 5px 6px; vertical-align: top; border: 1px solid #e5e7eb; width: 50%; }
        .label { display: block; font-size: 7.5px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.4px; }
        .value { display: block; font-size: 10px; font-weight: bold; margin-top: 1px; }
        .sacr { border: 1px solid #0B3D91; border-radius: 4px; padding: 8px 10px; margin-bottom: 10px; page-break-inside: avoid; }
        .sacr-head { font-size: 11px; font-weight: bold; color: #0B3D91; margin-bottom: 6px; }
        .sacr-head .num { float: right; font-size: 9px; color: #6b7280; font-weight: normal; }
        table.sacr-grid { width: 100%; border-collapse: collapse; }
        table.sacr-grid td { padding: 4px 6px; vertical-align: top; width: 50%; }
        .wide { width: 100% !important; }
        .empty { color: #9ca3af; font-style: italic; }
        .footer { margin-top: 24px; page-break-inside: avoid; }
        table.sign { width: 100%; margin-top: 30px; }
        table.sign td { width: 50%; font-size: 9px; color: #374151; }
        .sign-line { border-top: 1px solid #9ca3af; margin-top: 40px; padding-top: 4px; }
        .generated { margin-top: 18px; font-size: 7.5px; color: #9ca3af; text-align: center; }
    </style>
</head>
<body>
    @php
        use Carbon\Carbon;

        $fmt = function ($value) {
            if (! $value) return '';
            try { return Carbon::parse($value)->format('d/m/Y'); } catch (\Throwable $e) { return (string) $value; }
        };
        $oui = fn ($v) => $v ? 'Oui' : 'Non';

        $ficheLabels = [
            'nom' => 'Nom(s)',
            'prenom' => 'Prénom(s)',
            'telephone' => 'Téléphone',
            'email' => 'Email',
            'tranche_age' => "Tranche d'âge",
            'rue' => 'Rue',
            'quartier' => 'Quartier',
            'lieu_dit' => 'Lieu-dit',
            'quelle_cev' => 'Nom de la CEV',
            'quel_groupe' => 'Groupe / mouvement',
            'anciennete' => 'Ancienneté dans la paroisse',
        ];

        $typeLabels = [
            'bapteme' => 'Baptême',
            'communion' => '1ère Communion',
            'confirmation' => 'Confirmation',
            'mariage' => 'Mariage',
        ];

        $sacrLabels = [
            'nom' => 'Noms et prénoms',
            'sexe' => 'Fils / Fille',
            'pere' => 'Fils / Fille de',
            'mere' => 'Et de',
            'date_naissance' => 'Né(e) le',
            'date_evenement' => 'Date de célébration',
            'lieu' => 'Village / Lieu',
            'numero' => 'N°',
            'numero_registre' => 'N° du Registre',
            'parrain_marraine' => 'Parrain / Marraine',
            'conjoint' => 'Conjoint(e)',
            'baptise_a' => 'Baptisé(e) à',
            'temoins' => 'Témoins',
            'ministre' => 'Ministre',
            'signataire' => 'Signé par',
            'date_certificat' => 'Certifié exact le',
            'remarques' => 'Remarques',
        ];

        $sacrOrder = array_keys($sacrLabels);
        $dateFields = ['date_naissance', 'date_evenement', 'date_certificat'];

        $ficheRows = [
            ['nom', $inscription->nom],
            ['prenom', $inscription->prenom],
            ['telephone', $inscription->telephone],
            ['email', $inscription->email],
            ['tranche_age', $inscription->tranche_age],
            ['quartier', $inscription->quartier],
            ['rue', $inscription->rue],
            ['lieu_dit', $inscription->lieu_dit],
            ['anciennete', $inscription->anciennete],
        ];
        $ficheRows = array_values(array_filter($ficheRows, fn ($r) => $r[1] !== null && $r[1] !== ''));
    @endphp

    <div class="header">
        <div class="parish">Paroisse Saint Dominique Savio</div>
        <div class="meta">Doyenné Wouri I · Archidiocèse de Douala</div>
        <table class="title-row">
            <tr>
                <td><div class="title">Fiche du registre paroissial</div></td>
                <td class="ref">
                    Fiche n° {{ $inscription->id }}<br>
                    Émise le {{ Carbon::now()->format('d/m/Y') }}
                </td>
            </tr>
        </table>
    </div>

    <h2>Identification du fidèle</h2>
    <table class="grid">
        @foreach (array_chunk($ficheRows, 2) as $pair)
            <tr>
                @foreach ($pair as $row)
                    <td>
                        <span class="label">{{ $ficheLabels[$row[0]] ?? $row[0] }}</span>
                        <span class="value">{{ $row[1] }}</span>
                    </td>
                @endforeach
                @if (count($pair) === 1)
                    <td></td>
                @endif
            </tr>
        @endforeach
        <tr>
            <td>
                <span class="label">Membre d'une CEV</span>
                <span class="value">{{ $oui($inscription->membre_cev) }}{{ $inscription->membre_cev && $inscription->quelle_cev ? ' — '.$inscription->quelle_cev : '' }}</span>
            </td>
            <td>
                <span class="label">Membre d'un groupe</span>
                <span class="value">{{ $oui($inscription->membre_groupe) }}{{ $inscription->membre_groupe && $inscription->quel_groupe ? ' — '.$inscription->quel_groupe : '' }}</span>
            </td>
        </tr>
    </table>

    <h2>Sacrements</h2>
    @forelse ($inscription->sacrements as $sacrement)
        <div class="sacr">
            <div class="sacr-head">
                {{ $typeLabels[$sacrement->type] ?? $sacrement->type }}
                @if ($sacrement->numero_registre)
                    <span class="num">N° Registre : {{ $sacrement->numero_registre }}</span>
                @endif
            </div>
            <table class="sacr-grid">
                @php
                    $rows = [];
                    foreach ($sacrOrder as $key) {
                        $value = $sacrement->{$key};
                        if ($value === null || $value === '') continue;
                        if (in_array($key, $dateFields, true)) $value = $fmt($value);
                        if ($key === 'sexe') $value = $value === 'fille' ? 'Fille' : 'Fils';
                        if ($key === 'numero_registre') continue; // already shown in the header
                        $rows[] = [$sacrLabels[$key], $value, in_array($key, ['remarques'], true)];
                    }
                @endphp
                @forelse ($rows as $i => $row)
                    @if ($i % 2 === 0)<tr>@endif
                    <td @class(['wide' => $row[2]])>
                        <span class="label">{{ $row[0] }}</span>
                        <span class="value">{{ $row[1] }}</span>
                    </td>
                    @if ($i % 2 === 1 || $loop->last)
                        @if ($i % 2 === 0 && $loop->last)<td></td>@endif
                        </tr>
                    @endif
                @empty
                    <tr><td colspan="2" class="empty">Aucun détail renseigné.</td></tr>
                @endforelse
            </table>
        </div>
    @empty
        <p class="empty">Aucun sacrement enregistré pour ce fidèle.</p>
    @endforelse

    <div class="footer">
        <table class="sign">
            <tr>
                <td>
                    <div class="sign-line">Le fidèle</div>
                </td>
                <td style="text-align: right;">
                    <div class="sign-line">Le Curé / Le Secrétariat paroissial</div>
                </td>
            </tr>
        </table>
        <div class="generated">
            Document généré par la paroisse Saint Dominique Savio — {{ Carbon::now()->format('d/m/Y H:i') }}
        </div>
    </div>
</body>
</html>
