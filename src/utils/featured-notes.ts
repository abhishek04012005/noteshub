import { Notes, Purchase } from '@/types';

export function selectFeaturedNotes(notes: Notes[], purchases: Purchase[]) {
  const sortedNotes = [...notes].sort((a, b) => {
    const dateA = new Date(a.created_at || 0).getTime();
    const dateB = new Date(b.created_at || 0).getTime();
    return dateB - dateA;
  });

  const purchaseCounts = purchases.reduce<Record<string, number>>((acc, purchase) => {
    if (purchase.notes_id && purchase.status === 'completed') {
      acc[purchase.notes_id] = (acc[purchase.notes_id] || 0) + 1;
    }
    return acc;
  }, {});

  const rankedNotes = sortedNotes
    .map((note) => ({
      ...note,
      purchaseCount: purchaseCounts[note.id] || 0,
    }))
    .sort((a, b) => {
      if (b.purchaseCount !== a.purchaseCount) {
        return b.purchaseCount - a.purchaseCount;
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

  const selected = rankedNotes.slice(0, 3);
  const latestNote = sortedNotes[0];

  if (!latestNote) {
    return [];
  }

  const featuredIds = new Set<string>([latestNote.id]);
  const curated: Notes[] = [latestNote];

  rankedNotes.forEach((note) => {
    if (curated.length >= 3) {
      return;
    }
    if (!featuredIds.has(note.id)) {
      curated.push(note);
      featuredIds.add(note.id);
    }
  });

  return curated.slice(0, 3);
}
