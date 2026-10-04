export const UploadFile = async (file) => {
  return { file_url: URL.createObjectURL(file) };
};

export const InvokeLLM = async (params) => {
  return {
    soil_type: "Loamy Soil",
    ph_level: 6.5,
    nitrogen: "Medium",
    phosphorus: "High",
    potassium: "Good",
    organic_matter_percent: 3.2,
    recommendations: [
      "Apply organic compost to enrich soil structure.",
      "Maintain current crop rotation schedule."
    ]
  };
};