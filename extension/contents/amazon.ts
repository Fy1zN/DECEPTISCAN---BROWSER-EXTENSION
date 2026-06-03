import type { PlasmoCSConfig } from "plasmo"

export const config: PlasmoCSConfig = {
  matches: [
    "https://www.amazon.com/*",
    "https://www.amazon.in/*"
  ]
}

console.log(
  "DeceptiScan Amazon content script loaded"
)

function detectProduct() {
  try {
    // Product Name
    const productName =
      document
        .querySelector("#productTitle")
        ?.textContent
        ?.trim() ||

      document
        .querySelector(
          '[data-hook="product-link"]'
        )
        ?.textContent
        ?.trim() ||

      document.title

    if (!productName) {
      console.log(
        "Product title not found"
      )
      return
    }

    // Rating
    const rating =
      document
        .querySelector(".a-icon-alt")
        ?.textContent
        ?.trim() || "Unknown"

    // Review Count
    let reviewCount = "0"

    const productPageReviewCount =
      document
        .querySelector(
          "#acrCustomerReviewText"
        )
        ?.textContent
        ?.trim()

    if (productPageReviewCount) {
      reviewCount =
        productPageReviewCount
    } else {
      const reviewPageMatch =
        document.body.innerText.match(
          /([\d,]+)\s+global ratings/i
        )

      if (reviewPageMatch) {
        reviewCount =
          `${reviewPageMatch[1]} global ratings`
      }
    }

    // Reviews
    const reviewNodes =
      document.querySelectorAll(
        '[data-hook="review-body"]'
      )

    const reviews = Array.from(
      reviewNodes
    )
      .map((node) =>
        node.textContent?.trim()
      )
      .filter(
        (
          review
        ): review is string =>
          Boolean(review)
      )
      .slice(0, 50)

    console.log(
      "Detected Product:",
      productName
    )

    console.log(
      "Rating:",
      rating
    )

    console.log(
      "Review Count:",
      reviewCount
    )

    console.log(
      "Reviews Extracted:",
      reviews.length
    )

    console.log(
      "Reviews:",
      reviews
    )

    console.log({
      productName,
      rating,
      reviewCount,
      reviewsFound:
        reviews.length
    })

    if (
      typeof chrome !==
        "undefined" &&
      chrome.storage &&
      chrome.storage.local
    ) {
      chrome.storage.local.set(
        {
          currentProduct:
            productName,
          currentSite: "Amazon",
          rating,
          reviewCount,
          reviews
        },
        () => {
          if (
            chrome.runtime
              .lastError
          ) {
            console.error(
              "Storage error:",
              chrome.runtime
                .lastError
            )
            return
          }

          console.log(
            "Product data saved successfully"
          )
        }
      )
    } else {
      console.error(
        "Chrome storage unavailable"
      )
    }
  } catch (error) {
    console.error(
      "Amazon content script error:",
      error
    )
  }
}

if (
  document.readyState ===
    "complete" ||
  document.readyState ===
    "interactive"
) {
  detectProduct()
} else {
  window.addEventListener(
    "DOMContentLoaded",
    detectProduct
  )
}

export {}