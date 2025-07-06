import { Star } from 'lucide-react';

export const width = 1200;
export const height = 675;

export function OpenGraphImage(props: {
  numberOfDiscussions: string | null;
  reviews: {
    averageRating: string;
    totalReviews: string;
  } | null;
  imageUrl: string;
}) {
  const { numberOfDiscussions, reviews, imageUrl } = props;
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#B2DFDB',
        backgroundImage:
          'radial-gradient(circle at 25px 25px, teal 2%, transparent 0%), radial-gradient(circle at 75px 75px, teal 2%, transparent 0%)',
        backgroundSize: '100px 100px',
        backgroundPosition: '0 -8px, 0 -8px',
      }}
    >
      {/* Top Row - Image and IBZIM Text */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          flex: 2,
          width: '100%',
        }}
      >
        {/* Left Column - Image (1x1 ratio) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 1,
            padding: '20px',
          }}
        >
          <div
            style={{
              width: '280px',
              height: '280px',
              backgroundImage: `url(${imageUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '20px',
              border: '4px solid white',
            }}
          />
        </div>

        {/* Right Column - IBZIM Text */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flex: 2,
            fontFamily: 'Bevan',
            fontSize: 120,
            fontStyle: 'normal',
            color: 'white',
            lineHeight: 1,
            whiteSpace: 'pre-wrap',
          }}
        >
          <div style={{ display: 'flex' }}>
            <b style={{ color: 'black' }}>IB</b>
            <b style={{ color: '#eab308' }}>ZIM</b>
          </div>
        </div>
      </div>

      {/* Bottom Row - Full Width Discussion/Reviews */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          fontSize: 48,
          fontStyle: 'normal',
          backgroundColor: 'black',
          color: 'white',
          margin: '0 40px 40px 40px',
          borderRadius: '20px',
          padding: '30px',
          lineHeight: 1,
          whiteSpace: 'pre-wrap',
        }}
      >
        {numberOfDiscussions ? (
          <b>Join {numberOfDiscussions} Open Discussions</b>
        ) : reviews ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  style={{
                    width: '40px',
                    height: '40px',
                    fill:
                      star <=
                      Math.floor(Number.parseFloat(reviews.averageRating))
                        ? '#eab308'
                        : star <=
                            Math.ceil(Number.parseFloat(reviews.averageRating))
                          ? '#fde047'
                          : 'transparent',
                    color:
                      star <=
                      Math.ceil(Number.parseFloat(reviews.averageRating))
                        ? '#eab308'
                        : '#6b7280',
                  }}
                />
              ))}
            </div>
            <span style={{ fontSize: '36px', fontWeight: 'normal' }}>
              {reviews.averageRating} ({reviews.totalReviews} reviews)
            </span>
          </div>
        ) : null}
      </div>
    </div>
  );
}
