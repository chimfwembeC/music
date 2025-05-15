<?php

namespace App\Http\Controllers;

use App\Services\DpoPayService;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;

class PaymentController extends Controller
{
    protected $dpoPayService;

    public function __construct(DpoPayService $dpoPayService)
    {
        $this->dpoPayService = $dpoPayService;
    }

    public function create(): Response
    {
        return Inertia::render('Payment/Create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'currency' => 'required|string|size:3'
        ]);

        $amount = $request->input('amount');
        $currency = $request->input('currency', 'USD');

        $response = $this->dpoPayService->initiatePayment($amount, $currency);

        if (isset($response['status']) && $response['status'] == 'success') {
            $payment = Payment::create([
                'user_id' => auth()->id(),
                'transaction_id' => $response['transaction_id'],
                'amount' => $amount,
                'currency' => $currency,
                'status' => 'pending',
                'merchant_reference' => $response['merchant_reference'] ?? null,
                'payment_url' => $response['paymentUrl'] ?? null,
                'callback_url' => route('payment.callback'),
            ]);
            return redirect($response['paymentUrl']);
        }

        return back()->withErrors('Payment initiation failed');
    }

    public function callback(Request $request)
    {
        $transactionId = $request->input('transaction_id');
        $payment = Payment::where('transaction_id', $transactionId)->first();

        if (!$payment) {
            Log::error("Payment callback received for unknown transaction ID: {$transactionId}");
            return back()->withErrors('Invalid transaction ID');
        }

        $response = $this->dpoPayService->checkPaymentStatus($transactionId);

        if (isset($response['status'])) {
            $payment->update(['status' => $response['status']]);

            if ($response['status'] == 'success') {
                return redirect()->route('payment.success');
            }
        }

        return back()->withErrors('Payment failed');
    }

    public function success(): Response
    {
        $payment = Payment::where('user_id', auth()->id())
            ->where('status', 'success')
            ->latest()
            ->first();

        return Inertia::render('Payment/Success', ['payment' => $payment]);
    }

    public function failed(): Response
    {
        return Inertia::render('Payment/Failed');
    }
}
