import React from 'react';
import ContactForm from '@/components/ContactForm';
import { Container, Typography, Box } from '@mui/material';

const ContactPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box my={4}>
        <Typography 
          variant="h2" 
          component="h1" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold', 
            color: '#2e7d32'  // Green color for heading
          }}
        >
          Contact Us
        </Typography>
        <Typography 
          variant="body1" 
          paragraph 
          sx={{ color: '#555' }} // Slightly muted color for the body text
        >
          We'd love to hear from you! Please fill out the form below and we'll get back to you as soon as possible.
        </Typography>
        <ContactForm />
      </Box>
    </Container>
  );
};

export default ContactPage;
