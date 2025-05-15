<?php

namespace App\Services;

use GuzzleHttp\Client;

class DpoPayService
{
    protected $client;
    protected $apiKey;
    protected $apiSecret;
    protected $baseUrl = 'https://api.dpopay.com/v1/'; // Replace with actual base URL if different

    public function __construct()
    {
        $this->client = new Client();
        $this->apiKey = env('DPO_API_KEY');
        $this->apiSecret = env('DPO_API_SECRET');
    }

    /**
     * Make a request to the DPO Pay API.
     */
    private function makeRequest($endpoint, $method = 'GET', $data = [])
    {
        $response = $this->client->request($method, $this->baseUrl . $endpoint, [
            'headers' => [
                'Authorization' => 'Bearer ' . $this->apiKey,
                'Content-Type' => 'application/json',
            ],
            'json' => $data,
        ]);

        return json_decode($response->getBody()->getContents(), true);
    }

    /**
     * Example: Initiate a payment request.
     */
    public function initiatePayment($amount, $currency = 'USD')
    {
        $data = [
            'amount' => $amount,
            'currency' => $currency,
            'merchantReference' => 'your_unique_reference', // Unique transaction reference
            'callbackUrl' => route('payment.callback'), // URL to redirect after payment
            'redirectUrl' => route('payment.success'), // URL to redirect if payment is successful
        ];

        return $this->makeRequest('payment/initiate', 'POST', $data);
    }

    /**
     * Example: Check payment status
     */
    public function checkPaymentStatus($transactionId)
    {
        return $this->makeRequest("payment/{$transactionId}/status");
    }
}
