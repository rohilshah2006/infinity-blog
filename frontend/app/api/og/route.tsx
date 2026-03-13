import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Dynamic parameters
    const title = searchParams.get('title') || 'Infinity Blog';
    const author = searchParams.get('author') || 'Anonymous';
    const accentColor = searchParams.get('accent') || '#d97757'; // Default brand orange
    const avatarUrl = searchParams.get('avatar');

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#0a0a0a',
            backgroundImage: `radial-gradient(circle at 50% 50%, ${accentColor}33 0%, #0a0a0a 70%)`,
            fontFamily: 'sans-serif',
          }}
        >
          {/* Main Card */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '900px',
              height: '500px',
              backgroundColor: 'rgba(23, 23, 23, 0.8)',
              borderRadius: '40px',
              padding: '60px',
              border: `1px solid rgba(255, 255, 255, 0.1)`,
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Logo area */}
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: accentColor,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                }}
              >
                <div style={{ width: '20px', height: '20px', border: '3px solid #fff', borderRadius: '50%' }} />
              </div>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', letterSpacing: '-1px' }}>
                INFINITY
              </span>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: '64px',
                fontWeight: '800',
                color: '#fff',
                lineHeight: '1.1',
                marginBottom: 'auto',
                display: 'flex',
                flexWrap: 'wrap',
              }}
            >
              {title}
            </div>

            {/* Footer / Author */}
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '40px' }}>
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    marginRight: '20px',
                    border: `2px solid ${accentColor}`,
                  }}
                  alt="Avatar"
                />
              ) : (
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    borderRadius: '50%',
                    backgroundColor: '#27272a',
                    marginRight: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                  }}
                >
                  👤
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '24px', color: '#f9fafb', fontWeight: 'bold' }}>{author}</span>
                <span style={{ fontSize: '18px', color: '#a1a1aa' }}>infinity-blog.tech</span>
              </div>
            </div>

            {/* Design Accents */}
            <div
              style={{
                position: 'absolute',
                top: '-100px',
                right: '-100px',
                width: '300px',
                height: '300px',
                backgroundColor: accentColor,
                filter: 'blur(100px)',
                opacity: '0.2',
                borderRadius: '50%',
              }}
            />
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(e.message);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
