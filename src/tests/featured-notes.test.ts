import { selectFeaturedNotes } from '../utils/featured-notes';
import { Notes, Purchase } from '../types';

describe('selectFeaturedNotes', () => {
  const notes: Notes[] = [
    {
      id: 'note-1',
      title: 'Latest note',
      description: 'Newest content',
      subject: 'Maths',
      original_price: 100,
      discounted_price: 80,
      author: 'Author A',
      created_at: '2025-02-01T00:00:00.000Z',
      updated_at: '2025-02-01T00:00:00.000Z',
    },
    {
      id: 'note-2',
      title: 'Most popular note',
      description: 'High demand',
      subject: 'Physics',
      original_price: 120,
      discounted_price: 90,
      author: 'Author B',
      created_at: '2025-01-15T00:00:00.000Z',
      updated_at: '2025-01-15T00:00:00.000Z',
    },
    {
      id: 'note-3',
      title: 'Second popular note',
      description: 'Also popular',
      subject: 'Chemistry',
      original_price: 140,
      discounted_price: 100,
      author: 'Author C',
      created_at: '2025-01-10T00:00:00.000Z',
      updated_at: '2025-01-10T00:00:00.000Z',
    },
    {
      id: 'note-4',
      title: 'Less popular note',
      description: 'Limited demand',
      subject: 'English',
      original_price: 60,
      discounted_price: 50,
      author: 'Author D',
      created_at: '2025-01-05T00:00:00.000Z',
      updated_at: '2025-01-05T00:00:00.000Z',
    },
  ];

  const purchases: Purchase[] = [
    {
      id: 'purchase-1',
      notes_id: 'note-2',
      customer_email: 'student1@example.com',
      email: 'student1@example.com',
      customer_name: 'Student 1',
      amount: 90,
      razorpay_payment_id: 'pay-1',
      razorpay_order_id: 'order-1',
      status: 'completed',
      download_url: 'https://example.com',
      created_at: '2025-02-05T00:00:00.000Z',
      updated_at: '2025-02-05T00:00:00.000Z',
    },
    {
      id: 'purchase-2',
      notes_id: 'note-2',
      customer_email: 'student2@example.com',
      email: 'student2@example.com',
      customer_name: 'Student 2',
      amount: 90,
      razorpay_payment_id: 'pay-2',
      razorpay_order_id: 'order-2',
      status: 'completed',
      download_url: 'https://example.com',
      created_at: '2025-02-06T00:00:00.000Z',
      updated_at: '2025-02-06T00:00:00.000Z',
    },
    {
      id: 'purchase-3',
      notes_id: 'note-3',
      customer_email: 'student3@example.com',
      email: 'student3@example.com',
      customer_name: 'Student 3',
      amount: 100,
      razorpay_payment_id: 'pay-3',
      razorpay_order_id: 'order-3',
      status: 'completed',
      download_url: 'https://example.com',
      created_at: '2025-02-07T00:00:00.000Z',
      updated_at: '2025-02-07T00:00:00.000Z',
    },
  ];

  it('returns the latest note plus the two most purchased notes', () => {
    const featured = selectFeaturedNotes(notes, purchases);

    expect(featured.map((note) => note.id)).toEqual(['note-1', 'note-2', 'note-3']);
  });

  it('falls back to the newest notes when there are no purchases', () => {
    const featured = selectFeaturedNotes(notes, []);

    expect(featured.map((note) => note.id)).toEqual(['note-1', 'note-2', 'note-3']);
  });
});
