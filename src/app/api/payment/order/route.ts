import { NextRequest, NextResponse } from 'next/server';
import razorpay from '@/lib/razorpay';
import { supabase } from '@/lib/supabase';

// Create Razorpay order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { notes_id, amount, customer_email, customer_name } = body;

    // Create order with Razorpay
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise
      currency: 'INR',
      receipt: `receipt_${Date.now()}`,
      notes: {
        notes_id,
        customer_email,
        customer_name,
      },
    });

    // Store purchase record in Supabase with pending status
    const { data, error } = await supabase.from('purchases').insert([
      {
        notes_id,
        customer_email,
        customer_name,
        amount,
        razorpay_order_id: order.id,
        status: 'pending',
        created_at: new Date().toISOString(),
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json(
      {
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
