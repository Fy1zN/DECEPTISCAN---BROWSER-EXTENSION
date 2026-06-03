import { useEffect, useState } from "react"
import {
  ShieldCheck,
  AlertTriangle,
  Search,
  FileText
} from "lucide-react"

import analyzeReviews from "~lib/reviewAnalyzer"

function IndexPopup() {
  const [product, setProduct] = useState(
    "Loading Product..."
  )

  const [site, setSite] = useState(
    "Detecting..."
  )

  const [rating, setRating] = useState(
    "Loading..."
  )

  const [reviewCount, setReviewCount] =
    useState("Loading...")

  const [reviews, setReviews] = useState<
    string[]
  >([])

  useEffect(() => {
    try {
      if (
        typeof chrome === "undefined" ||
        !chrome.storage ||
        !chrome.storage.local
      ) {
        console.error(
          "Chrome Storage API unavailable"
        )

        setProduct("No Product Found")
        setSite("Unknown Site")
        return
      }

      chrome.storage.local.get(
        [
          "currentProduct",
          "currentSite",
          "rating",
          "reviewCount",
          "reviews"
        ],
        (result) => {
          if (chrome.runtime.lastError) {
            console.error(
              chrome.runtime.lastError
            )
            return
          }

          setProduct(
            result.currentProduct ||
              "No Product Found"
          )

          setSite(
            result.currentSite ||
              "Unknown Site"
          )

          setRating(
            result.rating || "N/A"
          )

          setReviewCount(
            result.reviewCount || "0"
          )

          setReviews(
            result.reviews || []
          )
        }
      )
    } catch (error) {
      console.error(
        "Popup storage error:",
        error
      )
    }
  }, [])

  const analysisResult = analyzeReviews(
  reviews,
  rating,
  reviewCount
)

  return (
    <div
      style={{
        width: "420px",
        padding: "20px",
        background: "#F8FAFC",
        fontFamily:
          "Inter, Segoe UI, Arial, sans-serif"
      }}
    >
      {/* Header */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "24px"
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "10px",
            marginBottom: "8px"
          }}
        >
          <ShieldCheck
            size={34}
            color="#14B8A6"
          />

          <h1
            style={{
              margin: 0,
              fontSize: "36px",
              fontWeight: 700,
              color: "#0F172A"
            }}
          >
            DeceptiScan
          </h1>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: "14px",
            color: "#64748B"
          }}
        >
          Review Intelligence Engine
        </p>
      </div>

      {/* Product Card */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          padding: "18px",
          marginBottom: "18px"
        }}
      >
        <p
          style={{
            margin: 0,
            color: "#64748B",
            fontSize: "12px"
          }}
        >
          Detected Site
        </p>

        <h3
          style={{
            marginTop: "6px",
            marginBottom: "14px",
            color: "#14B8A6",
            fontSize: "22px"
          }}
        >
          {site} ✓
        </h3>

        <p
          style={{
            margin: 0,
            color: "#64748B",
            fontSize: "12px"
          }}
        >
          Current Product
        </p>

        <div
          style={{
            marginTop: "4px",
            fontWeight: 600,
            fontSize: "16px",
            color: "#0F172A",
            lineHeight: 1.4,
            marginBottom: "16px"
          }}
        >
          {product}
        </div>

        {/* Product Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "12px",
            marginTop: "10px"
          }}
        >
          <div
            style={{
              background: "#F8FAFC",
              padding: "12px",
              borderRadius: "10px"
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#64748B"
              }}
            >
              Rating
            </div>

            <div
              style={{
                fontWeight: 700,
                color: "#0F172A"
              }}
            >
              ⭐ {rating}
            </div>
          </div>

          <div
            style={{
              background: "#F8FAFC",
              padding: "12px",
              borderRadius: "10px"
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#64748B"
              }}
            >
              Total Reviews
            </div>

            <div
              style={{
                fontWeight: 700,
                color: "#0F172A"
              }}
            >
              📝 {reviewCount}
            </div>
          </div>

          <div
            style={{
              background: "#F8FAFC",
              padding: "12px",
              borderRadius: "10px",
              gridColumn:
                "1 / span 2"
            }}
          >
            <div
              style={{
                fontSize: "12px",
                color: "#64748B"
              }}
            >
              Reviews Scraped
            </div>

            <div
              style={{
                fontWeight: 700,
                color: "#0F172A"
              }}
            >
              🤖 {reviews.length}
            </div>
          </div>
        </div>
      </div>

      {/* Score Card */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "18px",
          textAlign: "center"
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            border: "8px solid #14B8A6",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            margin: "0 auto 16px auto"
          }}
        >
          <div
            style={{
              fontSize: "52px",
              fontWeight: 700,
              color: "#14B8A6"
            }}
          >
            {analysisResult.score}%
          </div>
        </div>

        <div
          style={{
            fontSize: "18px",
            color: "#475569",
            marginBottom: "14px",
            fontWeight: 500
          }}
        >
          Trust Score
        </div>

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "8px",
            padding: "8px 16px",
            borderRadius: "999px",
            background: "#DCFCE7",
            color: "#15803D",
            fontWeight: 600
          }}
        >
          🟢 {analysisResult.risk}
        </div>
      </div>

      {/* Signals */}
      <div
        style={{
          background: "#FFFFFF",
          border: "1px solid #E2E8F0",
          borderRadius: "16px",
          padding: "18px",
          marginBottom: "20px"
        }}
      >
        <h3
          style={{
            marginTop: 0,
            marginBottom: "16px",
            color: "#0F172A"
          }}
        >
          Suspicious Signals
        </h3>

        {analysisResult.signals.map(
          (signal, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                marginBottom: "12px",
                color: "#475569"
              }}
            >
              <AlertTriangle
                size={18}
                color="#F59E0B"
              />
              <span>{signal}</span>
            </div>
          )
        )}
      </div>

      <button
        style={{
          width: "100%",
          height: "54px",
          background: "#14B8A6",
          color: "#FFFFFF",
          border: "none",
          borderRadius: "12px",
          fontWeight: 700,
          fontSize: "15px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px",
          marginBottom: "12px"
        }}
      >
        <Search size={18} />
        Analyze Current Product
      </button>

      <button
        style={{
          width: "100%",
          height: "54px",
          background: "#FFFFFF",
          color: "#14B8A6",
          border: "2px solid #14B8A6",
          borderRadius: "12px",
          fontWeight: 700,
          fontSize: "15px",
          cursor: "pointer",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "10px"
        }}
      >
        <FileText size={18} />
        View Full Report
      </button>
    </div>
  )
}

export default IndexPopup