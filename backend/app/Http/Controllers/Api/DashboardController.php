<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CatecheseInscription;
use App\Models\IntentionMesse;
use App\Models\Order;
use App\Models\RegistreInscription;

class DashboardController extends Controller
{
    public function index()
    {
        return response()->json([
            'intentions_en_attente' => IntentionMesse::where('statut', 'en_attente')->count(),
            'commandes_en_attente' => Order::where('payment_status', 'en_attente')->count(),
            'catechese_inscriptions_en_attente' => CatecheseInscription::where('statut', 'en_attente')->count(),
            'registre_cette_semaine' => RegistreInscription::where('created_at', '>=', now()->subDays(7))->count(),
            'registre_total' => RegistreInscription::count(),
            'dernieres_commandes' => Order::latest()->take(5)->get(['id', 'order_number', 'nom', 'prenom', 'total', 'payment_status', 'created_at']),
            'dernieres_intentions' => IntentionMesse::latest()->take(5)->get(['id', 'nom', 'prenom', 'description', 'statut', 'created_at']),
        ]);
    }
}
