import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '@/lib/supabase';

// Verify and confirm payment
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
      notes_id,
    } = body;

    // Verify Razorpay signature
    const secret = process.env.RAZORPAY_KEY_SECRET || '';
    const expectedSignature = crypto
      .createHmac('sha256', secret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: 'Payment verification failed' },
        { status: 400 }
      );
    }

    // Get notes info for download URL
    const { data: noteData, error: noteError } = await supabase
      .from('notes')
      .select('*')
      .eq('id', notes_id)
      .single();

    if (noteError || !noteData) {
      return NextResponse.json(
        { error: 'Note not found' },
        { status: 404 }
      );
    }

    // Update purchase record to completed
    const { data, error } = await supabase
      .from('purchases')
      .update({
        razorpay_payment_id,
        status: 'completed',
        download_url: noteData.download_url,
        updated_at: new Date().toISOString(),
      })
      .eq('razorpay_order_id', razorpay_order_id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({
      message: 'Payment verified and recorded',
      download_url: noteData.download_url,
    });
  } catch (error) {
    console.error('Error verifying payment:', error);
    return NextResponse.json(
      { error: 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
