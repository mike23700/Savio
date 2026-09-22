<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Payments\PaymentService;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    public function store(Request $request, PaymentService $payments)
    {
        $data = $request->validate([
            'montant' => 'required|numeric|min:100',
            'payment_method' => 'required|in:orange_money,mtn_momo,especes',
            'intention' => 'nullable|string|max:255',
        ]);
        $data['user_id'] = $request->user()->id;

        $donation = Donation::create($data);
        $payment = $payments->initiate($donation->payment_method, (float) $donation->montant);

        return response()->json(['donation' => $donation, 'payment' => $payment], 201);
    }

    public function myDonations(Request $request)
    {
        return response()->json(Donation::where('user_id', $request->user()->id)->latest()->get());
    }

    public function adminIndex()
    {
        return response()->json(Donation::with('user:id,nom,prenom,email')->latest()->get());
    }

    public function update(Request $request, Donation $donation)
    {
        $data = $request->validate(['payment_status' => 'required|in:en_attente,paye,annule']);

        if ($data['payment_status'] === 'paye' && $donation->payment_status !== 'paye') {
            $data['confirmed_by_user_id'] = $request->user()->id;
            $data['confirmed_at'] = now();
        }

        $donation->update($data);

        return response()->json($donation);
    }
}
