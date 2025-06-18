// CrUXApiUtil is an object that contains the API key, API endpoint, and a query method
const CrUXApiUtil = {
  // API key is retrieved from the environment variable GOOGLE_CLOUD_CRUX_KEY
  API_KEY: process.env.GOOGLE_CLOUD_CRUX_KEY,
  // API endpoint is constructed using the API key
  API_ENDPOINT: `https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=${process.env.GOOGLE_CLOUD_CRUX_KEY}`,

  // query method sends a POST request to the API endpoint with the provided body
  async query(body: any): Promise<any> {
    // If the API key is not available, throw an error with instructions to replace the placeholder
    if (!process.env.GOOGLE_CLOUD_CRUX_KEY) {
      console.log(this.API_ENDPOINT);
      throw new Error(
        'Replace "YOUR_API_KEY" with your private CrUX API key. Get a key at https://goo.gle/crux-api-key.'
      );
    }

    console.log("requestBody", body);

    try {
      // Send a POST request to the API endpoint with the provided body
      const response = await fetch(this.API_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      // Return the response as JSON
      return await response.json();
    } catch (error) {
      // If an error occurs during the API call, log the error and re-throw it
      console.error("API call failed:", error);
      throw error;
    }
  },
};

// getFinalUrl is an async function that fetches the final URL after any redirects
async function getFinalUrl(url: string): Promise<string> {
  console.log(`Attempting to fetch final URL for: ${url}`);
  // Fetch the URL with the redirect option set to "manual"
  const response = await fetch(url, { redirect: "manual" });
  console.log(
    `Received HTTP response status: ${response.status} for URL: ${url}`
  );
  // Get the "location" header from the response
  const locationHeader = response.headers.get("location");
  // If the response status is a redirect (3xx) and the "location" header exists, return the "location" header; otherwise, return the original URL
  return response.status >= 300 && response.status < 400 && locationHeader
    ? locationHeader
    : url;
}

// fetchCrUXData is an async function that fetches CrUX data for a given URL
export async function fetchCrUXData(url: string): Promise<any> {
  // Get the final URL after any redirects
  const finalUrl = await getFinalUrl(url);
  console.log(`Fetching CrUX data for: ${finalUrl}`);
  // Query the CrUX API with the final URL
  const rawWebVitals = await CrUXApiUtil.query({ url: finalUrl });
  // Assess the Core Web Vitals based on the raw web vitals data
  const coreVitalsAssessment = assessCoreWebVitals(rawWebVitals);
  // Return an object containing the raw web vitals data and the Core Web Vitals assessment
  return { rawWebVitals, coreVitalsAssessment };
}

// CrUXApiResponse interface defines the structure of the response from the CrUX API
interface CrUXApiResponse {
  record: {
    key: {
      url: string;
    };
    metrics: {
      [key: string]: {
        histogram: HistogramEntry[];
        percentiles: {
          p75: number;
        };
      };
    };
  };
}

// HistogramEntry interface defines the structure of a histogram entry in the CrUX API response
export interface HistogramEntry {
  start: number;
  end?: number;
  density: number;
}

// MetricAssessment interface defines the structure of an assessment for a single metric
export interface MetricAssessment {
  percentile75: number;
  threshold: number;
  passes: boolean;
}

// AssessmentResults interface defines the structure of the overall assessment results
export interface AssessmentResults {
  [key: string]: MetricAssessment | { error: string };
}

// assessCoreWebVitals function assesses the Core Web Vitals based on the CrUX API response
function assessCoreWebVitals(cruxResponse: CrUXApiResponse): AssessmentResults {
  // Define an array of Core Web Vitals metrics
  const coreWebVitals = [
    "largest_contentful_paint",
    "first_input_delay",
    "cumulative_layout_shift",
  ];

  // Reduce the Core Web Vitals metrics into an object of assessment results
  return coreWebVitals.reduce<AssessmentResults>((results, metric) => {
    // Get the metric data from the CrUX API response
    const metricData = cruxResponse.record.metrics[metric];

    if (!metricData) {
      // If no data is available for the metric, log a message and add an error to the results
      console.log(`No data available for ${metric}`);
      results[metric] = { error: "No data available" };
    } else {
      // If data is available for the metric, extract the 75th percentile value
      const { p75 } = metricData.percentiles;
      // Get the threshold value from the first histogram entry's end value, or use positive infinity if not available
      const threshold =
        metricData.histogram[0]?.end || Number.POSITIVE_INFINITY;
      // Check if the 75th percentile value passes the threshold
      const passes = p75 < threshold;

      console.log(
        `Metric: ${metric}, 75th Percentile: ${p75}, Threshold: ${threshold}, Passes: ${
          passes ? "Yes" : "No"
        }`
      );

      // Add the metric assessment to the results object
      results[metric] = {
        percentile75: p75,
        threshold,
        passes,
      };
    }

    return results;
  }, {});
}
