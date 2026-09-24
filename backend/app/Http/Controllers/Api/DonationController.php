<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use Illuminate\Validation\Rule;
use App\Payments\PaymentService;
use Illuminate\Http\Request;

class DonationController extends Controller
{
    public function store(Request $request, PaymentService $payments)
    {
        if (blank($request->input('telephone'))) {
            $request->merge(['telephone' => $request->user()->phone]);
        }

        $data = $request->validate([
            'montant' => 'required|numeric|min:100',
            'payment_method' => 'required|in:orange_money,mtn_momo,especes',
            'telephone' => 'required_unless:payment_method,especes|nullable|string|max:30',
            'intention' => 'nullable|string|max:255',
            'projet_id' => ['nullable', Rule::exists('projets', 'id')->where('is_active', true)->where('statut', 'en_cours')],
        ]);
        $data['user_id'] = $request->user()->id;

        $donation = Donation::create($data);
        $payment = $payments->start($donation);

        return response()->json(['donation' => $donation->fresh('projet:id,titre'), 'payment' => $payment], 201);
    }

    public function myDonations(Request $request)
    {
        return response()->json(Donation::where('user_id', $request->user()->id)->with('projet:id,titre')->latest()->get());
    }

    public function adminIndex()
    {
        return response()->json(Donation::with(['user:id,nom,prenom,email', 'projet:id,titre'])->latest()->get());
    }

    public function update(Request $request, Donation $donation)
    {
        $data = $request->validate(['payment_status' => 'required|in:en_attente,paye,echoue,annule']);

        if ($data['payment_status'] === 'paye' && $donation->payment_status !== 'paye') {
            $data['confirmed_by_user_id'] = $request->user()->id;
            $data['confirmed_at'] = now();
        }

        $donation->update($data);

        return response()->json($donation);
    }
}
