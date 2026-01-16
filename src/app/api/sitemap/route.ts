import { createClient } from '@supabase/supabase-js';

const supabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export async function GET() {
  try {
    // Fetch all published notes from Supabase
    const { data: notes, error } = await supabaseClient
      .from('notes')
      .select('id, title, created_at, updated_at')
      .eq('status', 'published')
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching notes for sitemap:', error);
      throw error;
    }

    // Base URL - Replace with your actual domain
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://noteshub.example.com';

    // Generate sitemap XML
    let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"\n';
    xml += '        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n';

    // Add static pages
    const staticPages = [
      { loc: '/', changefreq: 'weekly', priority: 1.0 },
      { loc: '/student/browse', changefreq: 'daily', priority: 0.9 },
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

    // Add dynamic note pages
    if (notes && notes.length > 0) {
      notes.forEach((note) => {
        xml += '  <url>\n';
        xml += `    <loc>${baseUrl}/student/notes/${note.id}</loc>\n`;
        xml += `    <lastmod>${new Date(note.updated_at).toISOString().split('T')[0]}</lastmod>\n`;
        xml += '    <changefreq>monthly</changefreq>\n';
        xml += '    <priority>0.8</priority>\n';
        xml += '  </url>\n';
      });
    }

    xml += '</urlset>';

    // Return XML with proper headers
    return new Response(xml, {
      headers: {
        'Content-Type': 'application/xml',
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
        'Content-Type': 'application/xml',
      },
    });
  }
}
