<!DOCTYPE html>
<html lang="fr">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Fiche du registre paroissial</title>
    <style>
        @page { size: A4 portrait; margin: 14mm 14mm 12mm 14mm; }
        * { box-sizing: border-box; }
        body {
            font-family: "DejaVu Sans", sans-serif;
            color: #1c2340;
            font-size: 10px;
            line-height: 1.35;
            margin: 0;
        }

        /* Fills the printable A4 height (applied only when the fiche holds a
           few sacraments) so the signatures sit near the bottom of the sheet. */
        .content.fill { min-height: 243mm; }

        /* ---------- Header ---------- */
        .header { border-bottom: 3px solid #0B3D91; padding-bottom: 6px; margin-bottom: 10px; }
        .header-brand { width: 100%; }
        .header-brand td { vertical-align: middle; }
        .parish { font-size: 16px; font-weight: bold; color: #0B3D91; line-height: 1.1; }
        .meta { font-size: 9px; color: #64748b; margin-top: 2px; }
        .doc-title {
            margin-top: 6px;
            font-size: 12px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #1c2340;
        }
        .doc-title .rule { display: inline-block; width: 46px; height: 3px; background: #D4AF37; margin-right: 8px; vertical-align: middle; }
        .stamp { text-align: right; font-size: 9px; color: #475569; }
        .stamp .ref {
            display: inline-block;
            background: #EEF3FB;
            border: 1px solid #0B3D91;
            border-radius: 4px;
            color: #0B3D91;
            font-weight: bold;
            font-size: 11px;
            padding: 5px 10px;
            margin-bottom: 4px;
        }

        /* ---------- Section titles ---------- */
        .section-title {
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            color: #0B3D91;
            margin: 0 0 6px;
        }
        .section-title .bar { display: inline-block; width: 5px; height: 11px; background: #D4AF37; margin-right: 7px; vertical-align: -1px; }

        /* ---------- Panels ---------- */
        .panel {
            border: 1px solid #dbe3ef;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 8px;
        }
        /* ---------- Field grids ---------- */
        table.fields { width: 100%; border-collapse: collapse; }
        table.fields td {
            vertical-align: top;
            padding: 3px 12px;
            width: 33.33%;
            border-top: 1px solid #eef2f7;
        }
        table.fields tr:first-child td { border-top: none; }
        table.fields td.full { width: 100%; }
        .k {
            font-size: 8px;
            font-weight: bold;
            color: #8a94a6;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-right: 5px;
        }
        .v { font-size: 10px; font-weight: bold; color: #111827; line-height: 1.35; }

        /* ---------- Sacraments ---------- */
        .sacr {
            border: 1px solid #dbe3ef;
            border-left: 5px solid #0B3D91;
            border-radius: 8px;
            overflow: hidden;
            margin-bottom: 6px;
            page-break-inside: avoid;
        }
        .sacr-head {
            background: #f3f7fd;
            border-bottom: 1px solid #dbe3ef;
            padding: 5px 12px;
        }
        .sacr-head .name {
            font-size: 14px;
            font-weight: bold;
            color: #0B3D91;
            letter-spacing: 0.5px;
            text-transform: uppercase;
        }
        .sacr-head .num {
            float: right;
            background: #D4AF37;
            color: #3d2e00;
            border-radius: 4px;
            font-size: 9px;
            font-weight: bold;
            letter-spacing: 0.4px;
            padding: 3px 8px;
            text-transform: uppercase;
        }
        .sacr table.fields td { padding: 3px 12px; }
        .sacr table.fields td.full { background: #fafbfd; }

        .empty { color: #9ca3af; font-style: italic; font-size: 10px; }

        /* ---------- Signatures ---------- */
        .signatures { padding-top: 10px; }
        table.sign { width: 100%; }
        table.sign td { width: 50%; vertical-align: bottom; }
        .sign-box { padding: 0 6px; }
        .sign-line { border-top: 1px solid #94a3b8; margin-top: 26px; padding-top: 5px; font-size: 9px; color: #475569; }
        .generated { margin-top: 12px; font-size: 7.5px; color: #9ca3af; text-align: center; border-top: 1px solid #eef2f7; padding-top: 6px; }
    </style>
</head>
<body>
    @php
        $fmt = function ($value) {
            if (! $value) return '';
            try { return \Carbon\Carbon::parse($value)->format('d/m/Y'); } catch (\Throwable $e) { return (string) $value; }
        };

        $typeLabels = [
            'bapteme' => 'Baptême',
            'communion' => '1re Communion',
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

        // Identification fields as inline [label, value] pairs.
        $fields = [];
        $add = function ($label, $value) use (&$fields) {
            if ($value !== null && $value !== '') $fields[] = [$label, $value];
        };
        $add('NOM', $inscription->nom);
        $add('PRÉNOM', $inscription->prenom);
        $add('TÉLÉPHONE', $inscription->telephone);
        $add('EMAIL', $inscription->email);
        $add("TRANCHE D'ÂGE", $inscription->tranche_age);
        $add('QUARTIER', $inscription->quartier);
        $add('RUE', $inscription->rue);
        $add('LIEU-DIT', $inscription->lieu_dit);
        $add('ANCIENNETÉ', $inscription->anciennete);
        $add("MEMBRE D'UNE CEV", $inscription->membre_cev ? ('Oui'.($inscription->quelle_cev ? ' — '.$inscription->quelle_cev : '')) : 'Non');
        $add("MEMBRE D'UN GROUPE", $inscription->membre_groupe ? ('Oui'.($inscription->quel_groupe ? ' — '.$inscription->quel_groupe : '')) : 'Non');
    @endphp

    <div class="content{{ $inscription->sacrements->count() <= 2 ? ' fill' : '' }}">
        <div class="header">
            <table class="header-brand">
                <tr>
                    <td>
                        <div class="parish">Paroisse Saint Dominique Savio</div>
                        <div class="meta">Doyenné Wouri I · Archidiocèse de Douala</div>
                    </td>
                    <td class="stamp">
                        <span class="ref">Fiche n° {{ $inscription->id }}</span><br>
                        Émise le {{ \Carbon\Carbon::now()->format('d/m/Y') }}
                    </td>
                </tr>
            </table>
            <div class="doc-title"><span class="rule"></span>Fiche du registre paroissial</div>
        </div>

        <h2 class="section-title"><span class="bar"></span>Identification du fidèle</h2>
        <div class="panel">
            <table class="fields">
                @foreach (array_chunk($fields, 3) as $pair)
                    <tr>
                        @foreach ($pair as $row)
                            <td>
                                <span class="k">{{ $row[0] }} :</span>
                                <span class="v">{{ $row[1] }}</span>
                            </td>
                        @endforeach
                        @for ($c = count($pair); $c < 3; $c++)
                            <td></td>
                        @endfor
                    </tr>
                @endforeach
            </table>
        </div>

        <h2 class="section-title"><span class="bar"></span>Sacrements</h2>
        @forelse ($inscription->sacrements as $sacrement)
            @php
                $rows = [];
                $remarque = null;
                foreach ($sacrOrder as $key) {
                    $value = $sacrement->{$key};
                    if ($value === null || $value === '') continue;
                    if ($key === 'numero_registre') continue; // shown in the header
                    if ($key === 'remarques') { $remarque = $value; continue; }
                    if (in_array($key, $dateFields, true)) $value = $fmt($value);
                    if ($key === 'sexe') $value = $value === 'fille' ? 'Fille' : 'Fils';
                    $rows[] = [$sacrLabels[$key], $value];
                }
            @endphp
            <div class="sacr">
                <div class="sacr-head">
                    @if ($sacrement->numero_registre)
                        <span class="num">N° {{ $sacrement->numero_registre }}</span>
                    @endif
                    <span class="name">{{ $typeLabels[$sacrement->type] ?? $sacrement->type }}</span>
                </div>
                @if (count($rows) === 0 && $remarque === null)
                    <table class="fields">
                        <tr><td class="full"><span class="empty">Aucun détail renseigné.</span></td></tr>
                    </table>
                @else
                    <table class="fields">
                        @foreach (array_chunk($rows, 3) as $pair)
                            <tr>
                                @foreach ($pair as $row)
                                    <td>
                                        <span class="k">{{ $row[0] }} :</span>
                                        <span class="v">{{ $row[1] }}</span>
                                    </td>
                                @endforeach
                                @for ($c = count($pair); $c < 3; $c++)
                                    <td></td>
                                @endfor
                            </tr>
                        @endforeach
                        @if ($remarque !== null)
                            <tr>
                                <td class="full">
                                    <span class="k">Remarques :</span>
                                    <span class="v">{{ $remarque }}</span>
                                </td>
                            </tr>
                        @endif
                    </table>
                @endif
            </div>
        @empty
            <p class="empty">Aucun sacrement enregistré pour ce fidèle.</p>
        @endforelse
    </div>

    <div class="signatures">
        <table class="sign">
            <tr>
                <td>
                    <div class="sign-box">
                        <div class="sign-line">Le fidèle</div>
                    </div>
                </td>
                <td style="text-align: right;">
                    <div class="sign-box">
                        <div class="sign-line">Le Curé / Le Secrétariat paroissial</div>
                    </div>
                </td>
            </tr>
        </table>
        <div class="generated">
            Document généré par la paroisse Saint Dominique Savio — {{ \Carbon\Carbon::now()->format('d/m/Y H:i') }}
        </div>
    </div>
</body>
</html>
