import { ImageResponse } from "next/og";

/**
 * The 1200×630 social card, drawn with Satori via `next/og`.
 *
 * Generated at build time and cached, so there is no image asset to keep in
 * sync with the brand. Typography only — the wordmark is set as text rather
 * than the logo WebP, because Satori cannot decode a raster WebP.
 *
 * Satori constraints worth knowing before editing: every element with more than
 * one child needs `display: flex`, and it supports a subset of CSS (linear
 * gradients, borders, radii — no filters or box-shadows on text).
 */
export function renderOgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          background:
            "linear-gradient(145deg, #0b1c30 0%, #08121e 55%, #060d16 100%)",
          color: "#ffffff",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                width: 44,
                height: 44,
                borderRadius: 13,
                background: "linear-gradient(160deg, #ff6a12, #c85f06)",
              }}
            />
            <div
              style={{
                display: "flex",
                marginLeft: 16,
                fontSize: 30,
                fontWeight: 700,
                letterSpacing: -0.5,
              }}
            >
              BULLSHILL.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              fontSize: 19,
              letterSpacing: 3.2,
              color: "rgba(183, 192, 203, 0.72)",
            }}
          >
            WEB3 &amp; AI MARKETING
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              width: 96,
              height: 4,
              borderRadius: 2,
              background: "#e8750a",
            }}
          />
          <div
            style={{
              display: "flex",
              marginTop: 30,
              maxWidth: 920,
              fontSize: 74,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: -2.2,
            }}
          >
            Marketing Built for Web3 Success
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 26,
              maxWidth: 780,
              fontSize: 27,
              lineHeight: 1.45,
              color: "rgba(183, 192, 203, 0.88)",
            }}
          >
            Token launches, community growth and campaigns that convert.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            paddingTop: 26,
            borderTop: "1px solid rgba(123, 150, 184, 0.35)",
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "rgba(183, 192, 203, 0.9)",
            }}
          >
            bullshill.com
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 24,
              color: "rgba(183, 192, 203, 0.55)",
            }}
          >
            Crypto &amp; Web3 marketing agency
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
