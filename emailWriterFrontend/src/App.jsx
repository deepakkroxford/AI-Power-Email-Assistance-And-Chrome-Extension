import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Container,
  FormControl,
  MenuItem,
  Select,
  Typography,
  Paper,
  InputLabel,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useState } from 'react';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // blue
    },
    background: {
      default: '#f4f8ff',
    },
  },
  shape: {
    borderRadius: 14,
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
  },
});

export default function App() {
  const [emailContent, setEmailContent] = useState('');
  const [tone, setTone] = useState('');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post(
        'http://localhost:9092/api/email/generate',
        { emailContent, tone }
      );
      setGeneratedReply(
        typeof response.data === 'string'
          ? response.data
          : JSON.stringify(response.data, null, 2)
      );
    } catch (e) {
      setError('Failed to generate email reply. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)' }}>
        <Container maxWidth="xl" sx={{ py: 8 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              gap: 4,
            }}
          >
            {/* LEFT: Generator */}
            <Paper
              elevation={8}
              sx={{
                p: 5,
                background: 'linear-gradient(135deg, #ffffff, #f0f6ff)',
              }}
            >
              <Typography
                variant="h3"
                fontWeight="bold"
                gutterBottom
                sx={{ color: 'primary.main' }}
              >
                💙 Email Reply Generator
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 4 }}>
                Generate professional and friendly replies instantly using AI.
              </Typography>

              <TextField
                label="Original Email Content"
                placeholder="Paste the email you received here..."
                fullWidth
                multiline
                rows={10}
                value={emailContent}
                onChange={(e) => setEmailContent(e.target.value)}
                sx={{ mb: 3 }}
              />

              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Tone (Optional)</InputLabel>
                <Select
                  value={tone}
                  label="Tone (Optional)"
                  onChange={(e) => setTone(e.target.value)}
                >
                  <MenuItem value="">None</MenuItem>
                  <MenuItem value="Professional">Professional</MenuItem>
                  <MenuItem value="Friendly">Friendly</MenuItem>
                  <MenuItem value="Polite">Polite</MenuItem>
                </Select>
              </FormControl>

              <Button
                variant="contained"
                size="large"
                fullWidth
                disabled={!emailContent || loading}
                onClick={handleSubmit}
                sx={{
                  py: 1.6,
                  fontSize: '1rem',
                  background: 'linear-gradient(90deg, #1976d2, #42a5f5)',
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Generate Reply'
                )}
              </Button>

              {error && (
                <Typography color="error" sx={{ mt: 2 }}>
                  {error}
                </Typography>
              )}
            </Paper>

            {/* RIGHT: Generated Reply */}
            <Paper
              elevation={6}
              sx={{
                p: 5,
                background: 'linear-gradient(135deg, #ffffff, #e3f2fd)',
              }}
            >
              <Typography
                variant="h5"
                gutterBottom
                sx={{ color: 'primary.main' }}
              >
                ✨ Generated Reply
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={22}
                value={generatedReply}
                placeholder="Your generated reply will appear here..."
                inputProps={{ readOnly: true }}
              />

              <Button
                variant="outlined"
                sx={{ mt: 3 }}
                disabled={!generatedReply}
                onClick={() => navigator.clipboard.writeText(generatedReply)}
              >
                Copy to Clipboard
              </Button>
            </Paper>
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}
