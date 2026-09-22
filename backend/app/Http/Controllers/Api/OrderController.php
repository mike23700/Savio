<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Payments\PaymentService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class OrderController extends Controller
{
    public function store(Request $request, PaymentService $payments)
    {
        $data = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'nullable|email',
            'telephone' => 'required|string|max:30',
            'payment_method' => 'required|in:orange_money,mtn_momo,especes',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        $order = DB::transaction(function () use ($data, $request) {
            $products = Product::whereIn('id', collect($data['items'])->pluck('product_id'))->get()->keyBy('id');

            $total = 0;
            $itemsToCreate = [];
            foreach ($data['items'] as $line) {
                $product = $products->get($line['product_id']);
                if (! $product) {
                    throw ValidationException::withMessages(['items' => ['Produit introuvable.']]);
                }
                $subtotal = $product->prix * $line['qty'];
                $total += $subtotal;
                $itemsToCreate[] = [
                    'product_id' => $product->id,
                    'product_nom_snapshot' => $product->nom,
                    'prix_unitaire' => $product->prix,
                    'qty' => $line['qty'],
                    'subtotal' => $subtotal,
                ];
            }

            $order = Order::create([
                'user_id' => $request->user()?->id,
                'order_number' => 'CMD-' . now()->format('ymd') . '-' . Str::upper(Str::random(5)),
                'nom' => $data['nom'],
                'prenom' => $data['prenom'],
                'email' => $data['email'] ?? null,
                'telephone' => $data['telephone'],
                'total' => $total,
                'payment_method' => $data['payment_method'],
            ]);

            foreach ($itemsToCreate as $item) {
                $order->items()->create($item);
            }

            return $order;
        });

        $payment = $payments->initiate($order->payment_method, (float) $order->total);

        return response()->json([
            'order' => $order->load('items'),
            'payment' => $payment,
        ], 201);
    }

    public function myOrders(Request $request)
    {
        return response()->json(
            Order::where('user_id', $request->user()->id)->with('items')->latest()->get()
        );
    }

    public function adminIndex()
    {
        return response()->json(Order::with('items')->latest()->get());
    }

    public function update(Request $request, Order $order)
    {
        $data = $request->validate([
            'payment_status' => 'nullable|in:en_attente,paye,annule',
            'order_status' => 'nullable|in:en_attente,confirmee,preparee,livree,annulee',
            'notes' => 'nullable|string',
        ]);

        if (($data['payment_status'] ?? null) === 'paye' && $order->payment_status !== 'paye') {
            $data['confirmed_by_user_id'] = $request->user()->id;
            $data['confirmed_at'] = now();
        }

        $order->update($data);

        return response()->json($order->fresh('items'));
    }
}
