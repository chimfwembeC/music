<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id(); // Auto-incrementing ID
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Foreign key to users table
            $table->string('transaction_id')->unique(); // Unique transaction ID from DPO Pay
            $table->decimal('amount', 10, 2); // Payment amount
            $table->string('currency', 3); // Payment currency (e.g., 'USD')
            $table->string('status'); // Payment status (e.g., 'pending', 'success', 'failed')
            $table->string('merchant_reference')->nullable(); // Unique reference for the transaction
            $table->text('payment_url')->nullable(); // URL to redirect the user to the payment page
            $table->text('callback_url')->nullable(); // Callback URL to receive payment notifications
            $table->timestamps(); // Created at and updated at
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
