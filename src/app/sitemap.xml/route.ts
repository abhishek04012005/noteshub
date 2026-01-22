import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// Helper function to convert string to URL-friendly slug
function slugify(text: string | undefined): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function GET() {
  try {
    // Fetch all notes from Supabase
    const { data: notes, error } = await supabaseClient
      .from('notes')
      .select('id, title, university, course, subject, chapter_no, created_at, updated_at')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes for sitemap:', error);
      throw error;
    }

    // Fetch syllabuses
    const { data: syllabuses } = await supabaseClient
      .from('syllabuses')
      .select('id, title, university, course, branch, semester, created_at, updated_at')
      .eq('is_free', true)
      .order('updated_at', { ascending: false });

    // Base URL
    const baseUrl = 'https://noteshub.abhishekchoudhary.co.in';

    // Generate sitemap XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

    // Add static pages
    const staticPages = [
      { loc: '/', changefreq: 'weekly', priority: 1.0 },
      { loc: '/student/browse', changefreq: 'daily', priority: 0.9 },
      { loc: '/student/syllabuses', changefreq: 'daily', priority: 0.85 },
      { loc: '/admin/login', changefreq: 'monthly', priority: 0.7 },
    ];

    staticPages.forEach((page) => {
      xml += '  <url>\n';
      xml += `    <loc>${baseUrl}${page.loc}</loc>\n`;
      xml += `    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>\n`;
      xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
      xml += `    <priority>${page.priority}</priority>\n`;
      xml += '  </url>\n';
    });

    // Add dynamic note pages with nested URL structure
    if (notes && notes.length > 0) {
      notes.forEach((note) => {
        // Build slug from university/course/subject/chapter
        const university = slugify(note.university);
        const course = slugify(note.course);
        const subject = slugify(note.subject);
        const chapter = slugify(note.chapter_no);

        // Only add if we have all the required fields
        if (university && course && subject && chapter) {
          const noteUrl = `${baseUrl}/student/notes/${university}/${course}/${subject}/${chapter}`;
          xml += '  <url>\n';
          xml += `    <loc>${noteUrl}</loc>\n`;
          xml += `    <lastmod>${new Date(note.updated_at).toISOString().split('T')[0]}</lastmod>\n`;
          xml += '    <changefreq>monthly</changefreq>\n';
          xml += '    <priority>0.8</priority>\n';
          xml += '  </url>\n';
        }
      });
    }

    // Add dynamic syllabus pages
    if (syllabuses && syllabuses.length > 0) {
      syllabuses.forEach((syllabus) => {
        // Build slug from university/course/branch/semester
        const university = slugify(syllabus.university);
        const course = slugify(syllabus.course);
        const branch = slugify(syllabus.branch);
        const semester = slugify(syllabus.semester);

        // Only add if we have all the required fields
        if (university && course && branch && semester) {
          const syllabusUrl = `${baseUrl}/student/syllabus-download/${syllabus.id}`;
          xml += '  <url>\n';
          xml += `    <loc>${syllabusUrl}</loc>\n`;
          xml += `    <lastmod>${new Date(syllabus.updated_at).toISOString().split('T')[0]}</lastmod>\n`;
          xml += '    <changefreq>monthly</changefreq>\n';
          xml += '    <priority>0.7</priority>\n';
          xml += '  </url>\n';
        }
      });
    }

    xml += '</urlset>';

    // Return XML with proper headers
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('Sitemap generation error:', error);

    // Return fallback sitemap on error
    const fallbackXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://noteshub.abhishekchoudhary.co.in/</loc>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://noteshub.abhishekchoudhary.co.in/student/browse</loc>
    <priority>0.9</priority>
  </url>
</urlset>`;

    return new Response(fallbackXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
      },
    });
  }
}
