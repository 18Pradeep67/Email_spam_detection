import React, { useState } from "react";
import axios from "axios";
import { Container, TextField, Button, Typography, Card, CircularProgress, Alert } from "@mui/material";
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: theme.spacing(2),
}));

const StyledCard = styled(Card)(({ theme }) => ({
  padding: theme.spacing(4),
  width: "100%",
  textAlign: "center",
  boxShadow: "0 8px 30px rgba(0, 0, 0, 0.2)",
  borderRadius: "16px",
  backgroundColor: "#ffffff",
  transition: "transform 0.2s",
  '&:hover': {
    transform: 'scale(1.02)',
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  backgroundColor: '#3f51b5',
  color: 'white',
  '&:hover': {
    backgroundColor: '#303f9f',
  },
}));

export default function SpamDetector() {
  const [emailText, setEmailText] = useState("");
  const [prediction1, setPrediction1] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async () => {
    if (!emailText.trim()) {
      setError("Please enter an email message.");
      return;
    }
    setError(null);
    setLoading(true);
  
    try {
      const response = await axios.post("http://localhost:5000/predict", { text: emailText });
      console.log("API Response:", response.data); // Debugging line
      setPrediction1(response.data.prediction1);
    } catch (err) {
      console.error("Error:", err);
      setError("Error connecting to the server.");
    }
    setLoading(false);
  };

  return (
    <StyledContainer maxWidth="sm">
      <StyledCard>
        <Typography variant="h4" gutterBottom>
          Email Spam Detector
        </Typography>
        <TextField
          fullWidth
          multiline
          rows={4}
          variant="outlined"
          label="Enter your email message"
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          sx={{ marginTop: 2 }}
        />
        <StyledButton 
          variant="contained" 
          fullWidth 
          onClick={handleSubmit} 
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} style={{ color: "white" }} /> : "Check Spam"}
        </StyledButton>
        {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
        {prediction1 && (
          <Alert severity={prediction1 === "spam" ? "error" : "success"} sx={{ marginTop: 2 }}>
            Prediction: {prediction1.toUpperCase()}
          </Alert>
        )}
      </StyledCard>
    </StyledContainer>
  );
}